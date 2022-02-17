import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import axios from 'axios';
import server from '../../../server.json';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5,
  },
  img: {
    width: '100%',
    maxHeight: 250,
  },
  chip: {
    margin: '3px',
  },
  intro: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'space-around',
    maxHeight: 250,
  },
  // details: {
  //   display: 'flex',
  //   flexDirection: 'column',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // title: {
  //   display: 'flex',
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  // },
  // content: {
  //   flex: '1 0 auto',
  // },
  // cover: {
  //   width: '100%',
  //   maxWidth: 200,
  //   objectFit: 'cover',
  // }
}));

const showDday = (date) => {
  if(date == null){
    return ('미정')
  }
  else if (date < 0) {
    return ('D + ' + String(Math.abs(date)))
  } else if (date >= 0) {
    return ('D - ' + String(date))
  }
};

//foodlist의 카운트 제어를 하기 위해 backend와 연동을 하는 함수
const postCount = async (url, Name, Type) => {
  try {
    const data = await axios({
      method: 'POST',
      url: url,
      data: {
        Name : Name,
        Type : Type
      },
      withCredentials: true,
      headers: { 
        accept: 'application/json'
      }
    })
    return data.data
  }
  catch (err) {
    console.log(url);
    console.log(`ERROR: ${err}`);
  }
}


export default function FoodList(props) {
  //카운트 제어를 위한 상태 함수 count에 현재 음식의 카운트를 저장한다
  const [count, setCount] = useState(props.foodCount)
  const classes = useStyles();
  const dDay = showDday(props.foodDday);
  //- 버튼이 클릭됐을 때 동작하는 함수
  async function onMinusClick (){
    const cnt = await postCount(`${server.ip}/foodlist/changeCount`, props.foodName, 1)
    setCount(cnt[0].Count)
  }
  
  //+ 버튼이 클릭됐을 때 동작하는 함수
  async function onPlusClick (){
    const cnt = await postCount(`${server.ip}/foodlist/changeCount`, props.foodName, 2)
    setCount(cnt[0].Count)
  }

  // 이벤트가 없는 날짜를 클릭하면 메시지를 띄우는 컴포넌트
  const blankPage = <Box><Typography variant="h6" color="secondary">달력에서 유통기한이 있는 날짜를 선택해 주세요.</Typography></Box>;

  //음식이름이 아무것도 들어오지 않으면 (이벤트가 없으면) blankpage를 아니라면 foodlist를 띄워준다.
  if (props.foodName !== "undefined") {
    return (
      <Box m={2}>
        <Paper>
          <Grid container alignItems="center" className={classes.intro}>
            <Grid item xs={6}>
                <img className={classes.img} src={props.url} />
            </Grid>
            <Grid item xs={6}>
              <Box p={1} className={classes.title}>
                <Box p={1}>
                  <Typography component="h5" variant="h5">
                    {props.foodName}
                  </Typography>
                </Box>
                <Box p={1}>
                  <Chip 
                    label={dDay}
                    color="primary"
                  />
                </Box>
              </Box>
              <Divider orientation="horizontal" variant="middle"/>
              <Box>
                <Grid p={1} container alignItems="center">
                  <Grid item xs={4}>
                    <IconButton>
                      <RemoveIcon onClick={onMinusClick}/>
                    </IconButton>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" color="textSecondary">
                      {count}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <IconButton>
                      <AddIcon onClick={onPlusClick}/>
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        {/* <Card className={classes.root}>
          <CardMedia
            component="img"
            alt="recipe-image"
            className={classes.cover}
            image={props.url}
          />
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Box p={1} className={classes.title}>
                <Typography component="h5" variant="h5">
                  {props.foodName}
                </Typography>
                <Chip 
                  label={dDay}
                  color="primary"
                />
              </Box>
              <Divider orientation="horizontal" variant="middle"/>
              <Grid p={1} container>
                <Grid item xs={4}>
                  <IconButton>
                    <RemoveIcon onClick={onMinusClick}/>
                  </IconButton>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle1" color="textSecondary">
                    {count}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <IconButton>
                    <AddIcon onClick={onPlusClick}/>
                  </IconButton>
                </Grid>
              </Grid>
            </CardContent>
          </div>
        </Card> */}
      </Box>
    )
  } else {
    return (
      blankPage
    )
  }
};
