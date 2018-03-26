import React from 'react';
import { Router, Route,IndexRoute } from 'dva/router';
import Login from './routes/Login';
import Findpass from './routes/Findpass';
import Cotainer from './routes/Index';
import Home from './routes/Home';
import IdentiInfo from './routes/Identify/IdentiInfo';
import Certification from './routes/Identify/Certification';
import MemberManage from './routes/Authorization/MemberManage';
import SysButtons from './routes/Authorization/SysButtons';
import SystemModel from './routes/Authorization/SysModule';
import SysRole from './routes/Authorization/SysRole';
//----------------------------------------基础信息-------------------------------------------------------
import Transportgoods from './routes/Database/Transportgoods';//货品维护
import Packingform from './routes/Database/Packingform';//包装
import Sunit from './routes/Database/Sunit';//单位
import Gtype from './routes/Database/Gtype';//类型
import Transportline from './routes/Database/Transportline';//运输线路维护
import Contacter from './routes/Database/Contacter';//收发货联系人
import Industries from './routes/Database/Industries';//行业
import Bankaccount from './routes/Database/Bankaccount';//银行账户
import TruckManage from './routes/Database/TruckManage';//车辆管理
import DriverManage from './routes/Database/DriverManage';//司机管理
//-----------------------------------------托运单----------------------------------------------------------
import MyConsignment from './routes/Consignment/MyConsignment';//发货方托运单
import AddConsignment from './routes/Consignment/AddConsignment'//发货方新增托运单
import ConsignmentDetail from './routes/Consignment/CosignmentDetail';//托运单详情
import CarrierConsignment from './routes/Consignment/CarrierConsignment';//承运方托运单
import SignConsignment from './routes/Consignment/SignConsignment';//托运单签收
import BatchManage from  './routes/Consignment/BatchManage'//托运单批次管理
import BatchDetails from  './routes/Consignment/BatchDetails'//托运单批次管理详情
import ConsignmentDetailTrans from  './routes/Consignment/ConsignmentDetailTrans'//托运单受理--查看时间线
import ConsignmentAcceptSreach from  './routes/Consignment/ConsignmentAcceptSreach'//托运单受理--查看
import BatchList from  './routes/Consignment/BatchList'//托运单批次运单列表
import TransStowage from  './routes/Consignment/TransStowage'//托运单运输配载
import TransStowageDetail from  './routes/Consignment/TransStowageDetail'//托运单运输配载详情
import LoadingCar from  './routes/Consignment/LoadingCar'//托运单一单多车/多单一车
//-------------------------------------------回单---------------------------------------------------------
import ConsignmentReceipt from  './routes/Receipt/ConsignmentReceipt'//发货方回单
import CarrierReceipt from  './routes/Receipt/CarrierReceipt'//承运方回单
import CarrierReceiptDetail from  './routes/Receipt/CarrierReceiptDetail'//回单详情
//--------------------------------------------对账---------------------------------------------------------
import Reconciliation from  './routes/Consignment/Reconciliation'//托运单对账
import ReconciliationDetail from  './routes/Consignment/ReconciliationDetail'//托运单对账详情




function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={Login} />
      <Route path="/password" component={Findpass} />
      <Route path="/home" component={Cotainer} >
        <IndexRoute  component={Home}/>
        <Route path='/identiinfo' component={IdentiInfo} />
        <Route path='/certification/:typeId/:Status' component={Certification} />
        <Route path='/membermanage/:id' component={MemberManage} />
        <Route path='/sysbutton/:menuId' component={SysButtons} />
        <Route path="/sysmodule/:id" component={SystemModel} />
        <Route path="/sysrole/:id" component={SysRole} />
        <Route path="/consignment/:id" component={MyConsignment} />
        <Route path="/consignmentCarrier/:id" component={CarrierConsignment} />
        <Route path="/addConsignment/:orderid" component={AddConsignment} />
        <Route path="/ConsignmentDetail/:orderId" component={ConsignmentDetail} />
        <Route path="/signconsignment/:orderId" component={SignConsignment} />
        <Route path="/transportgoods/:id" component={Transportgoods} />
        <Route path="/packingform/:id" component={Packingform} />
        <Route path="/sunit/:id" component={Sunit} />
        <Route path="/gtype/:id" component={Gtype} />
        <Route path="/transportline/:id" component={Transportline} />
        <Route path="/contacter/:id" component={Contacter} />
        <Route path="/industries/:id" component={Industries} />
        <Route path="/bankaccount/:id" component={Bankaccount} />
        <Route path="/truckmanage/:id" component={TruckManage} />
        <Route path="/drivermanage/:id" component={DriverManage} />
        <Route path="/consignmentreceipt/:id" component={ConsignmentReceipt} />
        <Route path="/carrierreceipt/:id" component={CarrierReceipt} />
        <Route path="/ConsignmentDetailTrans/:id" component={ConsignmentDetailTrans} />
        <Route path="/ConsignmentAcceptSreach/:id" component={ConsignmentAcceptSreach} />
        <Route path="/Reconciliation/:id" component={Reconciliation} />
        <Route path="/ReconciliationDetail/:id" component={ReconciliationDetail} />
        <Route path="/batchmanage/:id" component={BatchManage} />
        <Route path="/carrierreceiptdetail/:id" component={CarrierReceiptDetail} />
        <Route path="/batchdetails/:id" component={BatchDetails} />
        <Route path="/batchlist/:id" component={BatchList} />
        <Route path="/TransStowage/:id" component={TransStowage} />
        <Route path="/TransStowageDetail/:id" component={TransStowageDetail} />
        <Route path="/loadingcar/:id" component={LoadingCar} />
      </Route >
    </Router>
  );
}

export default RouterConfig;
