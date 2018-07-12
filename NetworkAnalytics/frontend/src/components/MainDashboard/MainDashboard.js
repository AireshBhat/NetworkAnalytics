import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

import Card from '../Card/Card';

import { connect } from 'react-redux';

const styles= theme => ({
  heading: {
    marginBottom: theme.spacing.unit * 4,
  },
  card: {
    maxWidth: 300,
    minWidth: 300,
    margin: theme.spacing.unit * 2,
  },
});

class mainDashboard extends Component {
  render() {
    const { classes } = this.props;    
    const cardList = this.props.individualModule.map(item => {
      return (
        <Grid item key={item.device_name} className={classes.card}>
          <Card 
            name={item.device_name} 
            className={classes.card}
            udDownCount={item.down_time_count}
            rtaCount={item.rta_count}
            avDownTime={item.average_down_time}
            avUpTime={item.average_up_time}
            avPacketLoss={item.average_packet_loss}
          />
        </Grid>
      );
    });
    return (
      <Grid 
        container 
        justify='center'
        direction='column'
        alignItems='center'
      >
        <Grid item className={classes.heading}>
          <Typography variant='display3' >
            Dashboard
          </Typography>
          <Divider />
        </Grid>
        <Grid item >
          <Grid 
            container
            justify='center'
            direction='row'
            alignItems='center'
          >
            {cardList}
          </Grid>
        </Grid>
      </Grid>
    );
  }
};

const mapStateToProps = state => {
  return {
    individualModule: state.network.individualModule,
  };
};

export default connect(mapStateToProps, null)(withStyles(styles)(mainDashboard));
