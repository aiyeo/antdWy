import {request} from '../utils/request';
import {token_request} from '../utils/request';
import Moment from 'moment';
const POST_SUBMIT = (body = null) => ({
  method: 'post',
  headers: {"Content-Type": "application/x-www-form-urlencoded"},
  body
});
const token_get = () => ({
  method: 'get',
  headers: {'Authorization': 'token '+sessionStorage.getItem('access_token')},
});
//=========承运方托运单========================================
//获取驾驶员列表  GET /driver/list/{pageindex}
export async function CARR_getDriverList(param){
   return request(`/driver/list/${param.page?param.page:1}?name=${param.name}`,token_get());
}
//获取车辆列表   GET /car/list/{pageindex}
export async function CARR_getCarlist(param) {
   return request(`/car/list/${param.page?param.page:1}?carNo=${param.carNo}`,token_get());
}
//确认装车  POST /consignment/package
export async function CARR_loadingGoods(params) {
	delete params.param.ConsignmentIds;
  return token_request(`/consignment/package`,{body:JSON.stringify(params.param)});
}
//拒绝装车  POST /consignment/rejection
export async function CARR_refuse(params) {
   return token_request(`/consignment/rejection`,{body:JSON.stringify(params.param)});
}
//到站确认    POST /consignment/arrive
export async function CARR_arriveSign(params) {
  return token_request(`/consignment/arrive`,{body:JSON.stringify(params.param)});
}
//承运方签收
 export async function CONSI_signConsignment(param) {
   	let option = param.options;
  	return token_request(`/consignment/recivce`,{body:JSON.stringify(option)});
 }
 //查询
export async function CONCON_searchList(param){
  	return request(`/consignment/searchlist?startTime=${param.startTime}&endTime=${param.endTime}&syscode=${param.syscode}&customerNumber=${param.customerNumber}&receiverCompanyName=${param.receiverCompanyName}&startAddress=${param.startAddress}&endAddress=${param.endAddress}&shipperCompanyName=${param.shipperCompanyName}&acceptanceStatus=${param.acceptanceStatus}&assignStatus=${param.assignStatus}&transportStatus=${param.transportStatus}&pageIndex=${param.page?param.page:1}`,token_get());
}
//Button条件查询
export async function Button_searchList(param){
	let status = param.status;
  return request(`/consignment/searchlist?status=${status}&pageIndex=1`,token_get());
}
//批量装车
export async function CARR_batchLoading(param) {
  return token_request(`/consignment/batchloading`,{body:JSON.stringify(param.param)});
}
//批量到站
export async function CARR_batchArrive(param) {
  return token_request(`/consignment/batcharrive`,{body:JSON.stringify(param.param)});
}
//批量签收
export async function CARR_batchRecivce(param) {
  return token_request(`/consignment/batchsign`,{body:JSON.stringify(param.param)});
}
//单个运单详情
export async function CARR_getSingleList(param){
  return request(`/consignment/single?id=${param.id}`,token_get());
}
//一单一车or 一单多车
export async function CARR_splitLoading(params) {
  return token_request(`/consignment/splitloading`,{body:JSON.stringify(params.param)});
}
