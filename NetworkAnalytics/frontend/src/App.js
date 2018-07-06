import React, { Component } from 'react';
import { withRR4, Nav, NavText, NavIcon } from 'react-sidenav';

import { ic_business } from 'react-icons-kit/md/ic_business';
import {ic_file_upload} from 'react-icons-kit/md/ic_file_upload';
import {user} from 'react-icons-kit/fa/user'
import Divider from '@material-ui/core/Divider';
// import Typography from '@material-ui/core/Typography';
// import Tabs from '@material-ui/core/Tabs';
// import Tab from '@material-ui/core/Tab';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import { connect } from 'react-redux';

import AppBar from './components/AppBar/AppBar';
import UploadData from './containers/UploadData/UploadData';
import Dashboard from './containers/Dashboard/Dashboard';

import styled from 'styled-components';
import SvgIcon from 'react-icons-kit';

import { getModules } from './store/actions/index';

const SideNav = withRR4();

const Icon20 = props => <SvgIcon size={props.size || 20} icon={props.icon} />;

const Div = styled.div`
    height: 100%;
`;

const MainDiv = styled.div`
    border: 1px solid red;
    height: 100%;
    display: flex;
    display: -webkit-flex;
    -webkit-flex-direction: row; /* Safari */
    flex-direction:         row;
`;

const SideNavDiv = styled.div`
    // border-right: 1px solid #aeaeae;
    width: 23%;
    box-shadow: 10px 0 5px -9px #aeaeae;
`;

const RoutedDiv = styled.div`
    width: 100%;
    padding: 20;
    background-color: #f4f4f4;
`;

const Title = styled.div`
    padding-left: 15px
    padding-top: 22.5px;
    padding-bottom: 22.5px;
`;

const StdDiv = styled.div`
    width: 100%;
`;

const NavTextStyle = styled.div`
    padding: 16px;
`;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
        }
    }

    handleChange = (event, value) => {
        this.setState({ value });
    };

    componentDidMount() {
        // check to see if there are any modules already present
        this.props.getModules(this.props.individualModule);
    };

    render() {
        return (
            <Router>
                <Div>
                    <MainDiv>
                        <SideNavDiv>
                            <SideNav default='dashboard' highlightBgColor="#eee" highlightColor="#E91E63">
                                <Title> MAIN </Title>
                                <Divider />
                                <Nav id='dashboard'>
                                    <NavIcon><Icon20 size={16} icon={ic_business} /></NavIcon>
                                    <NavText><NavTextStyle>  Dashboard</NavTextStyle> </NavText>
                                </Nav>
                                <Divider inset/>
                                <Nav id='uploadData'>
                                    <NavIcon><Icon20 size={16} icon={ic_file_upload} /></NavIcon>
                                    <NavText><NavTextStyle>  Upload Data</NavTextStyle> </NavText>
                                </Nav>
                                <Nav>
                                    <NavIcon>
                                        <Icon20 size={16} icon={user}/>
                                        <a href="#"><span>Admin</span></a>
                                    </NavIcon>
                                </Nav>
                            </SideNav>
                        </SideNavDiv>
                        <StdDiv>
                            <AppBar />
                            <RoutedDiv>
                                <Route exact path="/(|dashboard)/" component={Dashboard}/>
                                <Route path="/uploadData/" component={UploadData}/>
                            </RoutedDiv>
                        </StdDiv>
                        
                    </MainDiv>
                </Div>
            </Router>
        );
    }
}

// #4077f2

const mapStateToProps = state => {
    return {
        loader: state.network.loader,
        modules: state.network.modules,
        individualModule: state.network.individualModule,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getModules: (individualModule) => dispatch(getModules(individualModule))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)( App );


