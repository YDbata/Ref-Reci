import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Link as RouterLink } from "react-router-dom";

// Core
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

// Server
import server from '../../../server.json';

const useStyles = makeStyles({
  cardroot: {
    maxWidth: '100%',
    height: 'h-100',
  },
  media: {
    height: 180,
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
});

const url = server.ip + "/img";

const introTruncate = (txt, len, endwith) => {
  if (len == null) {
    len = 100;
  }
  if (endwith == null) {
    endwith = '...';
  }
  if (txt.length > len) {
    return txt.substring(0, len - endwith.length) + endwith;
  } else {
    return txt;
  }
};


export default function FavRecipe(props) {
  const classes = useStyles();
  const editedIntro = introTruncate(props.rIntroduce, 50);
  const detailUrl = "/rec/" + props.rID

  return (
  <Card className={classes.cardroot}>
    <CardActionArea
    component={RouterLink}
    to={detailUrl}
    >
      <CardMedia
        className={classes.media}
        image={props.url}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {props.rName}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {editedIntro}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
  )
}