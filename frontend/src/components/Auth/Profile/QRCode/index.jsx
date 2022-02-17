import React from 'react';

// Style
import { makeStyles } from '@material-ui/core/styles';

// Core
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

// Server 
import axios from 'axios';
import server from '../../../../server.json';


const useStyles = makeStyles((theme) => ({
    root: {
    },
}));


// const option ={
//   url:'http://i5a203.p.ssafy.io',
//   method:'POST',
//   header:{
    
//   }
// }

// axios(option)

// if chosen_items:
const params = {
  'size':'150x150',
  'data':'1'     // 여기에 userid
}
// qr_code = requests.get(
//     'http://api.qrserver.com/v1/create-qr-code', params=params
// ).url
const userid = '1'
const size = 250

export default function QRCode(props) {
  return (
    <Container fixed>
      <Box my={3}>
        <Typography
        variant="h5"
        color="secondary"
        style={{fontFamily:'KoPubWorld', fontStyle:'normal', fontWeight:'Bold'}}
        >
          나의 QR 코드
        </Typography>
      </Box>
      <Box p={2}>
        <img width={size} height={size} src={'http://api.qrserver.com/v1/create-qr-code?size='+size+'x'+size+'&data=' + props.uid} ></img>
      </Box>
    </Container>
  )
}