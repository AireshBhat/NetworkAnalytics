import React, { Component } from 'react';

// import Typography from '@material-ui/core/Typography';
// import Tabs from '@material-ui/core/Tabs';
// import Tab from '@material-ui/core/Tab';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

import { Route, Link, withRouter, Switch } from 'react-router-dom';

import Statistics from '../Statistics/Statistics';


import { connect } from 'react-redux';
import { getModules } from '../../store/actions/index';

const styles = theme => ({
  progress: {
      margin: theme.spacing.unit * 2,
    }
});

class dashboard extends Component {
  constructor (props) {
    super(props);
    this.state = {
      value: 0,
    };
  };

  handleChange = (event, value) => {
    this.setState({value});
  };

  renderLink = itemProps => <Link to={this.itemProps.to} />;

  render () {
    const { classes } = this.props;
    const statModules = this.props.individualModule.map((item, index) => {
      return (
        <Route 
          key={item.module_name} 
          path={ `/dashboard/` + item.module_name} 
          render={() => <Statistics 
            id={item.module_name}
            data={item.module_data}
          /> 
          } 
          sensitive={true}
        />
      );
    });

    if(this.props.loader){
      return <CircularProgress className={classes.progress} size={50} />;
    }
    return (
      <div>
          <Switch>
            {statModules}
          </Switch>
      </div>
    );
  };
};

const mapStateToProps = state => {
  return {
    loader: state.network.loader,
    modules: state.network.modules,
    individualModule: state.network.individualModule,
    curModule: state.individual.curModule,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getModules: () => dispatch(getModules())
  };
};

export default withRouter( connect(mapStateToProps, mapDispatchToProps)( withStyles(styles)(dashboard)) );
