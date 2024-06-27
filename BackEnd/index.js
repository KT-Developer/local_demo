const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_password,
    database: "ct-scan-tool-localdb"
})
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});
app.get('/', (req, res) => {
    return res.send('hello world')
})
app.post('/insert', async (req, res) => {
    const records = req.body.records;

    if (!Array.isArray(records) || records.length === 0) {
        return res.status(400).send({ message: 'Records should be a non-empty array' });
    }

    // Hash the desired field (e.g., password) for each record
    try {
        const saltRounds = 10;

        // Hash the PASSWORD field for each record
        for (const record of records) {
            if (record.PASSWORD) {
                record.PASSWORD = await bcrypt.hash(record.PASSWORD, saltRounds);
            }
        }

        // Extract field names dynamically
        const fields = Object.keys(records[0]);
        const values = records.map(record => fields.map(field => record[field]));

        const sql = `INSERT INTO users (${fields.join(', ')}) VALUES ?`;

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error('Error inserting records:', err);
                return res.status(500).send({ message: 'Error inserting records' });
            }
            res.send({ message: 'Records inserted successfully', affectedRows: result.affectedRows });
        });
    } catch (err) {
        console.error('Error processing records:', err);
        return res.status(500).send({ message: 'Error processing records' });
    }

});
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    const sql = "SELECT USER_ID,EMAIL, PASSWORD,ROLE FROM users WHERE EMAIL = ?";
    db.query(sql, [email], async (err, data) => {
        if (err) {
            console.error('Error during login:', err);
            return res.status(500).json({ error: "Error during login" });
        }

        if (data.length === 0) {
            return res.json({ message: "Not Found" });
        }

        const user = data[0];
        const passwordMatch = await bcrypt.compare(password, user.PASSWORD);

        if (!passwordMatch) {
            return res.json({ message: "Not Found" });
        }

        const token = jwt.sign({ id: user.USER_ID }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({
            message: "Login Successful",
            token: token,
            role: user.ROLE
        });
    });
});
app.get('/Clients', (req, res) => {
    const sql = "Select CLIENT_ID,CLIENT_NAME,EMAIL,ADDRESS,COUNTRY from client";
    db.query(sql, (err, data) => {
        if (err) return res.json('Error');
        else {
            return res.json(data);
        }
    })
})
app.get('/Projects', (req, res) => {
    const sql = "Select PROJECT_ID,PROJECT_NAME,CLIENT_NAME,CLOUD_PROVIDER from client,project where client.CLIENT_ID=project.CLIENT_ID and project.STATUS='Active'";
    db.query(sql, (err, data) => {
        if (err) return res.json('Error');
        else {
            return res.json(data);
        }
    })
})

app.get('/Users', (req, res) => {
    const sql = "Select USER_ID,USER_NAME,FIRST_NAME,LAST_NAME,EMAIL,CONTACT,ORGANIZATION,ROLE from users where STATUS='Active'";
    db.query(sql, (err, data) => {
        if (err) return res.json('Error');
        else {
            return res.json(data);
        }
    })
})
app.post('/Users/delete', (req, res) => {
    const userIds = req.body.ids;
    const sql = "Update users set STATUS='Archived',ARCHIVE_TIMESTAMP=NOW() WHERE USER_ID IN (?)";
    db.query(sql, [userIds], (err, data) => {
        if (err) return res.json({ message: 'Error' });
        return res.json({ message: 'Successful' });
    });
});
app.get('/Users/fetch/:ID', (req, res) => {
    const { ID } = req.params;
    const sql = `SELECT USER_ID, USER_NAME 
                 FROM users 
                 WHERE STATUS='active' 
                   AND USER_ID NOT IN (
                     SELECT USER_ID 
                     FROM user_project_mapping 
                     WHERE PROJECT_ID=? 
                       AND STATUS='active')`;

    db.query(sql, [ID], (err, data) => {
        if (err) return res.json('Error');
        else {
            return res.json(data);
        }
    });
});
app.get('/Users/fetchRevoke/:ID', (req, res) => {
    const { ID } = req.params;
    const sql = `SELECT USER_ID, USER_NAME 
                 FROM users 
                 WHERE STATUS='active' 
                   AND USER_ID IN (
                     SELECT USER_ID 
                     FROM user_project_mapping 
                     WHERE PROJECT_ID=? 
                       AND STATUS='active')`;

    db.query(sql, [ID], (err, data) => {
        if (err) return res.json('Error');
        else {
            return res.json(data);
        }
    });
});
app.post('/RevokeUserAccess', (req, res) => {
    const { projectId, projectName, user } = req.body;
    const values = [projectId, user];
    try {
        const sql = `update user_project_mapping set STATUS='Archived' , ARCHIVE_TIMESTAMP=NOW()  where PROJECT_ID=? AND USER_ID=?`;
        db.query(sql, values, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error' });
            }
            res.status(200).json({ message: 'Successful' });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error' });
    }
})

