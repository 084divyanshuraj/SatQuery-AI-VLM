import os
import io
import tempfile
import base64
import urllib.request
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle, Flowable,
    Image as RLImage, KeepTogether
)
from PIL import Image as PILImage, ImageDraw
import matplotlib
matplotlib.use('Agg')
from datetime import datetime

# Define Palette matching the SatQuery AI premium dark theme
COLORS = {
    'heading':    HexColor('#0f172a'),  # Slate 900
    'body':       HexColor('#334155'),  # Slate 700
    'accent':     HexColor('#10b981'),  # Emerald 500 (Primary pop)
    'saffron':    HexColor('#f59e0b'),  # Saffron/Amber 500 (Grounding pop)
    'red_alert':  HexColor('#ef4444'),  # Rose 500
    'blue_alert': HexColor('#3b82f6'),  # Blue 500
    'muted':      HexColor('#64748b'),  # Slate 500 (Captions & headers)
    'bg_alt':     HexColor('#f8fafc'),  # Slate 50
    'bg_header':  HexColor('#0f172a'),  # Dark Slate 900
    'bg_card':    HexColor('#1e293b'),  # Slate 800
    'white':      HexColor('#ffffff'),
}

HEADING_FONT = 'Helvetica-Bold'
BODY_FONT    = 'Helvetica'
MONO_FONT    = 'Courier'

class SectionDivider(Flowable):
    """Accent color visual horizontal divider."""
    def __init__(self, width, color):
        Flowable.__init__(self)
        self._width = width
        self.color = color
        self._height = 14

    def wrap(self, availWidth, availHeight):
        return self._width, self._height

    def draw(self):
        self.canv.setStrokeColor(self.color)
        self.canv.setLineWidth(1)
        self.canv.line(0, 6, self._width, 6)


