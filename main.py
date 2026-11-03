from database import Base, engine, get_db
from fastapi import FastAPI, Depends, HTTPException, Query
from schemas import (
    UserCreate, UserResponse, UserLogin, PasswordUpdate,
    AttendanceCreate, AttendanceResponse,
    MarkCreate, MarkResponse,
    FeeCreate, FeeResponse,
    NoticeCreate, NoticeResponse,
    BookCreate, BookResponse,
    BookIssueCreate, BookIssueResponse,
    BookRequestCreate, BookRequestResponse, BookRequestUpdate,FacultyCreate, FacultyResponse, FacultyLogin, FacultyUpdate
)
from models import User, Attendance, Mark, Fee, Notice, Book, BookIssue, BookRequest,Faculty
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import date
from sqlalchemy import and_

app = FastAPI()
Base.metadata.create_all(bind=engine)

FINE_PER_DAY = 5.0  # ₹5 per day late


# ======================================================
#                  STUDENT BASIC APIs
# ======================================================

@app.post("/students", response_model=UserResponse)
def sign_up(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=409, detail="Email already exists")
    if db.query(User).filter(User.rollnumber == user.rollnumber).first():
        raise HTTPException(status_code=409, detail="Roll number already exists")

    new_user = User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/Student-login", response_model=UserResponse)
def log_in(student: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == student.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="No user found with this email")
    if student.password != user.password:
        raise HTTPException(status_code=401, detail="Invalid password")
    return user


