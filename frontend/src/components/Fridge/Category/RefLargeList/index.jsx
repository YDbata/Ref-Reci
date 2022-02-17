import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import RefLargeItem from "../RefLargeItem";

// Theme -------------------------------------
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
  },
  grid: {
    border: "1px solid #dfdfdf",
    textAlign: "center",
    borderRadius: "15px",
    margin: "auto",
    height: "100%",
    width: '100%',
  },
  MainGrid: {
    marginBottom: theme.spacing(2),
  },
}));
// -------------------------------------------

const RefLargeList = (props) => {
  const classes = useStyles();
  const data = props.datas;
  const setMain = (c1ID, classification1Name) => {
    props.mainCheck(c1ID, classification1Name);
  };
  return (
    <div className={classes.root}>
      <Grid container>
        {data.map((dt, idx) => {
          return (
            <Grid item key={idx} dt={dt} xs={4} lg={3} spacing={3} className={classes.MainGrid}>
              <RefLargeItem dt={dt} idx={idx} data={data} setMain={setMain.bind()} />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};
export default RefLargeList;
