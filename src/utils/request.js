import fetch from 'dva/fetch';
import {RQHEADER} from './config';
import { routerRedux } from 'dva/router';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if(response.status==404){
      routerRedux.push('/')
  }
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export function request(url, options) {
  return fetch(RQHEADER+url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => ({ data }))
    .catch(err => ({ err }));
}
export function token_request(url, options) {
 
  var json= {
    method:'POST',
    headers: {'Content-Type': 'application/json','Authorization': 'token '+sessionStorage.getItem('access_token')},
  }
  return fetch(RQHEADER+url, Object.assign({},json,options))
    .then(checkStatus)
    .then(parseJSON)
    .then(data => ({ data }))
    .catch(err => ({ err }));
}

