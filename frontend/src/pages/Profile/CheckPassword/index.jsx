import React, {useEffect, useState} from 'react';
import { Link as RouterLink } from "react-router-dom";
import TopBar from "../../../layout/TopBar";
import BottomBar from "../../../layout/BottomBar";
import Fab from '../../../layout/FloatingActionButton';

import Typography  from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

import axios from 'axios';
import server from '../../../server.json';

const postCheck = async(url, password) => {
  try {
    const data = await axios({
      method: 'post',
      url: url,
      data: {
        password: password,
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

export default function CheckPassword({history, match}) {
  const [password, setPassword] = useState('');

  useEffect(async()=>{
    const loginData = await checkLogin(`${server.ip}/user/isLogin`);
    if (loginData.value === undefined) {
      window.location.replace("http://i5a203.p.ssafy.io/signin")
    }
  })

  const onChangePW = (event) => {
    setPassword(event.target.value);
  }
  
  const onClickPW = async() => {
    const data = await postCheck(`${server.ip}/user/checkPassword`, password);

    if(data){
      if (match.params.id === "update"){
        window.location.replace("http://i5a203.p.ssafy.io/usr/update");
        // window.location.replace("http://localhost:3000/usr/update");
      }
      else if (match.params.id === "delete"){
        window.location.replace("http://i5a203.p.ssafy.io/usr/delete");
        // window.location.replace("http://localhost:3000/usr/update");
      }
    }
    else{
      
    }
  }

  return (
    <Container fixed>
      <TopBar />
      <Box m={5} justifyContent="center" alignItems="center">
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
            비밀번호 확인
          </Typography>
        </Box>
        <Container maxWidth="sm">
          <Typography>
            회원정보를 수정하시려면 비밀번호를 입력하세요.
          </Typography>
          <form>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="비밀번호"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={onChangePW}
            />
            <Button
              fullWidth
              size="large"
              variant="contained"
              color= "primary"
              onClick={onClickPW}
            >
              확인
            </Button>
          </form>

        </Container>
      </Box>
      <BottomBar />
      <Fab />
    </Container>
  )
}