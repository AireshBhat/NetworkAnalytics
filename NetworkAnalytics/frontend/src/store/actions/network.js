import { SET_MODULES, SET_LOADER, SET_INDMOD } from './actionTypesNetwork';

import axios from 'axios';

export const setModules = (modules) => {
    return {
        type: SET_MODULES,
        module: modules
    };
};

export const setLoader = (loader) => {
    return {
        type: SET_LOADER,
        loader: loader
    };
};

export const setIndMod = (module, module_name) => {
    return {
        type: SET_INDMOD,
        module: module,
        module_name: module_name
    };
};

export const uploadModule = (formData) => {
    return dispatch => {
        axios({
            method: 'post',
            url: '/uploadData/',
            data: formData,
            baseURL: 'http://127.0.0.1:8000/'
        })
            .catch(err => {
                console.log("Error");
                console.log(err);
            })
            .then((res) => {
                console.log(res);
                if(res === undefined){
                    throw Error;
                }
                return res.json();
            })
            .then(parsedRes => {
                console.log("This is the parsed Res");
                console.log(parsedRes);
            })
            .catch(err => {
                Promise.resolve(err);
            })
    };
};

export const getModules = () => {
    return dispatch => {
        dispatch(setLoader(true));
        const url_fetch = 'http://127.0.0.1:8000/devices/';
        fetch(url_fetch, {
            method: 'GET',
        })
            .catch(err => {
                console.log(err);
            })
            .then(res => {
                console.log(res);
                return res.json();
            })
            .then(parsedRes => {
                console.log("Parsed Res");
                console.log(parsedRes);
                if(parsedRes.length === 0){
                    console.log("There is no device");
                }
                else if(parsedRes.length <= 3){
                    console.log("There are devices");
                    parsedRes.forEach(item => {
                        console.log("Result of each item");
                        console.log(item);
                        console.log(item.device_name);
                        let data = {
                            'device_name': item.device_name
                        };
                        console.log("Data");
                        console.log(data);
                        dispatch(getIndividualAnal(data));
                    });
                }
                dispatch(setModules(parsedRes));
            })
    };
};

export const getIndividualAnal = (data) => {
    return dispatch => {
        console.log(JSON.stringify(data));
        const url_fetch = 'http://127.0.0.1:8000/individualAnalytics/';
        const userName = 'nalvp';
        const ticket = 'na@lvpei';
        fetch(url_fetch, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Authorisation': 'Basic ' + window.btoa(userName + ':' + ticket),
                'Content-Type': 'application/json'
            }
        })
            .catch(err => {
                console.log("Error");
                console.log(err);
            })
            .then(res => {
                if(res === undefined){
                    throw Error;
                }
                return res.json();
            })
            .then(parsedRes => {
                console.log(parsedRes);
                dispatch(setIndMod(parsedRes, data.device_name));
                dispatch(setLoader(false));
            })
    };
};
