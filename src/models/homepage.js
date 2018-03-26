
import {HOME_getMessageList,HOME_getConsignNum} from '../services/index';
import {message} from 'antd';

export default {
  namespace: 'homepage',
  state: {
    messagelist:[],//我的货运单
    loadingTable:true,
    totalList:0,
    AllCount:0,//所有运单
    ArrivedCount:0,//已到站运单
    MovingCount:0,//运输中运单
    RejectionCount:0,//被拒绝运单
    AlreadySignedCount:0,//已签收运单
    pageIndex:1,
  },
  reducers: {
   setmsgList(state,action){
      return Object.assign({},state,{messagelist: action.Data,loadingTable:false,totalList:action.Total})
   },
   setlistNum(state,action){
     return Object.assign({},state,{AllCount: action.AllCount,ArrivedCount:action.ArrivedCount,MovingCount:action.MovingCount,RejectionCount:action.RejectionCount,AlreadySignedCount:action.AlreadySignedCount})
   },
   updatePage(state,action){
      return Object.assign({},state,{pageIndex:action.page});
    },
  },
  effects: {
    *getmessagelist(action,{call,put}){
    const dat = yield call(HOME_getMessageList,action);
      if(!dat.err){
         const {Success,Data,Message} = dat.data;
         const Total = parseInt(Message);
        if(Success){
          yield put({
                type:'setmsgList',
                Data,
                Total
            });
        }else{
          message.destroy();
            message.error(Message);
        }
      }
  },
  *getConsignNum(action,{call,put}){
    const dat = yield call(HOME_getConsignNum,action);
      if(!dat.err){
         const {Success,Data,Message} = dat.data;
         const {AllCount,ArrivedCount,MovingCount,RejectionCount,AlreadySignedCount} = Data;
        if(Success){
          yield put({
            type:'setlistNum',
            AllCount,
            ArrivedCount,
            MovingCount,
            RejectionCount,
            AlreadySignedCount
            });
        }else{
          message.destroy();
            message.error(Message);
        }
      }
  }
  },
  subscriptions: {},
};
