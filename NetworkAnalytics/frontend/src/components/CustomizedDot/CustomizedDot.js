import React from 'react';

import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
  customizedDot: {
  },
});

const customizedDot = props => {
  const { classes } = props;
  return (
    <div className={classes.customizedDot}>
    {
      props.ud &&
      <Typography variant="subheading">
        Hello world
      </Typography> 
    }
    {
      props.lat &&
        <Typography variant="subheading">
        </Typography>
    }
    <Typography variant="subheading">
    </Typography>
  </div>
  );
};

export default withStyles(styles)(customizedDot);
