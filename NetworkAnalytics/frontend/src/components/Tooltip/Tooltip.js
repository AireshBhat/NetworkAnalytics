import React from 'react';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

import moment from 'moment';

const styles = theme => ({
  toolTip: {
    padding: theme.spacing.unit,
  }
});

const toolTip = props => {
  const { classes } = props;
  return (
    <Paper className={classes.toolTip}>
      {
        props.ud &&
          <Typography variant="subheading">
            Event State: {props.data.payload[0] ? (props.data.payload[0].payload.event_state === 1 ? 'UP' : 'DOWN') : 'Not Applicable'}
          </Typography> 
      }
      {
        props.lat &&
          <Typography variant="subheading">
            RTA: {props.data.payload[0] ? (props.data.payload[0].payload.device_rta) : 'Not Applicable'}
          </Typography>
      }
      <Typography variant="subheading">
        Date: {moment.unix(props.data.label).format('dddd, MMMM Do YYYY, h:mm:ss a')}
      </Typography>
    </Paper>
  );
};

export default withStyles(styles)(toolTip);
