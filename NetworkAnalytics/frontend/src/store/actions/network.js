import { SET_MODULES, SET_LOADER, SET_INDMOD, MOD_EXIST, DEL_MODULE, SET_STATS, SET_COUNT } from './actionTypesNetwork';

import moment from 'moment';

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

export const setCount = (data, deviceName) => {
    return {
        type: SET_COUNT,
        data: data,
        device_name: deviceName,
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
                // console.log("I have been recieved");
                // console.log(res);
                return res.json();
            })
            .then(parsedRes => {
                // console.log(parsedRes);
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
                        const itemExists = indMod.find(mod => {
                            return item.device_name === mod.device_name;
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
                if(res === undefined || res.status === 500){
                    throw Error;
                }
                return res.json();
            })
            .then(parsedRes => {
                // console.log('paresedRes');
                // console.log(parsedRes);
                if(parsedRes.length === 0){
                    throw Error;
                }
                const data = {
                    device_name: parsedRes[0].device_name,
                    start_date: moment.unix( parsedRes[0].event_start_time ).format('YYYY-MM-DD'),
                    end_date: moment.unix( parsedRes[parsedRes.length - 1].event_end_time ).format('YYYY-MM-DD'),                    
                }
                dispatch(setIndMod(parsedRes, data.device_name));
                dispatch(getStats(data));
                dispatch(setLoader(false));
            })
            .catch(err => {
                Promise.resolve(err);
                console.log(err);
            })
    };
};

export const getStats = (device) => {
    return dispatch => {
        const url_fetch = 'http://nalvp.pythonanywhere.com/deviceStats/';
        fetch(url_fetch, {
            method: 'POST',
            body: JSON.stringify(device),
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .catch(err => {
                console.log(err);
            })
            .then(res => {
                if(res === undefined || res.status === 500){
                    throw Error;
                }
                return res.json();
            })
            .then(parsedRes => {
                // console.log('parsedRes');
                // console.log(parsedRes);
                dispatch(setStats(parsedRes, device));
                const deviceCountData = {
                    down_start_time: parsedRes.down_start_time,
                    rta_start_time: parsedRes.rta_start_time,
                };
                dispatch(deviceCountInit(deviceCountData, 'week', device));
            })
            .catch( err => Promise.resolve(err))
    };
};

export const deviceCountInit = (data, time, device) => {
    return dispatch => {
        // console.log(time);
        // console.log(data);
        const downTimeCount = filterData(data.down_start_time, time, device);
        const rtaCount = filterData(data.rta_start_time, time, device);
        // console.log('downTimeCount ' + device.device_name, downTimeCount);
        // console.log('rtaCount' + device.device_name, rtaCount);
        const countData = {
            downTimeCount,
            rtaCount,
        };
        dispatch(setCount(countData, device.device_name));
    };
};

const filterData = (data, time, device) => {
    // console.log(data);
    let curDataCount = [];
    let dataLength = data.length;
    const start_date = moment(device.start_date).unix();
    const end_date = moment(device.end_date).unix();
    // console.log('length');
    // console.log(dataLength);
    let count = 0;
    let fromNow = null;
    let setData = null;
    // let totalCount = 0;
    if(dataLength === 0) {
        // set DataCount to defualt value
        curDataCount.push({
            time: 'No data',
            count: 0,
        });
        // totalCount = 0;
        return curDataCount;
    }
    if(dataLength === 1) {
        time === 'week' ? 
        curDataCount.push({
            time: moment.unix(data[0]).startOf('week').format('MMM Do') + ' - ' + moment.unix(data[0]).endOf('week').format('MMM Do'),
            count: 1,
        }) :
            curDataCount.push({
            time: moment.unix(data[0]).startOf('month').format('MMM') + ' - ' + moment.unix(data[0]).endOf('month').format('MMM'),
            count: 1,
        });
        // totalCount = 1;
        return curDataCount;
    }
    if(time === 'week')
    {
        fromNow = moment.unix(data[0]).endOf('week').format('X');
    }
    else {
        fromNow = moment.unix(data[0]).endOf('month').format('X');
        // console.log('fromnow', moment.unix(fromNow).format('MMM'));
    }
    count = 1;
    for(let i = 1; i < dataLength; i++){
        // console.log('fromnow', moment.unix( fromNow ).subtract(1, 'month').format('MMM'), moment.unix(fromNow).format('MMM'));
        let item = data[i];
        if(item >= start_date && item <= end_date){
            if(time === 'week'){
                // console.log('fromnow', fromNow);
                if(item > fromNow){
                    setData = {
                        time: moment.unix( fromNow ).subtract(1, 'week').format('MMM Do') + ' - ' + moment.unix(fromNow).format('MMM Do'),
                        count: count,
                    };
                    curDataCount.push(setData);
                    // totalCount += count;
                    // console.log('curDataCount', curDataCount);
                    fromNow = moment.unix(item).endOf('week').format('X');
                    count = 1;
                }
                else
                {
                    count++;
                    // console.log('count', count);
                }
                // console.log('fromnow');
                // console.log(fromNow);
            }
            else{
                if(item > fromNow){
                    setData = {
                        time: moment.unix( fromNow ).format('MMM') + ' - ' + moment.unix(fromNow).add(1, 'month').format('MMM'),
                        count: count,
                    };
                    curDataCount.push(setData);
                    // totalCount += count;
                    // console.log('curDataCount', curDataCount);
                    fromNow = moment.unix(item).endOf('month').format('X');
                    count = 1;
                }
                else
                {
                    count++;
                    // console.log('count', count);
                }
            }
        }
    }
    time === 'week' ?
        curDataCount.push({
            time: moment.unix( fromNow ).subtract(1, 'week').format('MMM Do') + ' - ' + moment.unix(fromNow).format('MMM Do'),
            count: count,
    }) :
        curDataCount.push({
            time: moment.unix( fromNow ).format('MMM') + ' - ' + moment.unix(fromNow).add(1, 'month').format('MMM'),
            count: count,
    });
    // totalCount += count;
    // console.log('totalCount', totalCount);
    return curDataCount;
};
