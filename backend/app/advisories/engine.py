"""
Expert Agronomic Rules & Multilingual Advisory Engine.
Generates localized, crop-specific guidance based on predicted rainfall anomalies,
false-onset risk, and impending dry spell / break monsoon duration.
Supports regional Indian languages (Hindi, Marathi, Gujarati, Telugu, Bengali, Punjabi, English).
"""

from typing import Dict, List, Any

# Regional dictionary for agronomic actions
TRANSLATIONS: Dict[str, Dict[str, str]] = {
    "en": {
        "sowing_delay": "Delay Sowing: High probability of immediate break spell. Sowing now risks seed germination failure.",
        "sowing_proceed": "Proceed with Sowing: Optimal soil moisture conditions expected over the next 7-10 days.",
        "irrigation_prep": "Prepare Supplemental Irrigation: Expected dry spell of 5-8 days will cause critical moisture stress.",
        "drainage_prep": "Clear Field Drainage: Heavy downpour risk exceeding 65mm. Prevent waterlogging and root rot.",
        "pesticide_spray": "Hold Chemical Sprays: Imminent rainfall will wash off foliar applications.",
        "drought_tolerant": "Consider short-duration or drought-tolerant crop varieties if dry spell extends beyond 12 days.",
    },
    "hi": {
        "sowing_delay": "बुवाई टालें: तत्काल शुष्क दौर (Break Spell) की उच्च संभावना है। अभी बुवाई करने से अंकुरण खराब होने का जोखिम है।",
        "sowing_proceed": "बुवाई शुरू करें: अगले 7-10 दिनों में मिट्टी में नमी की अनुकूल स्थिति रहने की उम्मीद है।",
        "irrigation_prep": "पूरक सिंचाई तैयार रखें: 5-8 दिनों के शुष्क दौर से नमी की गंभीर कमी हो सकती है।",
        "drainage_prep": "खेत में जल निकासी नालियां साफ करें: 65 मिमी से अधिक भारी बारिश की संभावना है। जलभराव रोकें।",
        "pesticide_spray": "कीटनाशक छिड़काव रोकें: आगामी बारिश से दवा बह जाने की संभावना है।",
        "drought_tolerant": "यदि सूखा 12 दिनों से अधिक बढ़ता है तो कम अवधि या सूखा-सहनशील किस्मों का चयन करें।",
    },
    "mr": {
        "sowing_delay": "पेरणी लांबणीवर टाका: पावसाचा मोठा खंड (Break Monsoon) पडण्याची शक्यता आहे. बियाणे वाया जाण्याचा धोका आहे.",
        "sowing_proceed": "पेरणीस सुरुवात करा: पुढील 7-10 दिवसांत जमिनीत पुरेशी ओल राहण्याचा अंदाज आहे.",
        "irrigation_prep": "संरक्षित सिंचनाची व्यवस्था करा: 5-8 दिवस पावसाचा खंड पडल्यास पिकांवर पाण्याचा ताण येईल.",
        "drainage_prep": "पाण्याचा निचरा करा: अतिवृष्टी (65 मिमी+) होण्याची शक्यता. शेतात पाणी साचू देऊ नका.",
        "pesticide_spray": "फवारणी थांबवा: पावसाची शक्यता असल्याने कीटकनाशक फवारणी वाया जाऊ शकते.",
        "drought_tolerant": "पावसाचा खंड वाढल्यास कमी कालावधीच्या किंवा अवर्षणाचा ताण सहन करणाऱ्या वाणांची निवड करा.",
    },
    "gu": {
        "sowing_delay": "વાવણી મોકૂફ રાખો: વરસાદમાં મોટો વિરામ (Break Monsoon) આવવાની શક્યતા છે. બિયારણ બગડવાનું જોખમ.",
        "sowing_proceed": "વાવણી શરૂ કરો: આગામી 7-10 દિવસમાં જમીનમાં ભેજનું અનુકૂળ પ્રમાણ જળવાઈ રહેશે.",
        "irrigation_prep": "પૂરક પિયતની તૈયારી રાખો: 5-8 દિવસના વરસાદી વિરામથી પાકને ભેજની તંગી પડી શકે છે.",
        "drainage_prep": "પાણીના નિકાલની વ્યવસ્થા કરો: ભારે વરસાદની (65mm+) આગાહી છે. પાણી ભરાવા ન દો.",
        "pesticide_spray": "દવાનો છંટકાવ મોકૂફ રાખો: વરસાદથી દવા ધોવાઈ જવાની સંભાવના છે.",
        "drought_tolerant": "જો વરસાદી વિરામ લંબાય તો ટૂંકી મુદતના અથવા ઓછા પાણીમાં થતા પાકની જાતો પસંદ કરો.",
    },
    "pa": {
        "sowing_delay": "ਬਿਜਾਈ ਮੁਲਤਵੀ ਕਰੋ: ਮਾਨਸੂਨ ਵਿੱਚ ਲੰਬੇ ਸੁੱਕੇ ਦੌਰ ਦੀ ਸੰਭਾਵਨਾ ਹੈ। ਬੀਜ ਖਰਾਬ ਹੋਣ ਦਾ ਖਤਰਾ ਹੈ।",
        "sowing_proceed": "ਬਿਜਾਈ ਸ਼ੁਰੂ ਕਰੋ: ਅਗਲੇ 7-10 ਦਿਨਾਂ ਵਿੱਚ ਮਿੱਟੀ ਵਿੱਚ ਨਮੀ ਦੀ ਸਥਿతి ਬਹੁਤ ਵਧੀਆ ਰਹੇਗੀ।",
        "irrigation_prep": "ਸਿੰਚਾਈ ਦਾ ਪ੍ਰਬੰਧ ਤਿਆਰ ਰੱਖੋ: ਸੁੱਕੇ ਦੌਰ ਕਾਰਨ ਫਸਲ ਨੂੰ ਪਾਣੀ ਦੀ ਘਾਟ ਹੋ ਸਕਦੀ ਹੈ।",
        "drainage_prep": "ਪਾਣੀ ਦੀ ਨਿਕਾਸੀ ਦੇ ਪ੍ਰਬੰਧ ਕਰੋ: ਭਾਰੀ ਮੀਂਹ (65mm+) ਦੀ ਸੰਭਾਵਨਾ ਹੈ। ਪਾਣੀ ਖੜ੍ਹਾ ਨਾ ਹੋਣ ਦਿਓ।",
        "pesticide_spray": "ਕੀਟਨਾਸ਼ਕਾਂ ਦਾ ਛਿੜਕਾਅ ਰੋਕੋ: ਮੀਂਹ ਕਾਰਨ ਦਵਾਈ ਵਹਿ ਜਾਣ ਦਾ ਖਤਰਾ ਹੈ।",
        "drought_tolerant": "ਜੇਕਰ ਸੁੱਕਾ ਲੰਬਾ ਚੱਲਦਾ ਹੈ ਤਾਂ ਘੱਟ ਸਮੇਂ ਵਾਲੀਆਂ ਕਿਸਮਾਂ ਦੀ ਚੋਣ ਕਰੋ।",
    }
}

