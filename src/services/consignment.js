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

//获取我的托运单列表   GET /consignment/shipperlist
export async function CONSI_getCosignList(param){
  return request(`/consignment/searchlist?pageIndex=${param.pageIndex}`,token_get());
}
//获取运单编号 GET /consignment/syscode
export async function COSI_getCosignCode(params) {
  return request(`/consignment/syscode`);
}
//删除托运单  GET /consignment/delete
export async function CONSI_deletCosignment(param) {
  return request(`/consignment/delete?id=${param.id}`,token_get());
}
//获取银行卡列表  GET /bankaccount/pagelist
export async function CONSI_getCardlist(param){
  return request(`/bankaccount/pagelist?pageIndex=${param.page}`,token_get());
}
//获取发货联系人列表
export async function CONSI_getShipperList(param){
  return request(`/contacter/search?pageIndex=${param.shipperPage?param.shipperPage:1}&maxResult=5&type=2&searchCriteria=${param.searchCriteria}`,token_get());
}
//获取收货联系人列表
export async function CONSI_getReceiveList(param){
  return request(`/contacter/search?pageIndex=${param.receivePage?param.receivePage:1}&maxResult=5&type=1&searchCriteria=${param.searchCriteria}`,token_get());
}
//获取订单详细信息及状态等 GET /consignment/single
export async function CONSI_getOrderinfo(param){
 return request(`/consignment/single?id=${param}`,token_get());
}
//新增托运单信息  CONSI_getvtlist,CONSI_getreqlist
 export async function CONSI_AddCosignment(param){
   let orderInfo = param.orderDetail;
  return token_request(`/consignment/add`,{body:JSON.stringify(orderInfo)});
 }
 //修改托运单信息   POST /consignment/update
 export async function CONSI_UpdateCosignment(params) {
   let orderInfo = params.orderDetail;
  return token_request(`/consignment/update`,{body:JSON.stringify(orderInfo)});
 }
 //获取回单要求 GET
export async function CONSI_getreqlist(param){
  return request(`/consignment/rreqlist`,token_get());
}
//获取车型要求
export async function CONSI_getvtlist(param){
  return request(`/consignment/vtlist`,token_get());
}
//获取计量单位 GET /consignment/measure
export async function CONSI_getMeasurelist (param) {
  return request(`/consignment/measure`,token_get());
}
//获取常用货品列表 GET /transportgoods/searchpagelist
export async function CONSI_getUesedGoods(param){
   return request(`/transportgoods/searchpagelist?pageIndex=1&searchCriteria=${param.value}`,token_get());
}
//获取承运方公司列表 GET /member/carrierpagelist
export async function CONSI_ggetCompanylist (params) {
	let searchCriteria = params.searchCriteria?params.searchCriteria:''
  return request(`/member/carrierpagelist?pageIndex=${params.companyPageIndex?params.companyPageIndex:1}&keyWord=${searchCriteria}`,token_get());
}
//===========================================收货方托运单====================================================

//收货方签收
 export async function CONSI_signConsignment(param) {
   	let option = param.options;
  	return token_request(`/consignment/recivce`,{body:JSON.stringify(option)});
 }
 //托运单单个详情
export async function ACCEPT_detail(param){
   return request(`/consignment/single?id=`+param.id,token_get());
}
//获取省份
export async function getProvinces(param){
   return request(`/province/singleprovince?id=`+param.pId,token_get());
}
//获取市
export async function getCitys(param){
   return request(`/province/singlecity?id=`+param.cId,token_get());
}
//获取区
export async function getAreas(param){
   return request(`/province/singledist?id=`+param.aId,token_get());
}
//获取省份
export async function getProvinces1(param){
   return request(`/province/singleprovince?id=`+param.pId1,token_get());
}
//获取市
export async function getCitys1(param){
   return request(`/province/singlecity?id=`+param.cId1,token_get());
}
//获取区
export async function getAreas1(param){
   return request(`/province/singledist?id=`+param.aId1,token_get());
}
//获取承运方列表
export async function CON_carrierList(param){
   return request(`/member/carrierpagelist?pageIndex=1`,token_get());
}
 //查询
export async function CONCON_searchList(param){
  	return request(`/consignment/searchlist?startTime=${param.startTime}&endTime=${param.endTime}&syscode=${param.syscode}&customerNumber=${param.customerNumber}&receiverCompanyName=${param.receiverCompanyName}&startAddress=${param.startAddress}&endAddress=${param.endAddress}&shipperCompanyName=${param.shipperCompanyName}&acceptanceStatus=${param.acceptanceStatus}&assignStatus=${param.assignStatus}&transportStatus=${param.transportStatus}&receiptStatus=${param.receiptStatus}&pageIndex=${param.page?param.page:1}`,token_get());
}
export async function RVCCON_searchList(param){
  	return request(`/consignment/searchlist?startTime=${param.startTime}&endTime=${param.endTime}&syscode=${param.syscode}&customerNumber=${param.customerNumber}&startAddress=${param.startAddress}&endAddress=${param.endAddress}&transportStatus=${param.transportStatus}&pageIndex=${param.page?param.page:1}`,token_get());
}
//对账查询
export async function CON_searchList(param){
  return request(`/consignment/searchlist?startTime=${param.startTime}&endTime=${param.endTime}&syscode=${param.syscode}&customerNumber=${param.customerNumber}&pageIndex=${param.page?param.page:1}&transportStatus=4`,token_get());
}

//===========================================批次管理====================================================
//获取列表
export async function BATCH_getBatchList(param){
  return request(`/loadingbatch/searchlist?pageIndex=${param.pageIndex?param.pageIndex:1}&loadingBatch=${param.loadingBatch}&startTime=${param.startTime}&endTime=${param.endTime}&licensePlateNumber=${param.licensePlateNumber}&driverName=${param.driverName}&truckBatchStatus=${param.truckBatchStatus}`,token_get());
}
//单个批次详情
export async function BATCH_getSingleDetail(param){
  return request(`/loadingbatch/getdetailmodel?id=${param.id}`,token_get());
}
//批次到站
export async function BATCH_loadBatchArrive(param) {
  let option = param.param;
  delete option.arriveTime;
  delete option.unloadTime;
  delete option.info;
 	return token_request(`/loadingbatch/loadingbatcharrive`,{body:JSON.stringify(option)});
}
//批次签收
export async function BATCH_loadBatchSign(param) {
  let option = param.options;
 	return token_request(`/loadingbatch/loadingbatchsign`,{body:JSON.stringify(option)});
}
//查询未装车数据
export async function BATCH_getPageList(param) {
 	return request(`/consignment/searchlist?acceptanceStatus=3&assignStatus=2&transportStatus=1&pageIndex=${param.page?param.page:1}`,token_get());
}
//确认新增/删除托运单
export async function BATCH_sureNewPage(param) {
  let option = param.options;
 	return token_request(`/loadingbatch/consignbatchmanage`,{body:JSON.stringify(option)});
}
//批量到站
export async function CARR_batchArrive(params) {
	delete params.type;
  return token_request(`/consignment/batcharrive`,{body:JSON.stringify(params)});
}
//批量签收
export async function CARR_batchRecivce(params) {
	delete params.type;
  return token_request(`/consignment/batchrecivce`,{body:JSON.stringify(params)});
}
