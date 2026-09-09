import os
import json
import logging
from enum import Enum
from pydantic import BaseModel, Field
from typing import Optional

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("AgenticRouter")

# Attempt to import LLM libraries
try:
    from google import genai
    from google.genai import types
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False


# Define the SIH 2026 Supported Tasks
class SIHTask(str, Enum):
    VQA = "VQA"
    IMAGE_CAPTIONING = "IMAGE_CAPTIONING"
    SCENE_DESCRIPTION = "SCENE_DESCRIPTION"
    TEXT_GUIDED_GROUNDING = "TEXT_GUIDED_GROUNDING"
    CHANGE_ANALYSIS = "CHANGE_ANALYSIS"
    CHANGE_DESCRIPTION = "CHANGE_DESCRIPTION"
    CHANGE_BASED_VQA = "CHANGE_BASED_VQA"
    CROSS_MODAL_ANALYSIS = "CROSS_MODAL_ANALYSIS"
    LAND_COVER_ANALYSIS = "LAND_COVER_ANALYSIS"
    OBJECT_IDENTIFICATION = "OBJECT_IDENTIFICATION"


class RouterDecision(BaseModel):
    task: SIHTask = Field(description="The primary remote sensing task identified from the user query.")
    confidence: float = Field(description="Confidence score (0.0 to 100.0) of this routing decision.")
    reasoning: str = Field(description="A brief, one-sentence explanation of why this task was chosen.")
    is_flood_related: bool = Field(description="True if the query explicitly mentions floods, water breaches, or inundation.")


class SatQueryRouter:
    """
    The Agentic Router acting as the 'traffic cop' for SatQuery AI.
    Implements a multi-provider fail-safe architecture:
    1. Primary: Gemini API
    2. Secondary: OpenAI API (or Groq via OpenAI client)
    3. Fallback: Local Keyword Mocking
    """

    SYSTEM_PROMPT = """You are an ISRO remote-sensing Agentic Controller for SatQuery AI.
    Your job is to read the user's natural language query about satellite imagery and classify it into the correct SIH Task category.
    Do not answer the user's question. Only route it to the correct workflow task.
    """

    @staticmethod
    def _fallback_local_router(query: str) -> RouterDecision:
        """The ultimate safety net. Never fails during a demo."""
        logger.warning("Using LOCAL FALLBACK ROUTER.")
        q_lower = query.lower()
        
        is_flood = any(kw in q_lower for kw in ["flood", "breach", "inundation", "water"])
        is_change = any(kw in q_lower for kw in ["change", "difference", "increase", "decrease", "compare"])
        is_grounding = any(kw in q_lower for kw in ["highlight", "where is", "locate", "find"])
        
        if is_change:
            task = SIHTask.CHANGE_ANALYSIS
            reasoning = "Query mentions change or comparison keywords."
        elif is_grounding:
            task = SIHTask.TEXT_GUIDED_GROUNDING
            reasoning = "Query asks to locate or highlight a specific feature."
        elif is_flood:
            task = SIHTask.LAND_COVER_ANALYSIS
            reasoning = "Query focuses on water bodies/flooding."
        else:
            task = SIHTask.VQA
            reasoning = "Defaulting to general Visual Question Answering."

        return RouterDecision(
            task=task,
            confidence=85.0,
            reasoning=reasoning,
            is_flood_related=is_flood
        )

    @staticmethod
    def _route_via_gemini(query: str, api_key: str) -> RouterDecision:
        """Primary LLM Router using Google GenAI SDK with Structured Outputs."""
        logger.info("Attempting Gemini API routing...")
        client = genai.Client(api_key=api_key)
        
        # Try models in order - gemini-3.6-flash recommended by API when 2.5 was deprecated
        router_model_candidates = ["gemini-3.6-flash", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]
        
        last_error = None
        for model_name in router_model_candidates:
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=query,
                    config=types.GenerateContentConfig(
                        system_instruction=SatQueryRouter.SYSTEM_PROMPT,
                        response_mime_type="application/json",
                        response_schema=RouterDecision,
                        temperature=0.1,
                    ),
                )
                logger.info(f"Router using model: {model_name}")
                return RouterDecision.model_validate_json(response.text)
            except Exception as e:
                err_str = str(e)
                if "404" in err_str or "NOT_FOUND" in err_str or "no longer available" in err_str.lower():
                    last_error = e
                    continue
                raise  # re-raise non-404 errors immediately
        
        raise last_error or Exception("All Gemini router models failed.")

    @staticmethod
    def _route_via_openai(query: str, api_key: str) -> RouterDecision:
        """Secondary LLM Router using OpenAI SDK with Structured Outputs."""
        logger.info("Attempting OpenAI API routing...")
        client = OpenAI(api_key=api_key)
        
        completion = client.beta.chat.completions.parse(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SatQueryRouter.SYSTEM_PROMPT},
                {"role": "user", "content": query}
            ],
            response_format=RouterDecision,
            temperature=0.1
        )
        
        return completion.choices[0].message.parsed

    @classmethod
    def route_query(cls, query: str) -> RouterDecision:
        """Main entry point. Cascades through multiple Gemini keys before falling back."""
        
        gemini_key_1 = os.getenv("GEMINI_API_KEY_1")
        gemini_key_2 = os.getenv("GEMINI_API_KEY_2")

        # 1. Try Primary Gemini Key
        if GEMINI_AVAILABLE and gemini_key_1 and gemini_key_1 != "your_first_gemini_key_here":
            try:
                return cls._route_via_gemini(query, gemini_key_1)
            except Exception as e:
                logger.warning(f"Primary Gemini API Key failed (Rate limit?): {e}. Failing over to Key 2...")

        # 2. Try Secondary Gemini Key
        if GEMINI_AVAILABLE and gemini_key_2 and gemini_key_2 != "your_second_gemini_key_here":
            try:
                logger.info("Attempting Secondary Gemini API Key routing...")
                return cls._route_via_gemini(query, gemini_key_2)
            except Exception as e:
                logger.error(f"Secondary Gemini API Key failed: {e}")

        # 3. Ultimate Fallback
        return cls._fallback_local_router(query)

# Quick test if run directly
if __name__ == "__main__":
    test_query = "What changed between these two dates regarding the flood inundation?"
    print(f"Testing Query: {test_query}")
    decision = SatQueryRouter.route_query(test_query)
    print(decision.model_dump_json(indent=2))
