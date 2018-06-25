import { SET_MODULES, SET_LOADER, SET_INDMOD } from '../actions/actionTypesNetwork';

const initialState = {
    modules: [],
    individualModule: [],
    loader: true
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_MODULES: 
            return {
                ...state,
                modules: action.module
            };
        case SET_LOADER:
            return {
                ...state,
                loader: action.loader
            };
        case SET_INDMOD:
            return {
                ...state,
                individualModule: state.individualModule.concat({
                    module_name: action.module_name,
                    module_data: action.module
                })
            };
        default: 
            return state;
    }
};

export default reducer;
