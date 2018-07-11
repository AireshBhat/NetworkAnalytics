import React, { Component } from 'react';

// import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import { connect } from 'react-redux';

import { addIndData, remIndData, getStats } from '../../store/actions/index';

import LineChartAnalyticsUD from '../../components/LineChart/LineChartAnalyticsUD';
import LineChartAnalyticsLat from '../../components/LineChart/LineChartAnalyticsLat';
import PieChart from '../../components/PieChart/PieChart';
import RadarChart from '../../components/RadarChart/RadarChart';
import DateSetting from '../../components/DateSetting/DateSetting';

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
  }
});

class analytics extends Component {
  constructor (props) {
    super(props);
    this.state = {
      modules: this.props.modules,
      event_start_date: '',
      event_start_date_unix: '',
      event_end_date: '',
      event_end_date_unix: '',
    };
  };

  clickHandler = (data) => {
    if(this.props.moduleData.length === 0){
      const dateSet = this.props.individualModule.find(item => {
        return data.device_name === item.device_name;
      });
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
            event_state: 1,
            device_ping: item.device_ping,
            device_rta: item.device_rta,
          };
        }
        return {
          event_start_time: item.event_start_time,
          event_end_time: item.event_end_time,
          event_state: -1,
          device_ping: item.device_ping,
          device_rta: item.device_rta,
        };
      });
      const moduleData = {
        device_name: data.device_name,
        device_data: module_data,
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
      this.props.getStats(data);
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
          <Typography className={classes.headerPadding} variant="headline">
            General Properties
          </Typography>
          <Typography className={classes.subheaderPadding} variant='subheading'> UP/DOWN </Typography>
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
        </Paper>
        <Divider />
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
          <Typography className={classes.headerPadding} variant="headline">
            Up/Down Time
          </Typography>
          <LineChartAnalyticsUD 
            data={this.props.moduleData}
            event_start_date_unix={this.state.event_start_date_unix}
            event_end_date_unix={this.state.event_end_date_unix}
          />
        </Paper>
        <Paper>
          <Typography className={classes.headerPadding} variant={'headline'}>
            Latency
          </Typography>
          <LineChartAnalyticsLat 
            data={this.props.moduleData}
            event_start_date_unix={this.state.event_start_date_unix}
            event_end_date_unix={this.state.event_end_date_unix}            
          />
        </Paper>
      </div>
    );
  };
};

const mapStateToProps = state => {
  return {
    modules: state.network.modules,
    individualModule: state.network.individualModule,
    moduleData: state.analytics.moduleData,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addIndData: (data) => dispatch(addIndData(data)),
    remIndData: (data) => dispatch(remIndData(data)),
    getStats: (data) => dispatch(getStats(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)( withStyles(styles)( analytics ) );

