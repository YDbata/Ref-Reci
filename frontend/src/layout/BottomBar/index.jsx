// React, Router
import React from 'react';
import Box from '@material-ui/core/Box';

// Style
import { makeStyles } from '@material-ui/core/styles';

// Core
import Typography from '@material-ui/core/Typography';

// Theme -------------------------------------

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    bottom: 0,
    display:'flex',
    justifyContent: 'center',
    userSelect: 'none',
  },
}));
// -------------------------------------------

function Copyright() {
  const classes = useStyles();

  return (
    <Typography 
    variant="body2" 
    color="textSecondary" 
    align="start"
    className={classes.root}
    >
        {'Copyright © '}
        <span color="primary">
            Ref:reci
        </span>{' '}
        {new Date().getFullYear()}
        {'.'}
    </Typography>
  );
}

export default function BottomBar() {
  return (
    <Box mt={5}>
      <Copyright />
    </Box>
  )
}