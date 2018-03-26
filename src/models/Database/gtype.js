import {GTYPE_list,GTYPE_add,GTYPE_update,GTYPE_delete} from '../../services/index';
import {message} from 'antd';
import {loadsh} from '../../utils/fun_config'

export default {
  namespace: 'gtype',
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
    total:'',
    pageIndex:1
},
  reducers: {
    settransportgoods(state,action){
      return Object.assign({},state,{tData:action.Data,loading:false,selectedRowKeys: [],total:action.total,modalShow:false,modalShowEdit: false});
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
    edittansdata(state,action){
       return Object.assign({},state,{item:action.item,modalShowEdit:true});
    },
    updatePage(state,action){
      return Object.assign({},state,{pageIndex:action.page});
    },
  },
  effects: {
    *gettransportgoods(action,{call,put}){
      const dat = yield call(GTYPE_list,action);
      if(!dat.err){
        let {Success,Data,Message} = dat.data;
        if(Success){
          const total=parseInt(Message)
          yield put({
            type:'settransportgoods',
            Data,
            total
          })
        }else{
          message.destroy();
            message.error(Message)
          }
      }else{
        message.destroy();
        message.error('请求异常');
      }
    },
    *addtransportgoods(action,{call,put}){
      const dat = yield call(GTYPE_add,action);
      if(!dat.err){
        const {Success,Message} = dat.data;
        if(Success){
          let page=action.pageIndex;
          message.destroy();
          message.success('添加成功！');
          yield put({
            type:'gettransportgoods',
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
    *edittransportgoods(action,{call,put}){
      const dat = yield call(GTYPE_update,action);
      if(!dat.err){
        const {Success,Message} = dat.data;
        if(Success){
          let page=action.pageIndex;
          message.destroy();
          message.success('修改成功！');
          yield put({
            type:'gettransportgoods',
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
    *deletetransportgoods(action,{call,put}){
      const dat = yield call(GTYPE_delete,action);
      if(!dat.err){
        let {Success,Message} = dat.data;
        if(Success){
          let page=action.pageIndex;
          message.destroy();
          message.success('删除成功！');
          yield put({type:'gettransportgoods',page});
        }else{
          message.destroy();
          message.error(Message);
        }
      }else{
        message.destroy();
        message.error('请求异常');
      }
    },
  },
  subscriptions: {},
};

