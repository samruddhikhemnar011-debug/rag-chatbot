from fastapi import APIRouter, UploadFile, File
from app.services.pdf_service import upload_pdf

router = APIRouter()


@router.post("/upload")
def upload(file: UploadFile = File(...)):
    return upload_pdf(file)