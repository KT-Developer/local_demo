import React, { useState, useEffect } from "react";
import { Grid, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import './Clients.css'
import config from "../../config";

// components
import PageTitle from "../../components/PageTitle/PageTitle";
import Widget from "../../components/Widget/Widget";
import Table from "../dashboard/components/Table/Table";

// data
import mock from "../dashboard/mock";

// const datatableData = [
//   ["Joe James", "Example Inc.", "Yonkers", "NY"],
//   ["John Walsh", "Example Inc.", "Hartford", "CT"],
//   ["Bob Herm", "Example Inc.", "Tampa", "FL"],
//   ["James Houston", "Example Inc.", "Dallas", "TX"],
//   ["Prabhakar Linwood", "Example Inc.", "Hartford", "CT"],
//   ["Kaui Ignace", "Example Inc.", "Yonkers", "NY"],
//   ["Esperanza Susanne", "Example Inc.", "Hartford", "CT"],
//   ["Christian Birgitte", "Example Inc.", "Tampa", "FL"],
//   ["Meral Elias", "Example Inc.", "Hartford", "CT"],
//   ["Deep Pau", "Example Inc.", "Yonkers", "NY"],
//   ["Sebastiana Hani", "Example Inc.", "Dallas", "TX"],
//   ["Marciano Oihana", "Example Inc.", "Yonkers", "NY"],
//   ["Brigid Ankur", "Example Inc.", "Dallas", "TX"],
//   ["Anna Siranush", "Example Inc.", "Yonkers", "NY"],
//   ["Avram Sylva", "Example Inc.", "Hartford", "CT"],
//   ["Serafima Babatunde", "Example Inc.", "Tampa", "FL"],
//   ["Gaston Festus", "Example Inc.", "Tampa", "FL"],
// ];

const useStyles = makeStyles(theme => ({
  tableOverflow: {
    overflow: 'auto'
  }, addButton: {
    marginBottom: theme.spacing(2)
  }
}))

export default function Clients() {
  const classes = useStyles();
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const history = useHistory();

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
  const columns = [
    // { name: "CLIENT_ID", label: "Client ID" },
    { name: "CLIENT_NAME", label: "Client Name" },
    { name: "EMAIL", label: "Email" },
    { name: "ADDRESS", label: "Address" },
    { name: "COUNTRY", label: "Country" }
  ];
  const handleDelete = async (rowsDeleted) => {
    const idsToDelete = rowsDeleted.data.map(d => clients[d.dataIndex].CLIENT_ID);
    try {
      const res = await axios.post(`${config.API_URL}:${config.API_PORT}/Clients/delete`, { ids: idsToDelete });
      if (res.data.message === 'Successful') {
        console.log('Successfully Deleted:', res.data.deleted);
        setClients(clients.filter(client => !res.data.deleted.includes(client.CLIENT_ID)));
        if (res.data.cannotDelete.length > 0) {
          console.log('Cannot delete the following clients as they are associated with projects:', res.data.cannotDelete);
          setError(true);
          setMessage(`Cannot delete the following clients as they are associated with projects: ${res.data.cannotDelete.join(', ')}`);
        }
      } else if (res.data.message === 'No clients to delete') {
        console.log('Cannot delete the following clients as they are associated with projects:', res.data.cannotDelete);
        setError(true);
        setMessage(`Cannot delete the following clients as they are associated with projects: ${res.data.cannotDelete.join(', ')}`);
      } else {
        console.log('Error in deletion');
      }
    } catch (err) {
      console.log('Error:', err);
    }
  }


  const handleAddClient = () => {
    history.push('/app/addClient');
  };

  return (
    <>
      <PageTitle title="Clients" />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            className={classes.addButton}
            onClick={handleAddClient}
          >
            Add Client
          </Button>
          <MUIDataTable
            title="Employee List"
            data={clients}
            columns={columns}
            options={{ onRowsDelete: handleDelete }}
          // options={{
          //   filterType: "checkbox",
          // }}
          />
        </Grid>
        {/* <Grid item xs={12}>
          <Widget title="Material-UI Table" upperTitle noBodyPadding bodyClass={classes.tableOverflow}>
            <Table data={mock.table} />
          </Widget>
        </Grid> */}
      </Grid>
      <div className="error">
        {error && <p>{message}</p>}
      </div>
    </>
  );
}
