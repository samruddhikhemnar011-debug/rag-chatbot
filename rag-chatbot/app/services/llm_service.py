from ollama import chat


MODEL_NAME = "llama3.2:3b"


def generate_answer(prompt: str):

    response = chat(

        model=MODEL_NAME,

        messages=[

            {
                "role": "user",
                "content": prompt
            }

        ]

    )

    return response["message"]["content"]