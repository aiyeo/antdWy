import {ROLE_getSysRole,ROLE_addSysRole,ROLE_deleteSysRole,ROLE_updateSysRole,ROLE_loadMenuButtons,ROLE_getPermissionButtons,savePermissionButtons} from '../../services/index';
import {message} from 'antd';
import {arrList,loadsh,authButtons} from '../../utils/fun_config';

export default {
  namespace: 'sysrole',
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
    permissionData:[],
    buttonsData:[],
    saveBtns:{},
    arrs:[],
    roleId:'',
    pageIndex:1,
    stauts:false
},
  reducers: {
  	//获取表格数据
    setrole(state,action){
      return Object.assign({},state,{tData:action.Data,loading:false,selectedRowKeys: [],total:action.total,modalShow:false,modalShowEdit: false});
    },
    lodingshow(state,action){
      return Object.assign({},state,{loading:true});
    },
    //打开添加
    showAddmodal(state,action){
      return Object.assign({},state,{modalShow:true});
    },
    //关闭添加弹框
    closeAddmodal(state,action){
      return Object.assign({},state,{modalShow:false});
    },
    //关闭编辑弹框
    closeEditmodal(state,action){
      return Object.assign({},state,{modalShowEdit:false});
    },
    //修改
    updateRole(state,action){
       return Object.assign({},state,{item:action.item,modalShowEdit:true});
    },
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
    //保存权限设置按钮
    savebuttons(state,action){
    	 return Object.assign({},state,{saveBtns:action.obj})
    },
    //获取角色id并保存
    getRoleID(state,action){
    	 return Object.assign({},state,{roleId:action.id})
    },
    updatePage(state,action){
      return Object.assign({},state,{pageIndex:action.page});
    },
    updateStauts(state,action){
       return Object.assign({},state,{stauts:action.stauts});
    },
    updateModal(state,action){
       return Object.assign({},state,{permissionData:action.permissionData});
    },
    updateBtns(state,action){
       return Object.assign({},state,{buttonsData:action.btns});
    },
  },
  effects: {
  	//获取列表
    *getrole(action,{call,put}){
      const dat = yield call(ROLE_getSysRole,action);
      if(!dat.err){
        let {Success,Data,Message} = dat.data;
        if(Success){
          const total=parseInt(Message)
          yield put({
            type:'setrole',
            Data,
            total
          })
        }else{
          message.destroy()
            message.error(Message)
          }
      }else{
        message.destroy()
        message.error('请求异常');
      }
    },
    //添加角色
    *addrole(action,{call,put}){
      const dat = yield call(ROLE_addSysRole,action);
      if(!dat.err){
        const {Success,Message} = dat.data;
        let page=action.pageIndex;
        if(Success){
          message.destroy();
          message.success('添加成功！');
          yield put({
            type:'getrole',page
          })
        }else{
          message.destroy()
          message.error(Message);
          yield put({
            type:'closeAddmodal'
          })
        }
      }else{
        message.destroy()
        message.error('请求异常');
      }
    },
    //删除角色
    *deleterole(action,{call,put}){
      const dat = yield call(ROLE_deleteSysRole,action);
      if(!dat.err){
        const {Success,Message} = dat.data;
        let page=action.pageIndex;
        if(Success){
          message.destroy()
          message.success('删除成功！');
          yield put({
            type:'getrole',page
          })
        }else{
          message.destroy()
          message.error(Message);
        }
      }else{
        message.destroy()
        message.error('请求异常');
      }
    },
    //修改角色
    *updaterole(action,{call,put}){
      const dat = yield call(ROLE_updateSysRole,action);
      if(!dat.err){
        const {Success,Message} = dat.data;
        let page=action.pageIndex;
        if(Success){
          message.destroy();
          message.success('修改成功！');
          yield put({
            type:'getrole',page
          })
        }else{
          message.destroy()
          message.error(Message);
        }
      }else{
        message.destroy()
        message.error('请求异常');
      }
    },
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
        message.destroy()
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
        message.destroy()
        message.error(Message);
      }
    },
    *savePermissionButtons(action,{call,put}){
    	const data = yield call(savePermissionButtons,action);
      const {Success,Message,Data} = data.data;
      if(Success){
        message.destroy();
      	message.success('设置成功！');
        yield put({
          type:'savebuttons',
          Data
        })
      }else{
        message.destroy()
        message.error(Message);
      }
    }
  },
  subscriptions: {},
};

