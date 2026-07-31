from sqlalchemy import Column, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    document_id = Column(Integer, ForeignKey("pdfs.id", ondelete="CASCADE"), nullable=False)

    # Relationship
    pdf = relationship("PDF")