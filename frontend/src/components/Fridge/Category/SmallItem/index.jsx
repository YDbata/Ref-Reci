import { React, useState, useEffect } from "react";
import {
  Fade,
  Backdrop,
  CardActionArea,
  makeStyles,
  Modal,
  Card,
  Button,
  Typography,
  CardMedia,
  CardContent,
  TextField,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Divider from "@material-ui/core/Divider";
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import RemoveIcon from "@material-ui/icons/Remove";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import RestaurantMenuIcon from "@material-ui/icons/RestaurantMenu";
import axios from 'axios';
import server from '../../../../server.json'
import DetailModal from "../DetailModal";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
  },
  title: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  btn: {
    width: "100%",
    height: "100%",
  },
  card: {
    height: "100%",
  },
  card2: {
    height: "100%",
  },
  image: {
    width: "100%",
    maxWidth: 300,
  },
  media: {
    height: 200,
  },
}));

const postCount = async (url, Name, Type) => {
  try {
    const data = await axios({
      method: 'POST',
      url: url,
      data: {
        Name: Name,
        Type: Type
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

const SmallItem = (props) => {
  const { dt, idx } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(dt.productCount)
  const [dateData, setDateData] = useState(dt.productShelfLife.slice(0, 10));
  // const [dateData, setDateData] = useState(dt.productShelfLife);
  
  const handleOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  const addDt = () => {
    handleClose();
    props.showDt(dt.productName, dt.productClassification2);
  };
  const editShelfLife = dt.productShelfLife.slice(0, 10);
  // const editShelfLife = dt.productShelfLife;

  async function onMinusClick() {
    const cnt = await postCount(`${server.ip}/foodlist/changeCount`, dt.productName, 1)
    setCount(cnt[0].Count)
  }

  async function onPlusClick() {
    const cnt = await postCount(`${server.ip}/foodlist/changeCount`, dt.productName, 2)
    setCount(cnt[0].Count)
  }

  const clickHandler = (date) =>{
    setDateData(date)
  }

  return (
    <div className={classes.btn}>
      <Card onClick={handleOpen} elevation={0}>
        {/* <CardActionArea className={classes.card}>{dt.productName}</CardActionArea> */}

        <CardActionArea>
          <CardMedia className={classes.media} image={`${server.ip}/img?id=${dt.productImage}`} />
          <CardContent>
            <Box>
              <Typography variant="h5" component="h2">
                {dt.productName}
              </Typography>
            </Box>
            <Box p={2}>
              <Chip size="small" label={`수량 | ${count}`} />
              <Typography variant="body2" color="textSecondary" component="p">
                유통기한 | {dateData}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Grid>
              <Grid item>
                <img className={classes.image} src={`${server.ip}/img?id=${dt.productImage}`} />
              </Grid>
              <Grid item>
                <Box>
                  <Box p={1} className={classes.modal}>
                    <Typography component="h5" variant="h5">
                      {dt.productName}
                    </Typography>
                  </Box>
                  <Divider orientation="horizontal" variant="middle" />
                  <Box p={1} className={classes.title}>
                    <IconButton onClick={onMinusClick}>
                      <RemoveIcon />
                    </IconButton>
                    <Typography variant="h5" color="textSecondary">
                      {count}
                    </Typography>
                    <IconButton onClick={onPlusClick}>
                      <AddIcon />
                    </IconButton>
                  </Box>
                  <Box p={1}>
                    <DetailModal dt={dt} childClickHandler={clickHandler}/>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            <Box display="flex" justifyContent="center">
              <Button variant="outlined" startIcon={<RestaurantMenuIcon />} onClick={addDt.bind()}>
                레시피 재료로 추가하기
              </Button>
            </Box>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};
export default SmallItem;