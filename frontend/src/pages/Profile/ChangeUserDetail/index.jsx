// React, Router
import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";
import TopBar from "../../../layout/TopBar";
import BottomBar from "../../../layout/BottomBar";
import Fab from '../../../layout/FloatingActionButton';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

// Style
import { makeStyles } from '@material-ui/core/styles';

// Core
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

// Server
import axios from 'axios';
import server from '../../../server.json';


const postName = async (url, userName) => {
  try {
    const data = await axios({
        method: 'post',
        url: url,
        data: {
          userName: userName,
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

const postID = async (url, userID) => {
    try {
      const data = await axios({
        method: 'post',
        url: url,
        data: {
          userID: userID,
        },
        withCredentials:true,
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

const postPW = async (url, userPW) => {
    try {
      const data = await axios({
        method: 'post',
        url: url,
        data: {
          userPW: userPW
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

function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright ?? '}
        <span color="inherit">
          Ref:reci
        </span>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
      height: '100vh',
    },
    image: {
      backgroundImage: "url(" + process.env.PUBLIC_URL + '/images/main.png' + ")",
      backgroundRepeat: 'no-repeat',
      backgroundColor: theme.palette.white,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    paper: {
      margin: theme.spacing(8, 4),
      display: 'flex',
      flexDirection: 'column',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
      alignItems: 'center',
      [theme.breakpoints.down('sm')]: {
        justifyContent: 'center'
      },
      [theme.breakpoints.up('md')]: {
        justifyContent: 'flex-start'
      },
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignUpSide({history}) {
    const classes = useStyles();

    //form ?????????
    const [userName, setUserName] = useState('');
    const [userID, setUserID] = useState('');
    const [verification, setVerification] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    
    //???????????? 2?????? ????????????, ?????? ?????? ?????????
    const [userNameShort, setUserNameShort] = useState(true);
    //????????? ????????? ????????????, ?????? ?????? ?????????
    const [emailAuth, setEmailAuth] = useState(true);
    //??????????????? ?????????, ?????? ?????? ?????????
    const [passwordSame, setPasswordSame] = useState(true);
    
    //???????????? ???????????? ?????????, ????????????
    const [verButtonInactive, setVerButtonInactive] = useState(false);
    //???????????? ????????? ?????????, ????????????
    const [hiddenAuth, setHiddenAuth] = useState(true);

    //???????????? ????????? ????????????
    const [emailAuthData, setEmailAuthData] = useState('');

    useEffect(() => {
      if (password === passwordCheck && password !== '') {
        setPasswordSame(false);
      }
      else {
        setPasswordSame(true);
      }
    }, [password, passwordCheck])

    useEffect(async ()=>{
      const loginData = await checkLogin(`${server.ip}/user/isLogin`);
      if (loginData.value === undefined) {
        window.location.replace("http://i5a203.p.ssafy.io/signin")
      }
    })

    const onChangeUserName = (e) => {
      setUserName(e.target.value);
      if (e.target.value.length > 20) {
        alert('20??? ????????? ????????????');
        e.target.value = e.target.value.slice(0, -1);
        setUserNameShort(true);
      }
      else if(e.target.value.length < 2){
        setUserNameShort(true);
      }
      else{
        setUserNameShort(false);
      }
    };

    const onChangeUserID = (e) => {
      setUserID(e.target.value);
    };

    const onChangeVer = (e) => {
      setVerification(e.target.value);
    }

    const onChangeUserPW = (e) => {
      setPassword(e.target.value);
      if (e.target.value.length > 20) {
        alert('??????????????? 8??? ?????? 20??? ????????? ??????????????????');
        
        e.target.value = e.target.value.slice(0, -1);
      }
    }

    const onChangeUserPWCheck = (e) => {
      setPasswordCheck(e.target.value);
    }

    const onClickUserNameChangeBtn = async () => {
      const userDatas = await postName(`${server.ip}/user/changeUserName`, userName);

      if (userDatas.value === 'Short userName') {
        alert('???????????? 2??? ?????? 20??? ????????? ??????????????????.');
      }
      
      alert('???????????? ?????????????????????.')
    };

    const onClickUserIDBtn = async () => {
      const userDatas = await postID(`${server.ip}/user/searchID`, userID);
      if (userDatas.value === 'Success') {
        const emailDatas = await postID(`${server.ip}/user/emailAuth`, userID);
        if (emailDatas.value === 'Email Sent') {
          alert('???????????? ?????????????????????.');
          setHiddenAuth(false);
          setEmailAuthData(emailDatas.number);
          setVerButtonInactive(true);
        }
        else if (emailDatas.value === 'Email Error') {
          alert('???????????? ???????????? ???????????????. ?????? ?????? ????????? ???????????????.');
        }
      }
      else if (userDatas.value === 'Duplicate Email') {
        alert('?????? ????????? ???????????????.');
      }
      else if (userDatas.value === 'Wrong Email') {
        alert('????????? ????????? ?????????????????????.');
      }
    };

    const onClickVerBtn = () => {
      if (verification == emailAuthData) {
        setEmailAuth(true);
        setHiddenAuth(true);
      }
      else {
        alert('????????? ?????????????????????.');
      }
    }

    const onClickUserIDChangeBtn = async () => {
      const userDatas = await postID(`${server.ip}/user/changeUserID`, userID);

      alert('???????????? ?????????????????????.')
    };

    const onClickUserPWChangeBtn = async () => {
      const userDatas = await postPW(`${server.ip}/user/changeUserPW`, password);

      if (userDatas.value === 'Short password') {
        alert('??????????????? 8??? ?????? 20??? ????????? ??????????????????.');
      }

      alert('??????????????? ?????????????????????.')
    };

    const onClickOkBtn = () => {
      // window.location.replace("http://localhost:3000/profile");
      window.location.replace("http://i5a203.p.ssafy.io/profile");
    }

    return (
      <Container fixed>
        <TopBar />
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
            ?????? ?????? ??????
          </Typography>
        </Box>
        <Grid container component="main" className={classes.root}>
          <CssBaseline />
          <div className={classes.paper}>
              <form className={classes.form}>
                <Container maxWidth="md">
                  <TextField
                      autoComplete="fname"
                      name="firstName"
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      autoFocus
                      id="firstName"
                      label="?????????"
                      onChange={onChangeUserName}
                  />
                  <Button
                      disabled={userNameShort}
                      color="primary"
                      fullWidth
                      size="large"
                      onClick={onClickUserNameChangeBtn}
                  >
                      ????????????
                  </Button>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={10}>
                      <TextField
                        disabled={verButtonInactive}
                        variant="outlined"
                        required
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="?????????(E-mail)"
                        name="email"
                        autoComplete="email"
                        onChange={onChangeUserID}
                      />
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                          disabled={verButtonInactive}
                          variant="outlined"
                          fullWidth
                          color="primary"
                          required
                          size="large"
                          onClick={onClickUserIDBtn}
                        >
                        ??????
                        </Button>
                      </Grid>
                  </Grid>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={10}>
                        <TextField
                          disabled={hiddenAuth}
                          variant="outlined"
                          required
                          fullWidth
                          id="verification"
                          label="????????????"
                          name="verification"
                          autoComplete="verification"
                          onChange={onChangeVer}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                          color="primary"
                          disabled={hiddenAuth}
                          fullWidth
                          size="large"
                          onClick={onClickVerBtn}
                        >
                          ??????
                        </Button>
                    </Grid>
                    <Button
                      disabled={emailAuth}
                      color="primary"
                      fullWidth
                      size="large"
                      onClick={onClickUserIDChangeBtn}
                    >
                      ????????????
                    </Button>
                  </Grid>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="????????????"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={onChangeUserPW}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="passwordcheck"
                    label="??????????????????"
                    type="password"
                    id="passwordcheck"
                    autoComplete="current-password-check"
                    onChange={onChangeUserPWCheck}
                  />
                  <Button
                    disabled={passwordSame}
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={onClickUserPWChangeBtn}
                  >
                    ????????????
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    color="primary"
                    className={classes.submit}
                    onClick={onClickOkBtn}
                  >
                    ??????
                  </Button>
                </Container>
              </form>
          </div>
        </Grid>
        <BottomBar />
        <Fab />
      </Container>
    );
}
