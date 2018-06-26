import React, { Component } from 'react';
import { withRR4, Nav, NavText, NavIcon } from 'react-sidenav';

import { ic_business } from 'react-icons-kit/md/ic_business';
import {ic_file_upload} from 'react-icons-kit/md/ic_file_upload';
import Divider from '@material-ui/core/Divider';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import { connect } from 'react-redux';

import AppBar from './components/AppBar/AppBar';
import UploadData from './containers/UploadData/UploadData';
import Dashboard from './containers/Dashboard/Dashboard';

import styled from 'styled-components';
import SvgIcon from 'react-icons-kit';

import { getModules } from './store/actions/index';

const Icon20 = props => <SvgIcon size={props.size || 20} icon={props.icon} />;

const SideNav = withRR4();

const Div = styled.div`
`;

const MainDiv = styled.div`
    height: 100%;
    display: flex;
    display: -webkit-flex;
    -webkit-flex-direction: row; /* Safari */
    flex-direction:         row;
`;

const SideNavDiv = styled.div`
    // border-right: 1px solid #aeaeae;
    width: 16%;
    height: 1000px;
    box-shadow: 10px 0 5px -5px #aeaeae;
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

const NavTextStyle = styled.div`
    padding: 16px;
`;

class App extends Component {
    // constructor(props) {
    //     super(props);
    // }

    componentDidMount() {
        // check to see if there are any modules already present
        console.log("I am being executed");
        this.props.getModules();
    };

  render() {
    return (
        <Router>
            <Div>
                <AppBar color="secondary"/>
                <MainDiv>
                    <SideNavDiv>
                        <SideNav default='dashboard' highlightBgColor="#eee" highlightColor="#E91E63">
                            <Title> Basic SideNav </Title>
                            <Divider />
                            <Nav id='dashboard'>
                                <NavIcon><Icon20 size={16} icon={ic_business} /></NavIcon>
                                <NavText><NavTextStyle>  Dashboard</NavTextStyle> </NavText>
                            </Nav>
                            <Nav id='uploadData'>
                                <NavIcon><Icon20 size={16} icon={ic_file_upload} /></NavIcon>
                                <NavText><NavTextStyle>  Upload Data</NavTextStyle> </NavText>
                            </Nav>
                        </SideNav>
                    </SideNavDiv>
                    <RoutedDiv>
                        <Route exact path="/(|dashboard)/" component={Dashboard}/>
                        <Route path="/uploadData/" component={UploadData}/>
                    </RoutedDiv>
                </MainDiv>
            </Div>
        </Router>
    );
  }
}

// const mapStateToProps = state => {
//     return 
// };

const mapDispatchToProps = dispatch => {
    return {
        getModules: () => dispatch(getModules())
    };
};

export default connect(null, mapDispatchToProps)( App );
