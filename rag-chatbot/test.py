from app.services.pdf_service import read_pdf
from app.services.chunk_service import create_chunks
from app.services.embedding_service import create_embeddings
from app.services.vector_store_service import (
    store_embeddings
)
from app.services.retriever_service import (
    retrieve_chunks
)
from app.services.llm_service import (
    generate_answer
)


# ---------------------------------------------------------
# PDF PATH
# ---------------------------------------------------------

PDF_PATH = "documents/uploads/RAG_Chatbot_Project_Demo_Handbook.pdf"


# ---------------------------------------------------------
# READ PDF
# ---------------------------------------------------------

text = read_pdf(PDF_PATH)

print("\n")
print("=" * 60)
print("PDF TEXT EXTRACTED SUCCESSFULLY")
print("=" * 60)
print(f"Total Characters : {len(text)}")


# ---------------------------------------------------------
# CREATE CHUNKS
# ---------------------------------------------------------

chunks = create_chunks(text)

print("\n")
print("=" * 60)
print("CHUNKING COMPLETED")
print("=" * 60)
print(f"Total Chunks : {len(chunks)}")


# ---------------------------------------------------------
# CREATE EMBEDDINGS
# ---------------------------------------------------------

embeddings = create_embeddings(chunks)

print("\n")
print("=" * 60)
print("EMBEDDINGS GENERATED SUCCESSFULLY")
print("=" * 60)
print(f"Total Embeddings : {len(embeddings)}")


# ---------------------------------------------------------
# STORE EMBEDDINGS IN FAISS
# ---------------------------------------------------------

index = store_embeddings(embeddings)

print("\n")
print("=" * 60)
print("FAISS INFORMATION")
print("=" * 60)
print(f"Total Stored Vectors : {index.ntotal}")


# ---------------------------------------------------------
# USER QUESTION
# ---------------------------------------------------------

question = input("\nEnter Your Question : ")


print("\n")
print("=" * 60)
print("QUESTION")
print("=" * 60)
print(question)


# ---------------------------------------------------------
# RETRIEVE RELEVANT CHUNKS
# ---------------------------------------------------------

results = retrieve_chunks(

    question,
    index,
    chunks

)

print("\n")
print("=" * 60)
print("RETRIEVED CHUNKS")
print("=" * 60)

for i, result in enumerate(results):

    print("\n")
    print(f"Result : {i + 1}")
    print("-" * 40)
    print(result)


# ---------------------------------------------------------
# CREATE CONTEXT
# ---------------------------------------------------------

context = "\n".join(results)

print("\n")
print("=" * 60)
print("CONTEXT CREATED")
print("=" * 60)
print(context)


# ---------------------------------------------------------
# CREATE PROMPT
# ---------------------------------------------------------

prompt = f"""

You are a helpful AI assistant.

Answer ONLY from the provided context.

If the answer is not present inside
the provided context simply say:

"I couldn't find the answer inside
the uploaded PDF."


QUESTION:

{question}


CONTEXT:

{context}


ANSWER:

"""


print("\n")
print("=" * 60)
print("PROMPT CREATED")
print("=" * 60)
print("Prompt Generated Successfully.")


# ---------------------------------------------------------
# GENERATE ANSWER USING OLLAMA
# ---------------------------------------------------------

answer = generate_answer(prompt)


print("\n")
print("=" * 60)
print("GENERATED ANSWER")
print("=" * 60)
print(answer)


# ---------------------------------------------------------
# RAG PIPELINE STATUS
# ---------------------------------------------------------

print("\n")
print("=" * 60)
print("RAG PIPELINE STATUS")
print("=" * 60)

print("PDF Reading         : SUCCESS")
print("Chunking            : SUCCESS")
print("Embeddings          : SUCCESS")
print("FAISS               : SUCCESS")
print("Retriever           : SUCCESS")
print("Context Builder     : SUCCESS")
print("Prompt Builder      : SUCCESS")
print("Ollama              : SUCCESS")
print("Answer Generated    : SUCCESS")