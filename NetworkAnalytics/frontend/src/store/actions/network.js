import { SET_MODULES, SET_LOADER, SET_INDMOD, MOD_EXIST } from './actionTypesNetwork';

import { addModule } from './index';

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

export const modExist = (val) => {
    return {
        type: MOD_EXIST,
        val: val,
    };
};

export const analytics = (data) => {
    return dispatch => {
        const url_fetch = 'http://nalvp.pythonanywhere.com/comparativeAnalytics/';
        // const url_fetch = 'http://127.0.0.1:8000/uploadData/';
        fetch(url_fetch, {
            method: 'POST',
            body: data,
        })
            .catch(err => {
                console.log(err);
            })
            .then(res => {
                console.log("I have been recieved");
                console.log(res);
                return res.json();
            })
            .then(parsedRes => {
                console.log(parsedRes);
            })
    };
};

export const uploadModule = (formData, indMod) => {
    return dispatch => {
        const url_fetch = 'http://nalvp.pythonanywhere.com/uploadData/';
        // const url_fetch = 'http://127.0.0.1:8000/uploadData/';
        const userName = 'nalvp';
        const ticket = 'na@lvpei';
        fetch(url_fetch, {
            method: 'POST',
            header: {
                'Authorisation': 'Basic ' + window.btoa(userName + ':' + ticket),
            },
            body: formData,
        })
            .catch(err => {
                console.log(err);
            })
            .then(res => {
                console.log("I have been recieved");
                console.log(res);
                return res.json();
            })
            .then(parsedRes => {
                console.log(parsedRes);
                dispatch(getModules(indMod));
            })
    };
};

export const getModules = (indMod) => {
    return dispatch => {
        if(indMod.length === 0){
            dispatch(setLoader(true));
            const url_fetch = 'http://nalvp.pythonanywhere.com/devices/';
            // const url_fetch = 'http://127.0.0.1:8000/devices/';
            // const userName = 'nalvp';
            // const ticket = 'na@lvpei';
            fetch(url_fetch, {
                method: 'GET',
                 // headers: {
                    // 'Authorisation': 'Basic ' + window.btoa(userName + ':' + ticket),
                    // 'Access-Control-Request-Headers' : 'content-type',
                // }
            })
                .catch(err => {
                    console.log(err);
                })
                .then(res => {
                    // console.log(res);
                    if(res === undefined){
                        throw Error;
                    }
                    return res.json();
                })
                .then(parsedRes => {
                    // console.log("Parsed Res");
                    // console.log(parsedRes);
                    if(parsedRes.length === 0){
                        console.log("There is no device");
                        dispatch(modExist(false));
                    }
                    else{
                         // if(parsedRes.length <= 3)
                        // console.log("There are devices");
                        parsedRes.forEach(item => {
                            // console.log("Result of each item");
                            // console.log(item);
                            // console.log(item.device_name);
                            let data = {
                                'device_name': item.device_name
                            };
                            // console.log("Data");
                            // console.log(data);
                            dispatch(getIndividualAnal(data));
                        });
                    }
                    dispatch(modExist(true));
                    // dispatch(setLoader(false));
                    dispatch(setModules(parsedRes));
                    dispatch(addModule(parsedRes[0]));
                })
                .catch(err => {
                    console.log(err);
                    Promise.resolve(err);
                })
        }
    };
};

export const getIndividualAnal = (data) => {
    return dispatch => {
        const url_fetch = 'http://nalvp.pythonanywhere.com/individualAnalytics/';
        // const url_fetch = 'http://127.0.0.1:8000/individualAnalytics/';
        // const userName = 'nalvp';
        // const ticket = 'na@lvpei';
        fetch(url_fetch, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
            //     'Authorisation': 'Basic ' + window.btoa(userName + ':' + ticket),
                'Content-Type': 'application/json'
            }
        })
            .catch(err => {
                // console.log("Error");
                console.log(err);
            })
            .then(res => {
                if(res === undefined){
                    throw Error;
                }
                return res.json();
            })
            .then(parsedRes => {
                // console.log(parsedRes);
                dispatch(setIndMod(parsedRes, data.device_name));
                dispatch(setLoader(false));
            })
    };
};
