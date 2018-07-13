import React, { Component } from 'react';

import * as html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import Tooltip from '@material-ui/core/Tooltip';

import Card from '../Card/Card';

import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';

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
  constructor (props) {
    super(props);
    this.state = {
      height: 0,
      width: 0,
    };
    this.setSave = element => {
      this.save = element;
    };
  };

  onSaveHandler = ( data, target ) => {
    // console.log(this.saveInput);
    // console.log('height', target.clientHeight);
    // console.log('height', target.clientWidth);
    html2canvas(target)
      .then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          unit: 'pt',
          format: [target.clientHeight, target.clientWidth]
        });
        pdf.addImage(imgData, 'JPEG', 0, 0);
        pdf.save(data+'.pdf');
      })
  };

  render() {
    const { classes } = this.props;    
    const cardList = this.props.individualModule.map(item => {
      return (
        <Grid item key={item.device_name} className={classes.card}>
          <Card 
            name={item.device_name} 
            region={item.device_region}
            isp={item.device_isp}
            className={classes.card}
            udDownCount={item.down_time_count}
            rtaCount={item.rta_count}
            avDownTime={item.average_down_time}
            avUpTime={item.average_up_time}
            avPacketLoss={item.average_packet_loss}
            pathHandler={(path) => this.props.history.push(path)}
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
          <div ref={this.setSave}>
          <Grid 
            container
            justify='center'
            direction='row'
            alignItems='center'
          >
            {cardList}
          </Grid>
        </div>
        </Grid>
        <Tooltip title="Download data">
          <Button onClick={() => this.onSaveHandler('Dashboard', this.save)} variant="fab" color="primary" aria-label="add" className={classes.button}>
            <SaveIcon />
          </Button>
        </Tooltip>
      </Grid>
    );
  }
};

const mapStateToProps = state => {
  return {
    individualModule: state.network.individualModule,
  };
};

export default connect(mapStateToProps, null)(withRouter(withStyles(styles)(mainDashboard)));
