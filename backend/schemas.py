from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date


# ---------- Student ----------
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    rollnumber: str
    course: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    rollnumber: str
    course: str

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class PasswordUpdate(BaseModel):
    old_password: str
    new_password: str


# ---------- Attendance ----------
class AttendanceCreate(BaseModel):
    student_id: int
    subject: str
    date: date
    status: str  # Present / Absent


class AttendanceResponse(BaseModel):
    id: int
    subject: str
    date: date
    status: str

    class Config:
        from_attributes = True


# ---------- Marks ----------
class MarkCreate(BaseModel):
    student_id: int
    subject: str
    exam_type: str
    marks_obtained: float
    max_marks: float
    semester: str


class MarkResponse(BaseModel):
    id: int
    subject: str
    exam_type: str
    marks_obtained: float
    max_marks: float
    semester: str

    class Config:
        from_attributes = True


# ---------- Fee ----------
class FeeCreate(BaseModel):
    student_id: int
    semester: str
    amount: float
    paid_amount: float = 0
    status: str = "Pending"
    due_date: Optional[date] = None


class FeeResponse(BaseModel):
    id: int
    semester: str
    amount: float
    paid_amount: float
    status: str
    due_date: Optional[date]

    class Config:
        from_attributes = True


# ---------- Notice ----------
class NoticeCreate(BaseModel):
    title: str
    content: str
    course: Optional[str] = None
    created_at: date


class NoticeResponse(BaseModel):
    id: int
    title: str
    content: str
    course: Optional[str]
    created_at: date

    class Config:
        from_attributes = True


# ---------- Book ----------
class BookCreate(BaseModel):
    title: str
    author: str
    isbn: Optional[str] = None
    category: Optional[str] = None
    total_copies: int = 1
    available_copies: int = 1


class BookResponse(BaseModel):
    id: int
    title: str
    author: str
    isbn: Optional[str]
    category: Optional[str]
    total_copies: int
    available_copies: int

    class Config:
        from_attributes = True


# ---------- Book Issue ----------
class BookIssueCreate(BaseModel):
    student_id: int
    book_id: int
    issue_date: date
    due_date: date


class BookIssueResponse(BaseModel):
    id: int
    student_id: int
    book_id: int
    issue_date: date
    due_date: date
    return_date: Optional[date]
    status: str
    fine_amount: float          # ← Important: was missing

    class Config:
        from_attributes = True


# ---------- Book Request ----------
class BookRequestCreate(BaseModel):          # ← This was completely missing
    student_id: int
    book_id: Optional[int] = None
    book_title: str
    reason: Optional[str] = None


class BookRequestResponse(BaseModel):
    id: int
    student_id: int
    book_id: Optional[int]
    book_title: str
    reason: Optional[str]
    request_date: date
    status: str
    admin_remark: Optional[str]

    class Config:
        from_attributes = True


class BookRequestUpdate(BaseModel):
    status: str
    admin_remark: Optional[str] = None      # ← was missing

# ---------- Faculty ----------
class FacultyCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    employee_id: str
    department: str
    designation: Optional[str] = None
    phone: Optional[str] = None

class FacultyResponse(BaseModel):
    id: int
    name: str
    email: str
    employee_id: str
    department: str
    designation: Optional[str]
    phone: Optional[str]

    class Config:
        from_attributes = True

class FacultyLogin(BaseModel):
    email: EmailStr
    password: str

class FacultyUpdate(BaseModel):
    name: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    phone: Optional[str] = None