import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Grid, Container, Typography, FormLabel } from "@material-ui/core";
import axios from "axios";
import { useHistory } from "react-router-dom";
import config from "../../config";


const AddProject = () => {
    const [error, setError] = useState("");
    const [clients, setClients] = useState([]);
    const [client, setClient] = useState('');
    const [projectName, setNameChange] = useState('');
    const [cloudProvider, setCloudProvider] = useState('');


    const history = useHistory();

    const handleNameChange = (e) => setNameChange(e.target.value);

    useEffect(() => {
        const fetchAllClients = async () => {
            try {
                const res = await axios.get(`${config.API_URL}:${config.API_PORT}/Clients`);
                setClients(res.data);
                console.log(res);
            } catch (err) {
                console.log(err);
            }
        };
        fetchAllClients();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!cloudProvider || !client || !projectName) {
            setError("All fields are required.");
            return;
        }
        try {
            const res = await axios.post(`${config.API_URL}:${config.API_PORT}/projects/addProject`, { client, projectName, cloudProvider });
            if (res.data.message === 'Successful') {
                console.log('Successfully Updated');
                history.push('/app/projects'); // Redirect to users page
            } else {
                setError('Error in adding project.');
            }
        } catch (err) {
            console.log(err);
            setError('Error in adding project.');
        }
    };

    return (
        <Container maxWidth='sm'>

            <Grid container spacing={4} >
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>Select Client</InputLabel>
                        <Select
                            value={client}
                            onChange={(e) => setClient(e.target.value)}
                            label="Select Client"
                        >
                            {clients.map((client) => (
                                <MenuItem key={client.CLIENT_ID} value={client.CLIENT_ID}>
                                    {client.CLIENT_NAME}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Project Name"
                        value={projectName}
                        onChange={handleNameChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth >
                        <InputLabel>Select Cloud Provider</InputLabel>
                        <Select
                            value={cloudProvider}
                            onChange={(e) => setCloudProvider(e.target.value)}
                            label="Select Role"
                        >
                            <MenuItem value="aws">AWS</MenuItem>
                            <MenuItem value="gcp">GCP</MenuItem>
                            <MenuItem value="azure">Azure</MenuItem>
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

export default AddProject;
