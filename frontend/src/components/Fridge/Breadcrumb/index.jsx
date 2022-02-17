import React, { useState, useEffect } from "react";
import { emphasize, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Chip from "@material-ui/core/Chip";
import HomeIcon from "@material-ui/icons/Home";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { ButtonBase } from "@material-ui/core";

const StyledBreadcrumb = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[100],
    height: theme.spacing(3),
    color: theme.palette.grey[800],
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.grey[300],
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(theme.palette.grey[300], 0.12),
    },
  },
}))(Chip);



export default function CustomizedBreadcrumbs(props) {
  return (
    <Breadcrumbs aria-label="breadcrumb">
      <StyledBreadcrumb
        component="a"
        label="나의 냉장고"
        onClick={() => props.goBack("전체")}
        icon={<HomeIcon fontSize="small" />}
      />
      <StyledBreadcrumb component="a" label={props.catName} />
    </Breadcrumbs>
  );
}
