"""
SMS & WhatsApp Outbound Gateway Simulator.
Dispatches actionable text alerts to farmers and agricultural extension officers
with delivery status tracking, language preference, and channel simulation.
"""

from typing import List, Dict, Any
from datetime import datetime
import uuid

# In-memory alert dispatch registry
DISPATCH_HISTORY: List[Dict[str, Any]] = []

def send_monsoon_alert(
    recipient_type: str,  # 'farmer' or 'officer'
    recipient_contact: str,  # Phone number
    channel: str,  # 'sms' or 'whatsapp'
    language: str,
    block_name: str,
    alert_title: str,
    alert_message: str,
    risk_level: str
) -> Dict[str, Any]:
    dispatch_id = str(uuid.uuid4())[:8]
    
    # Simulate delivery payload
    formatted_body = (
        f"🌧️ *MonsoonGuard Hyperlocal Alert* [{block_name}]\n"
        f"⚠️ Risk Level: {risk_level}\n\n"
        f"{alert_title}\n"
        f"{alert_message}\n\n"
        f"📅 Issued: {datetime.now().strftime('%d %b %Y, %I:%M %p')}\n"
        f"Govt of India - MoES / NCMRWF"
    ) if channel == "whatsapp" else (
        f"[MonsoonGuard-{block_name}] {alert_title}: {alert_message} (Risk: {risk_level}) - MoES/NCMRWF"
    )

    record = {
        "id": dispatch_id,
        "recipient_type": recipient_type,
        "contact": recipient_contact,
        "channel": channel,
        "language": language,
        "block": block_name,
        "risk_level": risk_level,
        "message": formatted_body,
        "status": "DELIVERED",
        "timestamp": datetime.now().isoformat()
    }
    
    DISPATCH_HISTORY.insert(0, record)
    return record

def get_recent_dispatches(limit: int = 50) -> List[Dict[str, Any]]:
    return DISPATCH_HISTORY[:limit]
