import React, { Component } from 'react';

// import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { connect } from 'react-redux';

import { addIndData, remIndData } from '../../store/actions/index';

import LineChartAnalyticsUD from '../../components/LineChart/LineChartAnalyticsUD';
import LineChartAnalyticsLat from '../../components/LineChart/LineChartAnalyticsLat';

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
});

class analytics extends Component {
  constructor (props) {
    super(props);
    this.state = {
      modules: this.props.modules,
    };
  };

  clickHandler = (data) => {
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
    return (
      <div>
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
          />
        </Paper>
        <Paper>
          <Typography className={classes.headerPadding} variant={'headline'}>Latency</Typography>
          <LineChartAnalyticsLat 
            data={this.props.moduleData}
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)( withStyles(styles)( analytics ) );

