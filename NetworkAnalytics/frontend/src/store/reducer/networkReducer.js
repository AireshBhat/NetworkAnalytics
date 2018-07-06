import { SET_MODULES, SET_LOADER, SET_INDMOD, MOD_EXIST } from '../actions/actionTypesNetwork';

const initialState = {
    modules: [],
    individualModule: [],
    loader: true,
    moduleExist: false,
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
        case MOD_EXIST:
            return {
                ...state,
                moduleExist: action.val,
            };
        default: 
            return state;
    }
};

export default reducer;
