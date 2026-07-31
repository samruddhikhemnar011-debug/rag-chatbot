from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import pdf, chat, auth
from app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
    version="1.0.0"
)

# Parse origins from comma-separated string
origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(',')]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Router Modules
app.include_router(
    auth.router,
    prefix=f"{settings.API_VERSION}/auth",
    tags=["Auth APIs"]
)

app.include_router(
    pdf.router,
    prefix=f"{settings.API_VERSION}/upload-pdf",
    tags=["PDF APIs"]
)

app.include_router(
    chat.router,
    prefix=f"{settings.API_VERSION}/chat",
    tags=["Chat APIs"]
)


@app.get(f"{settings.API_VERSION}/health")
def health_check():
    return {"status": "ok", "message": "Service is running."}


@app.get("/")
def home():
    return {"message": "Welcome to RAG Chatbot"}