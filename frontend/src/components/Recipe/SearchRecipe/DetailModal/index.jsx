import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import Grid from "@material-ui/core/Grid";


const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));


const DetailModal = () => {
  const [chipData, setChipData] = useState([
    { key: 0, label: "2021.07.21" },
    { key: 1, label: "2021.07.15" },
    { key: 2, label: "2021.07.3" },
  ]);
  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };
  const classes = useStyles();
  return (
    <div>
      <Paper component="ul" className={classes.root}>
        아 아아아 이게 무슨 일인가
      </Paper>
    </div>
  );
};
export default DetailModal;