app.post('/AddUserAccess', (req, res) => {
    const { projectId, projectName, user } = req.body;
    const values = [user, projectId];
    try {
        const sql = `Insert into user_project_mapping (USER_ID,PROJECT_ID,STATUS,CREATION_TIMESTAMP) values (?,?,'active',NOW()) `;
        db.query(sql, values, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error' });
            }
            res.status(200).json({ message: 'Successful' });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error' });
    }
})
app.post('/Users/changeRole', (req, res) => {
    var { userId, role } = req.body;
    if (role === 'admin') {
        role = 'user';
    }
    else {
        role = 'admin';
    }
    const values = [role, userId];
    try {
        const sql = `Update users set ROLE=? where USER_ID=?`;
        db.query(sql, values, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error' });
            }
            res.status(200).json({ message: 'Successful' });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error' });
    }
})
app.post('/Clients/delete', (req, res) => {
    const clientIds = req.body.ids;

    const selectSql = "SELECT DISTINCT CLIENT_ID FROM project WHERE CLIENT_ID IN (?) AND STATUS='Active'";
    db.query(selectSql, [clientIds], (err, data) => {
        if (err) {
            console.error("Error selecting client IDs from projects:", err);
            return res.json({ message: 'Error' });
        }

        const associatedClientIds = data.map(row => row.CLIENT_ID);
        const idsToDelete = clientIds.filter(id => !associatedClientIds.includes(id));

        const selSql = "SELECT CLIENT_NAME FROM client WHERE CLIENT_ID IN (?)";
        db.query(selSql, [associatedClientIds], (err, nameData) => {
            if (err) {
                console.error("Error selecting client names:", err);
                return res.json({ message: 'Error' });
            }

            const associatedNames = nameData.map(row => row.CLIENT_NAME);

            if (idsToDelete.length === 0) {
                return res.json({ message: 'No clients to delete', cannotDelete: associatedNames });
            }

            const deleteSql = "UPDATE client SET STATUS='Archived', ARCHIVE_TIMESTAMP=NOW() WHERE CLIENT_ID IN (?)";
            db.query(deleteSql, [idsToDelete], (err, result) => {
                if (err) {
                    console.error("Error updating clients:", err);
                    return res.json({ message: 'Error' });
                }

                return res.json({ message: 'Successful', deleted: idsToDelete, cannotDelete: associatedNames });
            });
        });
    });
});
app.post('/users/AddUser', async (req, res) => {
    const { userName, firstName, lastName, email, contact, organisation, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `
            INSERT INTO users 
            (USER_NAME, FIRST_NAME, LAST_NAME, EMAIL, CONTACT, ORGANIZATION, ROLE, STATUS, CREATION_TIMESTAMP, PASSWORD) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 'active', NOW(), ?)
        `;

        const values = [userName, firstName, lastName, email, contact, organisation, role, hashedPassword];

        db.query(sql, values, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error' });
            }
            res.status(200).json({ message: 'Successful' });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error' });
    }
});
app.post('/projects/addProject', async (req, res) => {
    const { client, projectName, cloudProvider } = req.body;
    try {
        const sql = ` INSERT INTO project 
            (CLIENT_ID, PROJECT_NAME,CLOUD_PROVIDER, STATUS, CREATION_TIMESTAMP) 
            VALUES (?, ?, ?, 'active', NOW())`;
        const values = [client, projectName, cloudProvider];
        db.query(sql, values, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error' });
            }
            res.status(200).json({ message: 'Successful' });
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error' });
    }
})
app.post('/clients/addClient', async (req, res) => {
    const { name, email, address, country } = req.body;
    try {
        const sql = ` INSERT INTO client 
            (CLIENT_NAME, EMAIL,ADDRESS, COUNTRY,STATUS, CREATION_TIMESTAMP) 
            VALUES (?, ?, ?,?, 'active', NOW())`;
        const values = [name, email, address, country];
        db.query(sql, values, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error' });
            }
            res.status(200).json({ message: 'Successful' });
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error' });
    }
})
app.post('/Projects/delete', (req, res) => {
    const projectIds = req.body.ids;
    const sql = "Update project set STATUS='Archived',ARCHIVE_TIMESTAMP=NOW() WHERE PROJECT_ID IN (?)";
    db.query(sql, [projectIds], (err, data) => {
        if (err) return res.json({ message: 'Error' });
        return res.json({ message: 'Successful' });
    });
});
app.get('/profile/:ID', (req, res) => {
    const { ID } = req.params;
    const sql = `Select USER_ID,USER_NAME,FIRST_NAME,LAST_NAME,EMAIL,CONTACT,ORGANIZATION from users where USER_ID=${ID} `;
    db.query(sql, (err, data) => {
        if (err) return res.json('Error');
        else {
            return res.json(data);
        }
    })
})
app.get('/profileName/:ID', (req, res) => {
    const { ID } = req.params;
    const sql = `Select USER_NAME from users where USER_ID=${ID} `;
    db.query(sql, (err, data) => {
        if (err) return res.json('Error');
        else {
            return res.json(data);
        }
    })
})
app.post('/profile/update', (req, res) => {
    const { id, firstName, lastName, contact } = req.body;
    const sql = `UPDATE users SET FIRST_NAME=?, LAST_NAME=?, CONTACT=? WHERE USER_ID=?`;
    db.query(sql, [firstName, lastName, contact, id], (err, data) => {
        if (err) {
            console.error('Error updating profile:', err);
            return res.status(400).json({ message: "Error" });
        } else {
            return res.status(200).json({ message: "Successful" });
        }
    });
});
app.get('/password/:ID', (req, res) => {
    const { ID } = req.params;
    const sql = `Select USER_NAME from users where USER_ID=${ID} `;
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error updating profile:', err);
            return res.status(400).json({ message: "Error" });
        } else {
            return res.json(data);
        }
    });
})
app.post('/password/update', (req, res) => {
    const { id, currPass, newPass } = req.body;
    const sql = `select PASSWORD from Users where USER_ID=${id}`;
    db.query(sql, [], async (err, data) => {
        if (err) {
            return console.error(err);
        }
        else {
            const user = data[0];
            const passwordMatch = await bcrypt.compare(currPass, user.PASSWORD);
            if (!passwordMatch) {
                return res.json({ message: "No Match" });
            }
            else {
                const pass = await bcrypt.hash(newPass, 10);
                const sql1 = `update Users set PASSWORD=? where USER_ID=${id} `;
                db.query(sql1, [pass], (err, data) => {
                    if (err) {
                        return console.error(err);
                    }
                    else {
                        return res.json({ message: "Successful" });
                    }
                });
            }
        }
    });
})
app.post('/password/reset', (req, res) => {
    const { userId, newPass } = req.body;
    const sql = `select PASSWORD from Users where USER_ID=${userId}`;
    db.query(sql, [], async (err, data) => {
        if (err) {
            return console.error(err);
        }
        else {
            const user = data[0];

            const pass = await bcrypt.hash(newPass, 10);
            const sql1 = `update Users set PASSWORD=? where USER_ID=${userId} `;
            db.query(sql1, [pass], (err, data) => {
                if (err) {
                    return console.error(err);
                }
                else {
                    return res.json({ message: "Successful" });
                }
            });
        }
    });
})
app.get('/User_Projects/:ID', (req, res) => {
    const { ID } = req.params;
    const sql = `WITH scans AS (
    SELECT 
        SCAN_ID,
        PROJECT_ID,
        TOTAL_SCAN,
        EXECUTION_TIME,
        
        ROW_NUMBER() OVER (PARTITION BY PROJECT_ID ORDER BY EXECUTION_TIME DESC) AS rn
    FROM 
        scan_result
) 
SELECT 
    SCAN_ID,
    PROJECT_NAME,
    CLOUD_PROVIDER,
    TOTAL_SCAN,
    EXECUTION_TIME
FROM 
    scans,project
WHERE 
    rn = 1 and scans.PROJECT_ID in (select PROJECT_ID FROM  user_project_mapping where USER_ID=? and STATUS='active') and scans.PROJECT_ID=project.PROJECT_ID and project.STATUS='active'
`;
    db.query(sql, ID, (err, data) => {
        if (err) return res.json(err);
        else {
            return res.json(data);
        }
    })
})
app.get('/User_Scan/:ID', (req, res) => {
    const { ID } = req.params;

    const sql = `
    WITH res AS (
        SELECT PROJECT_ID 
        FROM user_project_mapping 
        WHERE USER_ID = ? and STATUS='active'
    )
    SELECT 
        p.PROJECT_NAME, 
        c.CLIENT_NAME, 
        p.CLOUD_PROVIDER, 
        s.SCAN_ID, 
        s.COMPLIANCE_CHECK, 
        s.EXECUTION_TIME,
        s.TOTAL_SCAN,
        s.PASS,
        s.FAIL,
        s.WARN,
        s.CRITICAL,
        s.HIGH,
        s.MEDIUM,
        s.LOW,
        s.PCI,
        s.HIPAA,
        s.CIS1,
        s.CIS2,
        p.CLIENT_ID AS CLIENT_ID  
    FROM 
        scan_result s
    JOIN 
        project p ON s.PROJECT_ID = p.PROJECT_ID
    JOIN 
        client c ON p.CLIENT_ID = c.CLIENT_ID
    WHERE 
        s.EXECUTION_TIME = (
            SELECT MAX(s1.EXECUTION_TIME) 
            FROM scan_result s1 
            WHERE s1.PROJECT_ID IN (SELECT PROJECT_ID FROM res)
        )
    AND 
        p.PROJECT_ID IN (SELECT PROJECT_ID FROM res) and p.STATUS='active';
    `;

    db.query(sql, [ID], (err, data) => {
        if (err) return res.json(err);
        else return res.json(data);
    });
});
app.get('/Scan_Scores/:ID', (req, res) => {
    const { ID } = req.params;
    const sql = `WITH scans AS (
    SELECT 
        SCAN_ID,
        PROJECT_ID,
        CRITICAL, HIGH, MEDIUM, LOW ,SCORES,
        EXECUTION_TIME,
        
        ROW_NUMBER() OVER (PARTITION BY PROJECT_ID ORDER BY EXECUTION_TIME DESC) AS rn
    FROM 
        scan_result
) 
SELECT 
    SCAN_ID,
    PROJECT_NAME,
    CRITICAL, HIGH, MEDIUM, LOW ,SCORES,
    EXECUTION_TIME
FROM 
    scans,project
WHERE 
    rn = 1 and scans.PROJECT_ID in (select PROJECT_ID FROM  user_project_mapping where USER_ID=? and STATUS='active') and scans.PROJECT_ID=project.PROJECT_ID and project.STATUS='active' limit 5;
`;
    db.query(sql, ID, (err, data) => {
        if (err) return res.json(err);
        else {
            return res.json(data);
        }
    })
})
app.get('/Scan_Compliance_Scores/:ID', (req, res) => {
    const { ID } = req.params;
    const sql = `WITH scans AS (
    SELECT 
        SCAN_ID,
        PROJECT_ID, 
        COMPLIANCE_SCORES,
        EXECUTION_TIME,
        ROW_NUMBER() OVER (PARTITION BY PROJECT_ID ORDER BY EXECUTION_TIME DESC) AS rn
    FROM 
        scan_result
) 
SELECT 
    SCAN_ID,
    PROJECT_NAME,
    COMPLIANCE_SCORES,
    EXECUTION_TIME
FROM 
    scans,project
WHERE 
    rn = 1 and scans.PROJECT_ID in (select PROJECT_ID FROM  user_project_mapping where USER_ID=? and STATUS='active') and scans.PROJECT_ID=project.PROJECT_ID and project.STATUS='active' limit 5;
`;
    db.query(sql, ID, (err, data) => {
        if (err) return res.json(err);
        else {
            return res.json(data);
        }
    })
})
app.get('/TopFiveCategory/:ID', (req, res) => {
    const { ID } = req.params;
    const sql = `with res as(select PROJECT_ID from user_project_mapping where USER_ID=? and STATUS='active') SELECT CATEGORY, TOTAL_COUNT, PASS_COUNT, FAIL_COUNT
                              FROM top_five_category
                              WHERE SCAN_ID = (SELECT MAX(SCAN_ID) FROM scan_result where PROJECT_ID in (Select PROJECT_ID from res))`;
    db.query(sql, ID, (err, data) => {
        if (err) return res.json(err);
        else {
            return res.json(data);
        }
    })
})


app.listen(5001, () => {
    console.log("Server is listening")
})