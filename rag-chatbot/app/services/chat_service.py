from app.core.memory import memory

from app.services.retriever_service import (
    retrieve_chunks
)


from app.services.llm_service import (
    generate_answer
)


# ----------------------------------------------------
# CREATE CONTEXT
# ----------------------------------------------------

def create_context(results):

    context = "\n\n".join(results)

    return context


# ----------------------------------------------------
# CREATE PROMPT
# ----------------------------------------------------

def create_prompt(question,context):

    prompt=f"""

You are an AI assistant for PDF documents.

Use ONLY the provided context to answer
the user's question.

Rules:

1. Give detailed answers whenever possible.

2. Do NOT use outside knowledge.

3. If the answer exists in the context,
explain it properly.

4. If the answer does not exist, reply:

"I couldn't find the answer inside the uploaded PDF."


QUESTION:
{question}


CONTEXT:
{context}


Please provide a clear and detailed answer.


ANSWER:

"""

    return prompt


# ----------------------------------------------------
# GENERATE RESPONSE
# ----------------------------------------------------

def generate_response(prompt):

    return generate_answer(prompt)


# ----------------------------------------------------
# MAIN CHAT FUNCTION
# ----------------------------------------------------

def ask_question(question):

    # ---------------------------------
    # CHECK PDF UPLOADED
    # ---------------------------------

    if not memory.is_uploaded:

        return {

            "success": False,

            "message":
            "Please upload a PDF first."

        }


    # ---------------------------------
    # RETRIEVE CHUNKS
    # ---------------------------------

    results = retrieve_chunks(

        question,
        memory.index,
        memory.chunks

    )

    if not results:

        return{

        "success":False,

        "message":
        "No relevant information found."

    }


    # ---------------------------------
    # CREATE CONTEXT
    # ---------------------------------

    context = create_context(results)


    # ---------------------------------
    # CREATE PROMPT
    # ---------------------------------

    prompt = create_prompt(

        question,
        context

    )


    # ---------------------------------
    # GENERATE ANSWER
    # ---------------------------------

    answer = generate_response(

        prompt

    )

    # ---------------------------------
    # DEBUGGING
    # ---------------------------------

    print("\n")
    print("=" * 50)
    print("TOTAL RETRIEVED CHUNKS")
    print("=" * 50)

    print(len(results))


    for i, result in enumerate(results):

        print(f"\nCHUNK {i+1}")

        print("-" * 50)

        print(result)


    print("\n")
    print("=" * 50)
    print("CONTEXT LENGTH")
    print("=" * 50)

    print(len(context))


    print("\n")
    print("=" * 50)
    print("PROMPT LENGTH")
    print("=" * 50)

    print(len(prompt))


    print("\n")
    print("=" * 50)
    print("GENERATED ANSWER")
    print("=" * 50)

    print(answer)

    print("\n")
    print("=" * 50)
    print("ANSWER LENGTH")
    print("=" * 50)

    print(len(answer))

    


    # ---------------------------------
    # RETURN RESPONSE
    # ---------------------------------

    return {

        "success": True,

        "question": question,

        "pdf_name": memory.pdf_name,

        "chunks_retrieved": len(results),

        "answer": answer

        }