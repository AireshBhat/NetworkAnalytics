import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import './AppBar.css';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    padding: theme.spacing.unit
  },
  alignCenter: {
    textAlign: 'center',
  },
});

const ButtonAppBar = (props) => {
  const { classes } = props;
  // const sideNavHandler = () => {
  //   console.log("I was clicked");
  // };

  return (
    <div id="root" className={classes.root}>
      <AppBar className="appbar" position="static" color="inherit">
        <Toolbar>
          <Typography variant="title" color="inherit" className={classes.flex} align={'center'}>
            Network Analytics
          </Typography>
        </Toolbar>
        {props.children}
      </AppBar>
    </div>
    
  );
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonAppBar);

    // <div id="root" className={classes.root}>
    //   <AppBar position="static">
    //     <Toolbar>
    //       <IconButton onClick={ sideNavHandler } className={classes.menuButton} color="inherit" aria-label="Menu" >
    //         <MenuIcon />
    //       </IconButton>
    //       <Typography variant="title" color="inherit" className={classes.flex} align={'center'}>
    //         Network Analytics
    //       </Typography>
    //       <Button color="inherit">Login</Button>
    //     </Toolbar>
    //   </AppBar>
    // </div>

