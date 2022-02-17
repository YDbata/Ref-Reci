import React, {useEffect} from 'react';
import { Link as RouterLink } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import TopBar from '../../../layout/TopBar';
import BottomBar from '../../../layout/BottomBar';
import Fab from '../../../layout/FloatingActionButton';

import axios from 'axios';
import server from '../../../server.json';

const getDelete = async (url) => {
  try {
    const data = await axios({
      method: 'get',
      url: url,
      withCredentials:true,
      headers: {
        accept: 'application/json',
      },
    });
    return data.data.value;
  }
  catch (err) {
    console.log(`ERROR: ${err}`);
  }
}

const checkLogin = async (url) => {
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

const clickHandler = async () => {
  const data = await getDelete(`${server.ip}/user/deleteUser`);

  if(data === 'Success'){
    alert('회원 탈퇴가 완료되었습니다.');
    window.location.replace('http://i5a203.p.ssafy.io/signin');
  }
  else if(data === 'Fail'){
    alert('오류가 발생했습니다. 다시 시도해주세요.')
  }
}

export default function DeleteUser() {
  
  useEffect(async () => {
    const loginData = await checkLogin(`${server.ip}/user/isLogin`);
    if (loginData.value === undefined) {
      window.location.replace("http://i5a203.p.ssafy.io/signin")
    }
  })

  return (
    <Container fixed>
      <TopBar />
      <Box my={3}>
        <Box mt={5}>
          <Typography
            variant="h4"
            color="primary"
            component={RouterLink}
            to="/fridge"
            style={{
              fontFamily: "Jeju",
              fontStyle: "normal",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            회원 탈퇴
          </Typography>
        </Box>
        <Box my={5}>
          <Typography>
            정말로 탈퇴하시겠습니까?
          </Typography>
          <Typography>
            모든 정보는 탈퇴 즉시 삭제되며 탈퇴를 취소할 수 없습니다.
          </Typography>
        </Box>
        <Button
          onClick={clickHandler}
        >
          탈퇴
        </Button>
      </Box>
      <Fab />
      <BottomBar />
    </Container>
  )
}