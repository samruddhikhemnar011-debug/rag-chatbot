from app.services.llm_service import generate_answer


prompt = """

What is FastAPI?

"""


response = generate_answer(prompt)

print("\n")
print("="*50)
print("LLM RESPONSE")
print("="*50)

print(response)