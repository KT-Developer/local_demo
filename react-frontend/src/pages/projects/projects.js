import React, { useState, useEffect } from "react";
import { Grid, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import config from "../../config";

// components
import PageTitle from "../../components/PageTitle/PageTitle";

const useStyles = makeStyles(theme => ({
    tableOverflow: {
        overflow: 'auto'
    },
    addButton: {
        marginBottom: theme.spacing(2)
    },
    grantAccessButton: {
        marginLeft: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    revokeAccessButton: {
        marginLeft: theme.spacing(2),
        marginBottom: theme.spacing(2)
    }
}));

export default function Projects() {
    const history = useHistory();
    const classes = useStyles();
    const [projects, setProjects] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);

    useEffect(() => {
        const fetchAllProjects = async () => {
            try {
                const res = await axios.get(`${config.API_URL}:${config.API_PORT}/Projects`);
                setProjects(res.data);
                console.log(res);
            } catch (err) {
                console.log(err);
            }
        };
        fetchAllProjects();
    }, []);

    const columns = [
        { name: "PROJECT_NAME", label: "Project Name" },
        { name: "CLIENT_NAME", label: "Client Name" },
        { name: "CLOUD_PROVIDER", label: "Cloud Provider" }
    ];

    const handleDelete = async (rowsDeleted) => {
        const idsToDelete = rowsDeleted.data.map(d => projects[d.dataIndex].PROJECT_ID);
        try {
            const res = await axios.post(`${config.API_URL}:${config.API_PORT}/Projects/delete`, { ids: idsToDelete });
            if (res.data.message === 'Successful') {
                console.log('Successfully Deleted');
                setProjects(projects.filter(project => !idsToDelete.includes(project.PROJECT_ID)));
            } else {
                console.log('Error in deletion');
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleAddProject = () => {
        history.push('/app/addProject');
    };

    const handleGrantAccess = () => {
        if (selectedRow !== null) {
            const project = projects[selectedRow];
            history.push({
                pathname: `/app/grantAccess`,
                state: { projectId: project.PROJECT_ID, projectName: project.PROJECT_NAME }
            });
        }
    };
    const handleRevokeAccess = () => {
        if (selectedRow !== null) {
            const project = projects[selectedRow];
            history.push({
                pathname: `/app/revokeAccess`,
                state: { projectId: project.PROJECT_ID, projectName: project.PROJECT_NAME }
            });
        }
    };

    return (
        <>
            <PageTitle title="Projects" />
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.addButton}
                        onClick={handleAddProject}
                    >
                        Add Project
                    </Button>
                    {selectedRow !== null && (<>
                        <Button
                            variant="contained"
                            color="secondary"
                            className={classes.grantAccessButton}
                            onClick={handleGrantAccess}
                        >
                            Grant Access to Users
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            className={classes.revokeAccessButton}
                            onClick={handleRevokeAccess}
                        >
                            Revoke Access to Users
                        </Button>
                    </>
                    )}
                    <MUIDataTable
                        title="Project List"
                        data={projects}
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
        </>
    );
}
