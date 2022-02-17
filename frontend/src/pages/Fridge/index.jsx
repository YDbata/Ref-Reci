import { useState, React, useEffect } from "react";
import { Divider, makeStyles, Typography } from "@material-ui/core";
import { BrowserRouter as Router, Link as RouterLink } from "react-router-dom";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Breadcrumb from "../../components/Fridge/Breadcrumb";
import RadioButton from "../../components/Fridge/RadioButton";
import ShowChoiceButton from "../../components/Fridge/ShowChoiceButton";
import IconButton from "@material-ui/core/IconButton";
import TopBar from "../../layout/TopBar";
import BottomBar from "../../layout/BottomBar";
import FloatingActionButton from "../../layout/FloatingActionButton";
import SmallList from "../../components/Fridge/Category/SmallList";
import RefLargeList from "../../components/Fridge/Category/RefLargeList";

// server
import axios from "axios";
import server from "../../server.json";

// Theme -------------------------------------
const useStyles = makeStyles((theme) => ({
  topper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));
// -------------------------------------------

const getCl2Data = async (url) => {
  try {
    const data = await axios({
      method: "get",
      url: url,
      withCredentials: true,
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

const Fridge = (props) => {
  const classes = useStyles();

  let catName = "";
  let cl2Datas;
  let cl1Datas;
  const [cnt, setCnt] = useState(0);
  const [mainCatName, setMainCatName] = useState("");
  const [customSmallList, setCustomSmallList] = useState();
  const [refLargeList, setRefLargeList] = useState();

  const [customAllList, setCustomAllList] = useState();

  const [selectIng, setSelectIng] = useState([]);
  const [cl2List, setCl2List] = useState();

  if (props.location.state == undefined) {
    catName = "전체";
  }
  useEffect(async () => {
    const loginData = await checkLogin(`${server.ip}/user/isLogin`);
    if (loginData.value === undefined) {
      window.location.replace("http://i5a203.p.ssafy.io/signin")
    }
    
    catName = props.location.state == undefined ? "전체" : props.location.state.catName;
    setMainCatName(catName);
    if (catName == "전체" || catName == undefined) {
      setMainCatName(props.location.state.catName);
      cl1Datas = await getCl2Data(`${server.ip}/fridge/classification1`);
      setRefLargeList(<RefLargeList datas={cl1Datas} mainCheck={mainCheck.bind()} />);
    } else {
      cl2Datas = await getCl2Data(
        `${server.ip}/fridge/searchUserProduct?cl1ID=${props.location.state.catID}`
      );
      setCustomSmallList(
        <SmallList selectIng={selectIng} cnt={cnt} addCnt={addCnt.bind()} datas={cl2Datas} />
      );
    }
  }, []);

  const addCnt = (re) => {
    setSelectIng(re);
    setCl2List(re);
    //여기서 소분류 아이디와 유저 제품 이름을 하나씩 객체로 싸서 객체들의 모임으로 배열을 만들어서 보내야함
  };

  const mainCheck = async (c1ID, classification1Name) => {
    catName = classification1Name;
    setMainCatName(classification1Name);
    if(c1ID === 0){
      const allDatas = await getCl2Data(`${server.ip}/fridge/allUserProduct`)
      setCustomAllList(<SmallList selectIng={selectIng} cnt={cnt} addCnt={addCnt.bind()} datas={allDatas} />)
    }
    else{
      const datas = await getCl2Data(`${server.ip}/fridge/searchUserProduct?cl1ID=${c1ID}`);
      setCustomSmallList(
        <SmallList selectIng={selectIng} cnt={cnt} addCnt={addCnt.bind()} datas={datas} />
      );
    }
    
  };

  const getRefDt = async () => {
    cl1Datas = await getCl2Data(`${server.ip}/fridge/classification1`);
    setRefLargeList(<RefLargeList datas={cl1Datas} mainCheck={mainCheck.bind()} />);
  };

  const goBack = (re) => {
    setMainCatName(re);
    getRefDt();
  };
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
            나의 냉장고
          </Typography>
        </Box>
        <Box my={2}>
          <Divider variant="middle" />
        </Box>
        <Box mx={1} display="flex" justifyContent="space-between" alignItems="center">
          <Breadcrumb catName={mainCatName} goBack={goBack.bind()} />
          <IconButton
            component={RouterLink}
            to={{
              pathname: "/recipe",
              state: {
                cl2IDDatas: selectIng,
              },
            }}
          >
            <ShowChoiceButton selectIng={selectIng} />
          </IconButton>
        </Box>
        {/* <RadioButton color="primary" justifyContent="flex-start"/> */}
        <Box m={3}>{(props.location.state.isRef && mainCatName == "전체") ? customAllList :(mainCatName == "전체" ? refLargeList : customSmallList)}</Box>
      </Box>
      <FloatingActionButton />
      <BottomBar />
    </Container>
  );
};

export default Fridge;
