import {BANK_bankaccountlist,BANK_addbankaccount,BANK_editbankaccount,BANK_deletebankaccount} from '../../services/index';
import {message} from 'antd';

export default {
  namespace: 'bankaccount',
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
    setbankaccount(state,action){
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
    editbankaccountdata(state,action){
      return Object.assign({},state,{modalShowEdit:true,item:action.item});
    },
    updatePage(state,action){
      return Object.assign({},state,{pageIndex:action.page});
    },
  },
  effects: {
    *getbankaccount(action,{call,put}){
      const dat = yield call(BANK_bankaccountlist,action);
      if(!dat.err){
        let {Success,Data,Message} = dat.data;
        if(Success){
          const total=parseInt(Message)
          yield put({
            type:'setbankaccount',
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
    *addbankaccount(action,{call,put}){
      const dat = yield call(BANK_addbankaccount,action);
      if(!dat.err){
        const {Success,Message} = dat.data;
        if(Success){
          let page=action.pageIndex;
          message.destroy();
          message.success('添加成功！');
          yield put({
            type:'getbankaccount',
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
    *editbankaccount(action,{call,put}){
      const dat = yield call(BANK_editbankaccount,action);
      if(!dat.err){
        const {Success,Message} = dat.data;
        if(Success){
          let page=action.pageIndex;
          message.destroy();
          message.success('修改成功！');
          yield put({
            type:'getbankaccount',
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
    *deletebankaccount(action,{call,put}){
      const dat = yield call(BANK_deletebankaccount,action);
      if(!dat.err){
        let {Success,Message} = dat.data;
        if(Success){
          let page=action.pageIndex;
          message.destroy()
          message.success('删除成功！');
          yield put({
            type:'getbankaccount',
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
