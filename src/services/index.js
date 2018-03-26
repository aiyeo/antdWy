import {request} from '../utils/request';
import {token_request} from '../utils/request';
import Moment from 'moment';
import {uuid} from '../utils/fun_config';



const POST_SUBMIT = (body = null) => ({
  method: 'post',
  headers: {"Content-Type": "application/x-www-form-urlencoded"},
  body
});
const token_get = () => ({
  method: 'get',
  headers: {'Authorization': 'token '+sessionStorage.getItem('access_token')},
});

//登录  POST /member/login
export async function login(param) {
  let {Account,Password,Captcha} =param.values;
  return request('/member/login', POST_SUBMIT(`Account=${Account}&Password=${Password}&Captcha=${Captcha}&CaptchaKey=${param.guid}`));
}
//获取验证码 POST /member/captcha
export async function getCode(param) {
  return request('/member/captcha?key='+param.guid);
}


//退出
export async function logout() {
  return request(`/member/loginout`,token_get());
}

//获取手机验证码==找回密码  GET /mobilecheckcode/verificationcode
export async function getVericode(param){
  return request(`/mobilecheckcode/gaincode?mobileNo=${param.mobiles}`);
}
//重置密码=》忘记密码  POST
export async function setPassword(param) {
  const {mobiles,Code,Password} = param.values;
  return request('/mobilecheckcode/getpassword', POST_SUBMIT(`Account=${mobiles}&CheckCode=${Code}&NewPassword=${Password}`));
}
//修改密码=》修改  POST /member/updatepassword
export async function editPassword(param) {
  delete param.param.NewPassword1;
  return token_request('/member/updatepassword',{body:JSON.stringify(param.param)} );
}

//获取用户账号信息 GET /member/single
export async function getUserinfo(param){
  return request(`/member/single?memberId=${param.MemberId}`,token_get());
}
//获取当前登录会员主账号有权限的菜单列表MENU
export async function MENU_getMenu(param){
  return request(`/actionmenu/memberauthmenu`,token_get());
}
//获取当前登录会员主账号有权限的菜单列表MENU
export async function MBTN_getbtn(param){
  return request(`/actionmenu/memberbuttonlist?menuId=`+param.id,token_get());
}
//1:获取省份列表不分页
export async function getProvinces(param){
  return request(`/province/loadall`,token_get());
}
//5：取省下面的所有市
export async function getPCitys(param){
  let id=param.targetOption?(param.targetOption.value?param.targetOption.value:param.targetOption.ProvinceId):param.id;
  return token_request(`/province/loadallbypid?provinceId=`+id,token_get());
}
//5.取市下的所有地区
export async function getCDistricts(param){
  let id=param.targetOption?(param.targetOption.value?param.targetOption.value:param.targetOption.cityId):param.id;
  return token_request(`/province/loadallbycid?cityId=`+id,token_get());
}
//获取车辆所属单位 GET GET /member/logisticsbroker
export async function getManagers(param){
  return request(`/member/logisticsbroker`,token_get());
}
//保存司机认证信息 POST /memberbasicinfo/save
export async function saveMemberinfo(param){
  let data= param.param;
  delete data.DriverImage;
  delete data.region;
  delete data.Type;
  return token_request('/personalidentification/save',{body:JSON.stringify(data)} );
}
//获取司机填写的认证信息 POST  GET /personalidentification/single
export async function getDriverInfo(param){
  return request(`/personalidentification/single?memberId=${param.id}`,token_get());
}
//修改司机认证信息
export async function upadateDriverInfo(param){
  let data= param.param;
  delete data.DriverImage;
  delete data.region;
  delete data.Type;
  return token_request('/personalidentification/update',{body:JSON.stringify(data)} );
}

