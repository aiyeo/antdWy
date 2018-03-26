import {setPassword,editPassword,getVericode} from '../services/index';
import { routerRedux } from 'dva/router';
import { message } from 'antd';

export default {
  namespace: 'password',
  state: {
    loading:false,
    passcode:'',
    modalShowEdit:false,
    ValiCode:'',
    yesStatus:false,
  },
  reducers: {
    showdisable(state,action){
      return Object.assign({},state,{loading:true})
    },
    closedisable(state,action){
      return Object.assign({},state,{loading:false})
    },
    showEditpass(state,action){
      return Object.assign({},state,{modalShowEdit:true})
    },
    closeEditpass(state,action){
      return Object.assign({},state,{modalShowEdit:false})
    },
    setValiCode(state,action){
       return Object.assign({},state,{ValiCode:action.Message})
    },
		getyesStatus(state,action){
      return Object.assign({},state,{yesStatus:true});
    },
  },
  effects: {
    *setpass(action,{call,put}){
      const dat = yield call(setPassword,action);
      console.log(dat);
      if(dat){
        let {Success,Message} = dat.data;
        if(Success){
          message.destroy();
          message.success('修改成功，请重新登录！');
          //跳回登录界面登录
          yield put(routerRedux.push('/'));
        }else{
          message.destroy();
          message.error(Message);
        }
      }
    },
    *editpass(action,{call,put}){
      const dat = yield call(editPassword,action);
      if(dat){
        let {Success,Message} = dat.data;
        if(Success){
          //关闭修改框
           yield put({type:'closeEditpass'});
          message.destroy();
           message.success('修改成功，请重新登录!');
            //跳回登录界面登录
            yield put(routerRedux.push('/'));
        }else{
          message.destroy();
          message.error(Message);
        }
      }
    },
    *getValiCode(action,{call,put}){
      const dat = yield call(getVericode,action);
      if(dat){
        const {Success,Data,Message} = dat.data;
        if(Success){
          yield put({
          type:'setValiCode',
          Message
        })
        }else{
          message.destroy();
          message.error(Message);
        }

      }
      },
  },

  subscriptions: {},
};
