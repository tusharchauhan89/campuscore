--
-- PostgreSQL database dump
--

\restrict 0Mbw88s0tFTkWjQS9OVkPA8ltYD1hK7sNP02Sc9RHEBVyUPbZb5oKVBORb1Kdyr

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: attendance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attendance (
    id integer NOT NULL,
    student_id integer,
    subject character varying NOT NULL,
    date date NOT NULL,
    status character varying NOT NULL
);


ALTER TABLE public.attendance OWNER TO postgres;

--
-- Name: attendance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attendance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attendance_id_seq OWNER TO postgres;

--
-- Name: attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attendance_id_seq OWNED BY public.attendance.id;


--
-- Name: book_issues; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.book_issues (
    id integer NOT NULL,
    student_id integer,
    book_id integer,
    issue_date date NOT NULL,
    due_date date NOT NULL,
    return_date date,
    status character varying,
    fine_amount double precision DEFAULT 0.0
);


ALTER TABLE public.book_issues OWNER TO postgres;

--
-- Name: book_issues_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.book_issues_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.book_issues_id_seq OWNER TO postgres;

--
-- Name: book_issues_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.book_issues_id_seq OWNED BY public.book_issues.id;


--
-- Name: book_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.book_requests (
    id integer NOT NULL,
    student_id integer,
    book_id integer,
    book_title character varying NOT NULL,
    reason text,
    request_date date,
    status character varying,
    admin_remark character varying
);


ALTER TABLE public.book_requests OWNER TO postgres;

--
-- Name: book_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.book_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.book_requests_id_seq OWNER TO postgres;

--
-- Name: book_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.book_requests_id_seq OWNED BY public.book_requests.id;


--
-- Name: books; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.books (
    id integer NOT NULL,
    title character varying NOT NULL,
    author character varying NOT NULL,
    isbn character varying,
    category character varying,
    total_copies integer,
    available_copies integer
);


ALTER TABLE public.books OWNER TO postgres;

--
-- Name: books_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.books_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.books_id_seq OWNER TO postgres;

--
-- Name: books_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.books_id_seq OWNED BY public.books.id;


--
-- Name: faculty; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.faculty (
    id integer NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    employee_id character varying NOT NULL,
    department character varying NOT NULL,
    designation character varying,
    phone character varying
);


ALTER TABLE public.faculty OWNER TO postgres;

--
-- Name: faculty_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.faculty_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.faculty_id_seq OWNER TO postgres;

--
-- Name: faculty_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.faculty_id_seq OWNED BY public.faculty.id;


--
-- Name: fees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fees (
    id integer NOT NULL,
    student_id integer,
    semester character varying NOT NULL,
    amount double precision NOT NULL,
    paid_amount double precision,
    status character varying,
    due_date date
);


ALTER TABLE public.fees OWNER TO postgres;

--
-- Name: fees_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fees_id_seq OWNER TO postgres;

--
-- Name: fees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fees_id_seq OWNED BY public.fees.id;


--
-- Name: marks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.marks (
    id integer NOT NULL,
    student_id integer,
    subject character varying NOT NULL,
    exam_type character varying NOT NULL,
    marks_obtained double precision NOT NULL,
    max_marks double precision NOT NULL,
    semester character varying NOT NULL
);


ALTER TABLE public.marks OWNER TO postgres;

--
-- Name: marks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.marks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.marks_id_seq OWNER TO postgres;

--
-- Name: marks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.marks_id_seq OWNED BY public.marks.id;


--
-- Name: notices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notices (
    id integer NOT NULL,
    title character varying NOT NULL,
    content text NOT NULL,
    course character varying,
    created_at date NOT NULL
);


ALTER TABLE public.notices OWNER TO postgres;

--
-- Name: notices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notices_id_seq OWNER TO postgres;

--
-- Name: notices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notices_id_seq OWNED BY public.notices.id;


--
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    id integer NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    rollnumber character varying NOT NULL,
    course character varying NOT NULL,
    university character varying DEFAULT 'UIT Shimla (HPU)'::character varying
);


ALTER TABLE public.students OWNER TO postgres;

--
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.students_id_seq OWNER TO postgres;

--
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.students_id_seq OWNED BY public.students.id;


--
-- Name: attendance id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance ALTER COLUMN id SET DEFAULT nextval('public.attendance_id_seq'::regclass);


--
-- Name: book_issues id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_issues ALTER COLUMN id SET DEFAULT nextval('public.book_issues_id_seq'::regclass);


--
-- Name: book_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_requests ALTER COLUMN id SET DEFAULT nextval('public.book_requests_id_seq'::regclass);


--
-- Name: books id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books ALTER COLUMN id SET DEFAULT nextval('public.books_id_seq'::regclass);


--
-- Name: faculty id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculty ALTER COLUMN id SET DEFAULT nextval('public.faculty_id_seq'::regclass);


--
-- Name: fees id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fees ALTER COLUMN id SET DEFAULT nextval('public.fees_id_seq'::regclass);


--
-- Name: marks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marks ALTER COLUMN id SET DEFAULT nextval('public.marks_id_seq'::regclass);


--
-- Name: notices id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notices ALTER COLUMN id SET DEFAULT nextval('public.notices_id_seq'::regclass);


--
-- Name: students id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students ALTER COLUMN id SET DEFAULT nextval('public.students_id_seq'::regclass);


