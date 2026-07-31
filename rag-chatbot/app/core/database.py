from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base

from dotenv import load_dotenv

import os


# ----------------------------------
# LOAD ENV VARIABLES
# ----------------------------------

load_dotenv()


# ----------------------------------
# DATABASE URL
# ----------------------------------

DATABASE_URL = os.getenv("DATABASE_URL")


# ----------------------------------
# CREATE ENGINE
# ----------------------------------

engine = create_engine(

    DATABASE_URL

)


# ----------------------------------
# CREATE SESSION
# ----------------------------------

SessionLocal = sessionmaker(

    autocommit=False,
    autoflush=False,
    bind=engine

)


# ----------------------------------
# CREATE BASE CLASS
# ----------------------------------

Base = declarative_base()


# ----------------------------------
# DATABASE DEPENDENCY
# ----------------------------------

def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()