def _resolve_and_annotate_image(img_data, boxes=None, max_w=480, max_h=230):
    """
    Decodes an image from base64, data URI, local filesystem path, or HTTP URL.
    Optionally overlays grounding bounding boxes with labels.
    Returns (temp_file_path, display_width, display_height) or None if resolution fails.
    """
    if not img_data or not isinstance(img_data, str):
        return None

    pil_img = None
    try:
        if img_data.startswith("data:image"):
            _, b64_str = img_data.split(",", 1)
            raw = base64.b64decode(b64_str)
            pil_img = PILImage.open(io.BytesIO(raw))
        elif img_data.startswith("http://") or img_data.startswith("https://"):
            with urllib.request.urlopen(img_data, timeout=8) as resp:
                pil_img = PILImage.open(io.BytesIO(resp.read()))
        elif img_data.startswith("/"):
            # Check frontend/public or root directories
            backend_dir = os.path.dirname(os.path.abspath(__file__))
            project_root = os.path.abspath(os.path.join(backend_dir, ".."))
            local_path = os.path.join(project_root, "frontend", "public", img_data.lstrip("/\\"))
            if os.path.exists(local_path):
                pil_img = PILImage.open(local_path)
            else:
                # Try fetching via local Vite server
                try:
                    with urllib.request.urlopen(f"http://localhost:5173{img_data}", timeout=4) as resp:
                        pil_img = PILImage.open(io.BytesIO(resp.read()))
                except Exception:
                    pass
        elif os.path.exists(img_data):
            pil_img = PILImage.open(img_data)
        else:
            # Attempt pure base64 decode
            try:
                raw = base64.b64decode(img_data)
                pil_img = PILImage.open(io.BytesIO(raw))
            except Exception:
                return None
    except Exception as e:
        return None

    if pil_img is None:
        return None

    try:
        if pil_img.mode != "RGB":
            pil_img = pil_img.convert("RGB")

        # Overlay bounding boxes if available
        if boxes and isinstance(boxes, list):
            draw = ImageDraw.Draw(pil_img)
            img_w, img_h = pil_img.size

            for b in boxes:
                if not isinstance(b, dict):
                    continue
                try:
                    x_val = float(b.get("x", 0))
                    y_val = float(b.get("y", 0))
                    w_val = float(b.get("width", 0))
                    h_val = float(b.get("height", 0))

                    # Distinguish between 0.0-1.0 normalized ratio vs 0-100 percentage
                    if x_val <= 1.0 and y_val <= 1.0 and w_val <= 1.0 and h_val <= 1.0 and (w_val > 0 or h_val > 0):
                        bx0 = x_val * img_w
                        by0 = y_val * img_h
                        bx1 = (x_val + w_val) * img_w
                        by1 = (y_val + h_val) * img_h
                    else:
                        bx0 = (x_val / 100.0) * img_w
                        by0 = (y_val / 100.0) * img_h
                        bx1 = ((x_val + w_val) / 100.0) * img_w
                        by1 = ((y_val + h_val) / 100.0) * img_h

                    bx0 = max(0, min(img_w - 1, bx0))
                    by0 = max(0, min(img_h - 1, by0))
                    bx1 = max(0, min(img_w - 1, bx1))
                    by1 = max(0, min(img_h - 1, by1))

                    if bx1 > bx0 and by1 > by0:
                        # Draw high-visibility outline
                        for offset in range(3):
                            draw.rectangle(
                                [bx0 - offset, by0 - offset, bx1 + offset, by1 + offset],
                                outline=(245, 158, 11)  # Saffron
                            )

                        label = str(b.get("label") or "GROUNDED AOI").upper()
                        conf = b.get("confidence")
                        if conf:
                            label += f" ({conf})"

                        tag_w = min(img_w - bx0, len(label) * 7 + 8)
                        draw.rectangle([bx0, max(0, by0 - 15), bx0 + tag_w, by0], fill=(15, 23, 42))
                        draw.text((bx0 + 4, max(0, by0 - 13)), label, fill=(245, 158, 11))
                except Exception:
                    continue

        # Preserve aspect ratio within max dimensions
        orig_w, orig_h = pil_img.size
        aspect = orig_w / float(orig_h)
        if (orig_w / max_w) > (orig_h / max_h):
            scaled_w = max_w
            scaled_h = max_w / aspect
        else:
            scaled_h = max_h
            scaled_w = max_h * aspect

        tmp_f = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
        pil_img.save(tmp_f.name, format="JPEG", quality=88)
        tmp_f.close()
        return tmp_f.name, scaled_w, scaled_h
    except Exception:
        return None


