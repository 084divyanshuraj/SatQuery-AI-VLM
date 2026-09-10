import os
import json
import sqlite3
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime

logger = logging.getLogger("satquery.database")

DB_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
DB_PATH = os.path.join(DB_DIR, "satquery_history.db")


def get_db_connection() -> sqlite3.Connection:
    """Creates a thread-safe connection to the SQLite database with WAL mode."""
    os.makedirs(DB_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH, timeout=10.0, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA foreign_keys=ON;")
    return conn


def init_db():
    """Initializes the database schema and indexes."""
    os.makedirs(DB_DIR, exist_ok=True)
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # 1. Users Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT,
                name TEXT,
                rank TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        # 2. Sessions Table (Per-user workspaces/chat sessions)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS sessions (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                title TEXT NOT NULL,
                modality TEXT DEFAULT 'single',
                preview_text TEXT DEFAULT '',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
        """)

        # 3. Messages Table (Chat history per session)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS messages (
                id TEXT PRIMARY KEY,
                session_id TEXT NOT NULL,
                role TEXT NOT NULL,
                text TEXT NOT NULL,
                confidence REAL,
                intent TEXT,
                timestamp TEXT,
                grounding_boxes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
            );
        """)

        # Indexes for fast lookup
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_sessions_user_updated ON sessions(user_id, updated_at DESC);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id, created_at ASC);")
        conn.commit()
    logger.info(f"SatQuery SQLite database initialized at {DB_PATH}")


def ensure_user(user_id: str, email: str = "", name: str = "", rank: str = "") -> dict:
    """Ensures a user record exists in the database."""
    clean_id = str(user_id).strip()
    if not clean_id:
        clean_id = "analyst-default"

    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE id = ?", (clean_id,))
        row = cursor.fetchone()
        if not row:
            cursor.execute(
                "INSERT INTO users (id, email, name, rank) VALUES (?, ?, ?, ?)",
                (clean_id, email or f"{clean_id}@satquery.gov.in", name or "Geospatial Analyst", rank or "Level-4 Analyst")
            )
            conn.commit()
            cursor.execute("SELECT * FROM users WHERE id = ?", (clean_id,))
            row = cursor.fetchone()
        return dict(row)


def seed_default_sessions_if_empty(user_id: str):
    """If user has no past sessions, seeds realistic initial satellite analysis workspaces."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) as count FROM sessions WHERE user_id = ?", (user_id,))
        count = cursor.fetchone()["count"]
        if count > 0:
            return

        now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        seed_sessions = [
            (
                f"sess_{user_id}_1",
                user_id,
                "Venice Port Maritime Expansion",
                "single",
                "Commercial shipping channel expansion detected along northern lagoon.",
                now_str,
                now_str
            ),
            (
                f"sess_{user_id}_2",
                user_id,
                "Amazon Deforestation Delta",
                "bitemporal",
                "Bi-temporal change detection localized -14.2% canopy density loss.",
                now_str,
                now_str
            ),
            (
                f"sess_{user_id}_3",
                user_id,
                "Mumbai Monsoon Cloud Penetration",
                "crossmodal",
                "SAR InSAR dual-polarized coherence through thick monsoonal overcast.",
                now_str,
                now_str
            ),
            (
                f"sess_{user_id}_4",
                user_id,
                "Chi Square Feature Selection",
                "single",
                "Statistical feature importance ranking across multi-spectral bands.",
                now_str,
                now_str
            ),
            (
                f"sess_{user_id}_5",
                user_id,
                "Trip Plan Details",
                "single",
                "Flight and satellite orbital passes over target AOI coordinates.",
                now_str,
                now_str
            )
        ]

        for s in seed_sessions:
            cursor.execute("""
                INSERT OR IGNORE INTO sessions (id, user_id, title, modality, preview_text, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, s)

        # Seed an initial welcome message for the first session
        cursor.execute("""
            INSERT OR IGNORE INTO messages (id, session_id, role, text, confidence, intent, timestamp, grounding_boxes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            f"msg_{user_id}_1_1",
            f"sess_{user_id}_1",
            "assistant",
            "**SatQuery AI** is online and ready.\n\nAnalyze multispectral satellite tiles, compute NDVI vegetation health, interpret SAR radar passes, and detect land-use changes.\n\nUpload a GeoTIFF or click 'LOAD SAMPLE DEMO TILE' to begin analysis.",
            1.0,
            "SYSTEM_INIT",
            "11:42 AM",
            None
        ))
        conn.commit()


def get_user_sessions(user_id: str) -> List[Dict[str, Any]]:
    """Fetches all sessions for a specific user, ordered by most recently updated."""
    ensure_user(user_id)
    seed_default_sessions_if_empty(user_id)

    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, user_id, title, modality, preview_text, created_at, updated_at
            FROM sessions
            WHERE user_id = ?
            ORDER BY updated_at DESC
        """, (user_id,))
        rows = cursor.fetchall()
        return [dict(r) for r in rows]


