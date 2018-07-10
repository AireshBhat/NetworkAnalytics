import React from 'react';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});

const analyticsButton = props => {
  const { classes } = props;
  return (
    <Button 
      variant={"outlined"} 
      color={props.highlight && 'primary'}
      className={classes.button}
    >
      {props.name}
    </Button>
  );
};

export default withStyles(styles)(analyticsButton);
