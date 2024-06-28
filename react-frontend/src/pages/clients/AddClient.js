import React, { useState } from "react";
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Grid, Container, Typography, FormLabel } from "@material-ui/core";
import axios from "axios";
import { useHistory } from "react-router-dom";
import config from "../../config";


const AddClient = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [country, setCountry] = useState("");

    const [error, setError] = useState("");

    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) {
            setError("Name is required.");
            return;
        }
        try {
            const res = await axios.post(`${config.API_URL}:${config.API_PORT}/clients/addClient`, { name, email, address, country });
            if (res.data.message === 'Successful') {
                console.log('Successfully Updated');
                history.push('/app/clients'); // Redirect to users page
            } else {
                setError('Error in adding client.');
            }
        } catch (err) {
            console.log(err);
            setError('Error in adding client.');
        }
    };

    return (
        <Container maxWidth='sm'>

            <Grid container spacing={2} >
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Client Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                        label="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}

                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}

                    />
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

export default AddClient;
