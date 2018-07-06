import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import Tab from '@material-ui/core/Tab';

class statLink extends Component {
  renderLink = itemProps => <Link to={this.props.to} {...itemProps}/>;

  render() {
    return (
      <Tab label={this.props.label} component={this.renderLink}></Tab>
    );
  };
};

export default statLink;
