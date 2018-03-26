import {login,logout,getCode,getUserinfo} from '../services/index';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {uuid} from '../utils/fun_config';

export default {
  namespace: 'login',
  state: {
    Account: '',
    loginsuccess: false,
    code:'',
    MemberId:'',
    Regtime:'',
    Type:'',
    Status:'',
    token:'',
    Usertype:'',
    Level:'',
    modalShowuser:false,
    RoleId:'',
    navs:[],
    checkLogin:true,
    CompanyName:'',
    repeatCode:'',
    checkCode:'',
    yesStatus:false,
    showBtn:true,
    ParentId:'',
    AuthorizeRoleName:'',
    guid:'',
    ImgUrl:'',
    ImgModalHide:true
  },
  subscriptions: {
  },
  reducers: {
    updateuser(state, action) {
      return Object.assign({},state,{token:action.Message,MemberId:action.Data.MemberId,Account: action.Data.Account,Type:action.Data.Type,loginsuccess:true});
    },
    clearuser(state, action){
     return Object.assign({},state,{Account: ' ',loginsuccess:false})
    },
    setcode(state,action){
      return Object.assign({},state,{code:action.Message,guid:action.guid})
    },
    setUserinfo(state,action){
      return Object.assign({},state,{modalShowuser:true,Usertype:action.Data.MemberRoleName,CompanyName:action.Data.CompanyName,Level:action.Data.MemberLevelModel.Name,Status:action.Data.Status,Regtime:action.Data.Regtime,RoleId:action.Data.RoleId});
    },
    getUserinfo(state,action){
      return Object.assign({},state,{AuthorizeRoleName:action.Data.AuthorizeRoleName,ParentId:action.Data.ParentId,Usertype:action.Data.MemberRoleName,CompanyName:action.Data.CompanyName,Level:action.Data.MemberLevelModel.Name,Status:action.Data.Status,Regtime:action.Data.Regtime,RoleId:action.Data.RoleId});
    },
    Closeusermodal(state,action){
      return Object.assign({},state,{modalShowuser:false});
    },
    updateNavs(state,action){
      return Object.assign({},state,{navs:action.navs})
    },
    checkLoginTrue(state,action){
      return Object.assign({},state,{checkLogin:true})
    },
    checkLoginFalse(state,action){
      return Object.assign({},state,{checkLogin:false})
    },
    RepeatCode(state,action){
      return Object.assign({},state,{repeatCode:action.repeatCode})
    },
    CheckCode(state,action){
      return Object.assign({},state,{checkCode:action.checkCode})
    },
    getyesStatus(state,action){
      return Object.assign({},state,{yesStatus:true});
    },
    ShowBtn(state,action){
      return Object.assign({},state,{showBtn:false});
    },
    ImgUrl(state,action){
      return Object.assign({},state,{ImgUrl:action.url})
    },
    ImgModalHide(state,action){
      return Object.assign({},state,{ImgModalHide:!state.ImgModalHide})
    },
  },
  effects: {
    *login( action , { call, put }) {
      const dat = yield call(login,action);

      if(!dat.err){
      		yield put({type:'checkLoginTrue'});
         const {Success,Data,Message,Code} = dat.data;
        if(Success){
          sessionStorage.setItem('access_token',Message ? Message : '');
          sessionStorage.setItem('user',Data.Account);
          sessionStorage.setItem('MemberId',Data.MemberId);
          yield put({type:'updateuser',Data,Message});
          yield put(routerRedux.push('/home'));
        }else if(Code==2||Code==3){
          let guid=uuid()
        	yield put({type:'getcode',guid})
        	message.destroy();
        	message.error(Message);
        }else{
        	message.destroy();
            message.error(Message);
        }
      }else{

      	yield put({type:'checkLoginTrue'});
        message.destroy()
      		message.error('您输入的用户名或密码错误');
      }
    },
    *logout(action, { call, put }) {
    	const dat= yield call(logout,action);
      if(!dat.err){
        let {Success,Message,Code} = dat.data;
        if(Code==8||Code==1){
          yield put(routerRedux.push('/'));
        }
        if(Success){
          yield put({
            type:'clearuser'
          });
          yield put(routerRedux.push('/'));
        }else{
          message.destroy();
          message.error(Message);
        }
      }
    },
    *getcode(action,{call,put}){
      const dat= yield call(getCode,action);
      if(!dat.err){
        let {Success,Message,Data} = dat.data;
        if(Success){
          yield put({type:'setcode',Message,guid:action.guid});
        }else{
        	message.destroy();
          message.error(Message);
        }
      }
    },
    *getuserinfo(action,{call,put}){
        const dat = yield call(getUserinfo,action);
        if(!dat.err){
          const {Success,Data,Message} = dat.data;
          if(Success){
            yield put({
              type:'setUserinfo',
              Data
            })
          }else{
            message.destroy();
              message.error(Message);
          }
        }
    },
    *Getuserinfo(action,{call,put}){
        const dat = yield call(getUserinfo,action);
        if(!dat.err){
          const {Success,Data,Message} = dat.data;
          if(Success){
            yield put({
              type:'getUserinfo',
              Data
            })
          }else{
            message.destroy();
              message.error(Message);
          }
        }
    },
  },
};
