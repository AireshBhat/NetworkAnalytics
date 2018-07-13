import React, { Component } from 'react';

import * as html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';

import moment from 'moment';

import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';

import classNames from 'classnames';

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
import SaveIcon from '@material-ui/icons/Save';


// import CustomizedDot from '../../components/CustomizedDot/CustomizedDot';
import LineChartUD from '../../components/LineChart/LineChartUD';
import LineChartLatency from '../../components/LineChart/LineChartLatency';
import BarChart from '../../components/BarChart/BarChart';
// import { Line, LabelList } from 'recharts';
import DateSetting from '../../components/DateSetting/DateSetting';
import Modal from '../../components/Modal/Modal';

import { delModule, getStats, deviceCountInit } from '../../store/actions/index';

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
  date: {
    fontSize: theme.spacing.unit * 2.5,
  },
  dividerMargin: {
    marginTop: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit,
  },
  saveButton: {
    paddingTop: 'absolute',
    left: '95%',
  },
  tickButton: {
    margin: theme.spacing.unit,
  }
});

class statistics extends Component {
  constructor (props) {
    super(props);
    this.state = {
      event_start_date: moment.unix((this.props.data[0] || '').event_start_time).format('YYYY-MM-DD') || '',
      event_start_date_unix: (this.props.data[0] || '').event_start_time,
      event_end_date: moment.unix((this.props.data[this.props.data.length - 1] || '').event_end_time).format('YYYY-MM-DD') || '',
      event_end_date_unix: (this.props.data[this.props.data.length - 1] || '').event_end_time,
      average_down_time: '',
      average_up_time: '',
      average_packet_loss: '',
      dialogue_open: false,
      tickType: 'month'
    };
    this.setSaveUD = element => {
      this.UD = element;
    };
    this.setSaveDownCount = element => {
      this.downCount = element;
    };
    this.setSaveLatency = element => {
      this.latency = element;
    };
    this.setSaveLatCount = element => {
      this.latCount = element;
    };
  };

  componentDidMount () {
    // console.log("Statistics properties");
    // console.log(this.props);
    this.fetchStatsHandler();
  };

