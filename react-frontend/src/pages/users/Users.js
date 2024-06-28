import React, { useState, useEffect } from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useHistory } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import config from "../../config";

// components
import PageTitle from "../../components/PageTitle/PageTitle";
import { useUserState } from "../../context/UserContext"; // Import the context

// styles
const useStyles = makeStyles(theme => ({
    tableOverflow: {
        overflow: 'auto'
    },
    addButton: {
        marginBottom: theme.spacing(2)
    },
    changeRoleButton: {
        marginBottom: theme.spacing(2),
        marginLeft: theme.spacing(2)
    }, ResetPassButton: {
        marginBottom: theme.spacing(2),
        marginLeft: theme.spacing(2)
    }
}));

export default function Users() {
    const classes = useStyles();
    const [users, setUsers] = useState([]);
    const history = useHistory();
    const [selectedRow, setSelectedRow] = useState(null);
    const { userRole } = useUserState(); // Access the user role from context

    const fetchAllUsers = async () => {
        try {
            const res = await axios.get(`${config.API_URL}:${config.API_PORT}/Users`);
            setUsers(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const columns = [
        { name: "USER_NAME", label: "User Name" },
        { name: "FIRST_NAME", label: "First Name" },
        { name: "LAST_NAME", label: "Last Name" },
        { name: "EMAIL", label: "Email" },
        { name: "CONTACT", label: "Contact" },
        { name: "ORGANISATION", label: "Organisation" },
        { name: "ROLE", label: "Role" },
    ];

    const handleDelete = async (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data.map(d => users[d.dataIndex].USER_ID);
        try {
            const res = await axios.post(`${config.API_URL}:${config.API_PORT}/Users/delete`, { ids: idsToDelete });
            if (res.data.message === 'Successful') {
                setUsers(users.filter(user => !idsToDelete.includes(user.USER_ID)));
            } else {
                console.log('Error in deletion');
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleAddUser = () => {
        history.push('/app/addUser');
    };

    const handleChangeRole = async () => {
        if (selectedRow !== null) {
            try {
                const user = users[selectedRow];
                const res = await axios.post(`${config.API_URL}:${config.API_PORT}/Users/changeRole`, { userId: user.USER_ID, role: user.ROLE });
                if (res.data.message === 'Successful') {
                    fetchAllUsers();
                } else {
                    console.log('Error in changing role');
                }
            } catch (err) {
                console.log(err);
            }
        }
    };
    const handleResetPassword = () => {
        if (selectedRow !== null) {
            const user = users[selectedRow];
            history.push({
                pathname: `/app/resetPass`,
                state: { userId: user.USER_ID, userName: user.USER_NAME }
            });
        }
    };

    return (
        <>
            <PageTitle title="Users" />
            {userRole === "user" ? (
                <Typography variant="h6" color="error">
                    Not accessible to you.
                </Typography>
            ) : (
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.addButton}
                            onClick={handleAddUser}
                        >
                            Add User
                        </Button>
                        {selectedRow !== null && (
                            <>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    className={classes.changeRoleButton}
                                    onClick={handleChangeRole}
                                >
                                    Change Role
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    className={classes.ResetPassButton}
                                    onClick={handleResetPassword}>
                                    Reset Password
                                </Button>
                            </>
                        )}
                        <MUIDataTable
                            title="Employee List"
                            data={users}
                            columns={columns}
                            options={{
                                onRowsDelete: handleDelete,
                                selectableRows: 'multiple',
                                onRowSelectionChange: (currentRowsSelected, allRowsSelected) => {
                                    if (allRowsSelected.length === 1) {
                                        setSelectedRow(allRowsSelected[0].dataIndex);
                                    } else {
                                        setSelectedRow(null);
                                    }
                                }
                            }}
                        />
                    </Grid>
                </Grid>
            )}
        </>
    );
}
