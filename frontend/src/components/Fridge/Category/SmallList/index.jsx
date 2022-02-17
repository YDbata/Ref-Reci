import { react, useState } from "react";
import { Grid, makeStyles, Paper } from "@material-ui/core";
import IngItem from "../SmallItem";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: theme.spacing(1),
  },
  grid: {
    border: "1px solid #dfdfdf",
    textAlign: "center",
    borderRadius: "15px",
    margin: "auto",
    height: "100%",
    width: "100%",
  },
  list: {
    height: "120%",
  },
}));

const SmallList = (props) => {
  const classes = useStyles();
  // const data = catDt;
  const datas = props.datas;
  let list = [];

  const showDt = (productName, productID) => {
    let check = false;
    if (list.length == 0) list = props.selectIng;
    for (let i = 0; i < list.length; i++) {
      if (list[i].category == productID) {
        check = true;
        break;
      }
    }
    if (!check) {
      list = list.concat({ name: productName, category: productID });
    } else {
      list = list.filter((Ing) => Ing.name != productName);
    }
    props.addCnt(list);
  };

  return (
    <div className={classes.root}>
      <Grid xs={12}>
        <Grid container>
          {datas.map((dt, idx) => (
            <Grid item className={classes.MainGrid} key={idx} xs={4} lg={3}>
              <Paper className={classes.grid}>
                <IngItem
                  selectIng={props.selectIng}
                  dt={dt}
                  cnt={props.cnt}
                  showDt={showDt.bind()}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </div>
  );
};
export default SmallList;