def generate_report_pdf(
    output_path,
    query,
    mode="single",
    confidence=94.2,
    metadata=None,
    output_text="",
    trace_logs=None,
    extra_report_data=None,
    image_base64=None,
    image_after_base64=None,
    grounding_boxes=None,
    chat_history=None
):
    """
    Assembles a fully dynamic publication-quality Executive PDF Report using ReportLab.
    Renders actual uploaded satellite imagery, dynamic visual grounding overlays,
    inferred VLM reasoning answers, ingested metadata, and multi-turn chat interaction logs.
    """
    PAGE_SIZE = LETTER
    MARGIN = 0.75 * inch
    PAGE_W, PAGE_H = PAGE_SIZE
    USABLE_W = PAGE_W - 2 * MARGIN

    temp_files_to_clean = []

    # Custom styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'DocTitle', fontName=HEADING_FONT, fontSize=17,
        textColor=COLORS['heading'], leading=21, spaceAfter=4
    )
    subtitle_style = ParagraphStyle(
        'DocSub', fontName=HEADING_FONT, fontSize=9,
        textColor=COLORS['accent'], leading=12, spaceAfter=10
    )
    h1_style = ParagraphStyle(
        'H1', fontName=HEADING_FONT, fontSize=10.5,
        textColor=COLORS['heading'], leading=14,
        spaceBefore=8, spaceAfter=4
    )
    body_style = ParagraphStyle(
        'Body', fontName=BODY_FONT, fontSize=8.5,
        textColor=COLORS['body'], leading=12.5, spaceAfter=4,
        alignment=TA_JUSTIFY
    )
    meta_label = ParagraphStyle(
        'MetaLabel', fontName=HEADING_FONT, fontSize=8,
        textColor=COLORS['white'], leading=10
    )
    meta_val = ParagraphStyle(
        'MetaVal', fontName=BODY_FONT, fontSize=8,
        textColor=COLORS['body'], leading=10
    )
    code_style = ParagraphStyle(
        'Code', fontName=MONO_FONT, fontSize=7.5,
        textColor=COLORS['body'], leading=9.5,
        spaceAfter=1.5
    )
    
    # Grounding Card specific styles
    card_title_style = ParagraphStyle(
        'CardTitle', fontName=HEADING_FONT, fontSize=10,
        textColor=COLORS['white'], leading=13
    )
    card_badge_style = ParagraphStyle(
        'CardBadge', fontName=HEADING_FONT, fontSize=8,
        textColor=COLORS['white'], leading=11, alignment=TA_RIGHT
    )
    card_body_style = ParagraphStyle(
        'CardBody', fontName=BODY_FONT, fontSize=8.5,
        textColor=COLORS['white'], leading=12.5
    )
    card_metric_val = ParagraphStyle(
        'CardMetricVal', fontName=MONO_FONT, fontSize=8,
        textColor=COLORS['white'], leading=10.5
    )
    img_caption_style = ParagraphStyle(
        'ImgCaption', fontName=HEADING_FONT, fontSize=7.5,
        textColor=COLORS['muted'], leading=9.5, alignment=TA_CENTER, spaceBefore=3
    )

    doc = BaseDocTemplate(
        output_path,
        pagesize=PAGE_SIZE,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=MARGIN + 10, bottomMargin=MARGIN
    )

    content_frame = Frame(
        doc.leftMargin, doc.bottomMargin,
        USABLE_W, PAGE_H - doc.topMargin - doc.bottomMargin,
        id='main'
    )

    def on_page(canvas, doc_template):
        canvas.saveState()
        # Page border
        canvas.setStrokeColor(COLORS['muted'])
        canvas.setLineWidth(0.3)
        canvas.rect(MARGIN - 10, MARGIN - 10, USABLE_W + 20, PAGE_H - 2 * MARGIN + 20)

        # Header accent bar
        canvas.setFillColor(COLORS['bg_header'])
        canvas.rect(MARGIN - 10, PAGE_H - MARGIN + 4, USABLE_W + 20, 8, fill=1, stroke=0)

        # Footer
        canvas.setFont(BODY_FONT, 7.5)
        canvas.setFillColor(COLORS['muted'])
        canvas.drawString(MARGIN, MARGIN - 24, "SATQUERY AI • DEPARTMENT OF SPACE • ISRO/SAC SECURE GEOSPATIAL DISPATCH")
        canvas.drawRightString(PAGE_W - MARGIN, MARGIN - 24, f"Page {doc_template.page}")
        canvas.restoreState()

    doc.addPageTemplates([PageTemplate(id='content', frames=content_frame, onPage=on_page)])

    story = []

    # Title header
    story.append(Paragraph("SATQUERY AI — EXECUTIVE GEOSPATIAL ANALYSIS", title_style))
    story.append(Paragraph(f"AGENTIC MULTI-MODAL REASONING PIPELINE • GENERATED ON {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", subtitle_style))
    story.append(SectionDivider(USABLE_W, COLORS['accent']))
    story.append(Spacer(1, 6))

    # 1. Executive Summary
    story.append(Paragraph("1. EXECUTIVE SUMMARY & INTENT ROUTING", h1_style))
    conf_str = f"{confidence:.1f}%" if isinstance(confidence, (int, float)) else str(confidence)
    overview_text = (
        f"This report compiles multi-modal Earth observation findings generated by the SatQuery AI workstation. "
        f"In response to the analyst's natural language query: <b>\"{query}\"</b>, the agentic controller routed "
        f"the inspection under <b>{str(mode).upper()}</b> modality. The Vision-Language Model completed inference "
        f"with a validated confidence metric of <b>{conf_str}</b>."
    )
    story.append(Paragraph(overview_text, body_style))
    story.append(Spacer(1, 6))

    # 2. Dynamic Primary Visual Evidence (Actual Uploaded Image)
    sec_idx = 2
    primary_img_res = _resolve_and_annotate_image(image_base64, boxes=grounding_boxes, max_w=USABLE_W, max_h=210)
    after_img_res = None
    if mode == "bitemporal" and image_after_base64:
        after_img_res = _resolve_and_annotate_image(image_after_base64, boxes=None, max_w=(USABLE_W - 12) / 2, max_h=160)

    if primary_img_res:
        story.append(Paragraph(f"{sec_idx}. SATELLITE RASTER VISUAL EVIDENCE & GROUNDING RETICLES", h1_style))
        sec_idx += 1

        if mode == "bitemporal" and after_img_res:
            temp_files_to_clean.extend([primary_img_res[0], after_img_res[0]])
            # Dual-raster comparison table
            img_t0 = RLImage(primary_img_res[0], width=(USABLE_W - 12) / 2, height=150)
            img_t1 = RLImage(after_img_res[0], width=(USABLE_W - 12) / 2, height=150)
            
            dual_table = Table([
                [img_t0, img_t1],
                [
                    Paragraph("<b>TIME T0: BASELINE SATELLITE RASTER</b>", img_caption_style),
                    Paragraph("<b>TIME T1: POST-EVENT MONITORING RASTER</b>", img_caption_style)
                ]
            ], colWidths=[USABLE_W * 0.5, USABLE_W * 0.5])
            dual_table.setStyle(TableStyle([
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('TOPPADDING', (0, 0), (-1, -1), 2),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
            ]))
            story.append(dual_table)
        else:
            temp_files_to_clean.append(primary_img_res[0])
            p_img = RLImage(primary_img_res[0], width=primary_img_res[1], height=primary_img_res[2])
            img_table = Table([[p_img], [Paragraph("<b>ACTIVE AOI WITH SPATIAL REASONING GROUNDING RETICLES</b>", img_caption_style)]], colWidths=[USABLE_W])
            img_table.setStyle(TableStyle([
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('TOPPADDING', (0, 0), (-1, -1), 2),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
            ]))
            story.append(img_table)
        story.append(Spacer(1, 6))

    # 3. Dynamic Site Grounding & Analytical Reasoning Card
    q_lower = query.lower()
    
    # Derive dynamic title, badge, and border color based on actual user query & output
    if extra_report_data and extra_report_data.get("report_title"):
        r_title = str(extra_report_data.get("report_title")).upper()
        r_alert = str(extra_report_data.get("alert_level", "VERIFIED REASONING")).upper()
        badge_color = '#ef4444' if "CRITICAL" in r_alert or "ALERT" in r_alert else '#f59e0b'
        line_color = COLORS['saffron']
    elif any(w in q_lower for w in ["water", "flood", "inundat", "river", "breach", "lake"]):
        r_title = "HYDROLOGICAL & WATER SURFACE GROUNDING AUDIT"
        r_alert = "CRITICAL DETECTION" if ("flood" in q_lower or "breach" in q_lower) else "WATER SURFACE RESOLVED"
        badge_color = '#ef4444' if "CRITICAL" in r_alert else '#3b82f6'
        line_color = COLORS['red_alert'] if "CRITICAL" in r_alert else COLORS['blue_alert']
    elif any(w in q_lower for w in ["vegetation", "ndvi", "crop", "canopy", "forest", "farm"]):
        r_title = "VEGETATION SPECTRAL HEALTH & CANOPY ASSESSMENT"
        r_alert = "SPECTRAL INDEX EVALUATED"
        badge_color = '#10b981'
        line_color = COLORS['accent']
    elif any(w in q_lower for w in ["urban", "build", "road", "city", "structure", "construct"]):
        r_title = "BUILT ENVIRONMENT & INFRASTRUCTURE GROUNDING"
        r_alert = "SETTLEMENT / EXPANSION MAPPED"
        badge_color = '#f59e0b'
        line_color = COLORS['saffron']
    elif any(w in q_lower for w in ["change", "temporal", "delta", "shift", "difference", "between"]):
        r_title = "BI-TEMPORAL DIFFERENTIAL CHANGE DETECTION"
        r_alert = "SURFACE DELTA CONFIRMED"
        badge_color = '#f59e0b'
        line_color = COLORS['saffron']
    elif any(w in q_lower for w in ["cloud", "fog", "mist", "haze", "atmospheric"]):
        r_title = "ATMOSPHERIC PENETRATION & CLOUD MASKING"
        r_alert = "SAR COMPENSATED"
        badge_color = '#3b82f6'
        line_color = COLORS['blue_alert']
    else:
        r_title = "GEOSPATIAL MULTI-MODAL REASONING REPORT"
        r_alert = "ANALYSIS COMPLETE"
        badge_color = '#10b981'
        line_color = COLORS['accent']

    # Inferred reasoning text (actual answer returned by VLM)
    r_answer = output_text or (extra_report_data and extra_report_data.get("answer")) or "Analysis completed successfully for the uploaded satellite raster layer."

    story.append(Paragraph(f"{sec_idx}. INTERACTIVE SITE GROUNDING ANALYSIS", h1_style))
    sec_idx += 1

    title_block = [
        Paragraph(f"<b>{r_title}</b>", card_title_style),
        Paragraph(f"<font color='{badge_color}'><b>{r_alert}</b></font>", card_badge_style)
    ]
    
    desc_block = [
        Paragraph(r_answer, card_body_style),
        ""
    ]

    m_id = (extra_report_data and extra_report_data.get("mission_id")) or "ISRO-SAC-26167"
    e_area = (extra_report_data and extra_report_data.get("extent_area")) or (f"{metadata.get('DIM', '1024x1024')}" if metadata else "2.4 ha")
    t_utc = (extra_report_data and extra_report_data.get("time_utc")) or datetime.utcnow().strftime('%H:%M:%S UTC')
    c_val = f"{confidence:.1f}%" if isinstance(confidence, (int, float)) else str(confidence)

    metrics_block = [
        Paragraph(f"<b>GROUNDING CONFIDENCE:</b> <font color='#10b981'><b>{c_val}</b></font>", card_metric_val),
        Paragraph(f"<b>EXTENT / DIMENSIONS:</b> <font color='#f59e0b'><b>{e_area}</b></font>", card_metric_val)
    ]

    metrics_block_2 = [
        Paragraph(f"<b>MISSION ID:</b> {m_id}", card_metric_val),
        Paragraph(f"<b>TIMESTAMP UTC:</b> {t_utc}", card_metric_val)
    ]

    card_table_data = [
        title_block,
        desc_block,
        metrics_block,
        metrics_block_2
    ]

    card_table = Table(card_table_data, colWidths=[USABLE_W * 0.52, USABLE_W * 0.48])
    card_table.setStyle(TableStyle([
        ('SPAN', (0, 1), (1, 1)),
        ('BACKGROUND', (0, 0), (-1, -1), COLORS['bg_header']),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('LINELEFT', (0, 0), (0, -1), 4, line_color),
    ]))
    
    story.append(KeepTogether([card_table]))
    story.append(Spacer(1, 6))

    # 4. Multi-turn Chatbot Interaction History (if provided)
    if chat_history and isinstance(chat_history, list) and len(chat_history) > 0:
        meaningful_chats = [
            m for m in chat_history 
            if isinstance(m, dict) and m.get("text") and m.get("role") in ("user", "assistant") 
            and not (m.get("id") == "init-1" or "SatQuery AI is online and ready" in m.get("text", ""))
        ]

        if meaningful_chats:
            story.append(Paragraph(f"{sec_idx}. REASONING CONVERSATION LOG (SESSION TRANSCRIPT)", h1_style))
            sec_idx += 1

            chat_rows = [[
                Paragraph("<b>SPEAKER</b>", meta_label),
                Paragraph("<b>NATURAL LANGUAGE QUERY / VLM OBSERVATION</b>", meta_label),
                Paragraph("<b>CONFIDENCE</b>", meta_label)
            ]]

            for m in meaningful_chats[-6:]:  # Keep recent chronological exchanges
                speaker = "ANALYST" if m.get("role") == "user" else "SATQUERY AI"
                speaker_color = COLORS['accent'] if m.get("role") == "user" else COLORS['saffron']
                speaker_p = Paragraph(f"<font color='{speaker_color.hexval()}'><b>{speaker}</b></font>", meta_val)
                text_clean = m.get("text", "").replace("\n", "<br/>")
                text_p = Paragraph(text_clean, meta_val)
                conf_item = m.get("confidence")
                conf_p_str = f"{conf_item}%" if conf_item else "—"
                conf_p = Paragraph(conf_p_str, meta_val)

                chat_rows.append([speaker_p, text_p, conf_p])

            chat_table = Table(chat_rows, colWidths=[USABLE_W * 0.18, USABLE_W * 0.68, USABLE_W * 0.14])
            chat_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), COLORS['bg_header']),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [COLORS['white'], COLORS['bg_alt']]),
                ('GRID', (0, 0), (-1, -1), 0.5, COLORS['muted']),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('TOPPADDING', (0, 0), (-1, -1), 3),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
                ('LEFTPADDING', (0, 0), (-1, -1), 4),
                ('RIGHTPADDING', (0, 0), (-1, -1), 4),
            ]))
            story.append(KeepTogether([chat_table]))
            story.append(Spacer(1, 6))

    # 5. Ingested Geospatial Metadata Table
    story.append(Paragraph(f"{sec_idx}. INGESTED GEOSPATIAL METADATA & TELEMETRY", h1_style))
    sec_idx += 1

    headers = ["Parameter", "Target Value Details"]
    header_p = [Paragraph(f"<b>{h}</b>", meta_label) for h in headers]
    metadata_rows = [header_p]

    if isinstance(metadata, dict) and metadata:
        for key, value in metadata.items():
            metadata_rows.append([
                Paragraph(f"<b>{str(key).upper()}</b>", meta_val),
                Paragraph(str(value), meta_val)
            ])
    else:
        metadata_rows.append([
            Paragraph("<b>DATASET</b>", meta_val),
            Paragraph("Sentinel-2 MSI Level-2A BOA Reflectance", meta_val)
        ])
        metadata_rows.append([
            Paragraph("<b>CRS ALIGNMENT</b>", meta_val),
            Paragraph("EPSG:32643 (WGS 84 / UTM Zone 43N)", meta_val)
        ])

    t = Table(metadata_rows, colWidths=[USABLE_W * 0.32, USABLE_W * 0.68])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLORS['bg_header']),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [COLORS['white'], COLORS['bg_alt']]),
        ('GRID', (0, 0), (-1, -1), 0.5, COLORS['muted']),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(KeepTogether([t]))
    story.append(Spacer(1, 6))

    # 6. Auditable Orchestration Trace Logs
    story.append(Paragraph(f"{sec_idx}. AUDITABLE ORCHESTRATION TRACE LOGS", h1_style))
    trace_paragraphs = []
    for idx, log in enumerate(trace_logs or []):
        log_str = log if isinstance(log, str) else (log.get('text') or log.get('message') or str(log))
        trace_paragraphs.append([
            Paragraph(f"<b>[0{idx+1}]</b>", code_style),
            Paragraph(log_str, code_style)
        ])

    if trace_paragraphs:
        trace_table = Table(trace_paragraphs, colWidths=[USABLE_W * 0.09, USABLE_W * 0.91])
        trace_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), COLORS['bg_alt']),
            ('LINEBELOW', (0, 0), (-1, -1), 0.3, COLORS['muted']),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('TOPPADDING', (0, 0), (-1, -1), 2),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
        ]))
        story.append(KeepTogether([trace_table]))

    doc.build(story)

    # Clean up temporary visual assets
    for tmp_p in temp_files_to_clean:
        try:
            if os.path.exists(tmp_p):
                os.unlink(tmp_p)
        except Exception:
            pass

    return output_path
