import React, { Component } from 'react';

// import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

import * as html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';

import { connect } from 'react-redux';

import { addIndData, remIndData, getStats, deviceCountInit } from '../../store/actions/index';

import LineChartAnalyticsUD from '../../components/LineChart/LineChartAnalyticsUD';
import LineChartAnalyticsLat from '../../components/LineChart/LineChartAnalyticsLat';
import PieChart from '../../components/PieChart/PieChart';
import RadarChart from '../../components/RadarChart/RadarChart';
import DateSetting from '../../components/DateSetting/DateSetting';
import BarChart from '../../components/BarChart/BarChart';
import Modal from '../../components/Modal/Modal';

import moment from 'moment';

// import Button from '../../components/AnalyticsButton/AnalyticsButton';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  mainDiv: {
    justify: 'center'
  },
  chipDesign: {
    margin: theme.spacing.unit,
  },
  headerPadding: {
    paddingTop: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 2,
  },
  mainPaper: {
    marginBottom: theme.spacing.unit * 2
  },
  subheaderPadding: {
    paddingRight: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 6,
    paddingBottom: theme.spacing.unit,
  },
  saveButton: {
    paddingTop: 'absolute',
    left: '95%',
  },
  tickButton: {
    margin: theme.spacing.unit,
  }
});

class analytics extends Component {
  constructor (props) {
    super(props);
    if(this.props.moduleData.length !== 0){
      const dateSet = this.props.moduleData[0];
      this.state = {
        modules: this.props.modules,
        event_start_date: moment.unix((dateSet.device_data[0] || '').event_start_time).format('YYYY-MM-DD') || '',
        event_start_date_unix: (dateSet.device_data[0]).event_start_time,
        event_end_date: moment.unix((dateSet.device_data[dateSet.device_data.length - 1] || '').event_end_time).format('YYYY-MM-DD') || '',
        event_end_date_unix: (dateSet.device_data[dateSet.device_data.length - 1]).event_end_time,
        tickType: 'month',
      };
    }
    else
    {
      this.state = {
        modules: this.props.modules,
        event_start_date:  '',
        event_start_date_unix: '',
        event_end_date:  '',
        event_end_date_unix: '',
        tickType: 'month',
      };
    }
    this.setSaveGenProps = element => {
      this.genProps = element;
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

  clickHandler = (data) => {
    const dateSet = this.props.individualModule.find(item => {
        return data.device_name === item.device_name;
      });
    if(this.props.moduleData.length === 0){
      this.setState(prevState => {
        return {
          ...prevState,
          event_start_date: moment.unix((dateSet.device_data[0] || '').event_start_time).format('YYYY-MM-DD') || '',
          event_start_date_unix: (dateSet.device_data[0]).event_start_time,
          event_end_date: moment.unix((dateSet.device_data[dateSet.device_data.length - 1] || '').event_end_time).format('YYYY-MM-DD') || '',
          event_end_date_unix: (dateSet.device_data[dateSet.device_data.length - 1]).event_end_time,
        };
      });
    }
    if(!this.props.moduleData.find(item => {
      return item.device_name === data.device_name;
    })){
      const module_data = this.props.individualModule.find(item => {
        return data.device_name === item.device_name;
      }).device_data.map(item => {
        if(item.event_state === 'UP')
        {
          return {
            event_start_time: item.event_start_time,
            event_end_time: item.event_end_time,
            event_state: 0,
            device_ping: item.device_ping,
            device_rta: item.device_rta,
          };
        }
        return {
          event_start_time: item.event_start_time,
          event_end_time: item.event_end_time,
          event_state: 1,
          device_ping: item.device_ping,
          device_rta: item.device_rta,
        };
      });
      const moduleData = {
        device_name: data.device_name,
        device_data: module_data,
        down_time_count_array: dateSet.down_time_count_array,
        rta_count_array: dateSet.rta_count_array,
        ud_down_start_time: dateSet.ud_down_start_time,
        rta_start_time: dateSet.rta_start_time,
      };
      this.props.addIndData(moduleData);
    }
  };

  deleteHandler = (data) => {
    if(this.props.moduleData.find(item => {
      return item.device_name === data.device_name;
    })){
      this.props.remIndData(data);
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

  fetchStatsHandler = () => {
    this.props.moduleData.forEach(item => {
      const data = {
        device_name: item.device_name,
        start_date: this.state.event_start_date,
        end_date: this.state.event_end_date,
      }
      this.props.getStats(data, this.state.tickType);
    });
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
        console.log('canvas');
        console.log(canvas);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
        });
        pdf.addImage(imgData, 'JPEG', 0, 0);
        pdf.save(data+'.pdf');
      })
  };

  setTimeHandler = (time) => {
    this.setState(prevState => {
      return {
        ...prevState,
        tickType: time
      }
    });
    console.log('time', time);
    this.props.moduleData.forEach(item => {
      console.log('device Stats', {
        down_start_time: item.ud_down_start_time,
        rta_start_time: item.rta_start_time,
      }, {
        device_name: item.device_name,
        start_date: this.state.event_start_date,
        end_date: this.state.event_end_date,
      });
      this.props.deviceCountInit({
        down_start_time: item.ud_down_start_time,
        rta_start_time: item.rta_start_time,
      }, time, {
        device_name: item.device_name,
        start_date: this.state.event_start_date,
        end_date: this.state.event_end_date,
      });
    })
  };

