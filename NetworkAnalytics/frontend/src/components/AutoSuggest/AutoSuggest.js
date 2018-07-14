import React, { Component } from 'react';

import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import SearchIcon from '@material-ui/icons/Search';

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    width: 250,
    zIndex: theme.zIndex.appBar + 100,
    marginTop: theme.spacing.unit,
    top: theme.spacing.unit * 3,
    right: 0,
  },
  suggestion: {
    color: 'white',
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    color: 'white',
  },
  textField: {
    color: 'white',
  },
  cssLabel: {
    '&$cssFocused': {
      color: 'white',
    },
  },
  cssFocused: {
  },
  margin: {
    margin: theme.spacing.unit,
  },
});

class autoSuggest extends Component {
  constructor() {
    super();

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: '',
      suggestions: []
    };
  }

  renderInput = (inputProps) => {
    const { classes, ref, ...other } = inputProps;

    return (
      <TextField
        fullWidth
        className={classes.textField}
        InputProps={{
          inputRef: ref,
          classes: {
            input: classes.input,
          },
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          ...other,
        }}
      />
    );
  }

  // Teach Autosuggest how to calculate suggestions for any given input value.
  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : this.props.modules.filter(item => {
      // return item.device_name.toLowerCase().slice(0, inputLength) === inputValue;
      let probSugName = item.device_name.toLowerCase().slice(0, inputLength);
      let probSugReg = item.device_region.toLowerCase().slice(0, inputLength);
      let probSugIsp = item.device_isp.toLowerCase().slice(0, inputLength);
      if(probSugName === inputValue || probSugReg === inputValue || probSugIsp === inputValue) {
        return true;
      }
      return false;
    }
    );
  };

  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  getSuggestionValue = suggestion => suggestion.device_name;

  // Use your imagination to render suggestions.
  renderSuggestion = ( suggestion, { query, isHighlighted } ) => {
    const matches = match(suggestion.device_name, query);
    const parts = parse(suggestion.device_name, matches);

    return (
      <div>
        <MenuItem selected={isHighlighted} component="div">
          <div>
            <Typography variant='subheading'>
              {parts.map((part, index) => {
                return part.highlight ? (
                  <span key={String(index)} style={{ fontWeight: 500 }}>
                    {part.text}
                  </span>
                ) : (
                  <strong key={String(index)} style={{ fontWeight: 300 }}>
                    {part.text}
                  </strong>
                );
              })}
            </Typography>
              <Grid container spacing={24} justify='space-around' direction='row' alignItems='center'>
                <Grid item >
                  <Typography variant='body2'>
                    {suggestion.device_region}
                  </Typography>
                </Grid>
              <Grid item >
                <Typography variant='body2'>
                  {suggestion.device_isp}
                </Typography>
              </Grid>
            </Grid>
          </div>
        </MenuItem>
        <Divider />
      </div>
    );
  };

  renderSuggestionsContainer = (options) => {
    const { containerProps, children } = options;

    return (
      <Paper {...containerProps} square>
        {children}
      </Paper>
    );
  }

  handleChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected = (event, data) => {
    // console.log('data', data);
    // console.log('props', this.props);
    this.props.history.push('/dashboard/' + data.suggestionValue);
  };

  render() {
    const { classes } = this.props;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      classes,
      placeholder: 'Device Name',
      value: this.state.value,
      onChange: this.handleChange
    };

    // Finally, render it!
    return (
      <Autosuggest
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderInputComponent={this.renderInput}
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        renderSuggestionsContainer={this.renderSuggestionsContainer}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
        onSuggestionSelected={this.onSuggestionSelected}
      />
    );
  }
};

const mapStateToProps = state => {
  return {
    modules: state.network.modules,
  };
};

export default connect(mapStateToProps, null)( withRouter(withStyles(styles)(autoSuggest)) );
