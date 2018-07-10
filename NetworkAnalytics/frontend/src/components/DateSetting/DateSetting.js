import React, { Component } from 'react';

import moment from 'moment';

// import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DatePicker from 'material-ui-pickers/DatePicker';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import LeftIcon from '@material-ui/icons/ArrowBack';
import RightIcon from '@material-ui/icons/ArrowForward';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
// import Hidden from '@material-ui/core/Hidden';

import withWidth from '@material-ui/core/withWidth';
import compose from 'recompose/compose';

const styles = theme => ({
  date: {
    fontSize: theme.spacing.unit * 2.5,
  },
  dividerMargin: {
    // marginTop: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit,
  },
  hide: {
    position: 'absolute',
    top: -(theme.spacing.unit * 9999),
    left: -(theme.spacing.unit * 9999),
  },
  button: {
    // marginBottom: theme.spacing.unit * 2,
  }
});

class dateSetting extends Component {
  openPicker = () => {
    this.picker.open();
  };

  openPickerEnd = () => {
    this.pickerEnd.open();
  };

  render() {
    const { classes } = this.props;
    return (
      <MuiPickersUtilsProvider 
        utils={MomentUtils}
        moment={moment}
      >
        <Grid 
          container 
          direction={'row'}
          alignItems="center"
          justify="center"
        >
          <Grid item xs={2}>
            <Tooltip 
              title={moment.unix(this.props.event_start_date_unix).format("dddd, MMMM Do YYYY, h:mm:ss a")} 
              id="Start Date"
            >
            <Button 
              className={classes.date} 
              color="primary" 
              size="large"
              onClick={this.openPicker}
            >
              {moment.unix(this.props.event_start_date_unix).format("DD/MM/YYYY")}
            </Button>
          </Tooltip>
          <div className="picker">
            <DatePicker
              rightArrowIcon={<RightIcon />}
              leftArrowIcon={<LeftIcon />}
              className={classes.hide}
              clearable
              ref={(node) => {this.picker = node;}}
              emptyLabel=""
              format="D MMM YYYY"
              value={moment.unix(this.props.event_start_date_unix)}
              onChange={this.props.handleChangeStart}
              maxDate={this.props.maxDate}
              minDate={this.props.minDate}
              mask
            />
          </div>
          </Grid>
            <Grid 
              className={classes.dividerMargin} 
              item 
              xs={7}
            >
              <Divider />
            </Grid>
            <Grid item xs={2}>
              <Tooltip title={moment.unix(this.props.event_end_date_unix).format("dddd, MMMM Do YYYY, h:mm:ss a")} id="End Date">
                <Button 
                  className={classes.date} 
                  color="primary" 
                  size="large"
                  onClick={this.openPickerEnd}
                >
                  {moment.unix(this.props.event_end_date_unix).format("DD/MM/YYYY")}
                </Button>
              </Tooltip>
              <div className="pickerEnd">
                <DatePicker
                  rightArrowIcon={<RightIcon />}
                  leftArrowIcon={<LeftIcon />}
                  className={classes.hide}
                  clearable
                  ref={(node) => {this.pickerEnd = node;}}
                  emptyLabel=""
                  format="D MMM YYYY"
                  value={moment.unix(this.props.event_start_date_unix)}
                  onChange={this.props.handleChangeEnd}
                  maxDate={this.props.maxDate}
                  minDate={this.props.minDate}
                  mask
                />
              </div>
            </Grid>
            <Grid 
              className={classes.dividerMargin} 
              item 
              xs={1}
            >
              <Tooltip title={'Enter date'} id='EnterDate'>
                <IconButton onClick={this.props.fetchStatsHandler} className={classes.button} aria-label="Forward">
                  <RightIcon />
                </IconButton>
              </Tooltip>
            </Grid>
        </Grid>
      </MuiPickersUtilsProvider>
    );
  }
};

export default compose(
  withStyles(styles),
  withWidth(),
)(dateSetting);
