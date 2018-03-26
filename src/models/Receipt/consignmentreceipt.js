import {CONR_detail,ShipCON_searchList} from '../../services/index';
import {message} from 'antd';
import Moment from 'moment';

export default {
  namespace: 'consignmentreceipt',
  state: {
    tData: [],
    item: {},
    loading: false,
    total:'',
    modalShow:false,
    modalShowEdit:false,
    ConsignmentList:[],
    pageIndex:1,
    startTime:'',
    endTime:'',
    syscode:'',
    customerNumber:'',
    shipperCompanyName:'',
    receiverCompanyName:'',
    receiptStatus:0,
    transportStatus:0,
  },
  reducers: {
    setreceipt(state,action){
      return Object.assign({},state,{
        tData:action.Data,
        total:action.total,
        loading:false,
        modalShow: false,
        modalShowEdit: false,
        startTime:action.startTime,
        endTime:action.endTime,
        syscode:action.syscode,
        customerNumber:action.customerNumber,
        shipperCompanyName:action.shipperCompanyName,
        receiverCompanyName:action.receiverCompanyName,
        pageIndex:action.page,
        receiptStatus:action.receiptStatus,
        transportStatus:action.transportStatus,
      });
    },
    getReceiptdetail(state,action){
      return Object.assign({},state,{ConsignmentList:action.Data});
    },
    getPageNum(state,action){
      return Object.assign({},state,{pageIndex:action.page});
    },
  },
  effects: {
    *getdetail(action,{call,put}){
      const dat = yield call(CONR_detail,action);
      if(!dat.err){
        let {Success,Data,Message} = dat.data;
        if(Success){
          yield put({
            type:'getReceiptdetail',
            Data,
          })
        }else{
          message.destroy()
          message.error(Message)
        }
      }
    },
    //查询
    *search(action,{call,put}){
      const startTime=action.searchFields?(action.searchFields.startTime?Moment(action.searchFields.startTime).format('YYYY-MM-DD'):''):(action.startTime?action.startTime:'')
      const endTime=action.searchFields?(action.searchFields.endTime?Moment(action.searchFields.endTime).format('YYYY-MM-DD'):''):(action.endTime?action.endTime:'');
      const syscode = action.searchFields?(action.searchFields.syscode?action.searchFields.syscode:''):action.syscode?action.syscode:'';
      const customerNumber = action.searchFields?(action.searchFields.customerNumber?action.searchFields.customerNumber:''):action.customerNumber?action.customerNumber:'';
      const shipperCompanyName =action.searchFields?(action.searchFields.shipperCompanyName?action.searchFields.shipperCompanyName:''):action.shipperCompanyName?action.shipperCompanyName:'';
      const receiverCompanyName =action.searchFields?(action.searchFields.receiverCompanyName?action.searchFields.receiverCompanyName:''):action.receiverCompanyName?action.receiverCompanyName:'';
      const receiptStatus =action.searchFields?(action.searchFields.receiptStatus?action.searchFields.receiptStatus:0):action.receiptStatus?action.receiptStatus:0;
      const transportStatus =action.searchFields?(action.searchFields.transportStatus?action.searchFields.transportStatus:4):action.transportStatus?action.transportStatus:4;
      action.startTime=startTime;
      action.endTime = endTime;
      action.syscode=syscode;
      action.customerNumber=customerNumber;
      action.shipperCompanyName=shipperCompanyName;
      action.receiverCompanyName=receiverCompanyName;
      action.receiptStatus=receiptStatus;
      action.transportStatus = transportStatus;
      const dat = yield call(ShipCON_searchList,action);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        const total = parseInt(Message);
        let page=action.page;
        if(Success){
          yield put({
            type:'setreceipt',
            Data,
            total,
            startTime,
            endTime,
            customerNumber,
            syscode,
            shipperCompanyName,
            receiverCompanyName,
            receiptStatus,page,transportStatus
          });
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
  },
  subscriptions: {},
};