//----------------------------------按钮
//获取按钮信息 GET /actionmenu/list
export async function getButton(param){
  return request(`/actionmenu/memberbuttonlist?menuId=${param.MenuId}`,token_get());
}
//添加按钮
export async function addButton(param){
  return token_request('/actionmenu/addbtn',{body:JSON.stringify(param.param)} );
}
//修改按钮
export async function editButton(param){
  return token_request('/actionmenu/editbtn',{body:JSON.stringify(param.param)} );
}
//删除按钮

export async function deleteButton(param){
  return request(`/actionmenu/deletebtn?id=`+param.id,token_get());
}
//----------------------------------用户  MEB
//获取会员列表
export async function MEB_getMember(param){
  return request(`/users/pagelist?pageIndex=`+param.page,token_get());
}
//添加用户
export async function MEB_addMember(param){
  return token_request('/users/add',{body:JSON.stringify(param.param)});
}
//修改用户
export async function MEB_editMember(param){
  return token_request('/users/update',{body:JSON.stringify(param.param)} );
}
//删除用户
export async function MEB_deleteMember(param){
  return request(`/users/delete?id=`+param.id,token_get());
}
export async function MEB_getRoleList(param){
  return request(`/role/list`,token_get());
}
//----------------------------------企业认证
//获取企业类型
export async function getCompanytype(){
  return request(`/companyauth/companytype`,token_get());
}
//保存承运方认证信息
export async function submitauth(param){
  let data= param.param;
  delete data.region;
  delete data.Type;
  return token_request('/companyauth/submitauth',{body:JSON.stringify(data)});
}
//修改承运方认证信息
export async function AUTH_update(param){
  let data= param.param;
  delete data.region;
  delete data.Type;
  return token_request('/companyauth/update',{body:JSON.stringify(data)});
}
//查看承运方认证信息
export async function AUTH_single(param){
  const MemberId = sessionStorage.getItem('MemberId');
  return token_request('/companyauth/single?memberId='+MemberId,token_get());
}
//-------------------发货方---------------Shipper--SHIPPER
//保存发货方认证信息
export async function SHIPPER_submitauth(param){
  let data= param.param;
  delete data.region;
  delete data.Type;
  return token_request('/shipperauth/submitauth',{body:JSON.stringify(data)});
}
//修改发货方认证信息
export async function SHIPPER_update(param){
  let data= param.param;
  delete data.region;
  delete data.Type;
  return token_request('/shipperauth/update',{body:JSON.stringify(data)});
}
//查看发货方认证信息
export async function SHIPPER_single(param){
  const MemberId = sessionStorage.getItem('MemberId');
  return token_request('/shipperauth/single?memberId='+MemberId,token_get());
}
//----------------------------------系统角色
//获取角色列表
export async function ROLE_getSysRole(param){
  return request(`/role/pagelist?pageIndex=`+param.page,token_get());
}
//添加角色
export async function ROLE_addSysRole(param){
  return token_request(`/role/add`,{body:JSON.stringify(param.param)});
}
//删除角色
export async function ROLE_deleteSysRole(param){
  return request(`/role/delete?id=`+param.id,token_get());
}
//修改角色
export async function ROLE_updateSysRole(param){
  return token_request(`/role/update`,{body:JSON.stringify(param.param)});
}
//加载所有模块与权限按钮信息
export async function ROLE_loadMenuButtons(param){
  return request(`/role/loadmenubuttons`,token_get());
}
//取角色拥有的模块及按钮权限配置信息
export async function ROLE_getPermissionButtons(param){
  return request(`/role/loadbuttons?roleId=`+param.id,token_get());
}
//保存角色权限按钮
export async function savePermissionButtons(param){
  return token_request('/role/savebuttons',{body:JSON.stringify(param.obj)});
}
//------------------------------------模块  MDL
//获取系统模块
export async function getModule(){
  return request(`/actionmenu/list`,token_get());
}
//删除系统模块
export async function deleteModule(param){
  return request(`/actionmenu/delete?id=`+param.id,token_get());
}
//修改系统模块
export async function editModule(param){
  return token_request('/actionmenu/edit',{body:JSON.stringify(param.param)} );
}
//添加系统模块
export async function addModule(param){
  return token_request('/actionmenu/add',{body:JSON.stringify(param.param)} );
}
//获取所有按钮不分页  GET GET /button/loadall
export async function getAllButton(param){
  return request(`/button/loadall`,token_get());
}
//系统模块获取按钮  GET /actionmenu/buttonlist
export async function getBtnModule(param){
  return request(`/actionmenu/buttonlist?menuId=${param.MenuId}`,token_get());
}
//系统模块发送按钮数据 POSTPOST /actionmenu/setbuttons
export async function setButtonData(param) {
  return token_request('/actionmenu/setbuttons',{body:JSON.stringify(param)} );
}
//--------------------------------------------------------------------------------------基础数据设置
//-------------------------------包装  packingform----PACK
//列表all
export async function PACK_listall(param) {
  return token_request('/packingform/list',token_get());
}
//列表
export async function PACK_list(param) {
  return token_request('/packingform/pagelist?pageIndex='+param.page,token_get());
}
//增加
export async function PACK_add(param) {
  return token_request('/packingform/add',{body:JSON.stringify(param.param)} );
}
//修改
export async function PACK_update(param) {
  return token_request('/packingform/update',{body:JSON.stringify(param.param)} );
}
//删除
export async function PACK_delete(param) {
  return token_request('/packingform/delete?id='+param.id,token_get());
}
//-------------------------------单位  goodsunit----SUNIT
//列表all
export async function SUNIT_listall(param) {
  return token_request('/goodsunit/list',token_get());
}
//列表
export async function SUNIT_list(param) {
  return token_request('/goodsunit/pagelist?pageIndex='+param.page,token_get());
}
//增加
export async function SUNIT_add(param) {
  return token_request('/goodsunit/add',{body:JSON.stringify(param.param)} );
}
//修改
export async function SUNIT_update(param) {
  return token_request('/goodsunit/update',{body:JSON.stringify(param.param)} );
}
//删除
export async function SUNIT_delete(param) {
  return token_request('/goodsunit/delete?id='+param.id,token_get());
}
//-------------------------------类型  Gtype----GTYPE
//列表all
export async function GTYPE_listall(param) {
  return token_request('/cargotype/list',token_get());
}
//列表
export async function GTYPE_list(param) {
  return token_request('/cargotype/pagelist?pageIndex='+param.page,token_get());
}
//增加
export async function GTYPE_add(param) {
  return token_request('/cargotype/add',{body:JSON.stringify(param.param)} );
}
//修改
export async function GTYPE_update(param) {
  return token_request('/cargotype/update',{body:JSON.stringify(param.param)} );
}
//删除
export async function GTYPE_delete(param) {
  return token_request('/cargotype/delete?id='+param.id,token_get());
}
//-------------------------------常用货品维护  transportgoods----TRAN
//列表
export async function TRAN_list(param) {
  return token_request('/transportgoods/pagelist?pageIndex='+param.page,token_get());
}
//列表
export async function TRAN_searchlist(param) {
  return token_request(`/transportgoods/searchpagelist?pageIndex=${param.page}&name=${param.name}&manufactor=${param.manufactor}&gtype=${param.gtype}`,token_get());
}
//增加
export async function TRAN_add(param) {
//	let {Name,Packing,Gtype,Specifications,ItemType,Gunit,QualityGuaranteePeriod,UnitPrice,Manufactor,Remark,DisplayOrder} = param.param;
//let option={
//	'Name':Name?Name:'',
//	'Packing':Packing?Packing:'',
//	'Gtype':Gtype?Gtype:'',
//	'Specifications':Specifications?Specifications:'',
//	'ItemType':ItemType?ItemType:'',
//	'Gunit':Gunit?Gunit:'',
//	'Gtype':Gtype?Gtype:'',
//	'QualityGuaranteePeriod':QualityGuaranteePeriod?QualityGuaranteePeriod:'',
//	'UnitPrice':parseFloat(UnitPrice)?parseFloat(UnitPrice):0,
//	'Manufactor':Manufactor?Manufactor:'',
//	'Remark':Remark?Remark:'',
//	'DisplayOrder':0,
//};
  return token_request('/transportgoods/add',{body:JSON.stringify(param.param)} );
}
//修改
export async function TRAN_update(param) {
  return token_request('/transportgoods/update',{body:JSON.stringify(param.param)} );
}
//删除
export async function TRAN_delete(param) {
  return token_request('/transportgoods/delete?id='+param.id,token_get());
}
//包装list
export async function TRAN_packingform(param) {
  return token_request('/transportgoods/packingform',token_get());
}
//单位list
export async function TRAN_goodsunit(param) {
  return token_request('/transportgoods/goodsunit',token_get());
}

