1)select count(distinct(cid)) from course;
2)select cid,count(*) from takes group by cid having count(*)>=2;
3) select a, b  from (select cid,count(*) from takes group by cid) as course_count(a,b) where b=(select max(b) from (select count(*) as b from takes group by cid) as max_counts);
4)select fname from faculty natural join teaches group by teaches.fid having count(*)>2;
5) select fname from faculty natural join advisor group by advisor.fid having count(*)>4;
-- 6)
select fname from faculty where fid in (select max(credit) from course natural join teaches);
-- 7)
CREATE VIEW view_credits AS
SELECT fid, SUM(credit) AS total_credits
FROM course
JOIN teaches ON course.cid = teaches.cid
GROUP BY fid
HAVING total_credits = (SELECT MAX(credit_sum) FROM (SELECT fid, SUM(credit) AS credit_sum FROM course JOIN teaches ON course.cid = teaches.cid GROUP BY fid) AS max_credits);

select fname,faculty.fid from faculty,view_credits where faculty.fid=view_credits.fid;
-- 8)
    create view student_advisor1 as(select sid,count(fid) from advisor group by sid having count(fid)>1);
	select sname,student.sid from student,student_advisor1 where student.sid=student_advisor1.sid;
-- 9) 
	create view view1 as select fname,fid,count(*) from faculty natural join advisor group by advisor.fid;
     SELECT fname
    FROM view1
    GROUP BY fid, fname
    HAVING COUNT(*) = (SELECT MAX(cnt) FROM (SELECT COUNT(*) as cnt FROM view1 GROUP BY fid) AS max_counts);
-- 10) 
	create view takes_course1 as select sid,cid,did from takes natural join course;	
     create view stu_count as select sid,count(distinct(did)) from takes_course1 group by sid having   count(distinct(did))>=2;
    select sname from student where sid in(select sid from stu_count);
-- 11)
create view stu_count1 as select sid,count(distinct(did)) from takes_course1 group by sid having   count(distinct(did))>=2;
select sname from student where sid in(select sid from stu_count1);
-- 12)
create view view2 as select * from takes natural join teaches;
create view view4 as select advisor.sid from view2 join advisor on view2.sid=advisor.sid and view2.fid=advisor.fid;
select sname from student where sid in (select sid from view4);
-- 13)
select sname from student where sid not in (select sid from view4);
-- 14)
CREATE VIEW view14 AS
SELECT did, COUNT(DISTINCT sid) as distinct_sid_count
FROM course
NATURAL JOIN takes
GROUP BY did;
select did from view14 where distinct_sid_count=(select max(distinct_sid_count) from view14);

-- 15)
CREATE VIEW view12 AS 
SELECT did, COUNT(*) AS count_per_department 
FROM faculty 
GROUP BY did;

SELECT did, count_per_department AS max_count 
FROM view12 
WHERE count_per_department = (SELECT MAX(count_per_department) FROM view11);
-- 16) 
select cid,cname from course natural join teaches where did=1 or did=2;
-- 17)
select distinct(sid) from takes where cid=1001 and cid=1010;
-- 18)
	create view view13 as (select did,avg(salary) as avg_sal from faculty group by did);
    select did from view13 where avg_sal=(select max(avg_sal) from view13);
-- 19)
select did from view13 where avg_sal=(select min(avg_sal) from view13);
-- 20)
select distinct(did) from student where age=(select min(age) from student);
