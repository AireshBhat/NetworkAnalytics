import React, { Component } from 'react';
import { render } from 'react-dom';
import { withRR4, Nav, NavText, NavIcon } from 'react-sidenav';

import { ic_business } from 'react-icons-kit/md/ic_business';
import {ic_file_upload} from 'react-icons-kit/md/ic_file_upload';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import AppBar from './components/AppBar/AppBar';
import UploadData from './containers/UploadData/UploadData';

import styled from 'styled-components';
import SvgIcon from 'react-icons-kit';

const Icon20 = props => <SvgIcon size={props.size || 20} icon={props.icon} />;

const SideNav = withRR4();

const MainDiv = styled.div`
    width: 100%;
`;

const SideNavDiv = styled.div`
    display: flex;
    display: -webkit-flex;
    -webkit-flex-direction: row; /* Safari */
    flex-direction:         row;
`;

const RoutedDiv = styled.div`
    width: 84%;
    padding: 20;
`;

const Title = styled.div`
    padding: 12px;
    padding-top: 20px;
    padding-bottom: 20px;
`;

class Sales extends React.Component {

    componentWillUnmount() {
        console.log('Sales Will Unmount');
    }

    render() {
        return (
            <div>Sales</div>
        );
    }
}

class App extends Component {
    constructor(props) {
        super(props);
    }

    renderDashboard = () => {
        return <div>Dashboard</div>;
    }

    renderSales = () => {
        return <Sales />;
    }

    renderProducts = () => {
        return <div>Products</div>;
    }

  render() {
    return (
        <Router>
            <MainDiv>
                <AppBar />
                <SideNavDiv>
                    <div style={{width: '16%'}}>
                        <SideNav default='dashboard' highlightBgColor='blue' highlightColor='white'>
                            <Title> Basic SideNav </Title>
                            <Nav id='dashboard'>
                                <NavIcon><Icon20 size={16} icon={ic_business} /></NavIcon>
                                <NavText>  Dashboard </NavText>
                            </Nav>
                            <Nav id='uploadData'>
                                <NavIcon><Icon20 size={16} icon={ic_file_upload} /></NavIcon>
                                <NavText>  Upload Data </NavText>
                            </Nav>
                        </SideNav>
                    </div>
                    <RoutedDiv>
                        <Route exact path="/(|dashboard)/" render={this.renderDashboard}/>
                        <Route path="/uploadData" component={UploadData}/>
                    </RoutedDiv>
                </SideNavDiv>
            </MainDiv>
        </Router>
    );
  }
}

export default App;
