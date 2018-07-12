import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';

const styles = theme => ({
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  }
});

class link extends Component{
  state = {open: true};

  renderLink = itemProps => <Link to={this.props.to} {...itemProps}/>;

  closeHandler = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        open: false,
      };
      }
    );
  };

  openHandler = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        open: true,
      };
      }
    );
  };  

  render() {
    const { icon, primary, secondary } = this.props;
    const { classes } = this.props;
    return (
      <span>
        <ListItem 
          button 
          component={this.renderLink} 
          className={this.props.id && classes.nested}
          onMouseOver={this.props.id && this.onMouseOverHandler}
          divider={true && !this.props.id}
        >
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText inset primary={primary} secondary={secondary}/>
          {this.props.collapsible && (this.state.open ? 
            <IconButton onClick={this.closeHandler} aria-label="ExpandLess">
              <ExpandLess />
            </IconButton>
            : 
            <IconButton onClick={this.openHandler} aria-label="ExpandMore">
              <ExpandMore />
            </IconButton>
            )}
      </ListItem>
      {
        this.props.collapsible &&
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {this.props.children}
          </List>
        </Collapse>
      }
      </span>
    );
  };
};

export default withStyles(styles)(link);
