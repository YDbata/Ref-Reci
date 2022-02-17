import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles({
  table: {
    flexShrink: 0,
    maxWidth: '100%',
  },
});

export default function RecipeIng(props) {
  const classes = useStyles();

  const ingCells = props.datas.map((ing) => {
    return (
      <TableRow key={ing.name}>
        <TableCell component="th" scope="row">{ing.ingredientName}</TableCell>
        <TableCell align="right">{ing.ingredientAmount}</TableCell>
      </TableRow>
    )
  })

  return (
    <Box p={5}>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="ingredient table">
          <TableHead>
            <TableRow>
              <TableCell >재료</TableCell>
              <TableCell align="right">양</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ingCells}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
    
  )
}