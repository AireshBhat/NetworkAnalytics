import React, { Component } from 'react';

import { connect } from 'react-redux';

import CircularProgress from '@material-ui/core/CircularProgress';
import purple from '@material-ui/core/colors/purple';
// import TouchRipple from '@material-ui/internal/TouchRipple';

import { getModules } from '../../store/actions/index';

import styled from 'styled-components';
// import Button from '@material-ui/core/Button';
// import Card from '@material-ui/core/Card';
import './Dashboard.css';

import Statistics from '../Statistics/Statistics';
// import LineChart from '../../components/LineChart/LineChart';
// import AreaChart from '../../components/AreaChart/AreaChart';

const Dashboard = styled.div`
    // border: 1px solid #222222;
    width: 100%;
    height: 100%;
`;

const OutlinedButton = styled.div`
    margin: 0;
    padding: 0;
    display: -webkit-flex; /* Safari */
    display: flex;
    -webkit-flex-direction: row; /* Safari */
    flex-direction:         row;
    -webkit-justify-content: center; /* Safari */
    justify-content:         center;
    -webkit-align-items: center; /* Safari */
    align-items:         center;
`;

const ModuleNames = styled.div`
    width: 100%;
    // border: 1px solid black;
    display: -webkit-flex; /* Safari */
    display: flex;
    -webkit-flex-direction: row; /* Safari */
    flex-direction:         row;
    -webkit-justify-content: center; /* Safari */
    justify-content:         center;
    -webkit-align-items: center; /* Safari */
    align-items:         center;
    // background-color: #f4f4f4;
    z-index: -1000;
`;

const Tabs = styled.div`
    width: 80%;
    // border: 1px solid grey;
`;

// const NewButton = styled.Button`
//     height: 100%;
// `;

const CustomButton = styled.button`
    width: auto;
    padding: 10px;
    height: 100%;
    font-size: 1em;
    text-decoration: none;
    display: inline-block;
    border-right: 1px solid #ababab;
    border-left: 1px solid #ababab;
    border-bottom: 1px solid #ababab;
    border-bottom-right-radius: 10px 10px;
    border-bottom-left-radius: 10px 10px;
    -webkit-box-shadow: 0 8px 6px -6px black;
    -moz-box-shadow: 0 8px 6px -6px black;
    box-shadow: 0 8px 6px -6px #aaaaaa;
    cursor: pointer;
    outline:none;
`;

const AnalysisGraphs = styled.div`
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: row;
    flex-direction:         row;
    -webkit-flex-wrap: wrap; /* Safari */
    flex-wrap:         wrap;
`;

const GraphDiv = styled.div`
    margin: 15px;
    box-shadow: 0 0 20px #dddddd;
    width: 40%;
    height: 40%;
`;

class dashboard extends Component {
    // componentDidMount () {
    //     console.log("this is the dashboard");
    //     this.props.getModules();
    // };

    buttonHandler = () => {
        console.log("I was clicked");
    };

    render() {
        const moduleNames = this.props.modules.map((item) => {
            return (
                <OutlinedButton key={item.device_name}>
                    <CustomButton onClick={this.buttonHandler}>
                        {item.device_name}
                    </CustomButton>
                </OutlinedButton>
            );
        });
        const graphStats = this.props.modules.map((item) => {
            const device_data = this.props.individualModule.map((device) => {
                if(item.device_name === device.module_name){
                    return device.module_data;
                }
                return "Device not found";
            });
            return (
                <Statistics 
                    device={item}
                    device_data={device_data}
                    key={item.device_name}
                />
            );
        });
        if(this.props.loader){
            return (
                <CircularProgress style={{ color: purple[500] }} size={50} />
            );
        }
        return (
            <Dashboard>
                <ModuleNames>
                    <Tabs>
                        {moduleNames}
                    </Tabs>
                </ModuleNames>
                <AnalysisGraphs>
                    {graphStats}
                </AnalysisGraphs>
            </Dashboard>
        );
    };
};

const mapStateToProps = state => {
    return {
        loader: state.network.loader,
        modules: state.network.modules,
        individualModule: state.network.individualModule,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getModules: () => dispatch(getModules())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)( dashboard );

                    // <GraphDiv>
                    //     <LineChart />
                    // </GraphDiv>
                    // <GraphDiv>
                    //     <AreaChart />
                    // </GraphDiv>
 // <Button className="buttonStyle" variant="outlined">{item.device_name}</Button>
