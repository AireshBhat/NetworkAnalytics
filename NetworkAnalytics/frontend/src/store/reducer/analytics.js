import { ADD_INDDATA, REM_INDDATA } from '../actions/actionTypesAnalytics';
import { SET_COUNTANAL } from '../actions/actionTypesNetwork';

const initState = {
    moduleData: [],
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
        case SET_COUNTANAL: 
            const module = state.moduleData.map(item => {
                if(item.device_name === action.device_name){
                    return {
                        ...item,
                        down_time_count_array: action.data.downTimeCount,
                        rta_count_array: action.data.rtaCount,
                    };
                }
                return {
                    ...item,
                };
            })
            return {
                ...state,
                moduleData: module,
            };
        default:
            return {
                ...state,
            };
    }
};

export default reducer;
