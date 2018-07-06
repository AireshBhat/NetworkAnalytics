import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  }
});

class link extends Component{
  state = {open: true};

  renderLink = itemProps => <Link to={this.props.to} {...itemProps}/>;

  handleClick = collapsible => {
    if(collapsible){
      this.setState(prevState => {
        return {
          open: !prevState.open
        };
      });
    }
  };

  onMouseOverHandler = () => {
    
  };

  render() {
    const { icon, primary } = this.props;
    const { classes } = this.props;
    return (
      <span>
        <ListItem 
          button 
          component={this.renderLink} 
          onClick={() => this.handleClick(this.props.collapsible)} 
          className={this.props.id && classes.nested}
          onMouseOver={this.props.id && this.onMouseOverHandler}
          divider={true && !this.props.id}
        >
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText inset primary={primary}/>
          {this.props.collapsible && (this.state.open ? this.props.collapsible.expandLess: this.props.collapsible.expandMore)}
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

                // <ListItem button className={classes.nested}>
                //   <ListItemText inset primary="Starred" />
                // </ListItem>

