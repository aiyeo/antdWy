import {TM_addturck,TM_editturck,TM_deleteturck,TM_getcartype,TM_searchCar} from '../../services/index';
import {message} from 'antd';

export default {
  namespace: 'truckmanage',
  state: {
    tData: [],
    item: {},
    loading: false,
    modalShow:false,
    modalShowEdit:false,
    total:'',
    CarType:[],
    DrivingLicense:[],
    OperatingLicense:[],
    modalDetail:false,
    pageIndex:1,
    axesCount:'',
    carNo:'',
  },
  reducers: {
    settruckmanage(state,action){
      return Object.assign({},state,{tData:action.Data,loading:false,modalShow: false, modalShowEdit: false,total:action.total,axesCount:action.axesCount,carNo:action.carNo});
    },
    showAddmodal(state,action){
      return Object.assign({},state,{modalShow:true});
    },
    closeAddmodal(state,action){
      return Object.assign({},state,{modalShow:false});
    },
    closeEditmodal(state,action){
      return Object.assign({},state,{modalShowEdit:false});
    },
    showEditmodal(state,action){
      return Object.assign({},state,{modalShowEdit:true});
    },
    edittruckmanagedata(state,action){
      return Object.assign({},state,{modalShowEdit:true,item:action.item,DrivingLicense:action.item.DrivingLicense,OperatingLicense:action.item.OperatingLicense});
    },
    closemodalDetail(state,action){
      return Object.assign({},state,{modalDetail:false});
    },
    showmodalDetail(state,action){
      return Object.assign({},state,{modalDetail:true,item:action.item});
    },
    //行驶证图片上传
    saveDrivingLicenseimage(state,action){
      return Object.assign({},state,{DrivingLicense:action.DrivingLicense});
    },
    //营运证图片上传
    saveYyzimage(state,action){
      return Object.assign({},state,{OperatingLicense:action.OperatingLicense});
    },
    //车辆类型
    setcartype(state,action){
      return Object.assign({},state,{CarType:action.Data});
    },
    updatePage(state,action){
      return Object.assign({},state,{pageIndex:action.page});
    },
  },
  effects: {
    *addtruckmanage(action,{call,put}){
      const dat = yield call(TM_addturck,action);
      if(!dat.err){
        const {Success,Message,Code} = dat.data;
        if(Success){
          let page=action.pageIndex;
          message.destroy();
          message.success('添加成功！');
          yield put({
            type:'search',
            page
          })
        }else if(Code!=0){
          message.destroy();
          message.error(Message);
          yield put({
            type:'closeAddmodal'
          })
        }
      }else{
        message.destroy();
        message.error('请求异常');
      }
    },
    *edittruckmanage(action,{call,put}){
      const dat = yield call(TM_editturck,action);
      if(!dat.err){
        const {Success,Message} = dat.data;
        if(Success){
          let page=action.pageIndex;
          message.destroy();
          message.success('修改成功！');
          yield put({
            type:'search',
            page
          })
        }else{
          message.destroy();
          message.error(Message);
          yield put({
            type:'closeEditmodal'
          })
        }
      }else{
        message.destroy();
        message.error('请求异常');
      }
    },
    *deletetruckmanage(action,{call,put}){
      const dat = yield call(TM_deleteturck,action);
      if(!dat.err){
        let {Success,Message} = dat.data;
        if(Success){
          let page=action.pageIndex;
          message.destroy();
          message.success('删除成功！');
          yield put({
            type:'search',
            page
          });
        }else{
          message.destroy();
          message.error(Message);
        }
      }else{
        message.destroy();
        message.error('请求异常');
      }
    },
    *getcartype(action,{call,put}){
      const dat = yield call(TM_getcartype,action);
      if(!dat.err){
        const {Message,Success,Data} = dat.data;
        if(Success){
          yield put({
            type:'setcartype',
            Data
          });
        }else{
          message.destroy();
          message.error(Message);
        }
      }
    },
    //查询
    *search(action,{call,put}){
    	const axesCount=action.param?(action.param.axesCount?action.param.axesCount:''):(action.axesCount?action.axesCount:'');
			const carNo=action.param?(action.param.carNo?action.param.carNo:''):(action.carNo?action.carNo:'');
			action.axesCount = axesCount;
			action.carNo = carNo;
      const dat = yield call(TM_searchCar,action);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        const total = parseInt(Message);
        if(Success){
          yield put({type:'settruckmanage',Data,total,carNo,axesCount});
        }else{
          message.destroy();
          message.error(Message);
        }
      }
    },
  },
  subscriptions: {},
};
