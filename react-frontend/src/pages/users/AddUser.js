import React, { useState } from "react";
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Grid, Container, Typography, FormLabel } from "@material-ui/core";
import axios from "axios";
import { useHistory } from "react-router-dom";
import './AddUser.css';
import config from "../../config";

const AddUser = () => {
    const [userName, setUserName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [organisation, setOrganisation] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState("");

    const history = useHistory();

    const handleFirstName = (e) => setFirstName(e.target.value);
    const handleLastName = (e) => setLastName(e.target.value);
    const handleContact = (e) => setContact(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userName || !firstName || !lastName || !email || !contact || !organisation || !password || !confirmPassword || !role) {
            setError("All fields are required.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        try {
            const res = await axios.post(`${config.API_URL}:${config.API_PORT}/users/AddUser`, { userName, firstName, lastName, email, contact, organisation, password, role });
            if (res.data.message === 'Successful') {
                console.log('Successfully Updated');
                history.push('/app/users'); // Redirect to users page
            } else {
                setError('Error in adding user.');
            }
        } catch (err) {
            console.log(err);
            setError('Error in adding user.');
        }
    };

    return (
        <Container maxWidth='sm'>

            <Grid container spacing={2} >
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="User Name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="First Name"
                        value={firstName}
                        onChange={handleFirstName}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Last Name"
                        value={lastName}
                        onChange={handleLastName}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Contact"
                        value={contact}
                        onChange={handleContact}

                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Organisation"
                        value={organisation}
                        onChange={(e) => setOrganisation(e.target.value)}

                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}

                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}

                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth >
                        <InputLabel>Select Role</InputLabel>
                        <Select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            label="Select Role"
                        >
                            <MenuItem value="superAdmin">SuperAdmin</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="user">User</MenuItem>
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

export default AddUser;
