import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Box from '@material-ui/core/Box';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import server from '../../../../server.json';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import { Divider } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
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
    width: "100%",
  },
  mainchip: {
    margin: '3px',
  },
  chip: {
    margin: theme.spacing(1),
  },
  media: {
    height: 200,
  },
}));

const CardItem = (props) => {
  const { dt, dt2, idx } = props;
  const classes = useStyles();
  const handleOpen = () => {
    window.location.href = `http://i5a203.p.ssafy.io/rec/${dt.rID}`
  };

  if (dt2.count === undefined) dt2.count = 0;
  return (
    <div>
      <Card onClick={handleOpen}>
        <CardActionArea>
          <CardMedia className={classes.media} image={`${server.ip}/img?id=${dt.recipeImage}`} />
          <CardContent>
            <Box my={1}>
              <Typography variant="h5" component="h2">
                {dt.recipeName}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {dt.count===undefined? "검색한 재료가 0개 포함되었어요!" : `검색한 재료가 ${dt.count}개 포함되었어요!`}
              </Typography>
            </Box>
            <Box py={1}>
              <Chip
                icon={<HourglassEmptyIcon />}
                color="secondary"
                label={dt.recipeTime}
                className={classes.mainchip}
              />
            </Box>
            <Divider variant="fullWidth" />
            {dt2.map((data, idx) => {
              return (
                <span key={data.key} className={classes.chip}>
                  {(idx < dt.count) ? (<Chip label={data} className={classes.chip} color="primary" />) :
                  (<Chip label={data} className={classes.chip} />)}
                </span>
              );
            })}
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
};
export default CardItem;