  render () {
    const { classes } = this.props;
    const buttonSet = this.props.modules.map(item => {
      return (
        <Grid item key={item.device_name}>
          <Chip
            label={item.device_name} 
            onClick={() => this.clickHandler(item)}
            className={classes.chipDesign}
            onDelete={() => this.deleteHandler(item)}
          />
        </Grid>
      );
    });


    const piSet = this.props.individualModule.map(item => {
      // console.log('the req item');
      // console.log(item);
      return (
        <Grid item key={item.device_name}>
          <PieChart 
            data={
              [
                {
                  name: 'UP Time',
                  value: item.average_up_time || 0,
                },
                {
                  name: 'DOWN Time',
                  value: item.average_down_time || 0
                }
              ]
            }
            device_name={item.device_name}
          />
        </Grid>
      );
    });


    return (
      <div>
        <Typography className={classes.headerPadding} variant="display2">
            General Properties
          </Typography>
          {
          this.props.moduleData.length === 0 ? null :
            <DateSetting 
              event_start_date_unix = {this.state.event_start_date_unix}
              event_end_date_unix = {this.state.event_end_date_unix}
              handleChangeStart = {this.handleChangeStart}
              handleChangeEnd = {this.handleChangeEnd}
              fetchStatsHandler = {this.fetchStatsHandler}
            />
          }
          <Paper className={classes.mainPaper}>
          
            <div ref={this.setSaveGenProps}>
              <Typography className={classes.subheaderPadding} variant='headline'> UP/DOWN </Typography>
              <Grid
                container
                className={classes.root}
                alignItems='center'
                justify='center'
                direction='row'
              >
                {piSet}
              </Grid>
            <Grid
              container
              className={classes.root}
              alignItems='center'
              justify='center'
              direction='row'
            >
            <Grid item >
              <RadarChart data={
                this.props.individualModule.map(item => {
                  return {
                    name: item.device_name,
                    value: Math.round(item.average_up_time * 1000000)/10000 ,
                  };
                })
                }/>
            </Grid>
          </Grid>
        </div>
        <IconButton onClick={()=> this.onSaveHandler('GeneralProps', this.genProps)} size='small' className={classes.saveButton} aria-label="Generla-Props">
          <SaveIcon />
        </IconButton>
        </Paper>
        <Divider />


        <Typography className={classes.headerPadding} variant="display2">
          Analysis
        </Typography>
        <Grid 
          container
          className={classes.root}
          alignItems={'center'}
          justify={'center'}
          direction={'row'}
        >
          {buttonSet}
        </Grid>


        <Paper className={classes.mainPaper}>
          <div ref={this.setSaveUD}>
            <Typography className={classes.headerPadding} variant="headline">
              Up/Down Time
            </Typography>
            <LineChartAnalyticsUD 
              data={this.props.moduleData}
              event_start_date_unix={this.state.event_start_date_unix}
              event_end_date_unix={this.state.event_end_date_unix}
            />
          </div>
          <IconButton onClick={()=> this.onSaveHandler('AnalyticsUD', this.UD)} size='small' className={classes.saveButton} aria-label="AnalyticsUD">
            <SaveIcon />
          </IconButton>
        </Paper>


        <Paper className={classes.mainPaper}>
          <div ref={this.setSaveDownCount}>
            <Typography className={classes.headerPadding} variant="headline">
              Down Time Count
            </Typography>
            {
              this.props.moduleData.map(item => {
                return(
                  <BarChart 
                    key={item.device_name}
                    data={item.down_time_count_array}
                    device_name={item.device_name}
                  />
                );
              })
            }
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
          <div ref={this.setSaveLatency}>
            <Typography className={classes.headerPadding} variant={'headline'}>
              Latency
            </Typography>
            <LineChartAnalyticsLat 
              data={this.props.moduleData}
              event_start_date_unix={this.state.event_start_date_unix}
              event_end_date_unix={this.state.event_end_date_unix}            
            />
          </div>
          <IconButton onClick={()=> this.onSaveHandler('AnalyticsLat', this.latency)} size='small' className={classes.saveButton} aria-label="AnalyticsLat">
            <SaveIcon />
          </IconButton>
        </Paper>


        <Paper className={classes.mainPaper}>
          <div ref={this.setSaveLatCount}>
            <Typography className={classes.headerPadding} variant="headline">
              RTA Count(Latency > 120ms)
            </Typography>
            {
              this.props.moduleData.map(item => {
                return(
                  <BarChart 
                    key={item.device_name}
                    data={item.rta_count_array}
                    device_name={item.device_name}
                  />
                );
              })
            }
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


        {this.props.err && <Modal />}
      </div>
    );
  };
};

const mapStateToProps = state => {
  return {
    modules: state.network.modules,
    individualModule: state.network.individualModule,
    moduleData: state.analytics.moduleData,
    err: state.network.err,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addIndData: (data) => dispatch(addIndData(data)),
    remIndData: (data) => dispatch(remIndData(data)),
    getStats: (data, time) => dispatch(getStats(data, time)),
    deviceCountInit: (data, time, device) => dispatch(deviceCountInit(data, time, device)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)( withStyles(styles)( analytics ) );
