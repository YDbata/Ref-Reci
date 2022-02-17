import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import { useNowCols } from "../../../../common/MediaQueryHooks";
import CardItem from "../CardItem";

const useStyles = makeStyles((theme) => ({
  grid: {
    border: "1px solid #dfdfdf",
    textAlign: "center",
    borderRadius: "15px",
    margin: "auto",
    height: "100%",
  },
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: theme.spacing(1),
  },
  list: {
    height: "120%",
  },
}));


const CardList = (props) => {
  const classes = useStyles();
  const data = props.datas;
  const data2 = props.datas2;

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        {data.map((dt, idx) => (
          <Grid item justifyContent="center" alignItems="center" key={idx} xs={12} md={6} lg={4}>
            <CardItem dt={dt} idx={idx} dt2={data2[idx]}/>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
export default CardList;
