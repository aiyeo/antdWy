import {message} from 'antd';
import {CON_searchList,ACCEPT_detail} from '../../services/consignment';
import {arrList} from '../../utils/fun_config';
import Moment from 'moment';
export default {
  namespace: 'reconciliation',
  state: {
  	tData:[],
    item:{},
    total:'',
    pageIndex:1,
    startTime:'',
    endTime:'',
    syscode:'',
    shipperName:'',
    customerNumber:'',
    loading:true,
    unloadModal:false,//卸货模态框
    signModal:false,
  },
  reducers: {
    //详情
    detail(state,action){
      return Object.assign({},state,{item:action.Data});
    },
  	//列表展示
  	setdata(state,action){
       return Object.assign({},state,{
         loading:false,
       	tData:action.Data,
       	total:action.total,
       	startTime:action.startTime,
         customerNumber:action.customerNumber,
       	endTime:action.endTime,
       	syscode:action.syscode,
         pageIndex:action.page,
       });
   },
    //查看签收信息
    showSignModal(state,action){
      return Object.assign({},state,{signModal:true})
    },
    closeSignModal(state,action){
      return Object.assign({},state,{signModal:false})
    },
    //查看卸货信息
    showunloadModal(state,action){
      return Object.assign({},state,{unloadModal:true})
    },
    closeunloadModal(state,action){
      return Object.assign({},state,{unloadModal:false})
    },
  	//装载列表数据
  	getSingleData(state,action){
  		return Object.assign({},state,{item:action.Data})
  	},
  	updatePage(state,action){
      return Object.assign({},state,{pageIndex:action.page});
    },
  },
  effects: {
    //详情
    *getdetail(action,{call,put}){
      const dat = yield call(ACCEPT_detail,action);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        if(Success){
          yield put({type:'detail',Data});
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    //查询
    *search(action,{call,put}){
    	const startTime=action.searchFields?(action.searchFields.startTime?Moment(action.searchFields.startTime).format('YYYY-MM-DD'):''):(action.startTime?action.startTime:'')
      const endTime=action.searchFields?(action.searchFields.endTime?Moment(action.searchFields.endTime).format('YYYY-MM-DD'):''):(action.endTime?action.endTime:'');
			const syscode=action.searchFields?(action.searchFields.syscode?action.searchFields.syscode:''):(action.syscode?action.syscode:'');
      const customerNumber=action.searchFields?(action.searchFields.customerNumber?action.searchFields.customerNumber:''):(action.customerNumber?action.customerNumber:'');
			action.startTime = startTime;
			action.endTime = endTime;
      action.customerNumber = customerNumber;
			action.syscode = syscode;
      const dat = yield call(CON_searchList,action);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        const total = parseInt(Message);
        let page=action.page;
        if(Success){
        	yield put({type:'setdata',Data,total,startTime,endTime,syscode,page,customerNumber});
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
  },
  subscriptions: {},
};
