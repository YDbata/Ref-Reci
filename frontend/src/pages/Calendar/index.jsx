import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Link as RouterLink } from "react-router-dom";

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

// Layout
import TopBar from '../../layout/TopBar';
import BottomBar from '../../layout/BottomBar';
import FloatingActionButton from '../../layout/FloatingActionButton';

import axios from 'axios';
import Dates from '../../components/Calendar/Dates';
import FoodList from '../../components/Calendar/FoodList';
import server from '../../server.json';
import { computeSegDraggable } from '@fullcalendar/react';
import Pagination from '@material-ui/lab/Pagination';

const getItems = async (url,date) => {
  try {    
    const data = await axios({
      method: 'POST',
      url: url,
      data: {
        date: date,
      },
      headers: { 
        accept: 'application/json'
      },
      withCredentials: true,
    })
    return data.data
  }
  catch (err) {
    console.log(url);
    console.log(`ERROR: ${err}`);
  }
}
// 유통기한 7일 이내의 상품의 Dday, count, Name을 가져온다
const get7Items = async (url) => {
  try {    
    const data = await axios({
      method: 'GET',
      url: url,
      withCredentials: true,
      headers: { 
        accept: 'application/json'
      },
      withCredentials: true,
    })
    return data.data
  }
  catch (err) {
    console.log(url);
    console.log(`ERROR: ${err}`);
  }
}

// 모든 상품의 정보를 가져온다
const getAllItems = async (url) => {
  try {    
    const data = await axios({
      method: 'GET',
      url: url,
      headers: { 
        accept: 'application/json'
      },
      withCredentials: true,
    })
    return data.data
  }
  catch (err) {
    console.log(url);
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

export default function Calendar() {
  const [dates, setDates] = useState('')
  const [posts, setPosts]   = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage] = useState(3);
  const [flagState, setFlagState] = useState(false);

  const get7Days = (async () => {
    const foodlist = await get7Items(`${server.ip}/foodlist/get7days`)
    setPosts(foodlist);
  })
  const getAll = (async () => {
    const foodlist = await getAllItems(`${server.ip}/foodlist/getAllItem`)
    setPosts(foodlist);
  })
  
  //받아온 dates에 배열을 생성, events 는 이벤트가 있는 전체 날짜 calender events
  function getDates(dates) {
    setDates(dates)
  }
  
  useEffect(async()=>{
    const loginData = await checkLogin(`${server.ip}/user/isLogin`);
    if (loginData.value === undefined) {
      window.location.replace("http://i5a203.p.ssafy.io/signin")
    }
  }, [])

  useEffect(async () => {
    const foodlist = await getItems(`${server.ip}/foodlist/getItems`, `${dates}`);
    //다른거에 담아서 여러개를 보내는?
    setPosts(foodlist);
    setFlagState(false)
    if (foodlist.length === 0){
      setPosts([{ Name: "undefined", Dday: "", Count: "", Img: "" }])
      setFlagState(true)
    }

  }, [dates])

  // 현재 페이지 가져오기
  const indexOfLastPost = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);


  const paginate = (event, value) => {
    setCurrentPage(value)
  };
  return (
    <Container fixed>
      <TopBar />
      <Box mt={5}>
        <Typography
        variant="h4"
        color="primary"
        style={{fontFamily:'Jeju', fontStyle:'normal', fontWeight:'bold', textDecoration: 'none'}}
        component={RouterLink}
        to="/calendar"
        >
          유통기한 관리
        </Typography>
      </Box>
      <Box my={2}>
        <Divider variant="middle" />
      </Box>
      <Box my={5}>
          <Grid container>
            <Grid item xs={12} md={6}>
              <Box p={3}>
                <Dates onChildClick={getDates} on7DayClick={get7Days} onAllClick={getAll}/>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box p={1}>
                {currentPosts.map((foodData) => {
                return (
                  <FoodList foodName={foodData.Name} foodDday={foodData.Dday} foodCount={foodData.Count} url={`${server.ip}/img?id=${foodData.Img}`}/>
                )
              })}
              {flagState?
                null
              :
                (<Pagination onChange={paginate} page={currentPage} 
                  count={Math.ceil(posts.length / postPerPage)} 
                  color="primary" 
                  style={{      display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'}} />)
              }
              
              </Box>
            </Grid>
          </Grid>
      </Box>
      <FloatingActionButton />
      <BottomBar />
    </Container>
  )
}