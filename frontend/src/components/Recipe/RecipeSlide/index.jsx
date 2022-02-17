import React from 'react';
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';

import server from '../../../server.json';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  imageList: {
    flexWrap: 'nowrap',
    transform: 'translateZ(0)',
  },
  media: {
    width: '100%',
    maxWidth: 280,
  },
  title: {
    color: theme.white,
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
}));


export default function SlideList(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ImageList className={classes.imageList} cols={2.5}>
        {props.datas.map((rec) => (
          <ImageListItem className={classes.media} key={rec.rID} component={RouterLink} to={`/rec/${rec.rID}`}>
            <img 
              src={`${server.ip}/img?id=${rec.rImage}`} 
              alt={rec.rName}
              />
            <ImageListItemBar
              title={rec.rName}
              classes={{
                root: classes.titleBar,
                title: classes.title,
              }}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
}
