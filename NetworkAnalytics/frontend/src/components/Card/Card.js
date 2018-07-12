import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
// import CardActions from '@material-ui/core/CardActions';
// import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';

import { withStyles } from '@material-ui/core/styles';

const styles= theme => ({
  cardItem: {
    width: '40%',
    margin: theme.spacing.unit,
  },
  upTime: {
    color: 'green',
  },
  downTime: {
    color: 'red',
  },
  cardTitle: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
  },
});

const GridComponent = props => {
  const classes = props.classes;
  return (
    <Grid className={classes.cardItem} container alignItems='center' direction='column' >
      <Typography variant='subheading' className={classes.cardTitle}>
        {props.statName}
      </Typography>
      <Typography variant='title' className={props.className}>
        {props.data}
      </Typography>
    </Grid>
  )
};

class card extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Card>
        <Grid 
          container 
          justify='center' 
          alignItems='center' 
          direction='column'
        >
          <Grid item >
            <CardContent>
              <Typography variant='display1'>
                {this.props.name}
              </Typography>
            </CardContent>
            <Divider />
          </Grid>
          <Grid item >
            <Grid 
              container 
              justify='space-around'
              direction='row'
              alignItems='center'
            >
              <GridComponent 
                classes={this.props.classes} 
                data={Math.round(this.props.avUpTime * 10000) / 100 + '%'} 
                statName='Up Time' 
                className={classes.upTime}
              />
              <GridComponent 
                classes={this.props.classes} 
                data={Math.round(this.props.avDownTime * 10000) / 100 + '%'} 
                statName='Down Time' 
                className={classes.downTime}
              />
              <GridComponent
                classes={this.props.classes}
                data={Math.round((this.props.avPacketLoss * 100) / 100) + '%'}
                statName='Latency'
              />
              <GridComponent
                classes={this.props.classes}
                data={this.props.udDownCount}
                statName='Down Time Count'
              />
              <GridComponent
                classes={this.props.classes}
                data={this.props.rtaCount}
                statName='Latency Count'
              />
            </Grid>
          </Grid>
        </Grid>
      </Card>
    );
  };
};

export default withStyles(styles)(card);
