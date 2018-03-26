import {DM_adddriver,DM_editdriver,DM_deletedriver,DM_getdriverlicense,DM_searchDriver} from '../../services/index';
import {message} from 'antd';

export default {
  namespace: 'drivermanage',
  state: {
    tData: [],
    item: {},
    loading: false,
    modalShow:false,
    modalShowEdit:false,
    total:'',
    modalDetail:false,
    ImgPath:'',
    DriverLicense:[],
    pageIndex:1,
    name:'',
    phone:''
  },
  reducers: {
    setdrivermanage(state,action){
      return Object.assign({},state,{tData:action.Data,loading:false,modalShow: false, modalDetail:false,modalShowEdit: false,total:action.total,name:action.name,phone:action.phone});
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
    closemodalDetail(state,action){
      return Object.assign({},state,{modalDetail:false});
    },
    showmodalDetail(state,action){
      return Object.assign({},state,{modalDetail:true,item:action.item});
    },
    editdrivermanagedata(state,action){
      return Object.assign({},state,{modalShowEdit:true,item:action.item,ImgPath:action.item.ImgPath});
    },
    //保存驾驶证图片上传
    saveDriverimage(state,action){
      return Object.assign({},state,{ImgPath:action.ImgPath});
    },
    //驾照类型
    setdriverlicense(state,action){
      return Object.assign({},state,{DriverLicense:action.Data});
    },
    updatePage(state,action){
      return Object.assign({},state,{pageIndex:action.page});
    },
  },
  effects: {
    *adddrivermanage(action,{call,put}){
      const dat = yield call(DM_adddriver,action);
      if(!dat.err){
        const {Success,Message} = dat.data;
        if(Success){
          let page=action.pageIndex;
          message.destroy();
          message.success('添加成功！');
          yield put({
            type:'search',
            page
          })
        }else{
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
    *editdrivermanage(action,{call,put}){
      const dat = yield call(DM_editdriver,action);
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
        }
      }else{
        message.destroy();
        message.error('请求异常');
      }
    },
    *deletedrivermanage(action,{call,put}){
      const dat = yield call(DM_deletedriver,action);
      if(!dat.err){
        let {Success,Message} = dat.data;
        if(Success){
          let page=action.pageIndex;
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
    *getdriverlicense(action,{call,put}){
      const dat = yield call(DM_getdriverlicense,action);
      if(!dat.err){
        const {Message,Success,Data} = dat.data;
        if(Success){
          yield put({
            type:'setdriverlicense',
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
    	const name=action.param?(action.param.name?action.param.name:''):(action.name?action.name:'');
			const phone=action.param?(action.param.phone?action.param.phone:''):(action.phone?action.phone:'');
			action.name = name;
			action.phone = phone;
      const dat = yield call(DM_searchDriver,action);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        const total = parseInt(Message)
        if(Success){
          yield put({type:'setdrivermanage',Data,total,phone,name});
        }else{
          message.destroy();
          message.error(Message);
        }
      }
    },
  },
  subscriptions: {},
};
