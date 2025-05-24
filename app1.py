from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
from transformers import MBartForConditionalGeneration, MBart50TokenizerFast
import torch

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(title="English to Telugu Translation API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and tokenizer from Hugging Face
MODEL_NAME = "HafeezKing/my_model_en-te"
tokenizer = MBart50TokenizerFast.from_pretrained(MODEL_NAME)
model = MBartForConditionalGeneration.from_pretrained(MODEL_NAME)

# Set source and target language codes
tokenizer.src_lang = "en_XX"
TARGET_LANG = "te_IN"

# Translation function
def translate_to_telugu(text: str) -> str:
    try:
        logger.info(f"Translating text: {text}")
        inputs = tokenizer(text, return_tensors="pt")
        translated_tokens = model.generate(
            **inputs,
            forced_bos_token_id=tokenizer.lang_code_to_id[TARGET_LANG]
        )
        translation = tokenizer.batch_decode(translated_tokens, skip_special_tokens=True)[0]
        return translation
    except Exception as e:
        logger.error(f"Translation error: {str(e)}")
        raise HTTPException(status_code=502, detail="Translation model failed")

# Translation endpoint
@app.post("/translate")
async def translate(request: Request):
    try:
        body = await request.json()
        text = body.get("text")
        
        if not text or not text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        translated_text = translate_to_telugu(text)
        return {"translatedText": translated_text}
    except Exception as e:
        logger.error(f"Endpoint error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Translation error: {str(e)}")

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Run the serverpip show protobuf

if __name__ == "__main__":
    logger.info("Starting server...")
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
