import { ADD_INDDATA, REM_INDDATA, UPDATE_STATS } from '../actions/actionTypesAnalytics';
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
                        total_time_ud: action.data.totalTimeDurationUD,
                        total_time_rta: action.data.totalTimeDurationRTA,
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
        case UPDATE_STATS: 
            const updatedModule = state.moduleData.map(item => {
                if(item.device_name === action.device_name){
                    return {
                        ...item,
                        average_up_time: action.data.average_up_time,
                        average_down_time: action.data.average_down_time,
                        average_packet_loss: action.data.packet_loss_average,
                    };
                }
                return {
                    ...item,
                };
            })
            return {
                ...state,
                moduleData: updatedModule,
            };
        default:
            return {
                ...state,
            };
    }
};

export default reducer;
