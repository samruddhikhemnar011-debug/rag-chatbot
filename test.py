from app.services.pdf_service import read_pdf
from app.services.chunk_service import create_chunks


text = read_pdf(
    "documents/uploads/Bootstrap_Premium_Guide_Blueprint.pdf"
)

chunks = create_chunks(text)


print(f"Total Chunks : {len(chunks)}")


for i, chunk in enumerate(chunks):

    print("\n")
    print("="*50)
    print(f"Chunk Number : {i+1}")
    print("="*50)

    print(chunk)

    print("\n")