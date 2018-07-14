import { SET_MODULES, SET_LOADER, SET_INDMOD, MOD_EXIST, DEL_MODULE, SET_STATS, SET_COUNT, SET_COUNTANAL, SET_ERROR, SET_LOGIN } from './actionTypesNetwork';

import { UPDATE_STATS } from './actionTypesAnalytics';

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

export const setIndMod = (module, module_data) => {
    return {
        type: SET_INDMOD,
        module: module,
        module_name: module_data.device_name,
        module_region: module_data.device_region,
        module_isp: module_data.device_isp,
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

export const setCountAnalytics = (data, device_name) => {
    return {
        type: SET_COUNTANAL,
        data: data,
        device_name: device_name,
    };
};

export const setError = (err, errMessage) => {
    return {
        type: SET_ERROR,
        err,
        errMessage,
    };
};

export const setLogin = (token) => {
    return {
        type: SET_LOGIN,
        token: token
    };
};

export const updateStatsAnal = (data, deviceName) => {
    return {
        type: UPDATE_STATS,
        data: data,
        device_name: deviceName,
    };
};

export const uploadModule = (formData, indMod, push, path) => {
    return dispatch => {
        dispatch(setLoader(true));
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
                dispatch(setError(true, err));
            })
            .then(res => {
                // console.log("I have been recieved");
                // console.log('uploadRes',res);
                return res.json();
            })
            .then(parsedRes => {
                // console.log('fileError',parsedRes);
                if('error' in parsedRes){
                    dispatch(setError(true, parsedRes.error));
                    dispatch(setLoader(false));
                }
                dispatch(getModules(indMod));
                dispatch(setLoader(false));
                push(path);
            })
    };
};

export const getModules = (indMod) => {
    
    return dispatch => {
        dispatch(setLoader(true));
        dispatch(getLogin());
        const url_fetch = 'http://nalvp.pythonanywhere.com/devices/';
        // const url_fetch = 'http://127.0.0.1:8000/devices/';
        fetch(url_fetch, {
            method: 'GET',
        })
            .catch(err => {
            })
            .then(res => {
                // console.log(res);
                if(res === undefined){
                    throw Error;
                }
                return res.json();
            })
            .then(parsedRes => {
                if('error' in parsedRes){
                    dispatch(setError(true, parsedRes.error));
                    dispatch(setLoader(false));
                }
                else
                {
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
                                    'device_name': item.device_name,
                                    'device_region': item.device_region,
                                    'device_isp': item.device_isp,
                                };
                                const moduleData = {
                                    device_name: item.device_name,
                                    device_region: item.device_region,
                                    device_isp: item.device_isp,
                                };
                                dispatch(getIndividualAnal(data, moduleData));
                            }
                        });
                    }
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

export const getIndividualAnal = (data, moduleData) => {
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
                if('error' in parsedRes){
                    dispatch(setError(true, parsedRes.error));
                    dispatch(setLoader(false));
                }
                else
                {
                    if(parsedRes.length === 0){
                        throw Error;
                    }
                    const data = {
                        device_name: parsedRes[0].device_name,
                        start_date: moment.unix( parsedRes[0].event_start_time ).format('YYYY-MM-DD'),
                        end_date: moment.unix( parsedRes[parsedRes.length - 1].event_end_time ).format('YYYY-MM-DD'),                    
                    }
                    dispatch(setIndMod(parsedRes, moduleData));
                    dispatch(getStats(data, null));
                    dispatch(setLoader(false));
                }
            })
            .catch(err => {
                Promise.resolve(err);
                console.log(err);
            })
    };
};

