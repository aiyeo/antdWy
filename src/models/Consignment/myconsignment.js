import {CONSI_deletCosignment,CONCON_searchList} from '../../services/consignment';
import {message} from 'antd';
import Moment from 'moment';

export default {
  namespace: 'myconsignment',
  state: {
    myCosignList:[],//我的货运单
    modalId:'',//当前模块id
    loadingTable:true,
    totalConsign:0,
    pageIndex:1,
    startTime:'',
    endTime:'',
    syscode:'',
    customerNumber:'',
    shipperCompanyName:'',
    receiverCompanyName:'',
    startAddress:'',
    endAddress:'',
    acceptanceStatus:0,
    assignStatus:0,
    transportStatus:0,
    receiptStatus:0,
  },
  reducers: {
    setCosignList(state,action){
      return Object.assign({},state,{
        myCosignList: action.CosignList,
        modalId:action.modalId,
        loadingTable:false,
        totalConsign:action.Total,
        startTime:action.startTime,
        endTime:action.endTime,
        syscode:action.syscode,
        customerNumber:action.customerNumber,
        shipperCompanyName:action.shipperCompanyName,
        receiverCompanyName:action.receiverCompanyName,
        startAddress:action.startAddress,
        endAddress:action.endAddress,
        acceptanceStatus:action.acceptanceStatus,
        assignStatus:action.assignStatus,
        transportStatus:action.transportStatus,
        receiptStatus:action.receiptStatus,
        pageIndex:action.page,
      })
    },
    loadingFalse(state,action){
      return Object.assign({},state,{loadingTable:false,});
    },
    updatePage(state,action){
      return Object.assign({},state,{pageIndex:action.page});
    },
  },
  effects: {
    *deletCosignment(action,{call,put}){
      const dat = yield call(CONSI_deletCosignment,action);
      if(!dat.err){
        const {Success,Data,Message} = dat.data;
        if(Success){
          let page = action.pageIndex;
          message.destroy()
          message.success('删除成功！');
          yield put({type:'search',page})
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    *search(action,{call,put}){
      const startTime=action.searchFields?(action.searchFields.startTime?Moment(action.searchFields.startTime).format('YYYY-MM-DD'):''):(action.startTime?action.startTime:'')
      const endTime=action.searchFields?(action.searchFields.endTime?Moment(action.searchFields.endTime).format('YYYY-MM-DD'):''):(action.endTime?action.endTime:'');
      const syscode=action.searchFields?(action.searchFields.syscode?action.searchFields.syscode:''):(action.syscode?action.syscode:'');
      const customerNumber=action.searchFields?(action.searchFields.customerNumber?action.searchFields.customerNumber:''):(action.customerNumber?action.customerNumber:'');
      const shipperCompanyName=action.searchFields?(action.searchFields.shipperCompanyName?action.searchFields.shipperCompanyName:''):(action.shipperCompanyName?action.shipperCompanyName:'');
      const receiverCompanyName=action.searchFields?(action.searchFields.receiverCompanyName?action.searchFields.receiverCompanyName:''):(action.receiverCompanyName?action.receiverCompanyName:'');
      const startAddress=action.searchFields?(action.searchFields.startAddress?action.searchFields.startAddress:''):(action.startAddress?action.startAddress:'');
      const endAddress=action.searchFields?(action.searchFields.endAddress?action.searchFields.endAddress:''):(action.endAddress?action.endAddress:'');
      const acceptanceStatus=action.searchFields?(action.searchFields.acceptanceStatus?action.searchFields.acceptanceStatus:0):(action.acceptanceStatus?action.acceptanceStatus:0);
      const assignStatus=action.searchFields?(action.searchFields.assignStatus?action.searchFields.assignStatus:0):(action.assignStatus?action.assignStatus:0);
      const transportStatus=action.searchFields?(action.searchFields.transportStatus?action.searchFields.transportStatus:0):(action.transportStatus?action.transportStatus:0);
      const receiptStatus=action.searchFields?(action.searchFields.receiptStatus?action.searchFields.receiptStatus:0):(action.receiptStatus?action.receiptStatus:0);
      action.startTime = startTime;
      action.endTime = endTime;
      action.syscode = syscode;
      action.customerNumber = customerNumber;
      action.shipperCompanyName = shipperCompanyName;
      action.receiverCompanyName = receiverCompanyName;
      action.startAddress = startAddress;
      action.endAddress = endAddress;
      action.acceptanceStatus = acceptanceStatus;
      action.assignStatus = assignStatus;
      action.transportStatus = transportStatus;
      action.receiptStatus = receiptStatus;
      const dat = yield call(CONCON_searchList,action);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        const Total = parseInt(Message);
        let page = action.page;
        if(Success){
          let CosignList = [];
          Data.map(list=>{
            let ConsignmentId= list.ConsignmentId;
            let SysCode =  list.SysCode;
            let CustomerNumber =  list.CustomerNumber;
            let StartingAddress= list.StartingAddress;
            let DestinationAddress = list.DestinationAddress;
            let ReceiveCompanyName = list.ConsignmentReceivingModel? list.ConsignmentReceivingModel.CompanyName :'';
            let ReceivingTel =list.ConsignmentReceivingModel ? list.ConsignmentReceivingModel.ReceivingTel : '';
            let shipperCompanyName = list.ConsignmentShipperModel? list.ConsignmentShipperModel.CompanyName : '';
            let ShipperTel = list.ConsignmentShipperModel? list.ConsignmentShipperModel.ShipperTel : '';
            let Remark = list.Remark;
            let ContentDesc=list.ContentDesc;
            let Status = list.Status;
            let TranStatus = list.TranStatus;
            let CreateTime = list.CreateTime;
            let AssignStatus = list.AssignStatus;
            let AcceptanceStatus = list.AcceptanceStatus;
            let TransportStatus = list.TransportStatus;
            let ReceiptStatus = list.ReceiptStatus;
            let listobj = {
              ConsignmentId,
              SysCode,
              StartingAddress,
              DestinationAddress,
              ReceiveCompanyName,
              ReceivingTel,
              shipperCompanyName,
              ShipperTel,
              Remark,
              Status ,
              TranStatus,
              CreateTime,
              ContentDesc,
              AssignStatus,
              AcceptanceStatus,
              TransportStatus,
              ReceiptStatus,
              CustomerNumber
            }
            CosignList.push(
              listobj
            )
          })
          yield put({
            type:'setCosignList',
            CosignList,
            modalId:action.id,
            Total,
            page,startTime,endTime,syscode,shipperCompanyName,receiverCompanyName,startAddress,endAddress,acceptanceStatus,assignStatus,transportStatus,receiptStatus
          });
        }else{
          message.destroy();
          message.error(Message);
          yield put({
            type:'loadingFalse',
          })
        }
      }
    },
  },
  subscriptions: {},
};
