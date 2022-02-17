import React, {useState, useEffect} from 'react';
// import { Route } from "react-router";
import { BrowserRouter as Router, Link as RouterLink } from "react-router-dom";
import MyInfo from '../../components/Auth/Profile/MyInfo';
import QRCode from '../../components/Auth/Profile/QRCode';
import FavRecipe from "../../components/Recipe/FavRecipe";

import Fab from "../../layout/FloatingActionButton";
import TopBar from "../../layout/TopBar";
import BottomBar from "../../layout/BottomBar";
import MyProfile from '../../components/Auth/Profile/MyProfile';

// Style
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';


// Core
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import createTheme from '@material-ui/core/styles/createTheme';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Pagination from '@material-ui/lab/Pagination';

// Server 
import axios from 'axios';
import server from '../../server.json';


const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  gridItem: {
    display: 'flex',
    alignItems: 'stretch',
  },
  image: {
      backgroundImage: "url(" + process.env.PUBLIC_URL + '/images/main.png' + ")",
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
  },
  paper: {
      margin: theme.spacing(8, 4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
  },
  avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
  },
  form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
  },
  submit: {
      margin: theme.spacing(3, 0, 2),
  },
  pg: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const getUserData = async (url) => {
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

export default function Profile({history}) {
  const classes = useStyles();

  const [uID, setUID] = useState('');
  const [userID, setUserID] = useState('');
  const [userName, setUserName] = useState('');
  const [myFridgeNum, setMyFridgeNum] = useState('');
  const [expire3Num, setExpire3Num] = useState('');
  const [expiredNum, setExpiredNum] = useState('');


  const [posts, setPosts]   = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage] = useState(12);

  useEffect(async () => {
    const loginData = await checkLogin(`${server.ip}/user/isLogin`);
    if (loginData.value === undefined) {
      window.location.replace("http://i5a203.p.ssafy.io/signin")
    }
    setUID(loginData.value);
    const userInfoData = await getUserData(`${server.ip}/user/userInfo`);
    setUserID(userInfoData.userID);
    setUserName(userInfoData.userName);
    setMyFridgeNum(userInfoData.foodCount);
    setExpire3Num(userInfoData.expire3FoodCount);
    setExpiredNum(userInfoData.expiredFoodCount);

    const favRecipeData = await getUserData(`${server.ip}/recipe/favorRecipe`);
    setPosts(favRecipeData)
  }, [])
  
  // 현재 페이지 가져오기
  const indexOfLastPost = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (event, value) => setCurrentPage(value);

  return (
    <Container fixed >
      <TopBar />
      <Box mt={5}>
        <Typography
        variant="h4"
        color="primary"
        style={{fontFamily:'Jeju', fontStyle:'normal', fontWeight:'bold', textDecoration: 'none'}}
        component={RouterLink}
        to="/profile"
        >
          마이페이지
        </Typography>
      </Box>
      <Box my={2}>
        <Divider variant="middle" />
      </Box>
      <MyProfile userID={userID} userName={userName}/>
      <Box m={3}>
        <Grid container>
          <Grid item xs={12} md={6}>
            <QRCode uid={uID}/>
          </Grid>
          <Grid item xs={12} md={6}>
            <MyInfo myFridgeNum={myFridgeNum} expire3Num={expire3Num} expiredNum={expiredNum} />
          </Grid>
        </Grid>
      </Box>
      <Box my={3}>
        <Typography
        variant="h5"
        color="secondary"
        style={{fontFamily:'KoPubWorld', fontStyle:'normal', fontWeight:'bold'}}
        >
          즐겨찾기한 레시피
        </Typography>
      </Box>
      <Box 
        display="flex"
        justifyContent="center"
        alignItems="center"
        my={3}
      >
        <Grid container spacing={2}>
          {currentPosts.map((recipeData) => {
        return (
          <Grid item key={recipeData} xs={12} sm={6} md={4} lg={3}> 
            <FavRecipe rID={recipeData.rID} rName={recipeData.rName} rIntroduce={recipeData.rIntroduce} url={`${server.ip}/img?id=${recipeData.rImage}`} />
          </Grid>
        )
        })}
        </Grid>
      </Box>
      <div className={classes.pg}>
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          my={2}
        >
        <Pagination onChange={paginate} page={currentPage} 
        count={Math.ceil(posts.length/postPerPage)} 
        color="primary" />
        </Box>
      </div>
      <Fab />
      <BottomBar />
    </Container>
  )
}

