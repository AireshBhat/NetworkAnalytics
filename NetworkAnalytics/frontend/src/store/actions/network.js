import { SET_MODULES, SET_LOADER, SET_INDMOD, MOD_EXIST, DEL_MODULE, SET_STATS } from './actionTypesNetwork';

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

export const delModule = module => {
    return {
        type: DEL_MODULE,
        module: module,
    };
};

export const setStats = (res, data) => {
    return {
        type: SET_STATS,
        res: res,
        data: data,
    };
};

export const uploadModule = (formData, indMod, path) => {
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
                path();
            })
    };
};

export const getModules = (indMod) => {
    return dispatch => {
        dispatch(setLoader(true));
        const url_fetch = 'http://nalvp.pythonanywhere.com/devices/';
        // const url_fetch = 'http://127.0.0.1:8000/devices/';
        fetch(url_fetch, {
            method: 'GET',
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
                if(parsedRes.length === 0){
                    console.log("There is no device");
                    dispatch(modExist(false));
                }
                else{
                     // if(parsedRes.length <= 3)
                    parsedRes.forEach(item => {
                        let itemExists = indMod.find(mod => {
                            return item.device_name === mod.module_name;
                        })
                        if(!itemExists){
                            let data = {
                                'device_name': item.device_name
                            };
                            dispatch(getIndividualAnal(data));
                        }
                    });
                }
                dispatch(modExist(true));
                dispatch(setModules(parsedRes));
            })
            .catch(err => {
                console.log(err);
                Promise.resolve(err);
            })
    };
};

export const getIndividualAnal = (data) => {
    return dispatch => {
        const url_fetch = 'http://nalvp.pythonanywhere.com/individualAnalytics/';
        // const url_fetch = 'http://127.0.0.1:8000/individualAnalytics/';
        fetch(url_fetch, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
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

export const getStats = (data) => {
    return dispatch => {
        const url_fetch = 'http://nalvp.pythonanywhere.com/deviceStats/';
        fetch(url_fetch, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .catch(err => {
                console.log(err);
            })
            .then(res => {
                if(res === undefined){
                    throw Error;
                }
                return res.json();
            })
            .then(parsedRes => {
                dispatch(setStats(parsedRes, data));
            })
    };
};
