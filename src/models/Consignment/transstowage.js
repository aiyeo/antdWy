import {STO_detail,STO_searchList,STO_Arrive,STO_goodsdetail} from '../../services/index';
import {message} from 'antd';
import Moment from 'moment';

export default {
  namespace: 'transstowage',
  state: {
    tData: [],
    item: {},
    loading: false,
    total:'',
    modalShow:false,
    truckId:'',
    TransInfo:{},
    consignmentLists:[],
    pageIndex:1,
    startTime:'',
    endTime:'',
    endAddress:'',
    startAddress:'',
    driverName:'',
    status:'',
    licensePlateNumber:'',
    ConsignTruckArrivalPictureList:[],
    modalShowDetail:false,
  },
  reducers: {
    setlist(state,action){
      return Object.assign({},state,{
        tData:action.Data,
        total:action.total,
        loading:false,
        modalShow: false,
        pageIndex:action.page,
        startTime:action.startTime,
        endTime:action.endTime,
        endAddress:action.endAddress,
        startAddress:action.startAddress,
        driverName:action.driverName,
        status:action.status,
        licensePlateNumber:action.licensePlateNumber
      });
    },
    //到站模态框
    showarrivemodel(state,action){
      return Object.assign({},state,{modalShow:true,ConsignTruckArrivalPictureList:[],item:action.item});
    },
    closearrivemodel(state,action){
      return Object.assign({},state,{modalShow:false});
    },
    //详情
    getSTOdetail(state,action){
      return Object.assign({},state,{TransInfo:action.Data});
    },
    getPageNum(state,action){
      return Object.assign({},state,{pageIndex:action.page});
    },
    //保存到站单据图片上传
    saveArriveimage(state,action){
      return Object.assign({},state,{AddFirstPhoto:action.fileList});
    },
    deleteArriveimage(state,action){
      return Object.assign({},state,{AddFirstPhoto:action.removelist});
    },
    //详情页面货物来源模态框
    showmoredetailmodel(state, action){
      return Object.assign({},state,{modalShowDetail:true,consignmentLists:action.Data})
    },
    closemoredetailmodel(state, action){
      return Object.assign({},state,{modalShowDetail:false})
    }
  },
  effects: {
    *getgoodsdetail(action,{call,put}){
      const dat = yield call(STO_goodsdetail,action);
      if(!dat.err){
        let {Success,Data,Message} = dat.data;
        if(Success){
          yield put({
            type:'showmoredetailmodel',
            Data,
          })
        }else{
          message.destroy()
          message.error(Message)
        }
      }
    },
    *getdetail(action,{call,put}){
      const dat = yield call(STO_detail,action);
      if(!dat.err){
        let {Success,Data,Message} = dat.data;
        if(Success){
          yield put({
            type:'getSTOdetail',
            Data,
          })
        }else{
          message.destroy()
          message.error(Message)
        }
      }
    },
    *Arrive(action,{call,put}){
      const dat = yield call(STO_Arrive,action);
      if(!dat.err){
        const {Success,Message} = dat.data;
        if(Success){
          let page=action.pageIndex;
          message.destroy()
          message.success('到站成功！');
          yield put({
            type:'search',
            page,
          })
        }else{
          message.destroy()
          message.error(Message);
          yield put({
            type:'closearrivemodel'
          })
        }
      }
    },
    //查询
    *search(action,{call,put}){
      const startTime=action.searchFields?(action.searchFields.startTime?Moment(action.searchFields.startTime).format('YYYY-MM-DD'):''):(action.startTime?action.startTime:'')
      const endTime=action.searchFields?(action.searchFields.endTime?Moment(action.searchFields.endTime).format('YYYY-MM-DD'):''):(action.endTime?action.endTime:'');
      const endAddress = action.searchFields?(action.searchFields.endAddress?action.searchFields.endAddress:''):action.endAddress?action.endAddress:'';
      const startAddress =action.searchFields?(action.searchFields.startAddress?action.searchFields.startAddress:''):action.startAddress?action.startAddress:'';
      const driverName =action.searchFields?(action.searchFields.driverName?action.searchFields.driverName:''):action.driverName?action.driverName:'';
      const status =action.searchFields?(action.searchFields.status?action.searchFields.status:0):action.status?action.status:0;
      const licensePlateNumber =action.searchFields?(action.searchFields.licensePlateNumber?action.searchFields.licensePlateNumber:''):action.licensePlateNumber?action.licensePlateNumber:'';
      action.startTime=startTime;
      action.endTime = endTime;
      action.endAddress=endAddress;
      action.startAddress=startAddress;
      action.driverName=driverName;
      action.status=status;
      action.licensePlateNumber = licensePlateNumber;
      const dat = yield call(STO_searchList,action);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        const total = parseInt(Message);
        let page=action.page;
        if(Success){
          yield put({
            type:'setlist',
            Data,
            total,
            page,
            startTime,
            endTime,
            endAddress,
            startAddress,
            driverName,
            status,licensePlateNumber
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
