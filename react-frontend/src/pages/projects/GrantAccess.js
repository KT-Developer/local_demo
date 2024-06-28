import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Grid, Container, Typography } from "@material-ui/core";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
import config from "../../config";
const GrantAccess = () => {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState('');
    const [error, setError] = useState("");

    const history = useHistory();
    const location = useLocation();
    const { projectId, projectName } = location.state || {};

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const res = await axios.get(`${config.API_URL}:${config.API_PORT}/Users/fetch/${projectId}`);
                setUsers(res.data);
                console.log(res);
            } catch (err) {
                console.log(err);
            }
        };
        fetchAllUsers();
    }, [projectId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!projectName || !user) {
            setError("All fields are required.");
            return;
        }
        try {
            const res = await axios.post(`${config.API_URL}:${config.API_PORT}/AddUserAccess`, { projectId, projectName, user });
            if (res.data.message === 'Successful') {
                console.log('Successfully Updated');
                history.push('/app/projects'); // Redirect to projects page
            } else {
                setError('Error in granting user access.');
            }
        } catch (err) {
            console.log(err);
            setError('Error in granting user access.');
        }
    };

    return (
        <Container maxWidth='sm'>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Project Name"
                        value={projectName}
                        disabled={true}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>Select User</InputLabel>
                        <Select
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            label="Select User"
                        >
                            {users.map((user) => (
                                <MenuItem key={user.USER_ID} value={user.USER_ID}>
                                    {user.USER_NAME}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                {error && (
                    <Grid item xs={12}>
                        <Typography color="error">{error}</Typography>
                    </Grid>
                )}
                <Grid item xs={6}>
                    <Button fullWidth type="submit" color="primary" variant="contained" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button fullWidth color="secondary" variant="contained" onClick={() => history.goBack()}>
                        Back
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default GrantAccess;
