import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Paper, Grid, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import TopBar from '../../layout/TopBar';
import BottomBar from '../../layout/BottomBar';
import FloatingActionButton from '../../layout/FloatingActionButton';
import RecipeTitle from '../../components/RecipeDetail/RecipeTitle';
import RecipeContent from '../../components/RecipeDetail/RecipeContent';

// Server
import axios from 'axios';
import server from '../../server.json';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  image: {
    maxWidth: '100%',
    height: '100%',
  },
}));

const getRecipe = async (url) => {
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

export default function RecipeDetail({match}) {
  const classes = useStyles();

  const [customRecipeTitle, setCustomRecipeTitle] = useState();
  const [customRecipeContent, setCustomRecipeContent] = useState();
  let rID;


  useEffect(async () => {
    const loginData = await checkLogin(`${server.ip}/user/isLogin`);
    if (loginData.value === undefined) {
      window.location.replace("http://i5a203.p.ssafy.io/signin")
    }
    
    rID = match.params.rid;
    const datas = await getRecipe(`${server.ip}/recipe/detail?rID=${rID}`);
    const isFavor = await getRecipe(`${server.ip}/recipe/checkFavorRecipe?rID=${rID}`);

    setCustomRecipeTitle(<RecipeTitle datas={datas[0]} isStar={isFavor} rID={rID}/>)
    setCustomRecipeContent(<RecipeContent datas1={datas[1]} datas2={datas[2]} />)
  }, [])

  return (
    <Container fixed>
      <TopBar />
      {customRecipeTitle}
      {customRecipeContent}
      <BottomBar />
      <FloatingActionButton />
    </Container>
  )
};