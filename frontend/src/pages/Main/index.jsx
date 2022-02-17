import React, { useState, useEffect } from "react";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import SlideList from "../../components/Recipe/RecipeSlide";
import LargeList from "../../components/Fridge/Category/LargeList";
import Fab from "../../layout/FloatingActionButton";
import TopBar from "../../layout/TopBar";
import BottomBar from "../../layout/BottomBar";
import Box from '@material-ui/core/Box';
import Carousel from '../../components/Carousel';

// server
import axios from "axios";
import server from "../../server.json";

const useStyles = makeStyles((theme) => ({
  Fav: {
    margin: "auto",
    justifyItems: "center",
    alignItems: "center",
    fontFamily: "KoPubWorld Bold",
  },
  word: {
    color: "#A29D97",
    marginLeft: "10px",
    marginTop: "24px",
  },
  title: {
    color: "#45423C",
    marginTop: "60px",
    marginBottom: "60px",
  },
  image: {
    height: "40%",
  },
}));

const getFavData = async (url) => {
  try {
    const data = await axios({
      method: "get",
      url: url,
      headers: {
        accept: "application/json",
      },
    });
    return data.data;
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
};

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

const Main = () => {
  const st = useStyles();
  const [favRecipe, setFavRecipes] = useState();
  const [recentRecipe, setRecentRecipes] = useState();
  const [largeList, setLargeList] = useState();

  useEffect(async () => {
    const loginData = await checkLogin(`${server.ip}/user/isLogin`);
    if (loginData.value === undefined) {
      window.location.replace("http://i5a203.p.ssafy.io/signin")
    }

    const favRecipeData = await getFavData(`${server.ip}/recipe/tenFavorRecipe`);
    const recentRecipeData = await getFavData(`${server.ip}/recipe/tenRecentRecipe`);
    const largeListData = await getFavData(`${server.ip}/fridge/classification1`);

    // const favRecipes = ;
    setFavRecipes(<SlideList datas={favRecipeData} />);
    setRecentRecipes(<SlideList datas={recentRecipeData} />);
    setLargeList(<LargeList datas={largeListData} />);
  }, []);

  return (
    <Container fixed>
      <TopBar />
      <Box my={5}>
        <Grid>
          <Grid container mt={5} spacing={2} alignItems="center" justify="center">
            <Grid item xs={12} className={st.image}>
              <Carousel />
            </Grid>
            <Grid item xs={12} className={st.Fav} id={1} style={{ maxWidth: "100%", width: "100%" }}>
              <Typography align="left" variant="h6" gutterBottom className={st.word} style={{fontFamily:'KoPubWorld', fontStyle:'normal', fontWeight:'bold'}}>
                인기 폭주! 사람들이 가장 많이 찾았어요
              </Typography>
              {favRecipe}
            </Grid>
            <Grid item xs={12} className={st.Fav} id={2} style={{ maxWidth: "100%", width: "100%" }}>
              <Typography align="left" variant="h6" gutterBottom className={st.word} style={{fontFamily:'KoPubWorld', fontStyle:'normal', fontWeight:'bold'}}>
                신작 레시피 도착!
              </Typography>
              {recentRecipe}
            </Grid>
            <Grid item xs={12} className={st.Fav}>
              <Typography align="center" variant="h4" gutterBottom className={st.title} style={{fontFamily:'KoPubWorld', fontStyle:'normal', fontWeight:'bold'}}>
                나의 냉장고
              </Typography>
            </Grid>
            <Grid item xs={12}>{largeList}</Grid>
          </Grid>
        </Grid>
      </Box>
      <Fab />
      <BottomBar />
    </Container>
  );
};

export default Main;
