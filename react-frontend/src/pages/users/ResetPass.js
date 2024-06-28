import React, { useState } from "react";
import { TextField, Button, Grid, Container, Typography } from "@material-ui/core";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
import config from "../../config";

const ResetPass = () => {
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [message, setMessage] = useState('');
    const location = useLocation();
    const { userId, userName } = location.state || {};
    const history = useHistory();

    const handleNewPass = (event) => setNewPass(event.target.value);
    const handleConfirmPass = (event) => setConfirmPass(event.target.value);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (newPass !== confirmPass) {
            setMessage("Passwords do not match.");
        } else {
            try {
                const res = await axios.post(`${config.API_URL}:${config.API_PORT}/password/reset`, { userId, newPass });
                if (res.data.message === 'Successful') {
                    setMessage('Successfully Updated');
                    history.push('/app/users');
                } else {
                    setMessage('Error in updating password.');
                }
            } catch (err) {
                console.log(err);
                setMessage('Error in updating password.');
            }
        }
    };

    const handleBack = () => {
        history.push('/app/users');
    };

    return (
        <Container maxWidth='sm'>
            <Typography variant="h4" gutterBottom>
                Reset Password
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="User Name"
                        value={userName}
                        disabled
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="New Password"
                        type="password"
                        value={newPass}
                        onChange={handleNewPass}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Confirm Password"
                        type="password"
                        value={confirmPass}
                        onChange={handleConfirmPass}
                    />
                </Grid>
                {message && (
                    <Grid item xs={12}>
                        <Typography color={message.includes('Successfully') ? "primary" : "error"}>{message}</Typography>
                    </Grid>
                )}
                <Grid item xs={6}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        onClick={handleBack}
                    >
                        Back
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ResetPass;
