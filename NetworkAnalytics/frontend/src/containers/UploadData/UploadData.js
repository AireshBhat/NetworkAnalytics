import React, { Component } from 'react';

import { connect } from 'react-redux';

import Dropzone from 'react-dropzone';
import styled from 'styled-components';

import './UploadData.css';

import axios from 'axios';

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

class uploadData extends Component {
    constructor(props) {
        super(props);
        this.state={
            files: []
        };
    };

    ComponentDidMount () {
        axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios.defaults.xsrfCookieName = "csrftoken";
    }

    onDrop = (files) => {
        this.setState({
            files
        });

        // Create a new FormData object.
        var formData = new FormData();
        formData.append('uploaded_file', files[0], files[0].name);

        // This request uploads the file to the server
        this.props.uploadModule(formData);
    };

    render() {
        return (
            <MainDiv>
                <UploadDiv className="dropzone">
                    <Dropzone className="drop" onDrop={(files) => this.onDrop(files)}>
                        <p>Try dropping some files here, or click to select files to upload.</p>
                    </Dropzone>
                </UploadDiv>
                <aside>
                    <h2>Dropped files</h2>
                    <ul>
                        {
                            this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
                        }
                    </ul>
                </aside>
            </MainDiv>
        );
    }
};

const mapStateToProps = state => {
    return {
        models: state.network.models,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        uploadModule: (formData) => dispatch(uploadModule(formData)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)( uploadData );