//类型list
export async function TRAN_cargotype(param) {
  return token_request('/transportgoods/cargotype',token_get());
}

//-------------------------------运输线路维护  transportline----TLINE
//运输线路维护列表
export async function TLINE_list(param) {
  return token_request('/translines/pagelist?pageIndex='+param.page,token_get());
}
//获取线路属性
export async function TLINE_lineAttribute(param) {
  return token_request('/translines/lineattr',token_get());
}
//获取线路类型
export async function TLINE_lineType(param) {
  return token_request('/translines/linetype',token_get());
}
//获取线路产品类型
export async function TLINE_lineGoodsType(param) {
  return token_request('/translines/linegoodstype',token_get());
}
//获取线路行业优势
export async function TLINE_lineIndustry(param) {
  return token_request('/translines/industry',token_get());
}
//获取线路服务优势
export async function TLINE_lineService(param) {
  return token_request('/translines/serviceadvn',token_get());
}
//获取线路运输方式
export async function TLINE_lineShipType(param) {
  return token_request('/translines/shiptype',token_get());
}
//运输线路维护新增
export async function TLINE_addLine(param) {
  let {
    LineName,
    StartingProvinceId,
    StartingCityId,
    StartingDistrictId,
    DestinationProvinceId,
    DestinationCityId,
    DestinationDistrictId,
    Mileage,
    SubordinateArea,
    LineAttribute,
    LineType,
    LineGoodsType,
    TypeOfShipping,
    IndustryAdvantage,
    ServiceAdvantage,
    TransporPprescription,
    TheReceiptTime,
    Remark
  } = param.param;
  let option={
    'LineName':LineName,
    'StartingProvinceId':StartingProvinceId,
    'StartingCityId':StartingCityId,
    'StartingDistrictId':StartingDistrictId,
    'DestinationProvinceId':DestinationProvinceId,
    'DestinationCityId':DestinationCityId,
    'DestinationDistrictId':DestinationDistrictId,
    'Mileage':Mileage,
    'SubordinateArea':SubordinateArea,
    'LineAttribute':LineAttribute,
    'LineType':LineType,
    'LineGoodsType':LineGoodsType,
    'TypeOfShipping':TypeOfShipping,
    'IndustryAdvantage':IndustryAdvantage,
    'ServiceAdvantage':ServiceAdvantage,
    'TransporPprescription':TransporPprescription,
    'TheReceiptTime':TheReceiptTime,
    'Remark':Remark
  };
  return token_request('/translines/add',{body:JSON.stringify(option)} );
}
//运输线路维护修改
export async function TLINE_updateLine(param) {
  let {
    Id,
    LineName,
    StartingProvinceId,
    StartingCityId,
    StartingDistrictId,
    DestinationProvinceId,
    DestinationCityId,
    DestinationDistrictId,
    Mileage,
    SubordinateArea,
    LineAttribute,
    LineType,
    LineGoodsType,
    TypeOfShipping,
    IndustryAdvantage,
    ServiceAdvantage,
    TransporPprescription,
    TheReceiptTime,
    Remark
  } = param.param;
  let option={
    'Id':Id,
    'LineName':LineName,
    'StartingProvinceId':StartingProvinceId,
    'StartingCityId':StartingCityId,
    'StartingDistrictId':StartingDistrictId,
    'DestinationProvinceId':DestinationProvinceId,
    'DestinationCityId':DestinationCityId,
    'DestinationDistrictId':DestinationDistrictId,
    'Mileage':Mileage,
    'SubordinateArea':SubordinateArea,
    'LineAttribute':LineAttribute,
    'LineType':LineType,
    'LineGoodsType':LineGoodsType,
    'TypeOfShipping':TypeOfShipping,
    'IndustryAdvantage':IndustryAdvantage,
    'ServiceAdvantage':ServiceAdvantage,
    'TransporPprescription':TransporPprescription,
    'TheReceiptTime':TheReceiptTime,
    'Remark':Remark
  };
  return token_request('/translines/update',{body:JSON.stringify(option)} );
}
//运输线路维护删除
export async function TLINE_deleteLine(param) {
  return token_request('/translines/delete?id='+param.id,token_get());
}
//-------------------------------------收货联系人维护  CTER
//收货联系人列表
export async function CTER_Contacterlist(param) {
  return token_request('/contacter/pagelist?pageIndex='+param.page,token_get());
}
//增加收货联系人
export async function CTER_addContacter(param) {
  return token_request('/contacter/add',{body:JSON.stringify(param.param)} );
}
//修改收货联系人
export async function CTER_editContacter(param) {
  return token_request('/contacter/update',{body:JSON.stringify(param.param)} );
}
//删除收货联系人
export async function CTER_deleteContacter(param) {
  return token_request('/contacter/delete?id='+param.id,token_get());
}
//取省下面的所有市 id不同
export async function getPCitysStart(param){
  let id=param.targetOption.StartingProvinceId;
  return token_request(`/province/loadallbypid?provinceId=`+id,token_get());
}
//取市下面的所有区
export async function getCDistrictsStart(param){
  let id=param.targetOption.StartingCityId;
  return token_request(`/district/loadallbycid?cityId=`+id,token_get());
}

