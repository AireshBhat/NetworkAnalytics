import { ADD_INDDATA, REM_INDDATA } from './actionTypesAnalytics';

export const addIndData = data => {
    return {
        type: ADD_INDDATA,
        data: data,
    };
};

export const remIndData = data => {
    return {
        type: REM_INDDATA,
        data: data,
    };
};
