import {CARR_loadingGoods,CARR_getDriverList,CARR_arriveSign,CARR_refuse,CARR_getCarlist,CONSI_signConsignment,
	CONCON_searchList,CARR_batchLoading,CARR_batchArrive,CARR_batchRecivce,CARR_splitLoading,CARR_getSingleList} from '../../services/carrierConsignment';
import {message} from 'antd';
import Moment from 'moment';
export default {
  namespace: 'loadingcar',
  state: {
  	singleData:[],
    carrierCosignList:[],//我的货运单列表
    totalList:0,//列表总数
    loadingModalShow:false,//确认装车弹框显示
    showDriverModal:false,//选择司机弹框
    driverlist:[],//驾驶员列表
    totalDriver:0,//驾驶员总数
    showCar:false,
    totalCar:0,//车辆总数
    carList:[],//车辆列表数据
    currentConsignmentId:'',//当前被选中运单id
    carNo:'',//选择的车牌号
    carId:'',//选择的车辆id
    driverName:'',//选择的司机
    TruckType:'',
    DriverTel:'',//选择的司机电话
    driverId:'',//选择的司机id
    loadingCarrList:true,//加载托运单列表loading
    loadingDriver:true,//加载司机列表状态 loading
    loadingCar:true,//加载车辆状态  loading
    pageIndex:1,
    carPage:1,
    driverPage:1,
    startTime:'',
    endTime:'',
    syscode:'',
		getDataArr:[],
		newCosignList:[],
		getBatchInArr:[],
		getBatchSignArr:[],
		CarId:'',
		singleLoadModal:false, //单个装车弹框
		setLoadingArr:[],
		getAllLoading:[],
		showLoadingEditModal:false,
		loadingTimes:'',
		loadingIndex:0,
		carIdArr:[],//不能为同一辆车
		yesStatus:false,
  },
  reducers: {
   	getyesStatus(state,action){
   		console.log(action)
      return Object.assign({},state,{yesStatus:action.status});
    },
   setCurrentId(state,action){//设置当前运单id
    return Object.assign({},state,{currentConsignmentId:action.id})
   },
   showLoadingGoods(state,action){//显示确认装车弹框
     return Object.assign({},state,{loadingModalShow:true,carNo:'',driverName:'',DriverTel:''})
   },
   closeLoadingGoods(state,action){//关闭确认装车弹框
     return Object.assign({},state,{loadingModalShow:false})
   },
   showLoadingEdit(state,action){//显示编辑装车弹框
     return Object.assign({},state,{showLoadingEditModal:true})
   },
   closeLoadingEdit(state,action){//关闭编辑装车弹框
     return Object.assign({},state,{showLoadingEditModal:false})
   },
   getLoadingList(state,action){//设置大list
     return Object.assign({},state,{getAllLoading:[...state.getAllLoading,action.param]})
   },
   setLoadingList(state,action){//获取大list
     return Object.assign({},state,{getAllLoading:action.getAllLoading})
   },
   delLoadingList(state,action){//删除大list
     return Object.assign({},state,{getAllLoading:[...state.getAllLoading]})
   },
   clearLoadingList(state,action){//清空大list
     return Object.assign({},state,{getAllLoading:[]})
   },
   getloadingIndex(state,action){
   	return Object.assign({},state,{loadingIndex:action.index})
   },
   removeCarArr(state,action){//删除车arr
     return Object.assign({},state,{carIdArr:[...state.carIdArr]})
   },
   delCarArr(state,action){//删除车arr
     return Object.assign({},state,{carIdArr:[]})
   },
   showDriverModal(state,action){//显示驾驶员弹框
     return Object.assign({},state,{showDriverModal:true})
   },
   closeDriverModal(state,action){
     return Object.assign({},state,{showDriverModal:false})
   },
    showCarModal(state,action){//显示车辆弹框
     return Object.assign({},state,{showCar:true})
   },
   closeCarModal(state,action){
     return Object.assign({},state,{showCar:false})
   },
   setDriverlist(state,action){//设置驾驶员列表数据
     return Object.assign({},state,{driverlist:action.Data,totalDriver:action.total,loadingDriver:false,driverPage:action.driverPage,driverName:action.name})
   },
   setCarlist(state,action){
     return Object.assign({},state,{carList:action.Data,totalCar:action.total,loadingCar:false,carPage:action.carPage,carNo:action.carNo})
   },
   setSelectCarNo(state,action){//选择车牌，设置车牌
    return Object.assign({},state,{carNo:action.carNo,TruckType:action.CarModelName,CarId:action.Id})
   },
   setSelectDriver(state,action){//选择司机
    return Object.assign({},state,{driverName:action.driverName,DriverTel:action.Phone})
   },
   setSelectDrivername(state,action){
    return Object.assign({},state,{driverName:action.driverName})
   },
   setSelectDriPhone(state,action){
    return Object.assign({},state,{DriverTel:action.Phone})
   },

   updatePage(state,action){
      return Object.assign({},state,{pageIndex:action.page});
    },
    updateCarPage(state,action){
      return Object.assign({},state,{carPage:action.page});
    },
    updateDriverPage(state,action){
      return Object.assign({},state,{driverPage:action.page});
    },
    loadingFalse(state,action){
      return Object.assign({},state,{loadingTable:false,});
    },
    showSingleModal(state,action){
      return Object.assign({},state,{singleLoadModal:true});
    },
    closeSingleModal(state,action){
      return Object.assign({},state,{singleLoadModal:false});
    },
    getSingleData(state,action){
      return Object.assign({},state,{singleData:action.Data});
    },
  },
  effects: {
  	*getsingle(action,{call,put}){
	    const dat = yield call(CARR_getSingleList,action);
	    if(!dat.err){
	      const {Success,Data,Message} = dat.data;
	      let page = action.driverPage;
	      if(Success){
	        let total = parseInt(Message);
	        yield put({
	          type:'getSingleData',
	          Data,
	        })
	      }
	    }
	  },
  *getDriverlist(action,{call,put}){
  	const driverName=action.value?(action.value.name?action.value.name:''):(action.name?action.name:'');
		action.name = driverName;
    const dat = yield call(CARR_getDriverList,action);
    if(!dat.err){
      const {Success,Data,Message} = dat.data;
      let page = action.driverPage;
      if(Success){
        let total = parseInt(Message);
        yield put({
          type:'setDriverlist',
          Data,
          total,
          page,
          driverName
        })
      }
    }
  },
  *getCarlist(action,{call,put}){
  	const carNo=action.value?(action.value.carNo?action.value.carNo:''):(action.carNo?action.carNo:'');
		action.carNo = carNo;
    const dat = yield call(CARR_getCarlist,action);
    if(!dat.err){
      const {Success,Data,Message} = dat.data;
      if(Success){
        let total = parseInt(Message);
        let carPage = action.carPage;
        yield put({
          type:'setCarlist',
          Data,
          total,
          carPage,
          carNo
        })
      }
    }
  },
  //确认装车成功
  *sureLoading(action,{call,put,select}){
      const dat = yield call(CARR_splitLoading,action);
      if(!dat.err){
        const {Success,Data,Message} = dat.data;
        if(Success){
          message.destroy()
          message.success('装车成功!');
          yield put({type:'loadingcar/clearLoadingList'});
          setTimeout(()=>{
          	window.history.go(-1);
            dispatch({type:'consignmentCarrier/search'});
          },1000)
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
  },
  subscriptions: {},
};