def create_user_session(user_id: str, title: str = "New Workspace", modality: str = "single") -> Dict[str, Any]:
    """Creates a new workspace session for a user."""
    ensure_user(user_id)
    session_id = f"sess_{int(datetime.utcnow().timestamp() * 1000)}"
    now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO sessions (id, user_id, title, modality, preview_text, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (session_id, user_id, title, modality, "New session started.", now_str, now_str))
        conn.commit()

        cursor.execute("SELECT * FROM sessions WHERE id = ?", (session_id,))
        return dict(cursor.fetchone())


def get_session_messages(session_id: str) -> List[Dict[str, Any]]:
    """Retrieves all chat messages for a specific session."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, session_id, role, text, confidence, intent, timestamp, grounding_boxes, created_at
            FROM messages
            WHERE session_id = ?
            ORDER BY created_at ASC
        """, (session_id,))
        rows = cursor.fetchall()
        results = []
        for r in rows:
            item = dict(r)
            if item.get("grounding_boxes"):
                try:
                    item["grounding_boxes"] = json.loads(item["grounding_boxes"])
                except Exception:
                    pass
            results.append(item)
        return results


def save_chat_message(
    session_id: str,
    role: str,
    text: str,
    confidence: Optional[float] = None,
    intent: Optional[str] = None,
    timestamp: Optional[str] = None,
    grounding_boxes: Optional[Any] = None
) -> Dict[str, Any]:
    """Saves a message to the session and updates session title & timestamp."""
    msg_id = f"msg_{int(datetime.utcnow().timestamp() * 1000)}"
    time_str = timestamp or datetime.now().strftime("%I:%M %p")
    now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

    gb_json = json.dumps(grounding_boxes) if grounding_boxes else None

    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO messages (id, session_id, role, text, confidence, intent, timestamp, grounding_boxes, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (msg_id, session_id, role, text, confidence, intent, time_str, gb_json, now_str))

        # Auto-update session preview & title if it was default
        cursor.execute("SELECT title, user_id FROM sessions WHERE id = ?", (session_id,))
        session_row = cursor.fetchone()
        if session_row:
            current_title = session_row["title"]
            # If default title and user query, title the session from the first user query!
            new_title = current_title
            if (current_title == "New Workspace" or not current_title) and role == "user":
                clean_q = text.strip()
                new_title = (clean_q[:32] + "...") if len(clean_q) > 35 else clean_q
                new_title = new_title.title()

            cursor.execute("""
                UPDATE sessions
                SET updated_at = ?, preview_text = ?, title = ?
                WHERE id = ?
            """, (now_str, text[:60], new_title, session_id))

        conn.commit()

        return {
            "id": msg_id,
            "session_id": session_id,
            "role": role,
            "text": text,
            "confidence": confidence,
            "intent": intent,
            "timestamp": time_str,
            "grounding_boxes": grounding_boxes
        }


def delete_user_session(user_id: str, session_id: str) -> bool:
    """Deletes a session owned by the specified user."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM sessions WHERE id = ? AND user_id = ?", (session_id, user_id))
        conn.commit()
        return cursor.rowcount > 0
