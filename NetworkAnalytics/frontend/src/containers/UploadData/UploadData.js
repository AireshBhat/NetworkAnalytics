import React, { Component } from 'react';

import Dropzone from 'react-dropzone';
import styled from 'styled-components';

import './UploadData.css';

import axios from 'axios';


const MainDiv = styled.div`
    width: 100%;
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
        console.log("Files");
        console.log(files);

        console.log("FIles[0]");
        console.log(files[0]);

        // Create a new FormData object.
        var formData = new FormData();
        formData.append('uploaded_file', files[0], files[0].name);

        console.log("Form Data");
        console.log(formData);

        axios({
            method: 'post',
            url: '/uploadData/',
            data: formData,
            baseURL: 'http://127.0.0.1:8000/'
        })
            .catch(err => {
                console.log("Error");
                console.log(err);
            })
            .then((res) => {
                console.log(res);
                if(res === undefined){
                    throw Error;
                }
                return res.json();
            })
            .then(parsedRes => {
                console.log("This is the parsed Res");
                console.log(parsedRes);
            })
            .catch(err => {
                Promise.resolve(err);
            })
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

export default uploadData;
