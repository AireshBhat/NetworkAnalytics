import React, { Component } from 'react';

import { connect } from 'react-redux';

import CircularProgress from '@material-ui/core/CircularProgress';
import purple from '@material-ui/core/colors/purple';

import { getModules } from '../../store/actions/index';

import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import './Dashboard.css';

const Dashboard = styled.div`
    // border: 1px solid #222222;
    width: 100%;
    height: 100%;
`;

const OutlinedButton = styled.div`
    margin: 10px;
`;

class dashboard extends Component {
    // componentDidMount () {
    //     console.log("this is the dashboard");
    //     this.props.getModules();
    // };

    render() {
        const moduleNames = this.props.modules.map((item) => {
            return (
                <OutlinedButton key={item.device_name}>
                    <Button className="buttonStyle" variant="outlined">{item.device_name}</Button>
                </OutlinedButton>
                // <Button variant="outlined">item.device_name</Button>
            );
        });
        if(this.props.loader){
            return (
                <CircularProgress style={{ color: purple[500] }} size={50} />
            );
        }
        return (
            <Dashboard>
                {moduleNames}
            </Dashboard>
        );
    };
};

const mapStateToProps = state => {
    return {
        loader: state.network.loader,
        modules: state.network.modules,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getModules: () => dispatch(getModules())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)( dashboard );
