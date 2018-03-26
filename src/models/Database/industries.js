import {IDT_industrieslist,IDT_addindustries,IDT_editindustries,IDT_deleteindustries} from '../../services/index';
import {message} from 'antd';

export default {
  namespace: 'industries',
  state: {
    tData: [],
    item: {},
    loading: false,
    modalShow:false,
    modalShowEdit:false,
    total:'',
    pageIndex:1,
  },
  reducers: {
    setindustries(state,action){
      return Object.assign({},state,{tData:action.Data,loading:false,modalShow: false, modalShowEdit: false,total:action.total});
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
    editindustriesdata(state,action){
      return Object.assign({},state,{modalShowEdit:true,item:action.item});
    },
    updatePage(state,action){
      return Object.assign({},state,{pageIndex:action.page});
    },
  },
  effects: {
    *getindustries(action,{call,put}){
      const dat = yield call(IDT_industrieslist,action);
      if(!dat.err){
        let {Success,Data,Message} = dat.data;
        if(Success){
          const total=parseInt(Message)
          yield put({
            type:'setindustries',
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
    *addindustries(action,{call,put}){
      const dat = yield call(IDT_addindustries,action);
      if(!dat.err){
        const {Success,Message} = dat.data;
        if(Success){
          let page=action.pageIndex;
          message.destroy();
          message.success('添加成功！');
          yield put({
            type:'getindustries',
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
    *editindustries(action,{call,put}){
      const dat = yield call(IDT_editindustries,action);
      if(!dat.err){
        const {Success,Message} = dat.data;
        if(Success){
          let page=action.pageIndex;
          message.destroy();
          message.success('修改成功！');
          yield put({
            type:'getindustries',
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
    *deleteindustries(action,{call,put}){
      const dat = yield call(IDT_deleteindustries,action);
      if(!dat.err){
        let {Success,Message} = dat.data;
        if(Success){
          let page=action.pageIndex;
          message.destroy();
          message.success('删除成功！');
          yield put({
            type:'getindustries',
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
  },
  subscriptions: {},
};