@app.get("/users", response_model=List[UserResponse])
def get_users(limit: int = 10, offset: int = 0, course: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(User)
    if course:
        query = query.filter(User.course == course)
    return query.offset(offset).limit(limit).all()


@app.get("/student/course/{course}", response_model=List[UserResponse])
def get_student_by_course(course: str, db: Session = Depends(get_db)):
    users = db.query(User).filter(User.course == course).all()
    if not users:
        raise HTTPException(status_code=404, detail="No students found")
    return users


@app.get("/student/id/{id}", response_model=UserResponse)
def get_student_by_id(id: int, db: Session = Depends(get_db)):
    student = db.query(User).filter(User.id == id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@app.get("/student/roll/{rollnumber}", response_model=UserResponse)
def get_student_by_roll(rollnumber: str, db: Session = Depends(get_db)):
    student = db.query(User).filter(User.rollnumber == rollnumber).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@app.get("/student/roll/{rollnumber}/course/{course}", response_model=UserResponse)
def get_student_by_roll_and_course(rollnumber: str, course: str, db: Session = Depends(get_db)):
    student = db.query(User).filter(
        User.rollnumber == rollnumber,
        User.course == course
    ).first()
    if not student:
        raise HTTPException(
            status_code=404,
            detail=f"No student found with Roll Number '{rollnumber}' in course '{course}'"
        )
    return student


@app.get("/students/search", response_model=List[UserResponse])
def search_students(name: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    students = db.query(User).filter(User.name.ilike(f"%{name}%")).all()
    if not students:
        raise HTTPException(status_code=404, detail="No students found")
    return students


@app.get("/students/count/{course}")
def count_students(course: str, db: Session = Depends(get_db)):
    count = db.query(User).filter(User.course == course).count()
    return {"course": course, "total_students": count}


@app.put("/student/{id}", response_model=UserResponse)
def update_student(id: int, user: UserCreate, db: Session = Depends(get_db)):
    student = db.query(User).filter(User.id == id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    if user.email != student.email:
        if db.query(User).filter(User.email == user.email).first():
            raise HTTPException(status_code=409, detail="Email already exists")

    student.name = user.name
    student.email = user.email
    student.course = user.course
    student.rollnumber = user.rollnumber
    db.commit()
    db.refresh(student)
    return student


@app.put("/student/{id}/password")
def change_password(id: int, data: PasswordUpdate, db: Session = Depends(get_db)):
    student = db.query(User).filter(User.id == id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    if data.old_password != student.password:
        raise HTTPException(status_code=401, detail="Old password is incorrect")

    student.password = data.new_password
    db.commit()
    return {"message": "Password updated successfully"}


@app.delete("/user/{id}")
def del_user(id: int, db: Session = Depends(get_db)):
    student = db.query(User).filter(User.id == id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(student)
    db.commit()
    return {"message": "Student deleted successfully"}


# ======================================================
#                  ATTENDANCE
# ======================================================

@app.post("/attendance", response_model=AttendanceResponse)
def add_attendance(data: AttendanceCreate, db: Session = Depends(get_db)):
    attendance = Attendance(**data.dict())
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    return attendance


@app.get("/student/{student_id}/attendance", response_model=List[AttendanceResponse])
def get_my_attendance(student_id: int, db: Session = Depends(get_db)):
    records = db.query(Attendance).filter(Attendance.student_id == student_id).all()
    if not records:
        raise HTTPException(status_code=404, detail="No attendance records found")
    return records


@app.get("/student/{student_id}/attendance/summary")
def attendance_summary(student_id: int, db: Session = Depends(get_db)):
    records = db.query(Attendance).filter(Attendance.student_id == student_id).all()
    if not records:
        raise HTTPException(status_code=404, detail="No attendance records found")

    total = len(records)
    present = len([r for r in records if r.status.lower() == "present"])
    percentage = round((present / total) * 100, 2)

    return {
        "student_id": student_id,
        "total_classes": total,
        "present": present,
        "absent": total - present,
        "percentage": percentage
    }


# ======================================================
#                  MARKS / RESULTS
# ======================================================

@app.post("/marks", response_model=MarkResponse)
def add_marks(data: MarkCreate, db: Session = Depends(get_db)):
    mark = Mark(**data.dict())
    db.add(mark)
    db.commit()
    db.refresh(mark)
    return mark


@app.get("/student/{student_id}/marks", response_model=List[MarkResponse])
def get_my_marks(student_id: int, semester: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Mark).filter(Mark.student_id == student_id)
    if semester:
        query = query.filter(Mark.semester == semester)
    marks = query.all()
    if not marks:
        raise HTTPException(status_code=404, detail="No marks found")
    return marks


@app.get("/student/{student_id}/result")
def get_result_summary(student_id: int, semester: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Mark).filter(Mark.student_id == student_id)
    if semester:
        query = query.filter(Mark.semester == semester)

    marks = query.all()
    if not marks:
        raise HTTPException(status_code=404, detail="No marks found")

    total_obtained = sum(m.marks_obtained for m in marks)
    total_max = sum(m.max_marks for m in marks)
    percentage = round((total_obtained / total_max) * 100, 2) if total_max > 0 else 0

    return {
        "student_id": student_id,
        "semester": semester or "All",
        "total_subjects": len(marks),
        "total_obtained": total_obtained,
        "total_max": total_max,
        "percentage": percentage,
        "marks": marks
    }


# ======================================================
#                  FEE STATUS
# ======================================================

@app.post("/fees", response_model=FeeResponse)
def add_fee(data: FeeCreate, db: Session = Depends(get_db)):
    fee = Fee(**data.dict())
    db.add(fee)
    db.commit()
    db.refresh(fee)
    return fee


@app.get("/student/{student_id}/fees", response_model=List[FeeResponse])
def get_my_fees(student_id: int, db: Session = Depends(get_db)):
    fees = db.query(Fee).filter(Fee.student_id == student_id).all()
    if not fees:
        raise HTTPException(status_code=404, detail="No fee records found")
    return fees


@app.get("/student/{student_id}/fee-status")
def fee_status_summary(student_id: int, db: Session = Depends(get_db)):
    fees = db.query(Fee).filter(Fee.student_id == student_id).all()
    if not fees:
        raise HTTPException(status_code=404, detail="No fee records found")

    total_amount = sum(f.amount for f in fees)
    total_paid = sum(f.paid_amount for f in fees)
    pending = total_amount - total_paid

    return {
        "student_id": student_id,
        "total_amount": total_amount,
        "total_paid": total_paid,
        "pending_amount": pending,
        "overall_status": "Paid" if pending <= 0 else "Pending"
    }


# ======================================================
#                  NOTICES
# ======================================================

@app.post("/notices", response_model=NoticeResponse)
def create_notice(data: NoticeCreate, db: Session = Depends(get_db)):
    notice = Notice(**data.dict())
    db.add(notice)
    db.commit()
    db.refresh(notice)
    return notice


@app.get("/notices", response_model=List[NoticeResponse])
def get_all_notices(course: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Notice)
    if course:
        query = query.filter((Notice.course == course) | (Notice.course == None))
    return query.order_by(Notice.created_at.desc()).all()


@app.get("/notices/{notice_id}", response_model=NoticeResponse)
def get_notice(notice_id: int, db: Session = Depends(get_db)):
    notice = db.query(Notice).filter(Notice.id == notice_id).first()
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")
    return notice


# ======================================================
#                  STUDENT DASHBOARD
# ======================================================

@app.get("/student/{student_id}/dashboard")
def student_dashboard(student_id: int, db: Session = Depends(get_db)):
    student = db.query(User).filter(User.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    today = date.today()

    # Attendance
    attendances = db.query(Attendance).filter(Attendance.student_id == student_id).all()
    total_classes = len(attendances)
    present = len([a for a in attendances if a.status.lower() == "present"])
    attendance_percentage = round((present / total_classes) * 100, 2) if total_classes > 0 else 0

    attendance_summary = {
        "total_classes": total_classes,
        "present": present,
        "absent": total_classes - present,
        "percentage": attendance_percentage
    }

    # Results
    marks = db.query(Mark).filter(Mark.student_id == student_id).all()
    total_obtained = sum(m.marks_obtained for m in marks)
    total_max = sum(m.max_marks for m in marks)
    percentage = round((total_obtained / total_max) * 100, 2) if total_max > 0 else 0

    result_summary = {
        "total_subjects": len(marks),
        "total_obtained": total_obtained,
        "total_max": total_max,
        "percentage": percentage
    }

    # Fees
    fees = db.query(Fee).filter(Fee.student_id == student_id).all()
    total_amount = sum(f.amount for f in fees)
    total_paid = sum(f.paid_amount for f in fees)
    pending_fee = total_amount - total_paid

    fee_summary = {
        "total_amount": total_amount,
        "total_paid": total_paid,
        "pending_amount": pending_fee,
        "status": "Paid" if pending_fee <= 0 else "Pending"
    }

    # Notices
    notices = db.query(Notice).filter(
        (Notice.course == student.course) | (Notice.course == None)
    ).order_by(Notice.created_at.desc()).limit(5).all()

    # Library + Fine
    issued_books = db.query(BookIssue).filter(
        BookIssue.student_id == student_id,
        BookIssue.status.in_(["Issued", "Overdue"])
    ).all()

    total_library_fine = 0.0
    for issue in issued_books:
        if issue.due_date < today:
            days_late = (today - issue.due_date).days
            fine = days_late * FINE_PER_DAY
            issue.fine_amount = fine
            issue.status = "Overdue"
            total_library_fine += fine
        else:
            total_library_fine += issue.fine_amount or 0.0

    db.commit()

    # Book Requests
    pending_requests = db.query(BookRequest).filter(
        BookRequest.student_id == student_id,
        BookRequest.status == "Pending"
    ).all()

    recent_requests = db.query(BookRequest).filter(
        BookRequest.student_id == student_id
    ).order_by(BookRequest.request_date.desc()).limit(5).all()

    return {
        "student": {
            "id": student.id,
            "name": student.name,
            "email": student.email,
            "rollnumber": student.rollnumber,
            "course": student.course
        },
        "attendance_summary": attendance_summary,
        "result_summary": result_summary,
        "fee_summary": fee_summary,
        "library_summary": {
            "issued_books_count": len(issued_books),
            "total_fine": total_library_fine,
            "issued_books": issued_books
        },
        "book_requests": {
            "pending_count": len(pending_requests),
            "pending_requests": pending_requests,
            "recent_requests": recent_requests
        },
        "recent_notices": notices
    }


@app.get("/student/roll/{rollnumber}/dashboard")
def student_dashboard_by_roll(rollnumber: str, db: Session = Depends(get_db)):
    student = db.query(User).filter(User.rollnumber == rollnumber).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found with this roll number")
    return student_dashboard(student.id, db)


# ======================================================
#                  LIBRARY
# ======================================================

@app.post("/books", response_model=BookResponse)
def add_book(book: BookCreate, db: Session = Depends(get_db)):
    new_book = Book(**book.dict())
    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    return new_book


@app.get("/books", response_model=List[BookResponse])
def get_all_books(category: Optional[str] = None, search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Book)
    if category:
        query = query.filter(Book.category.ilike(f"%{category}%"))
    if search:
        query = query.filter(
            (Book.title.ilike(f"%{search}%")) | (Book.author.ilike(f"%{search}%"))
        )
    return query.all()


@app.get("/books/{book_id}", response_model=BookResponse)
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


@app.post("/library/issue", response_model=BookIssueResponse)
def issue_book(data: BookIssueCreate, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == data.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if book.available_copies <= 0:
        raise HTTPException(status_code=400, detail="No copies available")

    student = db.query(User).filter(User.id == data.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    issue = BookIssue(**data.dict())
    db.add(issue)
    book.available_copies -= 1
    db.commit()
    db.refresh(issue)
    return issue


@app.put("/library/return/{issue_id}")
def return_book(issue_id: int, return_date: date = date.today(), db: Session = Depends(get_db)):
    issue = db.query(BookIssue).filter(BookIssue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue record not found")
    if issue.status == "Returned":
        raise HTTPException(status_code=400, detail="Book already returned")

    if return_date > issue.due_date:
        days_late = (return_date - issue.due_date).days
        fine = days_late * FINE_PER_DAY
    else:
        days_late = 0
        fine = 0.0

    issue.return_date = return_date
    issue.status = "Returned"
    issue.fine_amount = fine

    book = db.query(Book).filter(Book.id == issue.book_id).first()
    if book:
        book.available_copies += 1

    db.commit()
    return {
        "message": "Book returned successfully",
        "days_late": days_late,
        "fine_amount": fine
    }


@app.get("/student/{student_id}/library", response_model=List[BookIssueResponse])
def my_issued_books(student_id: int, db: Session = Depends(get_db)):
    today = date.today()
    overdue = db.query(BookIssue).filter(
        BookIssue.student_id == student_id,
        BookIssue.status == "Issued",
        BookIssue.due_date < today
    ).all()
    for issue in overdue:
        issue.status = "Overdue"
    db.commit()

    issues = db.query(BookIssue).filter(
        BookIssue.student_id == student_id,
        BookIssue.status.in_(["Issued", "Overdue"])
    ).all()
    return issues


@app.get("/student/{student_id}/library/history", response_model=List[BookIssueResponse])
def library_history(student_id: int, db: Session = Depends(get_db)):
    return db.query(BookIssue).filter(BookIssue.student_id == student_id).all()


@app.put("/library/check-overdue")
def check_and_mark_overdue(db: Session = Depends(get_db)):
    today = date.today()
    overdue_issues = db.query(BookIssue).filter(
        and_(
            BookIssue.status == "Issued",
            BookIssue.due_date < today
        )
    ).all()

    for issue in overdue_issues:
        issue.status = "Overdue"

    db.commit()
    return {"message": f"{len(overdue_issues)} books marked as Overdue", "checked_on": today}


@app.get("/library/calculate-fine/{issue_id}")
def calculate_fine(issue_id: int, db: Session = Depends(get_db)):
    issue = db.query(BookIssue).filter(BookIssue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue record not found")

    if issue.status == "Returned":
        return {
            "issue_id": issue_id,
            "status": "Returned",
            "fine_amount": issue.fine_amount,
            "message": "Book already returned"
        }

    today = date.today()
    if today <= issue.due_date:
        fine = 0.0
        days_late = 0
    else:
        days_late = (today - issue.due_date).days
        fine = days_late * FINE_PER_DAY

    issue.fine_amount = fine
    if days_late > 0:
        issue.status = "Overdue"
    db.commit()

    return {
        "issue_id": issue_id,
        "due_date": issue.due_date,
        "days_late": days_late,
        "fine_per_day": FINE_PER_DAY,
        "fine_amount": fine,
        "status": issue.status
    }


@app.get("/student/{student_id}/library/fines")
def student_total_fine(student_id: int, db: Session = Depends(get_db)):
    issues = db.query(BookIssue).filter(BookIssue.student_id == student_id).all()
    total_fine = 0.0
    pending_fines = []

    today = date.today()
    for issue in issues:
        if issue.status in ["Issued", "Overdue"]:
            if today > issue.due_date:
                days_late = (today - issue.due_date).days
                fine = days_late * FINE_PER_DAY
                issue.fine_amount = fine
                issue.status = "Overdue"
            else:
                fine = 0.0
        else:
            fine = issue.fine_amount or 0.0

        total_fine += fine
        if fine > 0:
            pending_fines.append({
                "issue_id": issue.id,
                "book_id": issue.book_id,
                "fine": fine,
                "status": issue.status
            })

    db.commit()
    return {
        "student_id": student_id,
        "total_fine": total_fine,
        "pending_fines": pending_fines
    }


# ======================================================
#                  BOOK REQUEST
# ======================================================

@app.post("/library/request", response_model=BookRequestResponse)
def request_book(data: BookRequestCreate, db: Session = Depends(get_db)):
    student = db.query(User).filter(User.id == data.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    if data.book_id:
        book = db.query(Book).filter(Book.id == data.book_id).first()
        if not book:
            raise HTTPException(status_code=404, detail="Book not found")

    request = BookRequest(**data.dict())
    db.add(request)
    db.commit()
    db.refresh(request)
    return request


@app.get("/student/{student_id}/library/requests", response_model=List[BookRequestResponse])
def my_book_requests(student_id: int, db: Session = Depends(get_db)):
    return db.query(BookRequest).filter(
        BookRequest.student_id == student_id
    ).order_by(BookRequest.request_date.desc()).all()


@app.get("/library/requests", response_model=List[BookRequestResponse])
def all_book_requests(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(BookRequest)
    if status:
        query = query.filter(BookRequest.status == status)
    return query.order_by(BookRequest.request_date.desc()).all()


@app.put("/library/request/{request_id}", response_model=BookRequestResponse)
def update_book_request(request_id: int, data: BookRequestUpdate, db: Session = Depends(get_db)):
    request = db.query(BookRequest).filter(BookRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    request.status = data.status
    request.admin_remark = data.admin_remark
    db.commit()
    db.refresh(request)
    return request


# ======================================================
#                  FACULTY PORTAL
# ======================================================

@app.post("/faculty/register", response_model=FacultyResponse)
def register_faculty(faculty: FacultyCreate, db: Session = Depends(get_db)):
    if db.query(Faculty).filter(Faculty.email == faculty.email).first():
        raise HTTPException(status_code=409, detail="Email already exists")
    if db.query(Faculty).filter(Faculty.employee_id == faculty.employee_id).first():
        raise HTTPException(status_code=409, detail="Employee ID already exists")

    new_faculty = Faculty(**faculty.dict())
    db.add(new_faculty)
    db.commit()
    db.refresh(new_faculty)
    return new_faculty


@app.post("/faculty/login", response_model=FacultyResponse)
def faculty_login(data: FacultyLogin, db: Session = Depends(get_db)):
    faculty = db.query(Faculty).filter(Faculty.email == data.email).first()
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")
    if faculty.password != data.password:
        raise HTTPException(status_code=401, detail="Invalid password")
    return faculty


@app.get("/faculty", response_model=List[FacultyResponse])
def get_all_faculty(department: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Faculty)
    if department:
        query = query.filter(Faculty.department == department)
    return query.all()


@app.get("/faculty/{faculty_id}", response_model=FacultyResponse)
def get_faculty(faculty_id: int, db: Session = Depends(get_db)):
    faculty = db.query(Faculty).filter(Faculty.id == faculty_id).first()
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")
    return faculty


@app.put("/faculty/{faculty_id}", response_model=FacultyResponse)
def update_faculty(faculty_id: int, data: FacultyUpdate, db: Session = Depends(get_db)):
    faculty = db.query(Faculty).filter(Faculty.id == faculty_id).first()
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")

    if data.name is not None:
        faculty.name = data.name
    if data.department is not None:
        faculty.department = data.department
    if data.designation is not None:
        faculty.designation = data.designation
    if data.phone is not None:
        faculty.phone = data.phone

    db.commit()
    db.refresh(faculty)
    return faculty


@app.delete("/faculty/{faculty_id}")
def delete_faculty(faculty_id: int, db: Session = Depends(get_db)):
    faculty = db.query(Faculty).filter(Faculty.id == faculty_id).first()
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")
    db.delete(faculty)
    db.commit()
    return {"message": "Faculty deleted successfully"}


# Faculty can view students of their department
@app.get("/faculty/{faculty_id}/students", response_model=List[UserResponse])
def faculty_view_students(faculty_id: int, db: Session = Depends(get_db)):
    faculty = db.query(Faculty).filter(Faculty.id == faculty_id).first()
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")

    students = db.query(User).filter(User.course == faculty.department).all()
    return students


# Faculty marks attendance
@app.post("/faculty/attendance", response_model=AttendanceResponse)
def faculty_mark_attendance(data: AttendanceCreate, db: Session = Depends(get_db)):
    # Reuse the same attendance table
    attendance = Attendance(**data.dict())
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    return attendance


# Faculty adds marks
@app.post("/faculty/marks", response_model=MarkResponse)
def faculty_add_marks(data: MarkCreate, db: Session = Depends(get_db)):
    mark = Mark(**data.dict())
    db.add(mark)
    db.commit()
    db.refresh(mark)
    return mark


# ======================================================
#                  ADMIN PORTAL
# ======================================================

@app.get("/admin/dashboard")
def admin_dashboard(db: Session = Depends(get_db)):
    total_students = db.query(User).count()
    total_faculty = db.query(Faculty).count()
    total_books = db.query(Book).count()
    total_issued = db.query(BookIssue).filter(BookIssue.status.in_(["Issued", "Overdue"])).count()
    pending_requests = db.query(BookRequest).filter(BookRequest.status == "Pending").count()
    total_notices = db.query(Notice).count()

    # Course-wise student count
    from sqlalchemy import func
    course_stats = db.query(User.course, func.count(User.id)).group_by(User.course).all()
    course_wise = {course: count for course, count in course_stats}

    return {
        "total_students": total_students,
        "total_faculty": total_faculty,
        "total_books": total_books,
        "currently_issued_books": total_issued,
        "pending_book_requests": pending_requests,
        "total_notices": total_notices,
        "students_by_course": course_wise
    }


@app.get("/admin/students", response_model=List[UserResponse])
def admin_get_all_students(course: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(User)
    if course:
        query = query.filter(User.course == course)
    return query.all()


@app.get("/admin/faculty", response_model=List[FacultyResponse])
def admin_get_all_faculty(department: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Faculty)
    if department:
        query = query.filter(Faculty.department == department)
    return query.all()


@app.delete("/admin/student/{student_id}")
def admin_delete_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(User).filter(User.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(student)
    db.commit()
    return {"message": "Student deleted by admin"}


@app.delete("/admin/faculty/{faculty_id}")
def admin_delete_faculty(faculty_id: int, db: Session = Depends(get_db)):
    faculty = db.query(Faculty).filter(Faculty.id == faculty_id).first()
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")
    db.delete(faculty)
    db.commit()
    return {"message": "Faculty deleted by admin"}


# Admin can approve/reject book requests (already existed, just confirming)
@app.put("/admin/book-request/{request_id}", response_model=BookRequestResponse)
def admin_update_book_request(request_id: int, data: BookRequestUpdate, db: Session = Depends(get_db)):
    request = db.query(BookRequest).filter(BookRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    request.status = data.status
    request.admin_remark = data.admin_remark
    db.commit()
    db.refresh(request)
    return request


@app.get("/admin/book-requests", response_model=List[BookRequestResponse])
def admin_view_book_requests(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(BookRequest)
    if status:
        query = query.filter(BookRequest.status == status)
    return query.order_by(BookRequest.request_date.desc()).all()


@app.post("/admin/notices", response_model=NoticeResponse)
def admin_create_notice(data: NoticeCreate, db: Session = Depends(get_db)):
    notice = Notice(**data.dict())
    db.add(notice)
    db.commit()
    db.refresh(notice)
    return notice


@app.get("/admin/fees")
def admin_view_all_fees(db: Session = Depends(get_db)):
    fees = db.query(Fee).all()
    return fees