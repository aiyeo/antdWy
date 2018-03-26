import {BATCH_getSingleDetail} from '../../services/consignment';
import {message} from 'antd';
import Moment from 'moment';
export default {
  namespace: 'batchdetails',
  state: {
    tData:[],
    pageIndex:1,
    loading:true,
    item:{},//详情总数据
  },
  reducers: {
   	showDetailsData(state,action){
     	return Object.assign({},state,{item:action.Data,loading:false})
   	},
  },
  effects: {
  	*getDetail(action,{call,put}){
      const dat = yield call(BATCH_getSingleDetail,action);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        if(Success){
        	yield put({type:'showDetailsData',Data})
        }else{
          message.destroy();
          message.error(Message);
        }
      }
    },
  },
  subscriptions: {},
};
