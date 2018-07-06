import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
});

const appBar = props => {
  const { classes } = props;

  return (
    <AppBar position="absolute" className={classes.appBar} align="center">
      <Toolbar>
        <Typography variant="title" color="inherit" noWrap>
          Network Analytics
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default withStyles(styles)(appBar);
