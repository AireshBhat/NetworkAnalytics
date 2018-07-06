import React, { Component } from 'react';

import moment from 'moment';

import { withRouter } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

import AreaChartUD from '../../components/AreaChart/AreaChartUD';
import AreaChartLatency from '../../components/AreaChart/AreaChartLatency';

const styles = theme => ({
  root: {
    width: '100%',
  },
  headerPadding: {
    paddingTop: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 2,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    color: theme.palette.text.secondary,
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
  },
  mainPaper: {
    marginBottom: theme.spacing.unit * 2
  },
  button: {
    flexDirection: 'rowReverse'
  },
});

class statistics extends Component {
  constructor (props) {
    super(props);
    this.state = {
      event_start_date: moment.unix((this.props.data[0] || '').event_start_time).format('YYYY-MM-DD') || '',
      event_end_date: moment.unix((this.props.data[this.props.data.length - 1] || '').event_end_time).format('YYYY-MM-DD') || '',
      average_down_time: '',
      average_up_time: '',
      average_packet_loss: '',
      dialogue_open: false
    };
  };

  componentDidMount () {
    console.log(this.props);
    this.getInfoHandler();
  };

  getInfoHandler = () => {
    const url_fetch = 'http://nalvp.pythonanywhere.com/deviceStats/';
    const data = {
      device_name: this.props.id,
      start_date: this.state.event_start_date,
      end_date: this.state.event_end_date,
    };
    fetch(url_fetch, {
      method: 'POST',
      body: JSON.stringify(data),
      headers:{
          'Content-Type': 'application/json'
      }
    })
      .catch(err => {
          console.log(err);
      })
      .then(res => {
        // console.log(res);
          if(res === undefined){
              throw Error;
          }
          return res.json();
      })
      .then(parsedRes => {
        // console.log(parsedRes);
        this.setState(prevState => {
          return {
            ...prevState,
            average_down_time: parsedRes.average_down_time,
            average_up_time: parsedRes.average_up_time,
            average_packet_loss: parsedRes.packet_loss_average,
          };
        });
      })
      .catch(err => {
        console.log(err);
        Promise.resolve(err);
      })
  };

  openDialogueHandler = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        dialogue_open: true
      };
    });
  };

  dialogueCloseHandler = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        dialogue_open: false
      };
    });
  };

  deleteModuleHandler = () => {
    this.dialogueCloseHandler();
    console.log("I am going to get deleted");
    const url_fetch = 'http://nalvp.pythonanywhere.com/deleteInfo/';
    const data = {
      device_name: this.props.id,
      // start_date: this.state.event_start_date,
      // end_date: this.state.event_end_date,
    };
    fetch(url_fetch, {
      method: 'POST',
      body: JSON.stringify(data),
      headers:{
          'Content-Type': 'application/json'
      }
    })
      .catch(err => {
          console.log(err);
      })
      .then(res => {
        console.log(res);
          if(res === undefined){
              throw Error;
          }
          return res.json();
      })
      .then(parsedRes => {
        console.log(parsedRes);
      })
      .catch(err => {
        console.log(err);
        Promise.resolve(err);
      })
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={10}>
            <Typography variant="display3">
              {this.props.id}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Tooltip id="tooltip-icon" title="Delete Module">
              <IconButton onClick={this.openDialogueHandler} className={classes.button} aria-label="Close">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
              <Dialog
                open={this.state.dialogue_open}
                onClose={this.dialogueCloseHandler}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete the module?"}</DialogTitle>
                <DialogActions>
                  <Button onClick={this.dialogueCloseHandler} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={this.deleteModuleHandler} color="primary" autoFocus>
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>
          </Grid>
        </Grid>
        <Grid container spacing={24}>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <Typography variant="subheading">Average Up Time</Typography>
              <Typography variant="display2">{Math.round(this.state.average_up_time * 1000000)/10000 + '%'}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <Typography variant="subheading">Average Down Time</Typography>
              <Typography variant="display2">{Math.round(this.state.average_down_time * 1000000)/10000 + '%'}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <Typography variant="subheading">Average Packet Loss</Typography>
              <Typography variant="display2">{this.state.average_packet_loss + '%'}</Typography>
            </Paper>
          </Grid>
        </Grid>
        <Paper className={classes.mainPaper}>
          <Typography className={classes.headerPadding} variant="headline">
            Up/Down Time
          </Typography>
          <AreaChartUD 
            data={
            this.props.data.map((item) => {
              if(item.event_state === 'UP'){
                return {
                  event_start_time: item.event_start_time,
                  event_end_time: item.event_end_time,
                  event_state: 1,
                };
              }
              return {
                event_start_time: item.event_start_time,
                event_end_time: item.event_end_time,
                event_state: -1,
              };
            })
          }
          ud
        />
        </Paper>
        <Paper>
          <Typography className={classes.headerPadding} variant={'headline'}>Latency</Typography>
          <AreaChartLatency 
            data={
              this.props.data.map((item) => {
                return {
                  event_start_time: item.event_start_time,
                  event_end_time: item.event_end_time,
                  device_ping: item.device_ping,
                  device_rta: item.device_rta,
                };
              })
            }
          />
        </Paper>
      </div>
    );
  };
};

export default withRouter(withStyles(styles)( statistics ));