export const getStats = (device, time) => {
    // console.log('device', device);
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
                    dispatch(setError(true, 'Server Error: 500'));
                    dispatch(setLoader(false));
                    throw Error;
                }
                return res.json();
            })
            .then(parsedRes => {
                // console.log('parsedRes', parsedRes);
                if('error' in parsedRes){
                    dispatch(setError(true, parsedRes.error));
                }
                else
                {
                    dispatch(setStats(parsedRes, device));
                    dispatch(updateStatsAnal(parsedRes, device.device_name));
                    const deviceCountData = {
                        down_start_time: parsedRes.down_start_time,
                        down_end_time: parsedRes.down_end_time,
                        rta_start_time: parsedRes.rta_start_time,
                        rta_end_time: parsedRes.rta_end_time,
                    };
                    const curTime = time === null ? 'month': time;
                    dispatch(deviceCountInit(deviceCountData, curTime, device));
                }
            })
            .catch( err => 
                {
                    Promise.resolve(err)
                }
            )
    };
};

export const deviceCountInit = (data, time, device) => {
    return dispatch => {
        // console.log(time);
        // console.log(data);
        const downTimeCount = filterData(data.down_start_time, data.down_end_time, time, device);
        const rtaCount = filterData(data.rta_start_time, data.rta_end_time, time, device);
        // console.log('downTimeCount ' + device.device_name, downTimeCount);
        // console.log('rtaCount' + device.device_name, rtaCount);
        const countData = {
            downTimeCount: downTimeCount.curDataCount,
            rtaCount: rtaCount.curDataCount,
            totalTimeDurationUD: downTimeCount.totalTimeDuration,
            totalTimeDurationRTA: rtaCount.totalTimeDuration,
        };
        // console.log('countData', countData);
        dispatch(setCount(countData, device.device_name));
        dispatch(setCountAnalytics(countData, device.device_name));
    };
};

