import numpy as np
from app.services.embedding_service import (
        create_embeddings
)

def retrieve_chunks(

        question,
        index,
        chunks,
        top_k=5

):

    question_embedding = create_embeddings(
            [question]
    )

    distances, indices = index.search(

        np.array(
            question_embedding,
            dtype="float32"
        ),

        top_k

    )

    results=[]

    seen=set()


    for i in indices[0]:

        chunk=chunks[i]

        if chunk not in seen:

            results.append(chunk)

            seen.add(chunk)

            return results