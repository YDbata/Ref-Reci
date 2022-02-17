import React, { useState } from 'react';

// Core
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box'


// Server
import axios from 'axios';
import server from '../../server.json';

// Style
import { makeStyles } from '@material-ui/core/styles';


// NavLink
import {NavLink} from "react-router-dom";
import { maxWidth } from '@material-ui/system';

// Theme -------------------------------------
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    userSelect: 'none',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  bar: {
    position: 'fixed',
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
  appbar: {
    elevation: 0,
  },
  toolbar: {
    display: 'flex',
    justifyContent:  'space-between',
    alignItems: 'center'
  },
  logo: {
    cursor: 'pointer',
    maxWidth: 200,
  }
}));
// -------------------------------------------

const getLogout = async (url) => {
  try {
    const data = await axios({
      method: 'get',
      url: url,
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

export default function TopBar() {
  const classes = useStyles();

  return (
    <Box mt={2}>
      <div className={classes.root} >
        <AppBar elevation={0} position="static" color="info">
          <Toolbar className={classes.toolbar}>
            <NavLink to={"/"}>
              <img src={process.env.PUBLIC_URL + '/logo_kr.png'} className={classes.logo} />
            </NavLink>
            <Button 
            color="secondary"
            onClick={async () => {
              const data = await getLogout(`${server.ip}/user/logout`);
              window.location.replace("http://i5a203.p.ssafy.io/signin");
            }} className={classes.logout}>
              <Typography variant="caption">
                | 로그아웃 | 
              </Typography>
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    </Box>
  )
}




