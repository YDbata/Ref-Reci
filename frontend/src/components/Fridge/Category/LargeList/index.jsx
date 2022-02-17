import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from '@material-ui/core/Box';
import LargeItem from "../LargeItem";
import Grid from '@material-ui/core/Grid';

// Theme -------------------------------------
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
  },
  MainGrid: {
    marginBottom: theme.spacing(2),
  },
  media: {
    width: '100%',
    height: '100%',
  },
}));
// -------------------------------------------

const LargeList = (props) => {
  const classes = useStyles();
  const data = props.datas;
  return (
    <Box px={3} className={classes.root}>
      <Grid container>
        {data.map((dt, idx) => {
          return (
            <Grid item key={idx} dt={dt} xs={4} lg={3} className={classes.MainGrid}>
              <LargeItem dt={dt} idx={idx} data={data} className={classes.media} />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
export default LargeList;
