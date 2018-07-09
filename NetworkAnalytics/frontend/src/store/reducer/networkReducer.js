import { SET_MODULES, SET_LOADER, SET_INDMOD, MOD_EXIST, DEL_MODULE, SET_STATS } from '../actions/actionTypesNetwork';

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
        default: 
            return state;
    }
};

export default reducer;
