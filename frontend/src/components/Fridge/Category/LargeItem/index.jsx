import React from "react";
import { ButtonBase, makeStyles } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { mergeClasses } from "@material-ui/styles";

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

const LargeItem = (props) => {
  const { dt, idx, data } = props;
  const classes = useStyles();

  return (
    <NavLink
      to={{
        pathname: "/fridge",
        state: {
          catID: dt.c1ID,
          catName: dt.classification1Name,
          data: data,
          isRef: false,
        },
      }}
      className={classes.media}
    >
      <img className={classes.image} src={process.env.PUBLIC_URL + `/category_icon/${dt.c1ID}.jpg`}/>
    </NavLink>
  );
};
export default LargeItem;


{/* <a href="https://kr.freepik.com/photos/food">Food 사진는 Racool_studio - kr.freepik.com가 제작함</a> */}