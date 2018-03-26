import {CONR_addReceipt,CONR_addHandin,CONR_detail,CONCON_searchList} from '../../services/index';
import {message} from 'antd';
import Moment from 'moment'
export default {
  namespace: 'carrierreceipt',
  state: {
    tData: [],
    item: {},
    loading: true,
    total:'',
    modalShow:false,
    modalShowEdit:false,
    modalShowDischarge:false,
    modalShowSign:false,
    AddFirstPhoto:[],
    AddSecondPhoto:[],
    HandInFirstPhoto:[],
    HandInSecondPhoto:[],
    ConsignmentList:[],
    customerNumber:'',
    pageIndex:1,
    ConsignmentDischargeList:[],
    startTime:'',
    endTime:'',
    syscode:'',
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
      	receiptStatus:action.receiptStatus,
      	transportStatus:action.transportStatus,
        pageIndex:action.page,
      });
    },
    showretrievemodel(state,action){
      return Object.assign({},state,{modalShow:true,item:action.item,AddFirstPhoto:[],AddSecondPhoto:[]});
    },
    closeretrievemodel(state,action){
      return Object.assign({},state,{modalShow:false});
    },
    closehandinmodel(state,action){
      return Object.assign({},state,{modalShowEdit:false});
    },
    showhandinmodel(state,action){
      return Object.assign({},state,{modalShowEdit:true,item:action.item,HandInFirstPhoto:[],HandInSecondPhoto:[]});
    },
    //详情页面卸货弹框
    showDischargemodel(state,action){
      return Object.assign({},state,{modalShowDischarge:true});
    },
    closemodalDischarge(state,action){
      return Object.assign({},state,{modalShowDischarge:false});
    },
    //详情页面签收弹框
    showSignmodel(state,action){
      return Object.assign({},state,{modalShowSign:true});
    },
    closemodalSign(state,action){
      return Object.assign({},state,{modalShowSign:false});
    },
    //保存第一张回执单据图片上传
    saveReceiptimage(state,action){
      return Object.assign({},state,{AddFirstPhoto:action.fileList});
    },
    deleteReceiptimage(state,action){
      return Object.assign({},state,{AddFirstPhoto:action.removelist});
    },
    //保存第二章回执单据图片上传
    saveReceiptimage2(state,action){
      return Object.assign({},state,{AddSecondPhoto:action.fileList});
    },
    deleteReceiptimage2(state,action){
      return Object.assign({},state,{AddSecondPhoto:action.removelist});
    },
    //保存第一张上交回执单据图片上传
    saveHandinimage(state,action){
      return Object.assign({},state,{HandInFirstPhoto:action.fileList});
    },
    deleteHandinimage(state,action){
      return Object.assign({},state,{HandInFirstPhoto:action.removelist});
    },
    //保存第二章回执单据图片上传
    saveHandinimage2(state,action){
      return Object.assign({},state,{HandInSecondPhoto:action.fileList});
    },
    deleteHandinimage2(state,action){
      return Object.assign({},state,{HandInSecondPhoto:action.removelist});
    },
    getReceiptdetail(state,action){
      return Object.assign({},state,{ConsignmentList:action.Data});
    },
    updatePage(state,action){
      return Object.assign({},state,{pageIndex:action.page});
    },
  },
  effects: {
    *addreceipt(action,{call,put}){
      const dat = yield call(CONR_addReceipt,action);
      if(!dat.err){
        const {Success,Message} = dat.data;
        if(Success){
          let page=action.pageIndex;
          message.destroy()
          message.success('回收成功！');
          yield put({
            type:'search',
            page,
          })
        }else{
          message.destroy()
          message.error(Message);
          yield put({
            type:'closeretrievemodel'
          })
        }
      }
    },
    *addhandin(action,{call,put}){
      const dat = yield call(CONR_addHandin,action);
      if(!dat.err){
        const {Success,Message} = dat.data;
        if(Success){
          let page=action.pageIndex;
          message.destroy()
          message.success('上交成功！');
          yield put({
            type:'search',
            page,
          })
        }else{
          message.destroy()
          message.error(Message);
          yield put({
            type:'closehandinmodel'
          })
        }
      }
    },
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
      const dat = yield call(CONCON_searchList,action);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        const total = parseInt(Message);
        let page=action.page;
        if(Success){
          yield put({type:'setreceipt',Data,total,startTime,
            endTime,
            syscode,
            customerNumber,
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
