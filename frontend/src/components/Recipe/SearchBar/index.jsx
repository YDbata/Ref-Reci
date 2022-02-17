/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from "react";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

// Server
import axios from "axios";
import server from "../../../server.json";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(3),
    },
  },
}));

const postDatas = async (url, cl2) => {
  try {
    const data = await axios({
      method: "post",
      url: url,
      data: {
        cl2: cl2,
      },
      headers: {
        accept: "application/json",
      },
    });
    return data.data;
  } catch (e) {
    console.log(`ERROR: ${e}`);
  }
};

export default function SearchBar(props) {
  const classes = useStyles();
  const [selectedOptions, setSelectedOptions] = useState([]);
  // const [defaultDatas, setDefaultDatas] = useState([]);

  const handleChange = async (event, value) => {
    setSelectedOptions(value);

    const len = value.length;
    let selectedSet = new Set();

    for (let i = 0; i < len; i++) {
      selectedSet.add(value[i].category);
    }
    const selectedArr = Array.from(selectedSet);

    //소분류로 레시피들을 찾아옴
    const recipes = await postDatas(`${server.ip}/recipe/search`, selectedArr);
    //부모에서 내려준 함수로  레시피 아이디들, 선택된 재료의 소분류를 넘김
    props.onChildChange(recipes, selectedArr);
  };

  const allFoodItems = props.datas;
  const defaultDatas = props.defaultDatas;

  return (
    <div className={classes.root}>
      <Autocomplete
        multiple
        id="tags-outlined"
        options={allFoodItems}
        getOptionLabel={(option) => option.name}
        filterSelectedOptions
        onChange={handleChange}
        defaultValue={defaultDatas.map((defaultDt) => defaultDt.name)}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="검색"
            placeholder="식재료를 검색하여 레시피 재료로 추가해 보세요."
          />
        )}
      />
    </div>
  );
}
