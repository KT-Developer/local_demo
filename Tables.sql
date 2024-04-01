create table Student(
stuId int PRIMARY KEY,
stuName varchar(50),
emailId varchar(80),
stuDepartment varchar(10),
roomNo varchar(10));

create table StuMobile(
stuId int NOT NULL,
stuMobileNo int PRIMARY KEY,
FOREIGN KEY (stuId) REFERENCES Student(stuId));

create table WorkerDepartment(
dId varchar(20) PRIMARY KEY,
dName varchar(50),
dLocation varchar(50),
dEmail varchar(50),
dHead varchar(50));

create table Worker(
workerId varchar(20) PRIMARY KEY,
workerName varchar(50),
dId varchar(20),
FOREIGN KEY(dId) REFERENCES WorkerDepartment(dId),
workerDesig varchar(50));

create table WorkerMobile(
workerId varchar(20) NOT NULL,
workerMobileNo int PRIMARY KEY,
FOREIGN KEY (workerId) REFERENCES Worker(workerId));

create table Faculty(
facId varchar(20) PRIMARY KEY,
facName varchar(20),
facEmail varchar(30),
facDesig varchar(20),
facPass varchar(20) NOT NULL UNIQUE
);

create table FacMobile(
facId varchar(20) ,
facMobileNo int PRIMARY KEY,
FOREIGN KEY (facId) REFERENCES faculty(facId)
);

create table OngoingWorks(
cId int PRIMARY KEY,
iniDate date,
expCompDate date);

create table OngoingWorksWorker(
cId int NOT NULL,
FOREIGN KEY(cId) REFERENCES OngoingWorks(cId),
workerId varchar(20) NOT NULL,
FOREIGN KEY(workerId) REFERENCES Worker(workerId));

create table OngoingWorksStudent(
cId int NOT NULL,
FOREIGN KEY(cId) REFERENCES OngoingWorks(cId),
stuId int NOT NULL,
FOREIGN KEY(stuId) REFERENCES Student(stuId));

create table OngoingWorksFaculty(
cId int NOT NULL,
FOREIGN KEY(cId) REFERENCES OngoingWorks(cId),
facId varchar(20) NOT NULL,
FOREIGN KEY(facId) REFERENCES Faculty(facId));

create table SuperAdmin(
adUserName varchar(30) PRIMARY KEY,
adPass varchar(20) NOT NULL UNIQUE,
adName varchar(20) NOT NULL,
adEmail varchar(30) NOT NULL,
adLocation varchar(20));

create table SupAdmMobileNo(
adUserName varchar(30) NOT NULL,
supAdMobileNo int PRIMARY KEY,
FOREIGN KEY(adUserName) REFERENCES SuperAdmin(adUserName));

create table FiledComplaint(
tempComplainId int PRIMARY KEY,
stuId int,
cDesc varchar(500) NOT NULL,
dId varchar(20),
FOREIGN KEY(stuId) REFERENCES student(stuId),
FOREIGN KEY(dId) REFERENCES WorkerDepartment(dId));

create table Thread(
cId int,
reply varchar(500),
FOREIGN KEY (cId) REFERENCES OngoingWorks(cId) );



drop table OngoingWorksWorker;

drop table OngoingWorksStudent;

drop table OngoingWorksFaculty;

drop table Thread;

drop table OngoingWorks;

drop table FiledComplaint;

drop table StuMobile;

drop table Student;

drop table WorkerMobile;

drop table Worker;

drop table WorkerDepartment;

drop table FacMobile;

drop table Faculty;

drop table SupAdmMobileNo;

drop table SuperAdmin;