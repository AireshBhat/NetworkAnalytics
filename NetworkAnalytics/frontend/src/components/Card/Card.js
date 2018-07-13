import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import RightIcon from '@material-ui/icons/ArrowForward';
import Tooltip from '@material-ui/core/Tooltip';
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
  button: {
    margin: theme.spacing.unit,
  }
});

const GridComponent = props => {
  const classes = props.classes;
  return (
    <Grid className={classes.cardItem} container alignItems='center' direction='column' justify='center' >
      <Grid item >
        <Typography variant='subheading' className={classes.cardTitle}>
          {props.statName}
        </Typography>
      </Grid>
      <Grid item >
        <Typography variant='title' className={props.className}>
          {props.data}
        </Typography>
      </Grid>
    </Grid>
  )
};

class card extends Component {
  handlePush = () => {
    this.props.pathHandler('/dashboard/' + this.props.name);
  };

  render() {
    const { classes } = this.props;
    return (
      <Card>
        <Grid 
          container 
          justify='flex-start' 
          alignItems='center' 
          direction='column'
        >
          <Grid item >
            <CardContent>
              <Typography variant='display1'>
                {this.props.name}
              </Typography>
              <Typography variant='body2'>{this.props.region + ' - ' + this.props.isp}</Typography>
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
              <Divider />
              <GridComponent 
                classes={this.props.classes} 
                data={Math.round(this.props.avDownTime * 10000) / 100 + '%'} 
                statName='Down Time' 
                className={classes.downTime}
              />
              <Divider />
              <GridComponent
                classes={this.props.classes}
                data={Math.round((this.props.avPacketLoss * 100) / 100) + '%'}
                statName='Latency'
              />
              <Divider />
              <GridComponent
                classes={this.props.classes}
                data={this.props.udDownCount}
                statName='Down Time Count'
              />
              <Divider />
              <GridComponent
                classes={this.props.classes}
                data={this.props.rtaCount}
                statName='Latency Count'
              />
              
            </Grid>
          </Grid>
        </Grid>
        <Grid container alignItems='center' justify='center'>
          <Tooltip title="See Individual Analytics">
            <IconButton onClick={this.handlePush} className={classes.button} aria-label="Route">
              <RightIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Card>
    );
  };
};

export default withStyles(styles)(card);