//---------------------------------------行业维护   IDT
// 获取行业列表
export async function IDT_getindustrieslist(param) {
  return token_request('/industries/list',token_get());
}
//行业列表分页
export async function IDT_industrieslist(param) {
  return token_request('/industries/pagelist?pageIndex='+param.page,token_get());
}
//增加行业
export async function IDT_addindustries(param) {
  return token_request('/industries/add',{body:JSON.stringify(param.param)} );
}
//修改行业
export async function IDT_editindustries(param) {
  return token_request('/industries/update',{body:JSON.stringify(param.param)} );
}
//删除行业
export async function IDT_deleteindustries(param) {
  return token_request('/industries/delete?id='+param.id,token_get());
}
//------------------------------------------银行账户维护   BANK
//获取银行账户
export async function BANK_getbanklist(param) {
  return token_request('/bankaccount/list',token_get());
}
//银行账户列表分页
export async function BANK_bankaccountlist(param) {
  return token_request('/bankaccount/pagelist?pageIndex='+param.page,token_get());
}
//增加银行账户
export async function BANK_addbankaccount(param) {
  return token_request('/bankaccount/add',{body:JSON.stringify(param.param)} );
}
//修改银行账户
export async function BANK_editbankaccount(param) {
  return token_request('/bankaccount/update',{body:JSON.stringify(param.param)} );
}
//删除银行账户
export async function BANK_deletebankaccount(param) {
  return token_request('/bankaccount/delete?id='+param.id,token_get());
}

