import {message} from 'antd';
import {CONSI_signConsignment,RVCCON_searchList} from '../../services/consignment';
import {arrList} from '../../utils/fun_config';
import Moment from 'moment'
export default {
  namespace: 'signconsignment',
  state: {
  	tData:[],
  	item:[],
  	modalShow:false,
  	modalShowEdit:false,
  	total:'',
  	keyNum:1,
  	batchAssignData:[],
  	SignImageList:[],//签收卸货图片列表
    pageIndex:1,
    startTime:'',
    endTime:'',
    syscode:'',
    startAddress:'',
    customerNumber:'',
    endAddress:'',
		transportStatus:0,
  },
  reducers: {
  	//列表展示
  	setdata(state,action){
       return Object.assign({},state,{
         tData:action.Data,total:action.total,
         startTime:action.startTime,
         endTime:action.endTime,
         syscode:action.syscode,
         startAddress:action.startAddress,
         customerNumber:action.customerNumber,
         endAddress:action.endAddress,
					transportStatus:action.transportStatus,
         pageIndex:action.page,
       });
    },
  	//列表点击指派弹框开启
  	showAssign(state,action){
  		return Object.assign({},state,{modalShow:true})
  	},
  	//列表点击指派弹框关闭
  	closeAssign(state,action){
  		return Object.assign({},state,{modalShow:false})
  	},
  	//指派数据表格
  	batchAssignData(state,action){
  		return Object.assign({},state,{batchAssignData:action.Data})
  	},
  	//装载列表数据
  	getSingleData(state,action){
  		return Object.assign({},state,{item:action.Data})
  	},
  	SetSignImage(state,action){//设置签收卸货图片
     return Object.assign({},state,{SignImageList:action.fileList});
   },
   deletSignImage(state,action){//删除签收卸货图片的图片列表
    return Object.assign({},state,{SignImageList:action.removelist});
   },
    updatePage(state,action){
      return Object.assign({},state,{pageIndex:action.page});
    },
  },
  effects: {
    //签收
    *assignGo(action,{call,put}){
      const dat = yield call(CONSI_signConsignment,action);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        let page=1;
        if(Success){
        	yield put({type:'search',page});
          message.destroy();
        	message.success('签收成功!')
        }else{
          message.destroy();
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
      const startAddress=action.searchFields?(action.searchFields.startAddress?action.searchFields.startAddress:''):(action.startAddress?action.startAddress:'');
      const endAddress=action.searchFields?(action.searchFields.endAddress?action.searchFields.endAddress:''):(action.endAddress?action.endAddress:'');
			const transportStatus=action.searchFields?(action.searchFields.transportStatus?action.searchFields.transportStatus:0):(action.transportStatus?action.transportStatus:0);
      action.startTime = startTime;
      action.endTime = endTime;
      action.syscode = syscode;
      action.customerNumber = customerNumber;
      action.startAddress = startAddress;
      action.endAddress = endAddress;
			action.transportStatus = transportStatus;
      const dat = yield call(RVCCON_searchList,action);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        const total = parseInt(Message)
        let page=action.page
        if(Success){
          yield put({type:'setdata',Data,total,page,startTime,endTime,syscode,customerNumber,startAddress,endAddress,transportStatus});
        }else{
          message.destroy();
          message.error(Message);
        }
      }
    },
  },
  subscriptions: {},
};
