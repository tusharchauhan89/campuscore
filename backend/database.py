from sqlalchemy.orm import sessionmaker,declarative_base
from sqlalchemy import create_engine

DATABASE_URL="postgresql://postgres:root@localhost:5432/cmsportal"

engine=create_engine(DATABASE_URL)

SessionLocal=sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base=declarative_base()

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()