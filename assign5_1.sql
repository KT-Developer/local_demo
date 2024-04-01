
-- 1
select dname from department where did in(select did from course group by did having count(cid)>=2);
-- 2
select distinct dname from department where did in(select did from course group by did having count(cid)<=2);
-- 3
SELECT dname 
FROM department 
WHERE did IN (
    SELECT did
    FROM (
        SELECT did, COUNT(*) AS count_did 
        FROM course 
        GROUP BY did
    ) AS course_count 
    WHERE count_did = (
        SELECT MAX(counts) 
        FROM (
            SELECT COUNT(*) AS counts 
            FROM course 
            GROUP BY did
        ) AS counter
    )
);

-- 4
SELECT dname 
FROM department 
WHERE did IN (
    SELECT did
    FROM (
        SELECT did, COUNT(*) AS count_did 
        FROM course 
        GROUP BY did
    ) AS course_count 
    WHERE count_did = (
        SELECT MIN(counts) 
        FROM (
            SELECT COUNT(*) AS counts 
            FROM course 
            GROUP BY did
        ) AS counter
    )
);

-- 5
SELECT *
FROM course
WHERE credit = (
    SELECT credit
    FROM course
    ORDER BY credit DESC
    LIMIT 1  offset 1
);
-- 6
select fname from faculty where fid in (select fid from advisor where title like '%Ad%');

-- 7
select fname from faculty where fid not in (select fid from teaches);

-- 8
with tab as (select fid, course.cid, did from teaches, course where course.cid =  teaches.cid), tab2 as (select fid, did from tab EXCEPT select fid, did from faculty)
select fname from faculty where fid in (select fid from tab2);

-- 9
with tab as (select fid, course.cid, did from teaches, course where course.cid =  teaches.cid), tab2 as (select fid, did from faculty intersect select fid, did from tab  ), tab3 as (select fid, did from tab EXCEPT select fid, did from faculty)
select fname from faculty where fid in (select fid from tab2 except select fid from tab3);

-- 10
with tab as (select fid, course.cid, did from teaches, course where course.cid =  teaches.cid), 
tab2 as (select fid, did from faculty except select fid, did from tab  ), 
tab3 as (select fid, did from tab intersect select fid, did from faculty) 
select fname from faculty where fid in (select fid from tab2 except select fid from tab3);

-- 11
-- create view view20 as select sid, age ,cid from student natural join  (select cid,sid from takes natural join course)as t1;
select cid from view20 group by cid having avg(age)= (select min(averg) from (select avg(age) as averg from view20 group by cid) as ages); 
   
 -- create table marks (
--  sid  int,
--  cid int,
--  marks int,
--  primary key(sid,cid),
--  foreign key(sid,cid) references takes (sid,cid)
--  );
--  insert into marks values(
--     105, 1001,80),
--     (101, 1010,95),
--     (102,2101,63),
--     (101,3010,50),
--     (106,3010,35),
--     (103,4010,29),
--     (104,4010,91);
--     
-- 12   
SELECT sid
FROM (
    SELECT sid, AVG(marks) AS average_marks
    FROM marks
    GROUP BY sid
) AS student_average
WHERE average_marks = (
    SELECT MAX(average_marks)
    FROM (
        SELECT AVG(marks) AS average_marks
        FROM marks
        GROUP BY sid
    ) AS max_average
);

-- this statement not giving desired output :select sid from (select sid, max(averg) from (select sid,avg(marks)as averg from marks group by sid) as avg_marks group by sid) as averag1; 

-- 13
with tab as (select cid, count(*) as cnt from marks where marks >= 50 group by cid)
select cname from course where cid in (select cid from tab where cnt = (select max(cnt) from tab));
-- 14
with tab as (select cid,count(*) as count1 from marks group by cid), tab2 as (select cid,count(*) as count2 from marks where marks=70 group by cid)
select tab.cid from tab,tab2 where count1=count2 and tab.cid=tab2.cid;
-- 15
SELECT
    sid,
    AVG(marks) AS average_marks,
    CASE
        WHEN AVG(marks) >= 80 THEN 'AA'
        WHEN AVG(marks) >= 60 THEN 'AB'
        WHEN AVG(marks) >= 40 THEN 'BB'
        WHEN AVG(marks) >= 20 THEN 'BC'
        ELSE 'F'
    END AS grade
FROM
    marks
GROUP BY
    sid;
-- 16    
-- delimiter //
-- 	create function in_count(dept_name varchar(50))
--     returns int
-- 	deterministic
--     begin 
-- 		declare dcount int;
-- 		select count(*) into dcount from faculty,department where dname=dept_name and faculty.did=department.did;
--         return dcount;
-- 	end //
-- delimiter ;
select in_count('Mathematics'); 
-- 17
select * from department where in_count(dname)>1;
-- 18
-- delimiter //
-- 	create function fac_count(fac_sal numeric(8,2))
--     returns int
-- 	deterministic
--     begin 
-- 		declare fcount int;
-- 		select count(*) into fcount from faculty where fac_sal=salary;
--         return fcount;
-- 	end //
-- delimiter ;
select fac_count(75000);
-- 19
select fac_count(100);
-- 20
select * from faculty where fac_count(salary)>=2;










