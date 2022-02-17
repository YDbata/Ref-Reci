// React
import React from 'react';
import { Link as RouterLink } from "react-router-dom";

// Material-UI
import Typography  from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  btn: {
    margin: theme.spacing(1),
    },
}));


export default function MyInfo(props) {
  const classes = useStyles();

  return (
    <div>
      <Box my={3}>
        <Typography
        variant="h5"
        color="secondary"
        style={{fontFamily:'KoPubWorld', fontStyle:'normal', fontWeight:'Bold'}}
        >
          내 리프레시 정보
        </Typography>
      </Box>
      <Box textAlign="center" p={2}>
        <Grid container justifyContent="space-around" alignItems="center">
          <Grid item xs={4}>
            <Typography variant="h3" color="primary" style={{fontFamily:'KoPubWorld', fontStyle:'normal', fontWeight:'Bold', textDecoration: 'none'}}
              component={RouterLink} to={{
                pathname: "/fridge",
                state: {
                  catName: '전체',
                },
              }}>
              {props.myFridgeNum}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h3" color="primary" style={{fontFamily:'KoPubWorld', fontStyle:'normal', fontWeight:'Bold', textDecoration: 'none'}}
              component={RouterLink} to="/calendar">
              {props.expire3Num}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h3" color="primary" style={{fontFamily:'KoPubWorld', fontStyle:'normal', fontWeight:'Bold', textDecoration: 'none'}}
              component={RouterLink} to="/calendar">
              {props.expiredNum}
            </Typography>
          </Grid>
        </Grid>
        <Box m={2}>
          <Typography color="secondary" style={{fontFamily:'KoPubWorld', fontStyle:'normal', fontWeight:'normal'}}>
            냉장고 속에 {props.myFridgeNum}개의 식재료가 있습니다.
          </Typography>
          <Typography color="secondary" style={{fontFamily:'KoPubWorld', fontStyle:'normal', fontWeight:'normal'}}>
            유효기간이 3일 미만인 식재료가 {props.expire3Num}개 있습니다.
          </Typography>
          <Typography color="secondary" style={{fontFamily:'KoPubWorld', fontStyle:'normal', fontWeight:'normal'}}>
            유효기간이 지난 식재료가 {props.expiredNum}개 있습니다.
          </Typography>
        </Box>
      </Box>
    </div>
  )
}