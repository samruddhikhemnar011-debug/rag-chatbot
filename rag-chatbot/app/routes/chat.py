from fastapi import APIRouter

from app.schemas.chat import (
    QuestionRequest
)

from app.services.chat_service import (
    ask_question
)


router = APIRouter()


@router.post("/")
def chat(data: QuestionRequest):

    return ask_question(

        data.question

    )