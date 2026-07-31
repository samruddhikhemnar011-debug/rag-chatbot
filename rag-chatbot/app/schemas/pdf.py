from pydantic import BaseModel


class PDFResponse(BaseModel):
    filename: str
    message: str