CROP_RULES = {
    "Soybean": {
        "critical_stages": ["germination", "flowering", "pod_filling"],
        "heavy_rain_sensitive": True,
        "max_dry_spell_days": 6,
    },
    "Cotton": {
        "critical_stages": ["square_formation", "boll_development"],
        "heavy_rain_sensitive": True,
        "max_dry_spell_days": 10,
    },
    "Maize": {
        "critical_stages": ["tasseling", "silking"],
        "heavy_rain_sensitive": False,
        "max_dry_spell_days": 7,
    },
    "Rice": {
        "critical_stages": ["nursery", "tillering", "panicle_initiation"],
        "heavy_rain_sensitive": False,
        "max_dry_spell_days": 4,
    },
    "Pulses": {
        "critical_stages": ["germination", "pod_formation"],
        "heavy_rain_sensitive": True,
        "max_dry_spell_days": 8,
    }
}

def generate_crop_advisories(
    block_name: str,
    crop: str,
    dry_spell_prob: float,
    heavy_rain_prob: float,
    onset_prob: float,
    false_onset_prob: float,
    language: str = "hi"
) -> List[Dict[str, Any]]:
    lang = language if language in TRANSLATIONS else "en"
    t = TRANSLATIONS[lang]
    fallback_t = TRANSLATIONS["en"]
    
    advisories = []
    
    # Check False Onset / Sowing Window
    if false_onset_prob >= 45 or (onset_prob < 50 and dry_spell_prob >= 50):
        advisories.append({
            "category": "SOWING",
            "urgency": "HIGH",
            "message": t.get("sowing_delay", fallback_t["sowing_delay"]),
            "rationale": f"False onset risk is high ({false_onset_prob}%). Dry spell probability in following week is {dry_spell_prob}%."
        })
    elif onset_prob >= 75 and dry_spell_prob < 40:
        advisories.append({
            "category": "SOWING",
            "urgency": "LOW",
            "message": t.get("sowing_proceed", fallback_t["sowing_proceed"]),
            "rationale": f"Monsoon onset probability is favorable ({onset_prob}%) with low break probability ({dry_spell_prob}%)."
        })

    # Dry Spell & Irrigation
    if dry_spell_prob >= 50:
        advisories.append({
            "category": "IRRIGATION",
            "urgency": "HIGH" if dry_spell_prob >= 65 else "MODERATE",
            "message": t.get("irrigation_prep", fallback_t["irrigation_prep"]),
            "rationale": f"Probability of prolonged break phase is {dry_spell_prob}%."
        })
        if dry_spell_prob >= 70:
            advisories.append({
                "category": "VARIETY_ADJUSTMENT",
                "urgency": "MODERATE",
                "message": t.get("drought_tolerant", fallback_t["drought_tolerant"]),
                "rationale": "Extended dry break projected across this agro-climatic pocket."
            })

    # Heavy Downpour
    if heavy_rain_prob >= 40:
        advisories.append({
            "category": "DRAINAGE",
            "urgency": "CRITICAL" if heavy_rain_prob >= 60 else "HIGH",
            "message": t.get("drainage_prep", fallback_t["drainage_prep"]),
            "rationale": f"Risk of heavy localized rainfall exceeding 65mm is {heavy_rain_prob}%."
        })
        advisories.append({
            "category": "PEST_MANAGEMENT",
            "urgency": "MODERATE",
            "message": t.get("pesticide_spray", fallback_t["pesticide_spray"]),
            "rationale": "High convective rain will cause runoff of applied foliar fertilizers and sprays."
        })

    return advisories
