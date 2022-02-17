import React from "react";
import { ButtonBase, makeStyles } from "@material-ui/core";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  meida: {
    width: '100%',
    height: '100%'
  },
  image: {
    width: '100%',
    height: '100%'
  }
}));

const RegLargeItem = (props) => {
  const { dt, idx, data } = props;
  const btn = () => {
    props.setMain(dt.c1ID, dt.classification1Name);
  };
  const classes = useStyles();

  return (
    <NavLink
      to={{
        pathname: "/fridge",
        state: {
          catID: dt.c1ID,
          catName: dt.classification1Name,
          data: data,
          isRef: true,
        },
      }}
      onClick={btn}
      className={classes.media}
    >
      <img className={classes.image} src={process.env.PUBLIC_URL + `/category_icon/${dt.c1ID}.jpg`}/>
    </NavLink>
  );
};
export default RegLargeItem;
