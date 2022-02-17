import React from 'react';
import { Link as RouterLink } from "react-router-dom";

import Typography  from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  btn: {
    margin: theme.spacing(1),
    },
}));

export default function MyProfile (props) {
  const classes = useStyles();

  return (
    <Box display="flex" justifyContent="space-around" alignItems="center" textAlign="left" px={5}>
      <Box>
        <Typography display="block" color="secondary" style={{fontFamily:'KoPubWorld', fontStyle:'normal', fontWeight:'normal'}}>
          닉네임 | {props.userName}
        </Typography>
        <Typography display="block" color="secondary" style={{fontFamily:'KoPubWorld', fontStyle:'normal', fontWeight:'normal'}}>
          아이디 | {props.userID}
        </Typography>
      </Box>
      <Box>
        <Box component="div" display="inline" spacing={2}>
          <Button
            fullWidth
            size="normal"
            variant="outlined"
            color= "secondary"
            component={RouterLink}
            to="/usr/check/update"
          >
            회원정보수정
          </Button>
        </Box>
        <Box component="div" display="inline">
          <Button
            fullWidth
            size="normal"
            variant="outlined"
            color= "secondary"
            component={RouterLink}
            to="/usr/check/delete"
          >
            회원탈퇴
          </Button>
        </Box>
      </Box>
    </Box>

  )
}