import pathToRegexp from 'path-to-regexp';
import {uuid} from '../utils/fun_config';

export default {
  namespace: 'global',
  state: {},
  reducers: {},
  effects: {},
  subscriptions: {
    setup({history,dispatch}){

      if(!Array.prototype.find){
        Array.prototype.find=function(predicate){
          'use strict';
          if(this==null){
            throw new TypeError('Array.prototype.find called on null or undefined');
          }
          if(typeof predicate !== 'function'){
            throw new TypeError('predicate must be a function');
          }
          var list = Object(this);
          var length = list.length>>>0;
          var thisArg = arguments[1];
          var value;
          for(var i=0;i<length;i++){
            value = list[i];
            if(predicate.call(this.Arg,value,i,list)){
              return value
            }
          }
          return undefined;
        }
      };

      history.listen(({pathname,query})=>{
        const login = pathToRegexp('/').exec(pathname);
        const driverIdentiinfo = pathToRegexp('/identiinfo').exec(pathname);
        const sysbutton=pathToRegexp('/sysbutton/:menuId').exec(pathname);
        const membermanage = pathToRegexp('/membermanage/:id').exec(pathname);
        const certification = pathToRegexp('/certification/:RoleId/:Status').exec(pathname);
        const sysmodule = pathToRegexp('/sysmodule/:id').exec(pathname);
        const sysrole = pathToRegexp('/sysrole/:id').exec(pathname);
        const transportgoods = pathToRegexp('/transportgoods/:id').exec(pathname);
        const packingform = pathToRegexp('/packingform/:id').exec(pathname);
        const gtype = pathToRegexp('/gtype/:id').exec(pathname);
        const sunit = pathToRegexp('/sunit/:id').exec(pathname);
        const transportline = pathToRegexp('/transportline/:id').exec(pathname);
        const contacter = pathToRegexp('/contacter/:id').exec(pathname);
        const industries = pathToRegexp('/industries/:id').exec(pathname);
        const bankaccount = pathToRegexp('/bankaccount/:id').exec(pathname);
        const addConsignment = pathToRegexp('/addConsignment/:orderId').exec(pathname);
        const consignmentCarrier = pathToRegexp('/consignmentCarrier/:id').exec(pathname);
        const consignmentDetail = pathToRegexp("/ConsignmentDetail/:orderId").exec(pathname);
        const signconsignment = pathToRegexp("/signconsignment/:orderId").exec(pathname);
        const myConsignment = pathToRegexp('/consignment/:id').exec(pathname);
        const truckmanage = pathToRegexp('/truckmanage/:id').exec(pathname);
        const drivermanage = pathToRegexp('/drivermanage/:id').exec(pathname);
        const consignmentreceipt = pathToRegexp('/consignmentreceipt/:id').exec(pathname);
        const carrierreceiptdetail = pathToRegexp('/carrierreceiptdetail/:id').exec(pathname);
        const carrierreceipt = pathToRegexp('/carrierreceipt/:id').exec(pathname);
        const consignmentacceptsreach = pathToRegexp('/consignmentacceptsreach/:id').exec(pathname);
        const consignmentdetailtrans = pathToRegexp('/consignmentdetailtrans/:id').exec(pathname);
        const reconciliation = pathToRegexp('/reconciliation/:id').exec(pathname);
        const ReconciliationDetail = pathToRegexp('/ReconciliationDetail/:id').exec(pathname);
        const batchmanage = pathToRegexp('/batchmanage/:id').exec(pathname);
        const batchdetails = pathToRegexp('/batchdetails/:id').exec(pathname);
        const batchlist = pathToRegexp('/batchlist/:id').exec(pathname);
        const TransStowage = pathToRegexp('/TransStowage/:id').exec(pathname);
        const TransStowageDetail = pathToRegexp('/TransStowageDetail/:id').exec(pathname);
        const loadingcar = pathToRegexp('/loadingcar/:id').exec(pathname);
        const home =  pathToRegexp('/home').exec(pathname);
        if(home){
          const MemberId = sessionStorage.getItem('MemberId');
          let navs=[''];
          sessionStorage.setItem('navs',navs);
          dispatch({type:'login/updateNavs',navs});
          dispatch({
            type:'homepage/getmessagelist',
            pageIndex:1
          })
          dispatch({ type:'homepage/getConsignNum'});
          dispatch({type:'common/Getuserinfo',MemberId})
        }
        if(login){
          let guid=uuid()
          dispatch({type:'login/getcode',guid})
        }
        if(driverIdentiinfo){
          let id=sessionStorage.getItem('MemberId');
          dispatch({type:'userinfo/getManager'});//获取所属经纪人
          dispatch({type:'userinfo/getprovines'});//获取省数据
          dispatch({
            type:'userinfo/getDriverInfo',
            id
          });//获取认证信息
        }
        if(certification){
          let navs=sessionStorage.getItem('navs').split(',');
          navs[1]='认证信息';
          sessionStorage.setItem('navs',navs);
          dispatch({type:'login/updateNavs',navs});
          let RoleId=certification[1];
          let status=certification[2];
          dispatch({type:'certification/updatetype',RoleId});//获取企业类型
          dispatch({type:'certification/getType'});//获取企业类型
          dispatch({type:'certification/getprovines'});//获取省数据
          if(status==4&&RoleId==4){
            dispatch({
              type:'certification/getanthSingle'
            });//获取认证信息
          }
          if(status==4&&RoleId==2){
            dispatch({
              type:'certification/getshipperSingle'
            });//获取认证信息
          }
        }
        if(sysbutton){
          let MenuId=sysbutton[1];
          dispatch({type:'sysbutton/updateMId',MenuId});
          dispatch({type:'sysbutton/getbutton',MenuId});
        }
        if(membermanage){
          let page=1;
          let id=membermanage[1];
          dispatch({type:'common/btnList',id})
          dispatch({type:'membermanage/getmember',page})
          dispatch({type:'membermanage/getrolelist'})
        }
        //获取系统角色
        if(sysrole){
          let page=1;
          let id=sysrole[1];
          dispatch({type:'common/btnList',id})
          dispatch({type:'sysrole/getrole',page})
        }
        if(sysmodule)
        {
          let id=sysmodule[1];
          dispatch({type:'common/btnList',id})
          dispatch({type:'sysmodule/getdata'});
        }
        if(transportgoods)
        {
          let id=transportgoods[1];
          let page=1;
          dispatch({type:'common/btnList',id})
          dispatch({type:'transportgoods/searchlist',page});
          dispatch({type:'transportgoods/packtransportgoods'})
          dispatch({type:'transportgoods/sunittransportgoods'})
          dispatch({type:'transportgoods/typetransportgoods'})
        }
        if(transportline)
        {
          let id=transportline[1];
          let page=1;
          dispatch({type:'common/btnList',id})
          dispatch({type:'transportline/gettransportgoodslist',page});
            dispatch({type:'transportline/getprovines'});
        }
        if(packingform)
        {
          let page=1;
          let id=packingform[1];
          dispatch({type:'common/btnList',id})
          dispatch({type:'packingform/gettransportgoods',page});
        }
        if(gtype)
        {
          let page=1;
          let id=gtype[1];
          dispatch({type:'common/btnList',id})
          dispatch({type:'gtype/gettransportgoods',page});
        }
        if(sunit)
        {
          let page=1;
          let id=sunit[1];
          dispatch({type:'common/btnList',id})
          dispatch({type:'sunit/gettransportgoods',page});
        }
        //收发货联系人
        if(contacter){
          let id=contacter[1];
          let page=1;
          dispatch({type:'common/btnList',id})
          dispatch({type:'contacter/getcontacter',page});

        }
        //行业
        if(industries){
          let id=industries[1];
          let page=1;
          dispatch({type:'common/btnList',id})
          dispatch({type:'industries/getindustries',page})
        }
        //银行账户
        if(bankaccount){
          let id=bankaccount[1];
          let page=1;
          dispatch({type:'common/btnList',id})
          dispatch({type:'bankaccount/getbankaccount',page})
        }
        //我的托运单
        if(myConsignment){
          let pageIndex = 1;
          //获取托运单列表
          let id=myConsignment[1];
          //dispatch({type:'common/btnList',id})
          dispatch({
            type:'myconsignment/search',
            pageIndex,
            id
          });
        }

        //我的托运单--承运方
        if(consignmentCarrier){
          let pageIndex = 1;
          //获取托运单列表
          dispatch({
            type:'consignmentCarrier/search',
            pageIndex
          });
          let id=consignmentCarrier[1];
          //dispatch({type:'common/btnList',id})

        }

        //新增托运单
        if(addConsignment || consignmentDetail){
          dispatch({type:'addconsignment/getprovines'});//获取省数据
          dispatch({type:'addconsignment/getreqlist'});//获取回单要求  GET /consignment/rreqlist
          dispatch({type:'addconsignment/getvtlist'});//获取车型要求  GET /consignment/vtlist
          dispatch({type:'addconsignment/getmeasuretlist'})//获取计量单位
          dispatch({type:'addconsignment/getCosignCode'})//获取运单编号
          let orderId= addConsignment ? addConsignment[1] :consignmentDetail[1];
          if(orderId=='1'){//新增
            dispatch({type:'addconsignment/clearInfo'});
          }else{//获取当前订单信息
            dispatch({
              type:'addconsignment/getOrderinfo',
              orderId
            });
          }
        }
        //承运方车辆管理
        if(truckmanage){
          let page = 1;
          let id=truckmanage[1];
          dispatch({type:'common/btnList',id});
          dispatch({
            type:'truckmanage/search',page
          });
        }
        //承运方司机管理
        if(drivermanage){
          let page = 1;
          let id=drivermanage[1];
          dispatch({type:'common/btnList',id});
          dispatch({type:'drivermanage/search',page});
        }
        //托运单签收
        if(signconsignment){
          let page = 1;
          let id=signconsignment[1];
          setTimeout(()=>{
            dispatch({type:'common/btnList',id});
          },500)
          dispatch({type:'signconsignment/search',page});
        }
        //受理详情
        if(consignmentacceptsreach){
          let id=consignmentacceptsreach[1];
          dispatch({ type:'consignmentacceptsreach/getacceptdetail',id});
        }
        //受理详情 时间线
        if(consignmentdetailtrans){
          let id=consignmentdetailtrans[1];
          dispatch({ type:'consignmentdetailtrans/getacceptdetail',id});
        }
        //发货方回单
        if(consignmentreceipt){
          let page = 1;
          let id=consignmentreceipt[1];
          dispatch({type:'common/btnList',id});
          dispatch({ type:'consignmentreceipt/search',page});
        }
        //承运方回单
        if(carrierreceipt){
          let page = 1;
          let id=carrierreceipt[1];
          dispatch({type:'common/btnList',id});
          dispatch({ type:'carrierreceipt/search',page});
        }
        //承运方回单详情
        if(carrierreceiptdetail){
          let id=carrierreceiptdetail[1];
          dispatch({ type:'carrierreceipt/getdetail',id});
        }
        //对账
        if(reconciliation){
          let id=reconciliation[1];
          let page=1;
          dispatch({ type:'reconciliation/search',page});
        }
        //对账详情
        if(ReconciliationDetail){
          let id=ReconciliationDetail[1];
          dispatch({ type:'reconciliation/getdetail',id});
        }

        //批次管理
        if(batchmanage){
          let id=batchmanage[1];
          let pageIndex=1;
          dispatch({type:'common/btnList',id});
          dispatch({ type:'batchmanage/search',pageIndex});
        }
        //批次管理详情
        if(batchdetails){
          let id=batchdetails[1];
          let pageIndex=1;
          dispatch({type:'common/btnList',id});
          dispatch({ type:'batchdetails/getDetail',id});
        }
        //批次管理运单列表
        if(batchlist){
          let id=batchlist[1];
          let pageIndex=1;
          dispatch({type:'common/btnList',id});
          dispatch({ type:'batchlist/getBatchDetail',id});
        }
        //运输配载
        if(TransStowage){
          let id=TransStowage[1];
          let pageIndex=1;
          dispatch({type:'common/btnList',id});
          dispatch({ type:'transstowage/search',pageIndex});
        }
        if(TransStowageDetail){
          let id=TransStowageDetail[1];
          dispatch({ type:'transstowage/getdetail',id});
        }

        //多单一车/一单多车
        if(loadingcar){
          let id=loadingcar[1];
          let pageIndex=1;
          dispatch({type:'common/btnList',id});
          dispatch({type:'loadingcar/delCarArr'})
          dispatch({ type:'loadingcar/setCurrentId',id});
          dispatch({type:'loadingcar/getsingle',id})
        }
      })
    }
  },
};
