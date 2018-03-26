import {BATCH_getBatchList,BATCH_loadBatchArrive,BATCH_loadBatchSign,BATCH_getSingleDetail,BATCH_getPageList,BATCH_sureNewPage,CARR_batchArrive,CARR_batchRecivce} from '../../services/consignment';
import {message} from 'antd';
import Moment from 'moment';
export default {
  namespace: 'batchlist',
  state: {
  	totalItem:{},
  	loading:true,
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
    getBatchInArr:[],
		getBatchSignArr:[],
		showPageModal:false,
		pageData:[],
		totalPage:0,
		pagePage:1,
		batchIds:[],
		removeArr:[],
  },
  reducers: {
  	showBatchData(state,action){
     	return Object.assign({},state,{totalItem:action.Data,loading:false,tData:action.Data.ConsignmentModelList})
   	},
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
   	getBatchInArr(state,action){
      return Object.assign({},state,{getBatchInArr:[...state.getBatchInArr]});
    },
    getBatchSignArr(state,action){
      return Object.assign({},state,{getBatchSignArr:[...state.getBatchSignArr]});
    },
    showPageModal(state,action){
      return Object.assign({},state,{showPageModal:true});
    },
    closePageModal(state,action){
      return Object.assign({},state,{showPageModal:false});
    },
    getpagelist(state,action){
      return Object.assign({},state,{pageData:action.Data,totalPage:action.total,pagePage:action.page});
    },
    updatePagePage(state,action){
      return Object.assign({},state,{pagePage:action.page});
    },
    getBatchIdsArr(state,action){
      return Object.assign({},state,{batchIds:[...state.batchIds]});
    },
    getRemoveArr(state,action){
      return Object.assign({},state,{removeArr:[...state.removeArr]});
    },
  },
  effects: {
  	//获取列表
  	*getBatchDetail(action,{call,put}){
      const dat = yield call(BATCH_getSingleDetail,action);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        if(Success){
        	yield put({type:'showBatchData',Data})
        }else{
          message.destroy();
          message.error(Message);
        }
      }
    },
    //新增弹框内容
    *getPageList(action,{call,put}){
      const dat = yield call(BATCH_getPageList,action);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        if(Success){
        	yield put({type:'getpagelist',Data})
        }else{
          message.destroy();
          message.error(Message);
        }
      }
    },
    //确认新增托运单
    *sureAddPage(action,{select,call,put}){
      const dat = yield call(BATCH_sureNewPage,action);
      const id = yield select(state => state.batchlist.totalItem.LoadingBatchId);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        if(Success){
        	message.destroy()
	        message.success('批次新增成功');
	        yield put({type:'getBatchDetail',id})
	        yield put({type:'closePageModal'})
        }else{
          message.destroy();
          message.error(Message);
          yield put({type:'closePageModal'})
        }
      }
    },
    //确认移除托运单
    *removeAddPage(action,{select,call,put}){
      const dat = yield call(BATCH_sureNewPage,action);
      const id = yield select(state => state.batchlist.totalItem.LoadingBatchId);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        if(Success){
        	message.destroy()
	        message.success('移除成功')
        	yield put({type:'getBatchDetail',id})
        }else{
          message.destroy();
          message.error(Message);
        }
      }
    },
    //批量到站
    *arriveSignBatch(action,{select,call,put}){
	    const dat = yield call(CARR_batchArrive,action);
	    const id = yield select(state => state.batchlist.totalItem.LoadingBatchId);
	    if(!dat.err){
	      const {Success,Data,Message} = dat.data;
	      if(Success){
	      	let page=action.page;
	        message.destroy()
	        message.success('批量到站成功')
	        yield put({type:'closeSignModal'})
	        yield put({type:'getBatchDetail',id})
	      }else{
	      	yield put({type:'closeSignModal'})
	        message.destroy()
	        message.error(Message);
	      }
	    }
	  },
	  //批量签收
    *assignBatchGo(action,{select,call,put}){
      const dat = yield call(CARR_batchRecivce,action);
      const id = yield select(state => state.batchlist.totalItem.LoadingBatchId);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        if(Success){
        	let page=action.page;
        	yield put({type:'getBatchDetail',id})
          message.destroy()
        	message.success('批量签收成功')
        }else{
          message.destroy();
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
