import { ADD_MODULE } from '../actions/actionTypesIndividual';

const initState = {
  curModule: [],
  loader: false,
};

const reducer = (state = initState, action) => {
  switch(action.type){
    case ADD_MODULE:
      return {
        ...state,
        curModule: action.module,
      };
    default:
      return {
        ...state
      };
  }
};

export default reducer;
