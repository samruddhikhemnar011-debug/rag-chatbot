from fastapi import UploadFile
import os
import shutil
from pypdf import PdfReader

def upload_pdf(file: UploadFile):

    os.makedirs("documents/uploads", exist_ok=True)

    file_path = f"documents/uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "message": "PDF Uploaded Successfully",
        "filename": file.filename,
        "path": file_path
    }


def read_pdf(file_path):

    reader = PdfReader(file_path)

    text = ""

    for page in reader.pages:
        text += page.extract_text()

    return text