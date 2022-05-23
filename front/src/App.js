import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#d50000",
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
    "& .StyledTableCell": {
      padding: "6px 0px 6px 16px" // <-- arbitrary value
    }
  },
});

const App = () => {
  const classes = useStyles();
  const [product, setProduct] = useState([]);

  const getProductData = async () => {
    try {
      const data = await axios.get(
        "http://localhost:3000/api/better"
      );
      console.log(data.data);
      setProduct(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getProductData();
  }, []);
  return (
    <div className="App">
      <img src={process.env.PUBLIC_URL + '/logo.png'} className="logo"/> 
      <h1>Top Netflix</h1>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Position</StyledTableCell>
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell>Country</StyledTableCell>
              <StyledTableCell>Director</StyledTableCell>
              <StyledTableCell>Release year</StyledTableCell>
              <StyledTableCell align="right">Type</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {product
              .map((item, index) => {
                return (
                  <StyledTableRow key={item.id}>
                    <StyledTableCell component="th" scope="row">
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {item.title}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {item.country}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {item.director}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {item.release_year}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {item.type}
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default App;
