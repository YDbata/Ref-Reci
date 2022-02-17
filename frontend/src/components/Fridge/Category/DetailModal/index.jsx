import { React, useState, useEffect } from "react";
import {
  TextField,
  Button,
  Paper,
  makeStyles,
  Card,
  CardContent,
  CardMedia,
} from "@material-ui/core";
import axios from 'axios';
import server from '../../../../server.json'

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: "1 0 auto",
  },
  cover: {
    width: 151,
    height: 100,
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  textField: {
    marginRight: theme.spacing(2),
  },
}));

const postData = async (url, upID, date) => {
  try {
    const data = await axios({
      method: 'post',
      url: url,
      data: {
        upID: upID,
        date: date,
      },
      headers: {
        accept: 'application/json'
      }
    })
    return data.data
  }
  catch (err) {
    console.log(url);
    console.log(`ERROR: ${err}`);
  }
}

const DetailModal = (props) => {
  const classes = useStyles();
  const { dt, childClickHandler } = props;
  const [dateData, setDateData] = useState(dt.productShelfLife.split("T")[0]);
  // const [dateData, setDateData] = useState(dt.productShelfLife);


  const changeHandler = (e) => {
    setDateData(e.target.value)
  }

  const clickHandler = () => {
    const datas = postData(`${server.ip}/foodlist/updateDate`, dt.upID, dateData);
    childClickHandler(dateData)
  }

  return (
    <Card elevation={0} className={classes.root}>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <TextField
            id="date"
            label="유통 기한"
            type="date"
            defaultValue={dt.productShelfLife.split("T")[0]}
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={changeHandler}
          />
          <Button variant="contained" onClick={clickHandler}>변경하기</Button>
        </CardContent>
      </div>
    </Card>
  );
};
export default DetailModal;