--
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attendance (id, student_id, subject, date, status) FROM stdin;
1	1	c	2026-11-02	string
2	2	cloud computing	2026-11-05	Present
3	2	DSA	2026-11-05	Present
4	2	DSA	2026-11-06	Absent
5	2	cloud computing	2026-11-06	Present
\.


--
-- Data for Name: book_issues; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.book_issues (id, student_id, book_id, issue_date, due_date, return_date, status, fine_amount) FROM stdin;
\.


--
-- Data for Name: book_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.book_requests (id, student_id, book_id, book_title, reason, request_date, status, admin_remark) FROM stdin;
1	2	\N	cloud computing	\N	2026-11-06	Approved	\N
\.


--
-- Data for Name: books; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.books (id, title, author, isbn, category, total_copies, available_copies) FROM stdin;
\.


--
-- Data for Name: faculty; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.faculty (id, name, email, password, employee_id, department, designation, phone) FROM stdin;
1	Dr. Sharma	faculty@college.edu	faculty123	FAC001	CSE	Professor	9876543210
2	Dr. chauhan	faculty@college.ed	faculty123	FAC002	ECE	Professor	9876543210
\.


--
-- Data for Name: fees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fees (id, student_id, semester, amount, paid_amount, status, due_date) FROM stdin;
1	2	8	48700	48700	Paid	2026-11-06
\.


--
-- Data for Name: marks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.marks (id, student_id, subject, exam_type, marks_obtained, max_marks, semester) FROM stdin;
1	2	cloud computing	Final	40	100	8
\.


--
-- Data for Name: notices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notices (id, title, content, course, created_at) FROM stdin;
1	TECH_FEST	regarding uit fest	UIT ALL BRANCHES	2026-11-03
2	TECH_FEST	regarding uit fest	CSE	2026-11-03
3	semester exam 	datesheeet will be shared shortley	\N	2026-11-05
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (id, name, email, password, rollnumber, course, university) FROM stdin;
1	Sahil Chauhan	user@it.com	string	50	IT	UIT Shimla (HPU)
3	Tushar Chauhan	cse@gmail.com	chuahan	CS070	CSE	UIT Shimla (HPU)
2	Tushar  Chauhan	user@example.com	string	70	ECE	UIT Shimla (HPU)
\.


--
-- Name: attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attendance_id_seq', 5, true);


--
-- Name: book_issues_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.book_issues_id_seq', 1, false);


--
-- Name: book_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.book_requests_id_seq', 1, true);


--
-- Name: books_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.books_id_seq', 1, false);


--
-- Name: faculty_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.faculty_id_seq', 2, true);


--
-- Name: fees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.fees_id_seq', 1, true);


--
-- Name: marks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.marks_id_seq', 1, true);


--
-- Name: notices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notices_id_seq', 3, true);


--
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.students_id_seq', 3, true);


--
-- Name: attendance attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_pkey PRIMARY KEY (id);


--
-- Name: book_issues book_issues_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_issues
    ADD CONSTRAINT book_issues_pkey PRIMARY KEY (id);


--
-- Name: book_requests book_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_requests
    ADD CONSTRAINT book_requests_pkey PRIMARY KEY (id);


--
-- Name: books books_isbn_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_isbn_key UNIQUE (isbn);


--
-- Name: books books_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (id);


--
-- Name: faculty faculty_employee_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT faculty_employee_id_key UNIQUE (employee_id);


--
-- Name: faculty faculty_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT faculty_pkey PRIMARY KEY (id);


--
-- Name: fees fees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fees
    ADD CONSTRAINT fees_pkey PRIMARY KEY (id);


--
-- Name: marks marks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marks
    ADD CONSTRAINT marks_pkey PRIMARY KEY (id);


--
-- Name: notices notices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notices
    ADD CONSTRAINT notices_pkey PRIMARY KEY (id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: students students_rollnumber_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_rollnumber_key UNIQUE (rollnumber);


--
-- Name: ix_attendance_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_attendance_id ON public.attendance USING btree (id);


--
-- Name: ix_book_issues_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_book_issues_id ON public.book_issues USING btree (id);


--
-- Name: ix_book_requests_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_book_requests_id ON public.book_requests USING btree (id);


--
-- Name: ix_books_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_books_id ON public.books USING btree (id);


--
-- Name: ix_faculty_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_faculty_email ON public.faculty USING btree (email);


--
-- Name: ix_faculty_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_faculty_id ON public.faculty USING btree (id);


--
-- Name: ix_fees_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_fees_id ON public.fees USING btree (id);


--
-- Name: ix_marks_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_marks_id ON public.marks USING btree (id);


--
-- Name: ix_notices_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_notices_id ON public.notices USING btree (id);


--
-- Name: ix_students_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_students_email ON public.students USING btree (email);


--
-- Name: ix_students_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_students_id ON public.students USING btree (id);


--
-- Name: attendance attendance_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: book_issues book_issues_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_issues
    ADD CONSTRAINT book_issues_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id);


--
-- Name: book_issues book_issues_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_issues
    ADD CONSTRAINT book_issues_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: book_requests book_requests_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_requests
    ADD CONSTRAINT book_requests_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id);


--
-- Name: book_requests book_requests_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_requests
    ADD CONSTRAINT book_requests_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: fees fees_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fees
    ADD CONSTRAINT fees_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: marks marks_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marks
    ADD CONSTRAINT marks_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- PostgreSQL database dump complete
--

\unrestrict 0Mbw88s0tFTkWjQS9OVkPA8ltYD1hK7sNP02Sc9RHEBVyUPbZb5oKVBORb1Kdyr