const filterData = (data_start, data_end, time, device) => {
    // console.log(data);
    let curDataCount = [];
    let dataLength = data_start.length;
    const start_date = moment(device.start_date).unix();
    const end_date = moment(device.end_date).unix();
    // console.log('length');
    // console.log(dataLength);
    let count = 0;
    let timeDuration = 0;
    let totalTimeDuration = 0;
    let fromNow = null;
    let setData = null;
    let data = {};
    // let totalCount = 0;
    if(dataLength === 0) {
        // set DataCount to defualt value
        curDataCount.push({
            time: '0 Count',
            count: 0,
        });
        // totalCount = 0;
        data = {
            curDataCount: curDataCount,
            totalTimeDuration: '0',
        }
        return data;
    }
    if(dataLength === 1) {
        time === 'week' ? 
            curDataCount.push({
                time: moment.unix(data_start[0]).startOf('week').format('MMM Do') + ' - ' + moment.unix(data_start[0]).endOf('week').format('MMM Do'),
                timeCount: timeFormatter(moment.duration( moment.unix(data_end[0]).diff(moment.unix(data_start[0])) )),
                count: 1,
        }) :
            curDataCount.push({
                time: moment.unix(data_start[0]).startOf('month').format('MMM') ,
                timeCount: timeFormatter(moment.duration( moment.unix(data_end[0]).diff(moment.unix(data_start[0])) )),                
                count: 1,
        });
        // totalCount = 1;
        timeDuration = moment.duration( moment.unix(data_end[0]).diff(moment.unix(data_start[0])) );
        totalTimeDuration = timeDuration;
        data = {
            curDataCount: curDataCount,
            totalTimeDuration: timeFormatter(totalTimeDuration),
        };
        return data;
    }
    if(time === 'week')
    {
        fromNow = moment.unix(data_start[0]).endOf('week').format('X');
        timeDuration = moment.duration( moment.unix(data_end[0]).diff(moment.unix(data_start[0])) );
        totalTimeDuration = timeDuration;
    }
    else {
        fromNow = moment.unix(data_start[0]).endOf('month').format('X');
        timeDuration = moment.duration( moment.unix(data_end[0]).diff(moment.unix(data_start[0])) );
        totalTimeDuration = timeDuration;
        // console.log('fromnow', moment.unix(fromNow).format('MMM'));
    }
    count = 1;
    for(let i = 1; i < dataLength; i++){
        // console.log('fromnow', moment.unix( fromNow ).subtract(1, 'month').format('MMM'), moment.unix(fromNow).format('MMM'));
        let item = data_start[i];
        if(item >= start_date && item <= end_date){
            if(time === 'week'){
                // console.log('fromnow', fromNow);
                if(item > fromNow){
                    setData = {
                        time: moment.unix( fromNow ).subtract(1, 'week').format('MMM Do') + ' - ' + moment.unix(fromNow).format('MMM Do'),
                        timeCount: timeFormatter ( timeDuration ),
                        count: count,
                    };
                    curDataCount.push(setData);
                    totalTimeDuration = totalTimeDuration.add(timeDuration);
                    // totalCount += count;
                    // console.log('curDataCount', curDataCount);
                    fromNow = moment.unix(item).endOf('week').format('X');
                    timeDuration = moment.duration( moment.unix(data_end[i]).diff(moment.unix(data_start[i])) );
                    count = 1;
                }
                else
                {
                    count++;
                    timeDuration = timeDuration.add(moment.duration( moment.unix(data_end[i]).diff(moment.unix(data_start[i]))) );
                    // console.log('count', count);
                }
                // console.log('fromnow');
                // console.log(fromNow);
            }
            else{
                if(item > fromNow){
                    setData = {
                        time: moment.unix( fromNow ).format('MMM'),
                        timeCount: timeFormatter ( timeDuration ),
                        count: count,
                    };
                    curDataCount.push(setData);
                    totalTimeDuration = totalTimeDuration.add(timeDuration);
                    // totalCount += count;
                    // console.log('curDataCount', curDataCount);
                    fromNow = moment.unix(item).endOf('month').format('X');
                    timeDuration = moment.duration( moment.unix(data_end[i]).diff(moment.unix(data_start[i])) );
                    count = 1;
                }
                else
                {
                    count++;
                    timeDuration = timeDuration.add(moment.duration( moment.unix(data_end[i]).diff(moment.unix(data_start[i]))) );
                    // console.log('count', count);
                }
            }
        }
    }
    time === 'week' ?
        curDataCount.push({
            time: moment.unix( fromNow ).subtract(1, 'week').format('MMM Do') + ' - ' + moment.unix(fromNow).format('MMM Do'),
            timeCount: timeFormatter ( timeDuration ),
            count: count,
    }) :
        curDataCount.push({
            time: moment.unix( fromNow ).format('MMM'),
            timeCount: timeFormatter ( timeDuration ),
            count: count,
        });
    totalTimeDuration = totalTimeDuration.add(timeDuration);
    // totalCount += count;
    // console.log('totalTimeDuration', timeFormatter(totalTimeDuration));
    data = {
        curDataCount: curDataCount,
        totalTimeDuration: timeFormatter(totalTimeDuration),
    };
    return data;
};

const timeFormatter = (difference) => {
    let time = '';
    let diff = difference.get('month');
    (diff === 0) ? null : (time += (diff + 'months '));
    diff = difference.get('days');
    (diff === 0) ? null : time += (diff + 'd ');
    diff = difference.get('hours');
    (diff === 0) ? null : time += (diff + 'hrs ');
    diff = difference.get('minutes');
    diff === 0 ? null : time += (diff + 'min ');
    diff = difference.get('seconds');
    diff === 0 ? null : time += (diff + 's');
    // console.log('time', time);
    return time;
};

export const getLogin = () => {
    return dispatch => {
        const url_fetch = 'http://nalvp.pythonanywhere.com/isAllowed/';
        fetch(url_fetch, {
            method: 'GET',
        })
            .catch(err => {
                console.log(err);
            })
            .then(res => {
                if(res === undefined || res.status === 500){
                    dispatch(setError(true, 'Server Error: 500'));
                    throw Error;
                }
                return res.json();
            })
            .then(parsedRes => {
                console.log('parsedRes', parsedRes);
                console.log(parsedRes.is_allowed);
                dispatch(setLogin(parsedRes.is_allowed));
            })
            .catch( err => 
                {
                    Promise.resolve(err)
                }
            )
    };
};
