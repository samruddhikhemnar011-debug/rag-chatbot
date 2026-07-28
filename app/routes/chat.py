from fastapi import APIRouter


router = APIRouter()


@router.get("/")
def chat_home():

    return{
        "message":"Chat APIs Working Successfully"
    }