  fetchStatsHandler = () => {
    const data = {
      device_name: this.props.id,
      start_date: this.state.event_start_date,
      end_date: this.state.event_end_date,
    };
    this.props.getStats(data, this.state.tickType);
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
        // console.log(res);
          if(res === undefined){
              throw Error;
          }
          return res.json();
      })
      .then(parsedRes => {
        // console.log(parsedRes);
      })
      .catch(err => {
        console.log(err);
        Promise.resolve(err);
      })
    this.props.delModule(this.props.id);
    if(this.props.modules.length > 1){
      this.props.history.push({pathname: '/dashboard/' + 
        this.props.modules.filter(item => {
          return item.device_name !== this.props.id;
        })[0].device_name
      });
    }
    else {
      this.props.history.push('/uploadData/');
    }
  };

  handleChangeStart = date => {
    if(date.unix() > this.state.event_end_date_unix){
      alert("End date is further than the start date.");
    }
    else
    {
      this.setState(prevState => {
        return {
          ...prevState,
          event_start_date: date.format('YYYY-MM-DD'),
          event_start_date_unix: date.unix(),
        };
      });
    }
  };

  handleChangeEnd = dateEnd => {
    if(dateEnd.unix() < this.state.event_start_date_unix){
      alert("End date is further than the start date.");
    }
    else
    {
      this.setState(prevState => {
        return {
          ...prevState,
          event_end_date: dateEnd.format('YYYY-MM-DD'),
          event_end_date_unix: dateEnd.unix(),
        };
      });
    }
  };

  onSaveHandler = ( data, target ) => {
    // console.log(this.saveInput);
    html2canvas(target)
      .then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'pt',
          format: [target.clientWidth * 0.8, target.clientHeight * 0.8]
        });
        pdf.addImage(imgData, 'JPEG', 0, 0);
        pdf.save(data+'.pdf');
      })
  };

  setTimeHandler = (time) => {
    this.setState(prevState => {
      return {
        ...prevState,
        tickType: time,
      };
    });
    this.props.deviceCountInit({
      down_start_time: this.props.itemData.ud_down_start_time,
      down_end_time: this.props.itemData.ud_down_end_time,
      rta_start_time: this.props.itemData.rta_start_time,
      rta_end_time: this.props.itemData.rta_end_time,
    }, time, {
      device_name: this.props.id,
      start_date: this.state.event_start_date,
      end_date: this.state.event_end_date,
    });
  };

  render() {
    const { classes } = this.props;
    const indMod = this.props.individualModule.find(item => {
      return this.props.id === item.device_name;
    });
    // console.log(indMod);
    // console.log("ind module");
    return (
      <div className={classes.root}>
        <Grid container alignItems='center' spacing={24}>
          <Grid item xs={10}>
            <Typography variant="display3">
              {this.props.id}
            </Typography>
            <Typography variant='body2'>
              {this.props.itemData.device_region + ' - ' + this.props.itemData.device_isp}
            </Typography>
          </Grid>
          { this.props.token &&
            <Grid item xs={2}>
              <Tooltip id="tooltip-icon" title="Delete Module">
                <IconButton onClick={this.openDialogueHandler} className={classNames(classes.button, classes.date)} aria-label="Close">
                  <DeleteIcon />
              </IconButton>
            </Tooltip>
              <Dialog
                open={this.state.dialogue_open}
                onClose={this.dialogueCloseHandler}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
              <DialogTitle 
                id="alert-dialog-title"
              >
                {"Are you sure you want to delete the module?"}
              </DialogTitle>
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
        }
        </Grid>
        <DateSetting 
          event_start_date_unix = {this.state.event_start_date_unix}
          event_end_date_unix = {this.state.event_end_date_unix}
          handleChangeStart = {this.handleChangeStart}
          handleChangeEnd = {this.handleChangeEnd}
          fetchStatsHandler = {this.fetchStatsHandler}
          minDate = {moment.unix((this.props.data[0] || '').event_start_time).format('YYYY-MM-DD')}
          maxDate = {moment.unix((this.props.data[this.props.data.length - 1] || '').event_end_time).format('YYYY-MM-DD')}
        />
        <Grid container spacing={24}>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <Grid 
                container
                alignItems='center'
                direction='row'
                justify='space-between'
              >
                <Grid>
                  <Typography variant="subheading">Average Up Time</Typography>
                  <Typography variant="display2">{(Math.round(indMod.average_up_time * 10000)/100 + '%')}</Typography>
                </Grid>
                {
                  false &&
                  <Grid className={classes.saveButton}>
                    <IconButton size='small' className={classes.button} aria-label="Delete">
                      <SaveIcon />
                    </IconButton>
                  </Grid>
                  }
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <Grid 
                container 
                alignItems='center' 
                direction='row' 
                justify='space-between'
              >
                <Grid>
                  <Typography variant="subheading">Average Down Time</Typography>
                  <Typography variant="display2">{(Math.round(indMod.average_down_time * 10000)/100 + '%')}</Typography>
                </Grid>
                {
                  false &&
                  <Grid className={classes.saveButton}>
                    <IconButton size='small' className={classes.button} aria-label="Delete">
                      <SaveIcon />
                    </IconButton>
                  </Grid>                
                  }
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <Grid 
                container 
                alignItems='center' 
                direction='row' 
                justify='space-between'
              >
                <Grid>
                  <Typography variant="subheading">Average Packet Loss</Typography>
                  <Typography variant="display2">{((Math.round(indMod.average_packet_loss * 100)/100) + '%') || 0 + '%'}</Typography>
                </Grid>
                {
                  false &&
                  <Grid className={classes.saveButton}>
                    <IconButton size='small' className={classes.button} aria-label="Delete">
                      <SaveIcon />
                    </IconButton>
                  </Grid>                
                  }
              </Grid>
            </Paper>
          </Grid>
        </Grid>



        <Paper className={classes.mainPaper}>
          <div ref={this.setSaveDownCount}>
            <Typography className={classes.headerPadding} variant='headline'>
              Down Time Count
            </Typography>
            <BarChart 
              data={this.props.itemData.down_time_count_array}
              device_name={this.props.id}
            />
            <Typography variant='subheading' className={classes.headerPadding}>
              {'Total Time: ' + this.props.itemData.total_time_ud}
            </Typography>
          </div>
          <Grid 
            container 
            direction='row-reverse'
            justify='space-between'
            alignItems='center'
          >
            <Grid item >
              <IconButton onClick={()=> this.onSaveHandler(this.props.id + 'Down Time Count', this.downCount)} size='small' aria-label="Down-Time-Count">
                <SaveIcon />
              </IconButton>
            </Grid>
            <Grid item >
              <Button variant="outlined" color="primary" className={classes.tickButton} onClick={() => this.setTimeHandler('week')}>
                Week
              </Button>
              <Button variant="outlined" color="primary" className={classes.tickButton} onClick={() => this.setTimeHandler('month')}>
                Month
              </Button>
            </Grid>
          </Grid>
        </Paper>


        <Paper className={classes.mainPaper}>
          <div ref={this.setSaveUD}>
            <Typography className={classes.headerPadding} variant="headline">
              Up/Down Time
            </Typography>
            <LineChartUD 
              data={
                this.props.data.map((item) => {
                  if(item.event_start_time >= this.state.event_start_date_unix && item.event_end_time <= this.state.event_end_date_unix){
                    if(item.event_state === 'UP'){
                      return {
                        event_start_time: item.event_start_time,
                        event_end_time: item.event_end_time,
                        event_state: 0,
                      };
                    }
                    return {
                      event_start_time: item.event_start_time,
                      event_end_time: item.event_end_time,
                      event_state: 1,
                    };
                  }
                  return null;
                })
                }
                ud
              >
            
          </LineChartUD>
            </div>
            <IconButton onClick={()=> this.onSaveHandler(this.props.id + 'UD', this.UD)} size='small' className={classes.saveButton} aria-label="UD">
              <SaveIcon />
            </IconButton>
        </Paper>


        <Paper className={classes.mainPaper}>
          <div ref={this.setSaveLatCount}>
            <Typography className={classes.headerPadding} variant='headline'>
              RTA Count(Latency > 120ms)
            </Typography>
            <BarChart 
              data={this.props.itemData.rta_count_array}
              device_name={this.props.id}
            />
            <Typography variant='subheading' className={classes.headerPadding}>
              {'Total Time: ' + this.props.itemData.total_time_rta}
            </Typography>
          </div>
          <Grid 
            container 
            direction='row-reverse'
            justify='space-between'
            alignItems='center'
          >
            <Grid item >
              <IconButton onClick={()=> this.onSaveHandler(this.props.id + 'Down Time Count', this.latCount)} size='small' aria-label="Down-Time-Count">
                <SaveIcon />
              </IconButton>
            </Grid>
            <Grid item >
              <Button variant="outlined" color="primary" className={classes.tickButton} onClick={() => this.setTimeHandler('week')}>
                Week
              </Button>
              <Button variant="outlined" color="primary" className={classes.tickButton} onClick={() => this.setTimeHandler('month')}>
                Month
              </Button>
            </Grid>
          </Grid>
        </Paper>


        <Paper>
          <div ref={this.setSaveLatency}>
            <Typography className={classes.headerPadding} variant={'headline'}>
              Latency
            </Typography>
            <LineChartLatency 
              data={
                this.props.data.map((item) => {
                  if(item.event_start_time >= this.state.event_start_date_unix && item.event_end_time <= this.state.event_end_date_unix){
                    if(item.device_rta === 0){
                      return {
                        event_start_time: item.event_start_time,
                        event_end_time: item.event_end_time,
                        device_ping: item.device_ping,
                      };
                    }
                    return {
                      event_start_time: item.event_start_time,
                      event_end_time: item.event_end_time,
                      device_ping: item.device_ping,
                      device_rta: item.device_rta,
                    };
                  }
                  return null;
                })
                }
              />
            </div>
          <IconButton onClick={()=> this.onSaveHandler(this.props.id + 'Latency', this.latency)} size='small' className={classes.saveButton} aria-label="Latency">
            <SaveIcon />
          </IconButton>          
        </Paper>
        {this.props.err && <Modal />}
      </div>
    );
  };
};

const mapStateToProps = state => {
  return {
    modules: state.network.modules,
    individualModule: state.network.individualModule,
    err: state.network.err,
    token: state.network.token,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    delModule: module => dispatch(delModule(module)),
    getStats: ( data, time ) => dispatch(getStats(data, time)),
    deviceCountInit: (data, time, device) => dispatch(deviceCountInit(data, time, device)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)( withRouter(withStyles(styles)( statistics )) );
