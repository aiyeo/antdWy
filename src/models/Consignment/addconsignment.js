import {message} from 'antd';
import {getProvinces,getPCitys,getCDistricts} from '../../services/index';
import {CONSI_getCardlist,CONSI_getShipperList,CONSI_getReceiveList,CONSI_getOrderinfo,
  CONSI_AddCosignment,CONSI_getvtlist,CONSI_getreqlist,
  CONSI_getUesedGoods,CONSI_ggetCompanylist,CONSI_getMeasurelist,COSI_getCosignCode,CONSI_UpdateCosignment
} from '../../services/consignment'
import { routerRedux } from 'dva/router';

export default {
  namespace: 'addconsignment',
  state: {
    cData:[],//省市数据
    Measuret:[],//计量单位
    showCard:false,//银行卡弹框显示状态
    cardlist:[],//银行卡列表
    totalcard:0,//银行卡总数
    ShipperList:[],//联系人列表
    showShipper:false,//联系人弹框显示状态
    showReceive:false,
    totalShipper:0,//发货联系人总数
    totalReceive:0,//收货联系人
    forwardingName:null,//发货单位名称初始值
    Consignor:null,//发货人初始值
    DispatchTel:null,//发货电话初始值
    ReceivingName:null,//收货单位初始值
    Consignee:null,//收货人初始值
    ReceivingTel:null,//收货电话初始值
    btnid:'',//点击的选择联系人的按钮
    OpeningBankName:'',//开户行名称
    BankAccountName:'',//户名
    CardNumber:'',//卡号
    CardId:'',//银行卡id
    GoodsData:[],//货物信息列表
    BuyInsurance:false,//保险金额编辑状态
    TotalFreight:0,//总运费
    orderStatus:0,//订单状态，未提交就修改，已提交就查看，不可编辑
    RequestList:[],//回单要求
    VerTYpelist:[],//车型要求,
    UesedGoods:[],//常用货品
    orderInfo:{},//订单详情
    showCompany:false,//显示承运方弹框
    totalCompany:0,//承运方总条数
    companylist:[],//承运方数据  ,
    CompanyName:'',//承运方初始值
    CarrierCompanyName:'',
    companyId:'',//承运方公司id
    CosignmentCode:'',//运单编号,
    modal_id:'',//模块id
    loadingPeople:true,//加载联系人列表  loading
    loadingCompany:true,//加载承运方列表  loading
    signModal:false,
    shipperchange:true,//发货信息编辑状态
    receiverchange:true,//收货信息编辑状态
    PickupTime:0,
    DeliveryTime:0,
    StartAddName:[],
    EndAddName:[],
    DischargingModal:false,
    unloadModal:false,//卸货模态框
    receivePageIndex:1,
    shipPageIndex:1,
    companyPageIndex:1,
    initFreight:null,//初始运费
    DispatchDrress:'',//发货地址
    ReceivDrress:'',//收货地址
    waitingDispatch:false,//等通知发货
    InsuranceAmount:0,//保险金额
  },
  reducers: {
    //省市区名字--Name
    san(state,action){
      return Object.assign({},state,{StartAddName:action.s});
    },
    //省市区名字--Name
    ean(state,action){
      return Object.assign({},state,{EndAddName:action.s});
    },
    //获取运单编号
    setCosignCode(state,action){
      return Object.assign({},state,{CosignmentCode:action.Message});
    },
    //省市区级联状态
    updateCData(state, action){
      return Object.assign({},state,{cData: action.arrs})
    },
    updateCDatas(state, action) {
      return Object.assign({},state,{cData: [...state.cData]})
    },
    setMeasuret(state,action){//设置计量单位
      return Object.assign({},state,{Measuret:action.measure})
    },
    showCardModal(state,action){//显示银行卡弹框
      return Object.assign({},state,{showCard: true})
    },
    closeCardModal(state,action){//关闭联系人弹框
      return Object.assign({},state,{showCard: false})
    },
    showShipperModal(state,action){//显示发货联系人弹框
      return Object.assign({},state,{showShipper: true,btnid:action.btnid,shipperchange:true})
    },
    closeShipperModal(state,action){//关闭发货联系人弹框
      return Object.assign({},state,{showShipper: false,shipperchange:true,shipperTelchange:true,shipperNamechange:true,receiverchange:true})
    },
    showReceiveModal(state,action){//显示发货联系人弹框
      return Object.assign({},state,{showReceive: true,btnid:action.btnid,shipperchange:true})
    },
    closeReceiveModal(state,action){//关闭发货联系人弹框
      return Object.assign({},state,{showReceive: false,shipperchange:true,shipperTelchange:true,shipperNamechange:true,receiverchange:true})
    },
    setCardlist(state,action){//获取银行卡列表
      return Object.assign({},state,{cardlist: action.Data,totalcard:action.total})
    },
    setShipperList(state,action){//获取联系人列表
      return Object.assign({},state,{ShipperList: action.Data,totalShipper:action.total,loadingPeople:false,shipPageIndex:action.shipPageIndex})
    },
    setReceiveList(state,action){//获取收货联系人列表
      return Object.assign({},state,{ReceiveList:action.Data,totalReceive:action.total,loadingPeople:false,receivePageIndex:action.receivePageIndex})
    },

    setDispatch(state,action){//设置发货方信息 （回显）
      return Object.assign({},state,{forwardingName: action.CompanyName,Consignor:action.ContacterName,DispatchTel:action.MobileNo,shipperchange:false,DispatchDrress:action.Address})
    },
    setCompanyName(state,action){//设置发货单位
      return Object.assign({},state,{forwardingName: action.forwardingName})
    },
    setShipperName(state,action){//设置发货人
      return Object.assign({},state,{Consignor: action.Consignor})
    },
    setShipperTel(state,action){//设置发货电话
      return Object.assign({},state,{DispatchTel: action.DispatchTel})
    },
    setShipperDrress(state,action){//设置发货地址
      return Object.assign({},state,{DispatchDrress: action.DispatchDrress})
    },
    setReceivingName(state,action){//设置收货单位
      return Object.assign({},state,{ReceivingName: action.ReceivingName})
    },
    setConsignee(state,action){//设置收货人
      return Object.assign({},state,{Consignee: action.Consignee})
    },
    setReceivingTel(state,action){//设置收货电话
      return Object.assign({},state,{ReceivingTel: action.ReceivingTel})
    },
    setReceivDrress(state,action){//设置收货地址
      return Object.assign({},state,{ReceivDrress: action.ReceivDrress})
    },
    setCompanyNameInput(state,action){//设置发货方input框的编辑状态
      return Object.assign({},state,{shipperchange:false})
    },
    setReceiverInput(state,action){//设置收货方input框的编辑状态
      return Object.assign({},state,{receiverchange:false})
    },

    setReceiving(state,action){//设置收货方信息（回显）
      return Object.assign({},state,{ReceivingName: action.CompanyName,Consignee:action.ContacterName,ReceivingTel:action.MobileNo,ReceivDrress:action.Address})
    },
    setCardinfo(state,action){//设置银行卡信息（回显）
      return Object.assign({},state,{OpeningBankName: action.OpeningBankName,BankAccountName:action.BankAccountName,CardNumber:action.CardNumber,CardId:action.CardId})
    },
    changeBuyInsurance(state,action){//切换保险金额编辑状态
      return Object.assign({},state,{BuyInsurance:action.BuyInsurance})
    },
    setFreight(state,action){//货物数据和总运费
      return Object.assign({},state,{TotalFreight:action.TotalFreight,initFreight:null,GoodsData:action.GoodsData})
    },
    setInsuranceAmount(state,action){
       return Object.assign({},state,{InsuranceAmount:action.InsuranceAmount})
    },
    setOrderinfo(state,action){//用返回数据设置表单信息以及表格货物信息orderInfo
      return Object.assign({},state,
      {orderInfo:action.Data,GoodsData:action.GoodsData,modal_id:action.modal_id,initFreight:action.initFreight,
        forwardingName:action.Data.ConsignmentShipperModel?action.Data.ConsignmentShipperModel.CompanyName:null,//发货单位名称初始值
        Consignor:action.Data.ConsignmentShipperModel?action.Data.ConsignmentShipperModel.ShipperName:null,//发货人初始值
        DispatchTel:action.Data.ConsignmentShipperModel?action.Data.ConsignmentShipperModel.ShipperTel:null,//发货电话初始值
        DispatchDrress:action.Data.ConsignmentShipperModel?action.Data.ConsignmentShipperModel.ShipperAddress:null,
        ReceivingName:action.Data.ConsignmentReceivingModel?action.Data.ConsignmentReceivingModel.CompanyName:null,//收货单位初始值
        Consignee:action.Data.ConsignmentReceivingModel?action.Data.ConsignmentReceivingModel.ReceivingName:null,//收货人初始值
        ReceivingTel:action.Data.ConsignmentReceivingModel?action.Data.ConsignmentReceivingModel.ReceivingTel:null,//收货电话初始值
        ReceivDrress:action.Data.ConsignmentReceivingModel?action.Data.ConsignmentReceivingModel.ReceivingAddress:null,
        waitingDispatch:action.Data.waitingDispatch,BuyInsurance:action.Data.IsBuyInsurance,
        InsuranceAmount:action.Data.ConsignmentInsuranceModel?action.Data.ConsignmentInsuranceModel.InsuranceAmount:0,
        CarrierCompanyName:action.Data.ConsignmentCarrierModel?action.Data.ConsignmentCarrierModel.CompanyName:'',
     })
    },
    setVerTYpelist(state,action){//设置车型要求 setVerTYpelist
      return Object.assign({},state,{VerTYpelist:action.Data})
    },
    setRequestList(state,action){//设置回单要求 RequestList VerTYpelist
      return Object.assign({},state,{RequestList:action.Data})
    },
    setUesedGoods(state,action){//设置常用货品列表数据
      return Object.assign({},state,{UesedGoods:action.goods})
    },
    clearInfo(state,action){//清空页面数据
      return Object.assign({},state,{orderInfo:{},GoodsData:[],initFreight:0,TotalFreight:0,forwardingName:'',
      Consignor:'', DispatchTel:'',ReceivingName:'',Consignee:'',ReceivingTel:'',InsuranceAmount:0,
      ReceivDrress:'',DispatchDrress:'',waitingDispatch:false,BuyInsurance:false,CarrierCompanyName:'',MemberId:'',companyId:''
  })
    },
    clearFreigth(state,action){
      return  Object.assign({},state,{TotalFreight:0})
    },
    showComModal(state,action){
      return Object.assign({},state,{showCompany:true})
    },
    closeComModal(state,action){
      return Object.assign({},state,{showCompany:false})
    },
    setCompanylist(state,action){//设置运输公司列表数据
      return Object.assign({},state,{companylist:action.CompanyList,totalCompany:action.total,loadingCompany:false,companyPageIndex:action.companyPageIndex})
    },
    saveCompany(state,action){
      return Object.assign({},state,{companyId:action.companyId,CarrierCompanyName:action.CompanyName})
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
    //设置取货时间
    setPickupTime(state,action){
      return Object.assign({},state,{PickupTime:action.value})
    },
    //设置送货时间
    setDeliveryTime(state,action){
      return Object.assign({},state,{DeliveryTime:action.value})
    }
  },
  //查看卸货信息
  showDisModal(state,action){
    return Object.assign({},state,{DischargingModal:true})
  },
  closeDisModal(state,action){
    return Object.assign({},state,{DischargingModal:false})
  },
  effects: {
    *getCosignCode(action,{call,put}){
      const dat = yield call(COSI_getCosignCode,action);
      if(!dat.err){
        const {Success,Data,Message} = dat.data;
        if(Success){
          yield put({
            type:'setCosignCode',
            Message
          });
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    //获取省数据
    *getprovines(payload, { call, put }) {
      const dat = yield call(getProvinces,payload);
      if(!dat.err){
        const {Success,Data,Message} = dat.data;
        if(Success){
          let arrs=[];
          Data.map(item => {
              let tempObj = {}
              tempObj.label = item.Name
              tempObj.value = item.ProvinceId
              tempObj.isLeaf = false
              arrs.push(tempObj)
            }
          );
          yield put({
            type:'updateCData',
            arrs
          });
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    //获取市数据
    *getPcitys(payload, { call, put }) {
      payload.targetOption.loading = true;
      const dat = yield call(getPCitys,payload);
      let arrs=payload.cData;
      if(!dat.err){
        const {Success,Data,Message} = dat.data;
        if(Success){
          payload.targetOption.loading = false;
          payload.targetOption.children = Data.map(item=>({
            label:item.Name,
            value:item.CityId,
            isLeaf:false
          }))
          yield put({
            type:'updateCDatas',
          });
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    //获取区域数据
    *getcdistricts(payload, { call, put }) {
      payload.targetOption.loading = true;
      let cData=payload.cData;
      const dat = yield call(getCDistricts,payload);
      if(!dat.err){
        const {Success,Data,Message} = dat.data;
        if(Success){
          let arrs=[];
          payload.targetOption.loading = false;
          payload.targetOption.children=Data.map(item=>({
            label:item.Name,
            value:item.DistrictId
          }))
          yield put({
            type:'updateCDatas',

          });
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    *getmeasuretlist(action,{call,put}){//获取计量单位
      const dat = yield call(CONSI_getMeasurelist,action);
      if(!dat.err){
        const {Success,Data,Message} = dat.data;
        let measure = [];
        Data.map(list=>{
          measure.push({code:list.Desction,text:list.Desction})
        })
        if(Success){
          yield put({
            type:'setMeasuret',
            measure
          });
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    //获取银行卡列表
    *getCardlist(action, { call, put }) {
      const dat = yield call(CONSI_getCardlist,action);
      if(!dat.err){
        const {Success,Data,Message} = dat.data;
        const total = parseInt(Message);
        if(Success){
          yield put({
            type:'setCardlist',
            Data,
            total
          });
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    *getShipperList(action, { call, put }) {//获取发货联系人列表
      const dat = yield call(CONSI_getShipperList,action);
      if(!dat.err){
        const {Success,Data,Message} = dat.data;
        const total = parseInt(Message);
        let shipPageIndex = action.shipperPage?action.shipperPage:1;
        if(Success){
          yield put({
            type:'setShipperList',
            Data,
            total,
            shipPageIndex
          });
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    *getReceiveList(action, { call, put }) {//获取收货联系人列表
      const dat = yield call(CONSI_getReceiveList,action);
      if(!dat.err){
        const {Success,Data,Message} = dat.data;
        const total = parseInt(Message);
        let receivePageIndex = action.receivePage?action.receivePage:1;
        if(Success){
          yield put({
            type:'setReceiveList',
            Data,
            total,
            receivePageIndex
          });
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    *getOrderinfo(action,{call,put,select}){//获取订单详细信息
      const dat = yield call(CONSI_getOrderinfo,action.orderId);
      const modal_id = yield select(state => state.myconsignment.modalId);
       const Measuret = yield select(state => state.addconsignment.Measuret);

      if(!dat.err){
        const {Success,Data,Message} = dat.data;
         let initFreight=null;
        if(Success){
          const {ConsignGoodsModelList,ConsignmentDistPaymentModel}=Data;
          let GoodsData=[];
          if(ConsignGoodsModelList && ConsignGoodsModelList.length!=0){
            ConsignGoodsModelList.map(item=>{
              let newItem = {};
              newItem
              let type=null;
              for(var i in item){
                switch(i){
                  case 'BatchNumber':type='input';
                  break;
                   case 'BillingQuantity':type='inputNumber';
                  break;
                   case 'Freight':type='inputNumber';
                  break;
                   case 'GoodsName':type='input';
                  break;
                   case 'MeasurementUnit':type='baseSelect';
                  break;
                   case 'Package':type='input';
                  break;
                   case 'PiecesNumber':type='inputNumber';
                  break;
                   case 'Specifications':type='input';
                  break;
                   case 'TextureOfMaterial':type='input';
                  break;
                   case 'TypeOfGoods':type='input';
                  break;
                   case 'UnitPrice':type='inputNumber';
                  break;
                   case 'Volume':type='inputNumber';
                  break;
                   case 'Weight':type='inputNumber';
                  break;
                  default: type=null;
                  break
                }

                 if(i=='MeasurementUnit'){
                   newItem[i]={
                  editable:false,
                  type:type,
                  value:item[i] ,
                  dataSource:Measuret
                  }
                 }else{
                   newItem[i]={
                  editable:false,
                  type:type,
                  value:item[i]
                 }
                 }
              }
              newItem.key=item.Id
              delete newItem.Id
              delete newItem.ConsignmentId
              GoodsData.push(newItem)
            })
          }
          if(ConsignmentDistPaymentModel){
            initFreight = ConsignmentDistPaymentModel.Freight
          }
          yield put({
            type:'setOrderinfo',
            Data,
            modal_id,
            GoodsData,
            initFreight,
          });
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    *AddCosignment(action,{call,put,select}){//新增托运单
      const dat = yield call(CONSI_AddCosignment,action);
      if(!dat.err){
        const {Success,Data,Message} = dat.data;
        if(Success){
          message.destroy()
          message.success('保存成功');
          const modal_id = yield select(state => state.myconsignment.modalId);
          window.history.go(-1)
         // yield put(routerRedux.push(`/consignment/${modal_id}`));
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    *UpdateCosignment(action,{call,put,select}){
      const dat = yield call(CONSI_UpdateCosignment,action);
      if(!dat.err){
        const {Success,Data,Message} = dat.data;
        if(Success){
          message.destroy()
          message.success('修改成功');
          const modal_id = yield select(state => state.myconsignment.modalId);
          // console.log(this.props)
          window.history.go(-1)
         // yield put(routerRedux.push(`/consignment/${modal_id}`));
        }else{
          message.destroy()
          message.error(Message);
        }
      }else{
        message.destroy()
        message.error('服务器繁忙，请稍后再试!')
      }
    },
    //获取回单要求
    *getreqlist(action,{call,put}){
      const dat = yield call(CONSI_getreqlist,action);
      if(!dat.err){
        const {Success,Data,Message} = dat.data;
        if(Success){
          yield put({
            type:'setRequestList',
            Data
          });
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    //获取车型要求
    *getvtlist(action,{call,put}){
      const dat = yield call(CONSI_getvtlist,action);
      if(!dat.err){
        const {Success,Data,Message} = dat.data;
        if(Success){
          yield put({
            type:'setVerTYpelist',
            Data
          });
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    *getUesedGoods(action,{call,put}){//获取常用货品列表
      const dat = yield call(CONSI_getUesedGoods,action);
      if(!dat.err){
        const {Success,Data,Message} = dat.data;
        let goods = [];
        Data.map(good=>{
          goods.push(good.Name);
        })
        if(Success){
          yield put({
            type:'setUesedGoods',
            goods
          });
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    *getCompanylist(action,{call,put}){//获取承运方列表
      const dat = yield call(CONSI_ggetCompanylist,action);
      if(!dat.err){
        const {Success,Data,Message} = dat.data;
        const total = parseInt(Message);
        let CompanyList = [];
        Data.map(list=>{
          let companyId= list.MemberId;
          let CompanyName =  list.CompanyName;
          let Tel= list.Tel;
          let companyLegal = list.LegalRepresentative;

          let listobj = {
            companyId,
            CompanyName,
            Tel,
            companyLegal
          }
          CompanyList.push(
            listobj
          )
        })
        let companyPageIndex = action.companyPageIndex?action.companyPageIndex:1;
        if(Success){
          yield put({
            type:'setCompanylist',
            CompanyList,
            total,
            companyPageIndex
          });
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    }
  },

  subscriptions: {},
};
