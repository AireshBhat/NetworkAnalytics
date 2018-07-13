import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import LogoutIcon from '@material-ui/icons/ExitToApp';

import AutoSuggest from '../AutoSuggest/AutoSuggest';

import { withRouter } from 'react-router-dom';

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  autoSuggest: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  button: {
    margin: theme.spacing.unit
  }
});

const appBar = props => {
  const { classes } = props;

  return (
    <AppBar 
      position="absolute" 
      className={classes.appBar} 
      align="center"
    >
      <Toolbar>
        <Grid 
          container 
          justify='space-between'
          alignItems='center'
        >
          <Grid item >
            <Typography variant="title" color="inherit" noWrap>
              Network Analytics
            </Typography>
          </Grid>
          <Grid item >
            <Grid container justify='space-between' direction='row' alignItems='center'>
                <Grid item >
                  <AutoSuggest className={classes.autoSuggest}/>
                </Grid>
              
              <Grid item >
                <a href="http://nalvp.pythonanywhere.com/logout/">
                  <IconButton className={classes.button} disabled aria-label="Search">
                    <LogoutIcon />
                </IconButton>
              </a>
            </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default withRouter(withStyles(styles)(appBar));

