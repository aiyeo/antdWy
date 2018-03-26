import {getButton,addButton,editButton,deleteButton,getBtnModule} from '../../services/index';
import {message} from 'antd';
import {loadsh} from '../../utils/fun_config'

export default {
  namespace: 'sysbutton',
  state: {
    tData: [],
    item: {},
    loading: false,
    modalShow: false,
    modalShowEdit: false,
    selectedRowKeys: [],
    modalOptions:false,
    tableLength:[],
    optionsDisabled:true,
    MenuId:'',
    modalOptionsButton: [{key: true, value: true, mean: '是'},{key: false, value: false, mean: '否'}],
},
  reducers: {
    setbutton(state,action){
      return Object.assign({},state,{tData:action.Data,loading:false,selectedRowKeys: [],modalShow:false,modalShowEdit: false});
    },
    lodingshow(state,action){
      return Object.assign({},state,{loading:true});
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
    editbutdata(state,action){
       return Object.assign({},state,{item:action.item,modalShowEdit:true});
    },
    updateMId(state,action){
      return Object.assign({},state,{MenuId:action.MenuId});
    }
  },
  effects: {
    *getbutton(action,{call,put}){
      const dat = yield call(getBtnModule,action);
      if(!dat.err){
        let {Success,Data,Message} = dat.data;
        if(Success){
          yield put({
            type:'setbutton',
            Data
          })
        }else{
            message.error(Message)
          }
      }else{
      	
        message.error('请求异常');
      }
    },
    *addbutton(action,{call,put}){
      const dat = yield call(addButton,action);
      if(!dat.err){
        const {Success,Message} = dat.data;
        if(Success){
          let MenuId=action.MenuId;
          message.success('添加成功！');
          yield put({
            type:'getbutton',
            MenuId
          })
        }else{
          message.error(Message);
          yield put({
            type:'closeAddmodal'
          })
        }
      }else{
      	
        message.error('请求异常');
      }
    },
    *editbutton(action,{call,put}){
      const dat = yield call(editButton,action);
      if(!dat.err){
        const {Success,Message} = dat.data;
        if(Success){
          let MenuId=action.MenuId;
          message.success('修改成功！');
          yield put({
            type:'getbutton',
            MenuId
          })
        }else{
          message.error(Message);
        }
      }else{
        message.error('请求异常');
      }
    },
    *deletebutton(action,{call,put}){
      const dat = yield call(deleteButton,action);
      if(!dat.err){
        let {Success,Message} = dat.data;
        if(Success){
          let MenuId=action.MenuId;
          message.success('删除成功！');
          yield put({type:'getbutton',MenuId});
        }else{
        	
          message.error(Message);
        }
      }else{
      	
        message.error('请求异常');
      }
    }
  },
  subscriptions: {},
};

