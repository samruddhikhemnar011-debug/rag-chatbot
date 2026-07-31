from fastapi import APIRouter, UploadFile, File

from app.services.pdf_service import (
    upload_pdf,
    read_pdf
)

from app.services.chunk_service import (
    create_chunks
)

from app.services.embedding_service import (
    create_embeddings
)

from app.services.vector_store_service import (
    store_embeddings
)

from app.core.memory import (
    memory
)


router = APIRouter()


@router.post("/")
def upload(file: UploadFile = File(...)):

    # -----------------------------------
    # SAVE PDF
    # -----------------------------------

    response = upload_pdf(file)

    file_path = response["path"]


    # -----------------------------------
    # READ PDF
    # -----------------------------------

    text = read_pdf(file_path)


    # -----------------------------------
    # CREATE CHUNKS
    # -----------------------------------

    chunks = create_chunks(text)


    # -----------------------------------
    # CREATE EMBEDDINGS
    # -----------------------------------

    embeddings = create_embeddings(chunks)


    # -----------------------------------
    # CREATE FAISS INDEX
    # -----------------------------------

    index = store_embeddings(
        embeddings
    )


    # -----------------------------------
    # STORE IN MEMORY
    # -----------------------------------

    memory.index = index

    memory.chunks = chunks

    memory.pdf_name = file.filename

    memory.is_uploaded = True


    # -----------------------------------
    # RETURN RESPONSE
    # -----------------------------------

    return {

        "success": True,

        "message":
        "PDF uploaded and processed successfully.",

        "filename":
        file.filename,

        "total_chunks":
        len(chunks)

    }