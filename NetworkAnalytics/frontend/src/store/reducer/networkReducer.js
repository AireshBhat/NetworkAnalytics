import { SET_MODULES, SET_LOADER, SET_INDMOD, MOD_EXIST, DEL_MODULE, SET_STATS, SET_COUNT, SET_ERROR, SET_LOGIN } from '../actions/actionTypesNetwork';

const initialState = {
    modules: [],
    individualModule: [],
    loader: true,
    moduleExist: false,
    err: false,
    errMessage: '',
    token: false
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
                    device_name: action.module_name,
                    device_data: action.module
                })
            };
        case MOD_EXIST:
            return {
                ...state,
                moduleExist: action.val,
            };
        case DEL_MODULE:
            const modules = state.modules.filter(item => {
                return action.module !== item.device_name;
            });
            const individualModule = state.individualModule.filter(item => {
                return action.module !== item.device_name;
            });
            return {
                ...state,
                modules: modules,
                individualModule: individualModule,
            };
        case SET_STATS:
            const individualModules = state.individualModule.map(item => {
                if(action.data.device_name === item.device_name){
                    return {
                        ...item,
                        event_start_date: action.data.start_date,
                        event_end_date: action.data.end_date,
                        average_down_time: action.res.average_down_time,
                        average_up_time: action.res.average_up_time,
                        average_packet_loss: action.res.packet_loss_average,
                        ud_down_end_time: action.res.down_end_time,
                        ud_down_start_time: action.res.down_start_time,
                        down_time_count: action.res.down_time_count,
                        rta_count: action.res.rta_counter,
                        rta_end_time: action.res.rta_end_time,
                        rta_start_time: action.res.rta_start_time,
                    }
                }
                return {
                    ...item,
                };
            });
            return {
                ...state,
                individualModule: individualModules,
            };
        case SET_COUNT:
            const individualMod = state.individualModule.map(item => {
                if(action.device_name === item.device_name){
                    return {
                        ...item,
                        down_time_count_array: action.data.downTimeCount,
                        rta_count_array: action.data.rtaCount,
                    };
                }
                return {...item};
            });
            return {
                ...state,
                individualModule: individualMod,
            };
        case SET_ERROR:
            return {
                ...state,
                err: action.err,
                errMessage: action.errMessage,
            };
        case SET_LOGIN:
            return {
                ...state,
                token: action.token,
            };
        default: 
            return state;
    }
};

export default reducer;
