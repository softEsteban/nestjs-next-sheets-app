--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.3

-- Started on 2024-02-16 15:43:20

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 3377 (class 0 OID 16906)
-- Dependencies: 222
-- Data for Name: employees; Type: TABLE DATA; Schema: generic; Owner: postgres
--

COPY generic.employees (employee_id, employee_name, employee_lastname, employee_created_at, user_id, employee_pay_type, employee_pay_rate) FROM stdin;
14	Anastasio	Casimiro	2024-02-11 23:18:52.263	13	hourly	15
3	Casiopea 	Montes	2024-02-11 00:55:25.623	9	salary	480
4	Sultanito	De Tal	2024-02-11 22:44:47.902	9	salary	480
5	Armando	Casas	2024-02-11 22:50:08.867	9	salary	480
15	John	Doe	2024-02-12 21:20:01.988	9	salary	480
12	Juanito	De Tales	2024-02-11 23:06:38.814	9	hourly	24
\.


--
-- TOC entry 3381 (class 0 OID 16982)
-- Dependencies: 226
-- Data for Name: minimum_wages; Type: TABLE DATA; Schema: generic; Owner: postgres
--

COPY generic.minimum_wages (wage_id, wage_name, wage_value) FROM stdin;
1	Salary	480
2	Hour	12
\.


--
-- TOC entry 3373 (class 0 OID 16881)
-- Dependencies: 218
-- Data for Name: profiles; Type: TABLE DATA; Schema: generic; Owner: postgres
--

COPY generic.profiles (profile_id, profile_name, profile_config) FROM stdin;
2	CLIENT PROFILE	[{"menu_id": "1", "children": [], "menu_icon": "FaHome", "menu_link": "/home", "menu_name": "Home"}, {"menu_id": "2", "children": [{"menu_id": "1", "children": [], "menu_icon": "FaHardHat", "menu_link": "/employees", "menu_name": "Employees"}, {"menu_id": "2", "children": [], "menu_icon": "FaClock", "menu_link": "/time-sheets", "menu_name": "Time Sheets"}], "menu_icon": "FaBars", "menu_link": "", "menu_name": "Employees Management"}]
1	ADMIN PROFILE	[{"menu_id": "1", "children": [], "menu_icon": "FaHome", "menu_link": "/home", "menu_name": "Home"}, {"menu_id": "2", "children": [{"menu_id": "1", "children": [], "menu_icon": "FaHardHat", "menu_link": "/employees", "menu_name": "Employees"}, {"menu_id": "2", "children": [], "menu_icon": "FaClock", "menu_link": "/time-sheets", "menu_name": "Time Sheets"}], "menu_icon": "FaBars", "menu_link": "", "menu_name": "Employees Management"}, {"menu_id": "3", "children": [{"menu_id": "1", "children": [], "menu_icon": "FaRegUser", "menu_link": "/users", "menu_name": "Users"}], "menu_icon": "FaBars", "menu_link": "/users", "menu_name": "Users Management"}]
\.


--
-- TOC entry 3379 (class 0 OID 16938)
-- Dependencies: 224
-- Data for Name: sheet_times; Type: TABLE DATA; Schema: generic; Owner: postgres
--

COPY generic.sheet_times (sheet_id, sheet_state, sheet_hours, sheet_pay_rate, sheet_total_payed, sheet_check_date, employee_id) FROM stdin;
10	pending	12	24	288	2024-02-15	12
11	pending	40	480	480	2024-03-02	15
13	pending	40	480	480	2024-02-28	15
14	pending	40	48022	48022	2024-02-07	15
16	pending	40	480	480	2024-01-30	15
9	approved	40	500	500	2024-02-20	4
12	declined	40	480	480	2024-03-07	5
17	pending	40	480	480	2024-02-27	15
18	pending	24	6777	162648	2024-01-05	12
15	approved	40	480	480	2024-02-05	5
\.


--
-- TOC entry 3375 (class 0 OID 16890)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: generic; Owner: postgres
--

COPY generic.users (user_id, user_name, user_lastname, user_email, user_password, user_created_at, profile_id, user_avatar, user_type) FROM stdin;
9	Esteban Client	Toro	estebantoro.client@gmail.com	$2b$10$07wsHWtDZCFgZzHVpp4/ce3t8pLDQIUAvC3R/hDK3GVqVIs0Yugn2	2024-02-10 21:00:08.359	2	https://randomuser.me/api/portraits/women/1.jpg	client
11	Esteban Admin	Toro	estebantoro.admin@gmail.com	$2b$10$I3I8EQuoM4b.GZErjFa2cOD/C8athNZDoN4l/gG3RWjh4Xp3JSlri	2024-02-10 21:08:18.394	1	https://randomuser.me/api/portraits/women/1.jpg	admin
13	John	Doe	john-doe@gmail.com	$2b$10$5NUwvxCIl/7Ct9raNx/8H.lZfTsZEYXrl5AH3jnG9MlStx7LPamfi	2024-02-11 23:10:53.669	2	https://randomuser.me/api/portraits/women/1.jpg	client
\.


--
-- TOC entry 3371 (class 0 OID 16871)
-- Dependencies: 216
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
1	1707591481861	InitialMigration1707591481861
2	1707595573958	JsonbInProfile1707595573958
3	1707604613463	AddEmployeesAndSheetTimesEntities1707604613463
4	1707615376255	RenamingSheetTimesTable1707615376255
5	1707616453018	ChangeProfileAndUserDirectionality1707616453018
6	1707629909376	AddingEmployeeColumnsAndEnums1707629909376
7	1707630826080	FixingPayRateDatatype1707630826080
8	1707782679460	AddingCheckDateToTimeSheet1707782679460
9	1707784154098	RemovingPayRateFromTimeSheets1707784154098
10	1707786194202	DateColumnForPayDate1707786194202
11	1707790092825	AddingMinWagesEntity1707790092825
12	1707970371113	ChangingSheetTimesColumnsAndAddingPayRate1707970371113
13	1707973492264	RefactoringEmployeeReferenceFromTimeSheets1707973492264
14	1707973977161	CorrectingDirectionality1707973977161
\.


--
-- TOC entry 3393 (class 0 OID 0)
-- Dependencies: 221
-- Name: employees_employee_id_seq; Type: SEQUENCE SET; Schema: generic; Owner: postgres
--

SELECT pg_catalog.setval('generic.employees_employee_id_seq', 21, true);


--
-- TOC entry 3394 (class 0 OID 0)
-- Dependencies: 225
-- Name: minimum_wages_wage_id_seq; Type: SEQUENCE SET; Schema: generic; Owner: postgres
--

SELECT pg_catalog.setval('generic.minimum_wages_wage_id_seq', 1, false);


--
-- TOC entry 3395 (class 0 OID 0)
-- Dependencies: 217
-- Name: profiles_profile_id_seq; Type: SEQUENCE SET; Schema: generic; Owner: postgres
--

SELECT pg_catalog.setval('generic.profiles_profile_id_seq', 5, true);


--
-- TOC entry 3396 (class 0 OID 0)
-- Dependencies: 223
-- Name: sheet_times_sheet_id_seq; Type: SEQUENCE SET; Schema: generic; Owner: postgres
--

SELECT pg_catalog.setval('generic.sheet_times_sheet_id_seq', 18, true);


--
-- TOC entry 3397 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: generic; Owner: postgres
--

SELECT pg_catalog.setval('generic.users_user_id_seq', 13, true);


--
-- TOC entry 3398 (class 0 OID 0)
-- Dependencies: 215
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 14, true);


-- Completed on 2024-02-16 15:43:20

--
-- PostgreSQL database dump complete
--