//--------------------------------------------承运方车辆管理  TM
//增加车辆信息
export async function TM_addturck(param) {
  return token_request('/car/add',{body:JSON.stringify(param.param)} );
}
//修改车辆信息
export async function TM_editturck(param) {
  return token_request('/car/update',{body:JSON.stringify(param.param)} );
}
//删除车辆信息
export async function TM_deleteturck(param) {
  return token_request('/car/remove/'+param.id,token_get());
}
//获取车辆类型
export async function TM_getcartype(param) {
  return token_request('/car/cartype',token_get());
}
//查询车辆
export async function TM_searchCar(param) {
  return token_request(`/car/list/1?pagesize=15&axesCount=${param.axesCount}&carNo=${param.carNo}`,token_get());
}

//--------------------------------------------承运方司机管理  DM
//增加司机信息
export async function DM_adddriver(param) {
  return token_request('/driver/add',{body:JSON.stringify(param.param)} );
}
//修改司机信息
export async function DM_editdriver(param) {
  return token_request('/driver/update',{body:JSON.stringify(param.param)} );
}
//删除司机信息
export async function DM_deletedriver(param) {
  return token_request('/driver/remove/'+param.id,token_get());
}
//获取驾照类型
export async function DM_getdriverlicense(param) {
  return token_request('/driver/driverlicensetype',token_get());
}
//查询司机
export async function DM_searchDriver(param) {
  return token_request(`/driver/list/1?pagesize=15&name=${param.name}&phone=${param.phone}`,token_get());
}


