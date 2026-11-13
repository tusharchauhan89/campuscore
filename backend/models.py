from sqlalchemy import Column, Integer, String, Float, Date, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import date

class User(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    rollnumber = Column(String, unique=True, nullable=False)
    course = Column(String, nullable=False)

    university = Column(
        String,
        nullable=True,
        default="UIT Shimla (HPU)"
    )

    attendances = relationship("Attendance", back_populates="student")
    marks = relationship("Mark", back_populates="student")
    fees = relationship("Fee", back_populates="student")
class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    subject = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    status = Column(String, nullable=False)  # Present / Absent

    student = relationship("User", back_populates="attendances")


class Mark(Base):
    __tablename__ = "marks"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    subject = Column(String, nullable=False)
    exam_type = Column(String, nullable=False)
    marks_obtained = Column(Float, nullable=False)
    max_marks = Column(Float, nullable=False)
    semester = Column(String, nullable=False)

    student = relationship("User", back_populates="marks")


class Fee(Base):
    __tablename__ = "fees"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    semester = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    paid_amount = Column(Float, default=0)
    status = Column(String, default="Pending")
    due_date = Column(Date, nullable=True)

    student = relationship("User", back_populates="fees")


class Notice(Base):
    __tablename__ = "notices"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    course = Column(String, nullable=True)
    created_at = Column(Date, nullable=False)


class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    author = Column(String, nullable=False)
    isbn = Column(String, unique=True, nullable=True)
    category = Column(String, nullable=True)
    total_copies = Column(Integer, default=1)
    available_copies = Column(Integer, default=1)


class BookIssue(Base):
    __tablename__ = "book_issues"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    book_id = Column(Integer, ForeignKey("books.id"))
    issue_date = Column(Date, nullable=False)
    due_date = Column(Date, nullable=False)
    return_date = Column(Date, nullable=True)
    status = Column(String, default="Issued")  # Issued / Returned / Overdue
    fine_amount = Column(Float, default=0.0)

    student = relationship("User", backref="issued_books")
    book = relationship("Book")


class BookRequest(Base):
    __tablename__ = "book_requests"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    book_id = Column(Integer, ForeignKey("books.id"), nullable=True)
    book_title = Column(String, nullable=False)
    reason = Column(Text, nullable=True)
    request_date = Column(Date, default=date.today)
    status = Column(String, default="Pending")  # Pending / Approved / Rejected
    admin_remark = Column(String, nullable=True)

    student = relationship("User", backref="book_requests")
    book = relationship("Book")

class Faculty(Base):
    __tablename__ = "faculty"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    employee_id = Column(String, unique=True, nullable=False)
    department = Column(String, nullable=False)          # CSE, IT, ECE etc.
    designation = Column(String, nullable=True)          # Professor, Assistant Professor etc.
    phone = Column(String, nullable=True)