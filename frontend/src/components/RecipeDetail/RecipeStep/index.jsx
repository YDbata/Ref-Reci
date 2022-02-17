import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';

import server from '../../../server.json'
import { useEffect } from 'react';

const useStyles = makeStyles((theme) => ({

}));

const cardstyles = {
  root: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: '200px',
  },
  media: {
    width: '100%',
    maxWidth: 500,
    height: 'h-100',
  },
  text: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
}



export default function RecipeStep(props) {
  const classes = useStyles();

  const stepcards = props.datas.map((step, idx) => {
    
    return (
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={12} md={6}>
          { step.recipephaseImage ? 
          (<img 
          style={cardstyles.media} 
          src={`${server.ip}/img?id=${step.recipephaseImage}`} 
          />) 
          :
          (<img 
            style={cardstyles.media} 
            src={`${server.ip}/img?id=no_image2.png`}
            />)
          }
        </Grid>
        <Grid item xs={12} md={6}>
          <Box p={1}>
            <Box p={1} display="inline">
              <Chip color="primary" label={idx+1} />
            </Box>
            <Typography display="inline" color="secondary" style={{fontFamily:'KoPubWorld', fontStyle:'normal', fontWeight:'normal'}}>
              {step.recipephaseIntroduce}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    )
  })

  return (
    <Box p={5}>
      {stepcards}
    </Box>
  )
}