import {CARR_loadingGoods,CARR_getDriverList,CARR_arriveSign,CARR_refuse,CARR_getCarlist,CONSI_signConsignment,
  CONCON_searchList,CARR_batchLoading,CARR_batchArrive,CARR_batchRecivce} from '../../services/carrierConsignment';
import {message} from 'antd';
import Moment from 'moment';
export default {
  namespace: 'consignmentCarrier',
  state: {
    item:{},
    carrierCosignList:[],//我的货运单列表
    totalList:0,//列表总数
    loadingModalShow:false,//确认装车弹框显示
    refuseModalShow:false,//拒绝弹框显示
    signModalShow:false,//确认到站弹框
    showDriverModal:false,//选择司机弹框
    driverlist:[],//驾驶员列表
    totalDriver:0,//驾驶员总数
    showCar:false,
    totalCar:0,//车辆总数
    carList:[],//车辆列表数据
    currentConsignmentId:'',//当前被选中运单id
    arriveConsignmentId:'',
    carNo:'',//选择的车牌号
    carId:'',//选择的车辆id
    driverName:'',//选择的司机
    TruckType:'',
    DriverTel:'',//选择的司机电话
    driverId:'',//选择的司机id
    loadingCarrList:true,//加载托运单列表loading
    loadingDriver:true,//加载司机列表状态 loading
    loadingCar:true,//加载车辆状态  loading
    arriveImageList:[],//到站图片列表
    SignImageList:[],//签收卸货图片列表
    showSignConsignModal:false,//签收弹出框
    currentCode:'',//当前运单编号
    SignConsignmentId:'',//签收运单的id
    pageIndex:1,
    carPage:1,
    driverPage:1,
    startTime:'',
    endTime:'',
    syscode:'',
    shipperCompanyName:'',
    customerNumber:'',
    receiverCompanyName:'',
//  acceptanceStatus:0,
//		assignStatus:0,
    transportStatus:0,
//		receiptStatus:0,
    startAddress:'',
    endAddress:'',
    getDataArr:[],
    newCosignList:[],
    getBatchInArr:[],
    getBatchSignArr:[],
    CarId:'',
    singleLoadModal:false//单个装车弹框
  },
  reducers: {
    setCosignList(state,action){//设置列表数据
      return Object.assign({},state,{
        carrierCosignList: action.CosignList,
        newCosignList:[...action.CosignList],
        totalList:action.total,
        loadingCarrList:false,
        startTime:action.startTime,
        endTime:action.endTime,
        syscode:action.syscode,
        customerNumber:action.customerNumber,
        shipperCompanyName:action.shipperCompanyName,
        receiverCompanyName:action.receiverCompanyName,
//    	acceptanceStatus:action.acceptanceStatus,
//				assignStatus:action.assignStatus,
        transportStatus:action.transportStatus,
//				receiptStatus:action.receiptStatus,
        startAddress:action.startAddress,
        endAddress:action.endAddress,
        pageIndex:action.page,
      })
    } ,
    setCurrentId(state,action){//设置当前运单id
      return Object.assign({},state,{currentConsignmentId:action.currentConsignmentId})
    },
    showLoadingGoods(state,action){//显示确认装车弹框
      return Object.assign({},state,{loadingModalShow:true})
    },
    closeLoadingGoods(state,action){//关闭确认装车弹框
      return Object.assign({},state,{loadingModalShow:false,carNo:'',driverName:'',DriverTel:'',getDataArr:[]})
    },
    showRefuseModal(state,action){//显示拒绝装车弹框
      return Object.assign({},state,{refuseModalShow:true})
    },
    closeRefuseModal(state,action){
      return Object.assign({},state,{refuseModalShow:false})
    },
    showSignModal(state,action){//显示到站卸货弹框
      return Object.assign({},state,{signModalShow:true,arriveImageList:[],arriveConsignmentId:action.ConsignmentId})
    },
    closeSignModal(state,action){
      return Object.assign({},state,{signModalShow:false,getBatchInArr:[]})
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
    SetArriveImage(state,action){//设置上传到站图片的图片列表
      return Object.assign({},state,{arriveImageList:action.fileList});
    },
    deletArriveImage(state,action){//删除上传到站图片的图片列表
      return Object.assign({},state,{arriveImageList:action.removelist});
    },
    SetSignImage(state,action){//设置签收卸货图片
      return Object.assign({},state,{SignImageList:action.fileList});
    },
    deletSignImage(state,action){//删除签收卸货图片的图片列表
      return Object.assign({},state,{SignImageList:action.removelist});
    },

    showSignConsignModal(state,action){ //签收弹框
      return Object.assign({},state,{showSignConsignModal:true,currentCode:action.currentCode,SignConsignmentId:action.SignConsignmentId,SignImageList:[]})
    },
    closeSignConsignModal(state,action){
      return Object.assign({},state,{showSignConsignModal:false,currentCode:'',SignConsignmentId:'',getBatchSignArr:[]})
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
    getDataArr(state,action){
      return Object.assign({},state,{getDataArr:[...state.getDataArr]});
    },
    getBatchInArr(state,action){
      return Object.assign({},state,{getBatchInArr:[...state.getBatchInArr]});
    },
    getBatchSignArr(state,action){
      return Object.assign({},state,{getBatchSignArr:[...state.getBatchSignArr]});
    },
    showSingleModal(state,action){
      return Object.assign({},state,{singleLoadModal:true});
    },
    closeSingleModal(state,action){
      return Object.assign({},state,{singleLoadModal:false});
    },
  },
  effects: {
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
    *loadingGoods(action,{call,put}){//确认装车
      const dat = yield call(CARR_loadingGoods,action);
      if(!dat.err){
        const {Success,Data,Message} = dat.data;
        if(Success){
          let page=action.page;
          message.destroy()
          message.success('装车成功');
          yield put({type:'closeLoadingGoods'})
          yield put({
            type:'search',
            page
          })
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    *loadingGoodsBatch(action,{call,put}){//批量确认装车
      const dat = yield call(CARR_batchLoading,action);
      if(!dat.err){
        const {Success,Data,Message} = dat.data;
        if(Success){
          let page=action.page;
          message.destroy()
          message.success('装车成功');
          yield put({type:'closeLoadingGoods'})
          yield put({
            type:'search',
            page
          });
        }else{
          yield put({type:'closeLoadingGoods'})
          message.destroy()
          message.error(Message);
        }
      }
    },
    *arriveSign(action,{call,put}){//到站
      const dat = yield call(CARR_arriveSign,action);
      if(!dat.err){
        const {Success,Data,Message} = dat.data;
        if(Success){
          let page=action.page;
          message.destroy()
          message.success('确认到站成功')
          yield put({type:'closeSignModal'})
          yield put({
            type:'search',
            page
          })
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    *arriveSignBatch(action,{call,put}){//批量到站
      const dat = yield call(CARR_batchArrive,action);
      if(!dat.err){
        const {Success,Data,Message} = dat.data;
        if(Success){
          let page=action.page;
          message.destroy()
          message.success('到站成功')
          yield put({type:'closeSignModal'})
          yield put({
            type:'search',
            page
          });
        }else{
          yield put({type:'closeSignModal'})
          message.destroy()
          message.error(Message);
        }
      }
    },
    *refuseLoading(action,{call,put}){
      const dat = yield call(CARR_refuse,action);
      if(!dat.err){
        const {Success,Data,Message} = dat.data;
        if(Success){
          let page=action.page;
          message.destroy()
          message.success('已拒绝装车')
          yield put({type:'closeRefuseModal'})
          yield put({
            type:'search',
            page
          })
        }else{
          message.destroy()
          message.error(Message);
          yield put({type:'closeRefuseModal'})
        }
      }
    },
    //签收
    *assignGo(action,{call,put}){
      const dat = yield call(CONSI_signConsignment,action);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        if(Success){
          let page=action.page;
          yield put({type:'search', page});
          message.destroy()
          message.success('签收成功')
        }else{
          message.destroy();
          message.error(Message);
        }
      }
    },
    //批量签收
    *assignBatchGo(action,{call,put}){
      const dat = yield call(CARR_batchRecivce,action);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        if(Success){
          let page=action.page;
          yield put({type:'closeSignConsignModal'})
          yield put({type:'search', page});
          message.destroy()
          message.success('签收成功')
        }else{
          message.destroy();
          message.error(Message);
          yield put({type:'closeSignConsignModal'})
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
      const acceptanceStatus=action.searchFields?(action.searchFields.acceptanceStatus?action.searchFields.acceptanceStatus:3):(action.acceptanceStatus?action.acceptanceStatus:3);
      const assignStatus=action.searchFields?(action.searchFields.assignStatus?action.searchFields.assignStatus:2):(action.assignStatus?action.assignStatus:2);
      const transportStatus=action.searchFields?(action.searchFields.transportStatus?action.searchFields.transportStatus:0):(action.transportStatus?action.transportStatus:0);
//			const receiptStatus=action.searchFields?(action.searchFields.receiptStatus?action.searchFields.receiptStatus:1):(action.receiptStatus?action.receiptStatus:1);
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
      const dat = yield call(CONCON_searchList,action);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        if(Success){
          let CosignList = [];
          let total = parseInt(Message);
          let page = action.page;
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
            let AssignStatus = list.AssignStatus;
            let AcceptanceStatus = list.AcceptanceStatus;
            let TransportStatus = list.TransportStatus;
            let ContentDesc = list.ContentDesc;
            let TranStatus = list.TranStatus;
            let CreateTime = list.CreateTime;
            let DateOfArrival= list.DateOfArrival;
            let listobj = {
              ConsignmentId,
              SysCode,
              StartingAddress,
              DestinationAddress,
              ReceiveCompanyName,
              ReceivingTel,
              shipperCompanyName,
              CustomerNumber,
              ShipperTel,
              Remark,
              AssignStatus,
              ContentDesc,
              AcceptanceStatus,
              TransportStatus,
              TranStatus,
              CreateTime,
              DateOfArrival
            }
            CosignList.push(
              listobj
            )
          })
          yield put({type:'setCosignList',CosignList,
            total,page,startTime,endTime,syscode,shipperCompanyName,receiverCompanyName,startAddress,endAddress,transportStatus,acceptanceStatus,assignStatus,customerNumber
          });
        }else{
          message.destroy()
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
