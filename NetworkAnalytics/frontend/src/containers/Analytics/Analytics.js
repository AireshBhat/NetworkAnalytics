import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';

import { connect } from 'react-redux';

import { deviceAnalytics } from '../../store/actions/index';

class analytics extends Component {
  constructor (props) {
    super(props);
    this.state = {
      modules: this.props.modules,
    };
  };
  
  render () {
    return (
      <div>
        <Typography noWrap>{'Analytics'}</Typography>
      </div>
    );
  };
};

const mapStateToProps = state => {
  return {
    modules: state.network.modules,
  };
};

export default connect(mapStateToProps, null)( analytics );

