import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';

import { Route} from 'react-router-dom';

import AppBar from './components/AppBar/AppBar';
import Drawer from './components/Drawer/Drawer';
import Link from './components/Link/Link';
import Dashboard from './containers/Dashboard/Dashboard';
import Analytics from './containers/Analytics/Analytics';
import UploadData from './containers/UploadData/UploadData';
// import Typography from '@material-ui/core/Typography';

import DashboardIcon from '@material-ui/icons/Dashboard';
import ChartIcon from '@material-ui/icons/InsertChart';
import UploadDataIcon from '@material-ui/icons/CloudUpload';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ShowChartIcon from '@material-ui/icons/ShowChart';

import { connect } from 'react-redux';
import { getModules } from './store/actions/index';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 'auto',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0, // So the Typography noWrap works
  },
  toolbar: theme.mixins.toolbar,
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
});

class App extends Component {
  constructor(props) {
        super(props);
        this.state = {
          value: 0,
          modulesExist: false,
        }
    }

  handleChange = (event, value) => {
      this.setState({ value });
  };

  onMouseOverHandler = () => {
    console.log("hello");
  };

  componentDidMount() {
      // check to see if there are any modules already present
    if(this.props.modules !== []){
      this.props.getModules(this.props.individualModule);
    }
  };

  render() {
    const { classes } = this.props;
    const modules = this.props.modules.map((item) => {
      return (
        <Link 
          key={item.device_name} 
          to={`/dashboard/` + item.device_name}
          primary={item.device_name} 
          secondary={item.device_region}
          icon={<ShowChartIcon />} 
          className="classes.nested" 
          id={item.device_name}
        />
      );
    });

    return (
      <div className={classes.root}>
        <AppBar />
        <Drawer>
          {this.props.moduleExist ? 
              <Link 
            to="/dashboard/" 
            primary="Dashboard" 
            icon={<DashboardIcon />} 
            collapsible={
              {
                expandLess: <ExpandLess />,
                expandMore: <ExpandMore />,
              }}
            >
              {modules}
              </Link> : 
              <Link 
            to="/dashboard/"
            primary="Dashboard" 
            icon={<DashboardIcon />} 
          />
          }
      <Link to="/analytics/" primary="Analytics" icon={<ChartIcon />}/>
      <Link to="/uploadData/" primary="Upload Data" icon={<UploadDataIcon />}/>
    </Drawer>
    <main className={classes.content}>
      <div className={classes.toolbar} />
        <Route path="/dashboard/" component={Dashboard} />
        <Route path="/analytics/" component={Analytics} />
        <Route path="/uploadData/" component={UploadData} />
    </main>
  </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loader: state.network.loader,
    modules: state.network.modules,
    individualModule: state.network.individualModule,
    moduleExist: state.network.moduleExist,
  };
};

const mapDispatchToProps = dispatch => {
    return {
        getModules: (individualModule) => dispatch(getModules(individualModule))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)( withStyles(styles)(App));
// export default withStyles(styles)(App);
