import React, { Component } from 'react';

import Dropzone from 'react-dropzone';

import styled from 'styled-components';
import './UploadData.css';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import { uploadModule } from '../../store/actions/index';

const MainDiv = styled.div`
  width: 100%;
  height: 100%;
  display: -webkit-flex;
  display: flex;
  height: 400px;
  -webkit-flex-direction: column;
  flex-direction:         column;
  -webkit-justify-content: center;
  justify-content:         center;
  -webkit-justify-content: center;
  justify-content:         center;
`;

const UploadDiv = styled.div`
  height: 100%;
  width: 97%;
  margin: 10px;
`;

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit,
  }
});

class uploadData extends Component {
  constructor(props) {
    super(props);
    console.log("upload Data props");
    console.log(this.props);
    this.state={
      files: []
    };
  };

  onDrop = (files) => {
    let res = files[0].name.split('_');
    if(true)
    {
      this.setState({
        files
      });

      // Create a new FormData object.
      var formData = new FormData();
      formData.append('uploaded_file', files[0], files[0].name);

      // This request uploads the file to the server
      this.props.uploadModule(formData, this.props.indMod, (path) => this.props.history.push(path), '/dashboard/' + res[0]);
    }
    else {
      this.props.history.push('/dashboard/' + res[0]);
    }
  };

  render () {
    const { classes } = this.props;
    if(this.props.loader && !this.props.err){
      return <CircularProgress className={classes.progress} size={50} />;
    }
    return (
      <div>
          <Typography variant="display3" gutterBottom >
            Upload Data
          </Typography>
          <Divider />
          <MainDiv>
            <UploadDiv className="dropzone">
              <Dropzone className="drop" onDrop={(files) => this.onDrop(files)}>
                <Typography variant="title">Try dropping some files here, or click to select files to upload.</Typography>
              </Dropzone>
            </UploadDiv>
          </MainDiv>
      </div>
    );
  };
};

const mapStateToProps = state => {
  return {
    modules: state.network.modules,
    indMod: state.network.individualModule,
    loader: state.network.loader,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    uploadModule: (formData, indMod, push, path) => dispatch(uploadModule(formData, indMod, push, path)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)( withRouter (withStyles(styles)(uploadData)) );
