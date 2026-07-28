from fastapi import APIRouter


router = APIRouter()


@router.get("/")
def pdf_home():

    return{
        "message":"PDF APIs Working Successfully"
    }