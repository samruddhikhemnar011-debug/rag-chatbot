from fastapi import FastAPI

from app.routes import pdf
from app.routes import chat


app = FastAPI()


app.include_router(
    pdf.router,
    prefix="/pdf",
    tags=["PDF APIs"]
)


app.include_router(
    chat.router,
    prefix="/chat",
    tags=["Chat APIs"]
)


@app.get("/")
def home():

    return{
        "message":"Welcome to RAG Chatbot"
    }