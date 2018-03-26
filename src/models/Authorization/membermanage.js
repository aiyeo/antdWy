import {MEB_getMember,MEB_deleteMember,MEB_editMember,MEB_addMember,MEB_getRoleList} from '../../services/index';
import {message} from 'antd';

export default {
  namespace: 'membermanage',
  state: {
    tData: [],
    item: {},
    loading: false,
    modalShow:false,
    modalShowEdit:false,
    total:'',
    RoleList:[],
    pageIndex:1,
  },
  reducers: {
    setmember(state,action){
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
    editmemberdata(state,action){
      return Object.assign({},state,{modalShowEdit:true,item:action.item});
    },
    setrole(state,action){
      return Object.assign({},state,{RoleList:action.Data})
    },
    updatePage(state,action){
      return Object.assign({},state,{pageIndex:action.page});
    },
  },
  effects: {
    *getmember(action,{call,put}){
      const dat = yield call(MEB_getMember,action);
      if(!dat.err){
        let {Success,Data,Message} = dat.data;
        if(Success){
          const total=parseInt(Message)
          yield put({
            type:'setmember',
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
    *addmember(action,{call,put}){
      const dat = yield call(MEB_addMember,action);
      if(!dat.err){
        const {Success,Message} = dat.data;
        if(Success){
          let page=action.pageIndex;
          message.destroy()
          message.success('添加成功！');
          yield put({
            type:'getmember',
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
    *editmember(action,{call,put}){
      const dat = yield call(MEB_editMember,action);
      if(!dat.err){
        const {Success,Message} = dat.data;
        if(Success){
          let page=action.pageIndex;
          message.destroy()
          message.success('修改成功！');
          yield put({
            type:'getmember',
            page
          })
        }else{
					yield put({type:'closeEditmodal'});
					message.destroy();
          message.error(Message);
        }
      }else{
        message.destroy()
        message.error('请求异常');
      }
    },
    *deletemember(action,{call,put}){
      const dat = yield call(MEB_deleteMember,action);
      if(!dat.err){
        let {Success,Message} = dat.data;
        if(Success){
          let page=action.pageIndex;
          message.destroy()
          message.success('删除成功！');
          yield put({
            type:'getmember',
            page
          });
        }else{
          message.destroy()
          message.error(Message);
        }
      }else{
        message.destroy()
        message.error('请求异常');
      }
    },
    *getrolelist(action,{call,put}){
      const dat = yield call(MEB_getRoleList,action);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        if(Success){
          yield put({
            type:'setrole',
            Data
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
  },
  subscriptions: {},
};
