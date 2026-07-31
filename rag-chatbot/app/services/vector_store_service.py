import faiss
import numpy as np

def store_embeddings(embeddings):

    dimensions = len(embeddings[0])

    index = faiss.IndexFlatL2(dimensions)

    index.add(
        np.array(
            embeddings,
            dtype="float32"
        )
    )

    return index