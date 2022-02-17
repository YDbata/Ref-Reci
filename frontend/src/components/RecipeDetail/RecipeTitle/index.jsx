import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Typography, Divider, Icon, IconButton } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import TimerIcon from '@material-ui/icons/Timer';
import GroupIcon from '@material-ui/icons/Group';
import StarHalfIcon from '@material-ui/icons/StarHalf';

// Server
import axios from 'axios';
import server from '../../../server.json';

const useStyles = makeStyles((theme) => ({
  img: {
    width: '100%',
  },
  chip: {
    margin: '3px',
  },
  intro: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'space-around'
  }
}));

const postData = async (url, rID, isStar) => {
  try {
    const data = await axios({
      method: 'post',
      url: url,
      data: {
        rID: rID,
        isStar: isStar
      },
      withCredentials: true,
      headers: {
        accept: 'application/json',
      },
    });
    return data.data;
  }
  catch (err) {
    console.log(`ERROR: ${err}`);
  }
}

export default function RecipeTitle(props) {
  const classes = useStyles()
  
  const [isFavorite, setIsFavorite] = useState(props.isStar);

  const handleClick = async () => {
    const datas = await postData(`${server.ip}/recipe/addFavorRecipe`, props.rID, isFavorite);
    setIsFavorite(datas)
  }

  return (
  <Box mt={3} mb={1}>
    <Box mt={5}>
      <Typography color="secondary" variant="h4" style={{fontFamily:'Jeju', fontStyle:'normal', fontWeight:'bold'}}>{props.datas[0].recipeName}</Typography>
    </Box>
    <Box my={2}>
      <Divider />
    </Box>
    <Paper>
      <Grid container alignItems="center" className={classes.intro}>
        <Grid item xs={12} md={6}>
            <img className={classes.img} src={`${server.ip}/img?id=${props.datas[0].recipeImage}`} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box mx={4}>
            <Typography color="secondary">
              {props.datas[0].recipeIntroduce}
            </Typography>
          </Box>
          <Box>
            <IconButton
              color="primary"
              onClick={handleClick}
            >
              {
                  isFavorite ? (<StarIcon />) : (<StarBorderIcon />)
              }
            </IconButton>
          </Box>
          <Box p={1}>
            <Chip
              icon={<GroupIcon />}
              color="primary"
              label={`${props.datas[0].recipeAmount}인분`}
              className={classes.chip}
            />
            <Chip
              icon={<HourglassEmptyIcon />}
              color="primary"
              label={`${props.datas[0].recipeTime}`}
              className={classes.chip}
            />
            <Chip
              icon={<FileCopyIcon />}
              color="primary"
              label="URL 복사"
              className={classes.chip}
            />
          </Box>
          
        </Grid>
      </Grid>
    </Paper>
  </Box>
  )
}