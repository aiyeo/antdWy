import {ROLE_getSysRole,ROLE_addSysRole,ROLE_deleteSysRole,ROLE_updateSysRole,ROLE_loadMenuButtons,ROLE_getPermissionButtons,savePermissionButtons} from '../../services/index';
import {message} from 'antd';
import {arrList,loadsh,authButtons} from '../../utils/fun_config';

export default {
  namespace: 'sysrolemodal',
  state: {
    modalOptions:false,
    permissionData:[],
    buttonsData:[]
},
  reducers: {
    //打开权限设置弹框
    showModalOption(state,action){
    	return Object.assign({},state,{modalOptions:true});
    },
    //获取权限设置树形表格
    permdata(state,action){
       return Object.assign({},state,{permissionData:action.trData});
    },
    //关闭权限设置弹框
    closeModalOption(state,action){
    	return Object.assign({},state,{modalOptions:false,buttonsData:[]});
    },
    //获取权限设置所有按钮
    getpermissionbuttons(state,action){
    	 return Object.assign({},state,{permissionData:action.Data,buttonsData:action.btns,modalOptions:true})
    },
    updateModal(state,action){
       return Object.assign({},state,{permissionData:action.permissionData});
    },
    updateBtns(state,action){
       return Object.assign({},state,{buttonsData:action.btns});
    },
  },
  effects: {
    //获取权限信息
    *getOptions(action,{call,put}){
      const data = yield call(ROLE_loadMenuButtons,action);
      const {Success,Message,Data} = data.data;
      let trData=loadsh(Data,'MenuId');
      if(Success){
        yield put({
          type:'permdata',
          trData
        })
      }else{

        message.error(Message);
      }
    },
    *PermissionButtons(action,{call,put}){
    	const dat = yield call(ROLE_getPermissionButtons,action);
      const {Success,Message,Data} = dat.data;
      let btns=[];
      let id=action.id;
      let data=loadsh(Data?Data:[],'MenuId');
      authButtons(Data?Data:[],id,btns);
      if(Success){
        yield put({
          type:'getpermissionbuttons',
          Data,
          btns
        })
      }else{
        message.error(Message);
      }
    },
  },
  subscriptions: {},
};

