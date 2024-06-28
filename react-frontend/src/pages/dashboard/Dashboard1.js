import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@material-ui/core";
import axios from "axios";
import { cookie_token } from "../login/auth";
import { Doughnut, Bar } from "react-chartjs-2";
// import 'chart.js/auto';
import config from "../../config";

function Dashboard(props) {
    const [projects, setProjects] = useState([]);
    const [latestProject, setLatestProject] = useState([]);
    const [scanData, setScanData] = useState([]);
    const [avgScanScore, setavgScanScore] = useState(null);
    const [avgComplianceScore, setavgComplianceScore] = useState(null);
    const [userName, setUserName] = useState('');
    const [open, setOpen] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const id = cookie_token();

    useEffect(() => {
        let isMounted = true;

        const fetchProfileName = async () => {
            try {
                const res = await axios.get(`${config.API_URL}:${config.API_PORT}/${cookie_token()}`);
                if (isMounted) {
                    const profileData = res.data[0];
                    setUserName(profileData.USER_NAME || '');
                    console.log(profileData);
                }
            } catch (err) {
                if (isMounted) {
                    console.log(err);
                }
            }
        };

        const fetchProjects = async () => {
            try {
                const res = await axios.get(`${config.API_URL}:${config.API_PORT}/User_Projects/${id}`);
                if (isMounted) {
                    setProjects(res.data);
                    console.log(res);
                }
            } catch (err) {
                if (isMounted) {
                    console.log(err);
                }
            }
        };

        const fetchScan = async () => {
            try {
                const res = await axios.get(`${config.API_URL}:${config.API_PORT}/User_Scan/${id}`);
                if (isMounted) {
                    setLatestProject(res.data[0]);
                    console.log(res);
                }
            } catch (err) {
                if (isMounted) {
                    console.log(err);
                }
            }
        };

        const fetchScore = async () => {
            try {
                const res = await axios.get(`${config.API_URL}:${config.API_PORT}/Scan_Scores/${id}`);
                if (isMounted) {
                    setScanData(res.data);
                    let score = 0;
                    for (let i = 0; i < res.data.length; i++) {
                        score += res.data[i].SCORES;
                    }
                    setavgScanScore(score / res.data.length);
                    console.log(res);
                }
            } catch (err) {
                if (isMounted) {
                    console.log(err);
                }
            }
        };

        const fetchComplianceScore = async () => {
            try {
                const res = await axios.get(`${config.API_URL}:${config.API_PORT}/Scan_Compliance_Scores/${id}`);
                if (isMounted) {
                    let score = 0;
                    for (let i = 0; i < res.data.length; i++) {
                        score += res.data[i].COMPLIANCE_SCORES;
                    }
                    setavgComplianceScore(score / res.data.length);
                    console.log(res);
                }
            } catch (err) {
                if (isMounted) {
                    console.log(err);
                }
            }
        };
        const fetchCategoryData = async () => {
            try {
                const res = await axios.get(`${config.API_URL}:${config.API_PORT}/TopFiveCategory/${id}`);
                if (isMounted) {
                    setCategoryData(res.data);
                    console.log(res);
                }
            } catch (err) {
                if (isMounted) {
                    console.log(err);
                }
            }
        };

        fetchProfileName();
        fetchProjects();
        fetchScan();
        fetchScore();
        fetchComplianceScore();
        fetchCategoryData();

        return () => {
            isMounted = false;
        };
    }, [id]);

    const columns = [
        { name: "PROJECT_NAME", label: "Project Name" },
        { name: "CLOUD_PROVIDER", label: "Cloud Provider" },
        { name: "TOTAL_SCAN", label: "Scan Count" },
        { name: "EXECUTION_TIME", label: "Last Execution Time" }
    ];

    const handleCardClick = () => {
        setOpen(!open);
    };

    const groupedBarChartData = {
        labels: categoryData.map((item) => item.CATEGORY),
        datasets: [
            {
                label: 'Total Count',
                data: categoryData.map((item) => item.TOTAL_COUNT),
                backgroundColor: 'blue',
                borderColor: 'blue',
                borderWidth: 1,
            },
            {
                label: 'Pass Count',
                data: categoryData.map((item) => item.PASS_COUNT),
                backgroundColor: 'green',
                borderColor: 'green',
                borderWidth: 1,
            },
            {
                label: 'Fail Count',
                data: categoryData.map((item) => item.FAIL_COUNT),
                backgroundColor: 'red',
                borderColor: 'red',
                borderWidth: 1,
            },
        ],
    };
    const legendColors = ['blue', 'green', 'red'];
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    generateLabels: (chart) => {
                        const labels = chart.data.datasets.map((dataset, i) => ({
                            text: dataset.label,
                            fillStyle: legendColors[i],
                            hidden: !chart.isDatasetVisible(i),
                            index: i
                        }));
                        return labels;
                    }
                }
            }
        }
    };

    return (
        <Container maxWidth="xl">
            <Typography variant="h4" component="h4" style={{ padding: '5px', color: 'black', textAlign: 'center' }}>
                Welcome {userName}
            </Typography>
            <Grid container spacing={1} style={{ padding: '5px', backgroundColor: 'lightgrey', borderRadius: '3px' }}>
                <Grid item xs={4} style={{ cursor: "pointer" }}>
                    <Card style={{ backgroundColor: avgScanScore > 75 ? 'lightgreen' : 'orange' }} onClick={handleCardClick}>
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {avgScanScore}
                            </Typography>
                            <Typography color="initial">
                                AVG Severity Score
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card style={{ backgroundColor: avgComplianceScore > 75 ? 'lightgreen' : 'orange' }}>
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {avgComplianceScore}
                            </Typography>
                            <Typography color="initial">
                                AVG Compliance Score
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            {open &&
                <Grid container spacing={1} style={{ marginTop: '20px', padding: '5px', backgroundColor: 'lightgrey', borderRadius: '3px' }} >
                    {scanData.map((data, index) => (
                        <Grid item xs={12 / scanData.length} key={index}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        {data.PROJECT_NAME}
                                    </Typography>
                                    <Typography variant="h6" component="h6">
                                        Critical:{data.CRITICAL}
                                    </Typography>
                                    <Typography variant="h6" component="h6">
                                        High:{data.HIGH}
                                    </Typography>
                                    <Typography variant="h6" component="h6">
                                        Medium:{data.MEDIUM}
                                    </Typography>
                                    <Typography variant="h6" component="h6">
                                        Low:{data.LOW}
                                    </Typography>
                                    <Typography variant="h6" component="h6">
                                        Score:{data.SCORES}%
                                    </Typography>
                                    <Doughnut
                                        data={{
                                            labels: ['Critical', 'High', 'Medium', 'Low'],
                                            datasets: [
                                                {
                                                    data: [data.CRITICAL, data.HIGH, data.MEDIUM, data.LOW],
                                                    backgroundColor: [
                                                        'maroon', 'red', 'orange', 'yellow'
                                                    ],
                                                    borderWidth: 1,
                                                },
                                            ],
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>))}
                </Grid>
            }
            <Grid container spacing={1} style={{ marginTop: '20px', backgroundColor: 'lightgrey', padding: '5px', borderRadius: '3px' }}>
                <Grid item xs={12}>
                    <TableContainer component={Paper} >
                        <Table>
                            <TableHead>
                                <TableRow style={{ fontWeight: 'bolder', fontSize: '20' }}>
                                    {columns.map((column) => (
                                        <TableCell key={column.name}>{column.label}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {projects.map((project) => (
                                    <TableRow key={project.SCAN_ID}>
                                        {columns.map((column) => (
                                            <TableCell key={column.name}>{project[column.name]}</TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>

            {latestProject && (
                <Grid container spacing={1} style={{ marginTop: '20px', backgroundColor: 'lightgrey', borderRadius: '3px', padding: '5px' }}>
                    <Grid item xs={4} style={{ marginTop: '2px' }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h3" component="h2" style={{ padding: '10px', color: 'black' }}>
                                    Latest Scan
                                </Typography>
                                <Typography color="textSecondary" style={{ padding: '5px' }}>
                                    Project Name: {latestProject.PROJECT_NAME}
                                </Typography>
                                <Typography color="textSecondary" style={{ padding: '5px' }}>
                                    Client Name: {latestProject.CLIENT_NAME}
                                </Typography>
                                <Typography color="textSecondary" style={{ padding: '5px' }}>
                                    Cloud Provider: {latestProject.CLOUD_PROVIDER}
                                </Typography>
                                <Typography color="textSecondary" style={{ padding: '5px' }}>
                                    Scan ID: {latestProject.SCAN_ID}
                                </Typography>
                                <Typography color="textSecondary" style={{ padding: '5px' }}>
                                    Compliance Check: {latestProject.COMPLIANCE_CHECK}
                                </Typography>
                                <Typography color="textSecondary" style={{ padding: '5px' }}>
                                    Execution Time: {latestProject.EXECUTION_TIME}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={4}>
                        <Grid container spacing={1} >
                            <Grid item xs={12}>
                                <Typography variant="h5" component="h4" style={{ textAlign: "center" }}>Vunerability Checks</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Card style={{ backgroundColor: 'blue' }}>
                                    <CardContent>
                                        <Typography variant="h5" component="h5" style={{ borderBottom: '1px solid white', color: 'white', textAlign: 'center', paddingBottom: '10px' }}>
                                            {latestProject.TOTAL_SCAN}
                                            {console.log(latestProject.TOTAL_SCAN)}
                                        </Typography>
                                        <Typography variant="h6" component="h6" style={{ color: 'white', textAlign: 'center', paddingTop: '10px' }}>
                                            Total Checks
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Card style={{ backgroundColor: 'green' }}>
                                    <CardContent>
                                        <Typography variant="h5" component="h5" style={{ borderBottom: '1px solid white', color: 'white', textAlign: 'center', paddingBottom: '10px' }}>
                                            {latestProject.PASS}
                                        </Typography>
                                        <Typography variant="h6" component="h6" style={{ color: 'white', textAlign: 'center', paddingTop: '10px' }}>
                                            PASS
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Card style={{ backgroundColor: 'red' }}>
                                    <CardContent>
                                        <Typography variant="h5" component="h5" style={{ borderBottom: '1px solid white', color: 'white', textAlign: 'center', paddingBottom: '10px' }}>
                                            {latestProject.FAIL}
                                        </Typography>
                                        <Typography variant="h6" component="h6" style={{ color: 'white', textAlign: 'center', paddingTop: '10px' }}>
                                            FAIL
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Card style={{ backgroundColor: 'orange' }}>
                                    <CardContent>
                                        <Typography variant="h5" component="h5" style={{ borderBottom: '1px solid white', color: 'white', textAlign: 'center', paddingBottom: '10px' }}>
                                            {latestProject.WARN}
                                        </Typography>
                                        <Typography variant="h6" component="h6" style={{ color: 'white', textAlign: 'center', paddingTop: '10px' }}>
                                            ALERT
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h4" component="h4" style={{ textAlign: 'center' }}>
                                    Severity
                                </Typography>
                                <Doughnut
                                    data={{
                                        labels: [`Critical:${latestProject.CRITICAL}`, `High:${latestProject.HIGH}`, `Medium:${latestProject.MEDIUM}`, `Low:${latestProject.LOW}`],
                                        datasets: [
                                            {
                                                data: [latestProject.CRITICAL, latestProject.HIGH, latestProject.MEDIUM, latestProject.LOW],
                                                backgroundColor: [
                                                    'maroon', 'red', 'orange', 'yellow'
                                                ],
                                                borderWidth: 2,
                                            },
                                        ],
                                    }}
                                    style={{ padding: '10px', margin: '10px' }}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={8}>
                        <Card>
                            <CardContent>
                                <Typography variant="h4" component="h4" style={{ textAlign: 'center' }}>
                                    Top Five Categories
                                </Typography>
                                <Bar data={groupedBarChartData} options={options} />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={4}>
                        <Grid container spacing={1} >
                            <Grid item xs={12}>
                                <Typography variant="h5" component="h4" style={{ textAlign: "center" }}>Compliance Checks</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Card style={{ backgroundColor: 'blue' }}>
                                    <CardContent>
                                        <Typography variant="h5" component="h5" style={{ borderBottom: '1px solid white', color: 'white', textAlign: 'center', paddingBottom: '10px' }}>
                                            {latestProject.PCI}
                                        </Typography>
                                        <Typography variant="h6" component="h6" style={{ color: 'white', textAlign: 'center', paddingTop: '10px' }}>
                                            PCI
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Card style={{ backgroundColor: 'green' }}>
                                    <CardContent>
                                        <Typography variant="h5" component="h5" style={{ borderBottom: '1px solid white', color: 'white', textAlign: 'center', paddingBottom: '10px' }}>
                                            {latestProject.HIPAA}
                                        </Typography>
                                        <Typography variant="h6" component="h6" style={{ color: 'white', textAlign: 'center', paddingTop: '10px' }}>
                                            HIPAA
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Card style={{ backgroundColor: 'red' }}>
                                    <CardContent>
                                        <Typography variant="h5" component="h5" style={{ borderBottom: '1px solid white', color: 'white', textAlign: 'center', paddingBottom: '10px' }}>
                                            {latestProject.CIS1}
                                        </Typography>
                                        <Typography variant="h6" component="h6" style={{ color: 'white', textAlign: 'center', paddingTop: '10px' }}>
                                            CIS1
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Card style={{ backgroundColor: 'orange' }}>
                                    <CardContent>
                                        <Typography variant="h5" component="h5" style={{ borderBottom: '1px solid white', color: 'white', textAlign: 'center', paddingBottom: '10px' }}>
                                            {latestProject.CIS2}
                                        </Typography>
                                        <Typography variant="h6" component="h6" style={{ color: 'white', textAlign: 'center', paddingTop: '10px' }}>
                                            CIS2
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
}

export default Dashboard;
