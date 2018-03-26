import {getProvinces,getPCitys,getCDistricts,MENU_getMenu,MBTN_getbtn} from '../services/index';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {actionList,isBool} from '../utils/fun_config'

export default {
  namespace: 'common',
  state: {
    address: [],
    keyNum:'1',
    menus:[],
    pruBtnList:[],
    addBool:false,
    sreachBool:false
  },
  subscriptions: {
  },
  reducers: {
    provinces(state, action) {
      return Object.assign({},state,{address:action.Data});
    },
    updateAddress(state,action){
      return Object.assign({},state,{address:[...state.address]})
    },
    keynum(state,action){
      let randomKey = Math.floor(Math.random()*100000);
      return Object.assign({},state,{keyNum:randomKey})
    },
    updatemenus(state,action){
      return Object.assign({},state,{menus:action.Data})
    },
    updateBtnList(state,action){
      return Object.assign({},state,{pruBtnList: action.data,addBool:action.isAdd,sreachBool:action.isSreach})
    }

  },
  effects: {
    *getMenus( action , { call, put ,select}) {
      const dat = yield call(MENU_getMenu,action);
      if(!dat.err){
         const {Success,Data,Message,Code} = dat.data;
        if(Code==8){
          message.destroy();
          message.error('账号在别处登录，您已被迫下线');
          yield put(routerRedux.push('/'))
          return false;
        }
        if(Success){
          yield put({type:'updatemenus',Data})
        }else{
          message.destroy();
            message.error(Message);
        }
      }
    },
    *btnList(payload, { call, put }) {
      const dat = yield call(MBTN_getbtn,payload);

      if(!dat.err){
         const {Success,Data,Message,Code} = dat.data;
          if(Code==8){
            yield put(routerRedux.push('/'))
            return false;
          }
        if(Success){
          const data=actionList(Data);
          const isAdd=isBool(Data,'add');
          const isSreach=isBool(Data,'sreach');
          yield put({
            type:'updateBtnList',
            data,
            isAdd,
            isSreach
          });
        }else if(Code!=8){
            message.destroy();
            message.error(Message);
        }
      }else{
        message.destroy();
        message.error('请求异常');
      }
    },
    *getProvinces( action , { call, put }) {
      const dat = yield call(getProvinces,action);
      if(!dat.err){
         const {Success,Data,Message} = dat.data;
        if(Success){
          Data.map(item=>({
              label:item.Name,
              value: item.ProvinceId,
              isLeaf: false
          }));
          yield put({type:'provinces',Data})
        }else{
          message.destroy();
            message.error(Message);
        }
      }
    },
    *getPCitys( action , { call, put }) {
      const dat = yield call(getPCitys,action);
      if(!dat.err){
         const {Success,Data,Message} = dat.data;
        if(Success){

        }else{
          message.destroy();
            message.error(Message);
        }
      }
    },
    *getCDistricts( action , { call, put }) {
      const dat = yield call(getCDistricts,action);
      if(!dat.err){
         const {Success,Data,Message} = dat.data;
        if(Success){

        }else{
          message.destroy();
            message.error(Message);
        }
      }
    },

  },

};