//首页获取消息列表  GET /consignment/msglist/{pageindex
export async function HOME_getMessageList(params) {
  return token_request(`/consignment/msglist/${params.pageIndex}`,token_get());
}
//首页获取各个状态运单数量  GET /consignment/ordercount
export async function HOME_getConsignNum(params) {
  return token_request(`/consignment/ordercount`,token_get());
}
//----------------------------------------承运方回单 CONR
//回收回单
export async function CONR_addReceipt(param) {
  return token_request('/receipt/add',{body:JSON.stringify(param.param)} );
}
//上交回单
export async function CONR_addHandin(param) {
  return token_request('/receipt/handin',{body:JSON.stringify(param.param)} );
}
//托运单单个详情
export async function CONR_detail(param){
  return request(`/consignment/single?id=`+param.id,token_get());
}
//承运方回单查询&列表
export async function CONCON_searchList(param){
  return request(`/consignment/searchlist?startTime=${param.startTime}&endTime=${param.endTime}&syscode=${param.syscode}&customerNumber=${param.customerNumber}&receiverCompanyName=${param.receiverCompanyName}&shipperCompanyName=${param.shipperCompanyName}&transportStatus=${param.transportStatus}&receiptStatus=${param.receiptStatus}&pageIndex=${param.page?param.page:1}`,token_get());
}
//发货方回单查询列表
export async function ShipCON_searchList(param){
  return request(`/consignment/searchlist?startTime=${param.startTime}&endTime=${param.endTime}&syscode=${param.syscode}&customerNumber=${param.customerNumber}&receiverCompanyName=${param.receiverCompanyName}&shipperCompanyName=${param.shipperCompanyName}&transportStatus=4&receiptStatus=${param.receiptStatus}&pageIndex=${param.page?param.page:1}`,token_get());
}
//-----------------------------------------------------车辆配载-    STO-----------------
//承运方车辆配载列表
export async function STO_searchList(param){
  return request(`/consigntruck/searchlist?pageIndex=${param.page?param.page:1}&status=${param.status}&startTime=${param.startTime}&endTime=${param.endTime}&endAddress=${param.endAddress}&startAddress=${param.startAddress}&driverName=${param.driverName}&licensePlateNumber=${param.licensePlateNumber}`,token_get());
}
//承运方车辆配载详情
export async function STO_detail(param){
  return request(`/consigntruck/single?id=`+param.id,token_get());
}
//承运方车辆配载到站
export async function STO_Arrive(param) {
  return token_request('/consigntruck/arrive',{body:JSON.stringify(param.param)} );
}
export async function STO_goodsdetail(param) {
  return request(`/consigntruck/loadTruckConsignment?truckId=${param.truckId}&loadingBatchId=${param.loadingBatchId}`,token_get());
}




