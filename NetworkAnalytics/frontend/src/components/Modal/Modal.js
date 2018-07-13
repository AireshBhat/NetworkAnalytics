import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import { connect } from 'react-redux';

import { setError, getModules } from '../../store/actions/index';

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    margin: theme.spacing.unit * 20,
  },
});

class modal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      err: this.props.err,
      errMessage: this.props.errMessage,
    };
  };

  handleClose = () => {
    this.setState({ err: false });
    this.props.setError(false, '');
    this.props.getModules(this.props.individualModule);
  };

  render() {
    return (
      <Dialog
        open={this.state.err}
        onClose={this.handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <DialogTitle>
          Error
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.props.errMessage}
            </DialogContentText>
          </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary" autoFocus>
            Retry
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
};

const mapStateToProps = state => {
  return {
    err: state.network.err,
    errMessage: state.network.errMessage,
    individualModule: state.network.individualModule,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setError: (err, errMessage) => dispatch(setError(err, errMessage)),
    getModules: (indMod) => dispatch(getModules(indMod)),
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(modal));
