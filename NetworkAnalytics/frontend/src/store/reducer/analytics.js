import { ADD_INDDATA, REM_INDDATA } from '../actions/actionTypesAnalytics';

const initState = {
    moduleData: [],
    manData: [],
};

const reducer = (state = initState, action) => {
    switch(action.type){
        case ADD_INDDATA:
            return {
                ...state,
                moduleData: state.moduleData.concat(action.data),
            };
        case REM_INDDATA:
            return {
                ...state,
                moduleData: state.moduleData.filter(item => {
                    return item.device_name !== action.data.device_name
                }),
            };
        default:
            return {
                ...state,
            };
    }
};

export default reducer;
