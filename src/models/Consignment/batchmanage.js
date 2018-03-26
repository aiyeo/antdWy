import {BATCH_getBatchList,BATCH_loadBatchArrive,BATCH_loadBatchSign} from '../../services/consignment';
import {message} from 'antd';
import Moment from 'moment';
export default {
  namespace: 'batchmanage',
  state: {
    tData:[],
    pageIndex:1,
    startTime:'',
    endTime:'',
    licensePlateNumber:'',
    driverName:'',
    total:'',
    loadingBatch:'',
    transportStatus:0,
    signModalShow:false,//确认到站弹框
    arriveImageList:[],//到站图片列表
    showSignConsignModal:false,//签收弹出框
    currentCode:'',//当前运单编号
    SignConsignmentId:'',//签收运单的id
    SignImageList:[],//签收卸货图片列表
    dateArrive:'',
    dateDischarge:'',
    LoadingBatchId:'',//当前被选中批次id
    showSignConsignModal:false,//签收弹出框
    SignImageList:[],//签收卸货图片列表
    Item:{},
  },
  reducers: {
  	setBatchList(state,action){//设置列表数据
      return Object.assign({},state,{
      	tData: action.Data,
      	total:action.total,
      	startTime:action.startTime,
      	endTime:action.endTime,
      	licensePlateNumber:action.licensePlateNumber,
      	driverName:action.driverName,
        pageIndex:action.pageIndex,
        transportStatus:action.transportStatus,
      })
   	} ,
   	showLoadingGoods(state,action){//显示确认装车弹框
     	return Object.assign({},state,{loadingModalShow:true})
   	},
   	showSignModal(state,action){//显示到站卸货弹框
     	return Object.assign({},state,{signModalShow:true})
   	},
   	closeSignModal(state,action){
     	return Object.assign({},state,{signModalShow:false,arriveImageList:[]})
   	},
   	SetArriveImage(state,action){//设置上传到站图片的图片列表
    	return Object.assign({},state,{arriveImageList:action.fileList});
   	},
   	deletArriveImage(state,action){//删除上传到站图片的图片列表
    	return Object.assign({},state,{arriveImageList:action.removelist});
   	},
   	showSignConsignModal(state,action){ //签收弹框
     	return Object.assign({},state,{showSignConsignModal:true,Item:action.item})
   	},
   	closeSignConsignModal(state,action){
     	return Object.assign({},state,{showSignConsignModal:false,SignImageList:[]})
   	},
   	SetSignImage(state,action){//设置签收卸货图片
     	return Object.assign({},state,{SignImageList:action.fileList});
   	},
   	deletSignImage(state,action){//删除签收卸货图片的图片列表
    	return Object.assign({},state,{SignImageList:action.removelist});
   	},
   	getDateArrive(state,action){//到站时间
    	return Object.assign({},state,{dateArrive:action.dateArrive});
   	},
   	getDateDischarge(state,action){//卸货时间
    	return Object.assign({},state,{dateDischarge:action.dateDischarge});
   	},
   	setBatchId(state,action){//设置当前批次id
    	return Object.assign({},state,{LoadingBatchId:action.LoadingBatchId})
   	},
  },
  effects: {
    *search(action,{call,put}){
    	const startTime=action.searchFields?(action.searchFields.startTime?Moment(action.searchFields.startTime).format('YYYY-MM-DD'):''):(action.startTime?action.startTime:'')
    	const endTime=action.searchFields?(action.searchFields.endTime?Moment(action.searchFields.endTime).format('YYYY-MM-DD'):''):(action.endTime?action.endTime:'');
    	const licensePlateNumber=action.searchFields?(action.searchFields.licensePlateNumber?action.searchFields.licensePlateNumber:''):(action.licensePlateNumber?action.licensePlateNumber:'');
			const driverName=action.searchFields?(action.searchFields.driverName?action.searchFields.driverName:''):(action.driverName?action.driverName:'');
			const loadingBatch=action.searchFields?(action.searchFields.loadingBatch?action.searchFields.loadingBatch:''):(action.loadingBatch?action.loadingBatch:'');
			const truckBatchStatus=action.searchFields?(action.searchFields.truckBatchStatus?action.searchFields.truckBatchStatus:0):(action.truckBatchStatus?action.truckBatchStatus:0);
			action.startTime = startTime;
			action.endTime = endTime;
			action.licensePlateNumber = licensePlateNumber;
			action.driverName = driverName;
			action.loadingBatch = loadingBatch;
			action.truckBatchStatus = truckBatchStatus;
      const dat = yield call(BATCH_getBatchList,action);
      	if(!dat.err){
        	const {Success,Message,Data} = dat.data;
        	if(Success){
          		let total = parseInt(Message);
          		let pageIndex = 1;
	          	yield put({type:'setBatchList',Data,
	                total,pageIndex,startTime,endTime,licensePlateNumber,driverName,loadingBatch,truckBatchStatus
	            });
        	}else{
	          	message.destroy()
	          	message.error(Message);
        	}
      	}
    },
    //批次到站
    *LoadBatchArrive(action,{call,put}){
	    const dat = yield call(BATCH_loadBatchArrive,action);
	    if(!dat.err){
	      const {Success,Data,Message} = dat.data;
	      if(Success){
	      	let page=action.page;
	        message.destroy()
	        message.success('批次到站成功')
	        yield put({type:'closeSignModal'})
	        yield put({type:'search',page})
	      }else{
	      	yield put({type:'closeSignModal'})
	        message.destroy()
	        message.error(Message);
	      }
	    }
	  },
	  //批次签收
    *LoadBatchSign(action,{call,put}){
	    const dat = yield call(BATCH_loadBatchSign,action);
	    if(!dat.err){
	      const {Success,Data,Message} = dat.data;
	      if(Success){
	      	let page=action.page;
	        message.destroy()
	        message.success('批次签收成功')
	        yield put({type:'closeSignConsignModal'})
	        yield put({type:'search',page})
	      }else{
	      	yield put({type:'closeSignConsignModal'})
	        message.destroy()
	        message.error(Message);
	      }
	    }
	  },
  },
  subscriptions: {},
};
