import React from 'react';
import { BrowserRouter as Router, Link as RouterLink } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import Fab from '@material-ui/core/Fab';
import KitchenIcon from '@material-ui/icons/Kitchen';
import DateRangeIcon from '@material-ui/icons/DateRange';
import BookIcon from '@material-ui/icons/Book';
import PersonIcon from '@material-ui/icons/Person';


const useStyles = makeStyles(theme => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

export default function FloatingActionButton() {
  const classes = useStyles();
  const positionMargin = 10
  const rightMargin = 10

  return (
    <Box>
      <Fab
      color="primary"
      aria-label="user"
      component={RouterLink}
      to="/profile"
      style={
        {
          position: 'fixed',
          bottom: positionMargin,
          right: rightMargin,
        }
      }>
        <PersonIcon />
      </Fab>
      <Fab
      color="primary"
      aria-label="calendar"
      component={RouterLink}
      to="/calendar"
      style={
        {
          position: 'fixed',
          bottom: positionMargin + 70,
          right: rightMargin,
        }
      }>
        <DateRangeIcon />
      </Fab>
      <Fab
      color="primary"
      aria-label="recipe"
      component={RouterLink}
      to="/recipe"
      style={
        {
          position: 'fixed',
          bottom: positionMargin + 140,
          right: rightMargin,
        }
      }>
        <BookIcon />
      </Fab>
      <Fab
      color="primary"
      aria-label="fridge"
      component={RouterLink}
        to={{
          pathname: "/fridge",
          state: {
            catName: "전체",
          },
        }}
      style={
        {
          position: 'fixed',
          bottom: positionMargin + 210,
          right: rightMargin,
        }
      }>
        <KitchenIcon />
      </Fab>
    </Box>
  )};