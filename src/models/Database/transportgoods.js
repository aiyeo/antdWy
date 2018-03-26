import {TRAN_list,TRAN_add,TRAN_update,TRAN_delete,PACK_listall,GTYPE_listall,SUNIT_listall,TRAN_searchlist} from '../../services/index';
import {message} from 'antd';
import {loadsh} from '../../utils/fun_config'
import Moment from 'moment';
export default {
  namespace: 'transportgoods',
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
    packData:[],
    sunitData:[],
    typeData:[],
    pageIndex:1,
    gtype:'',
    manufactor:'',
    name:''

},
  reducers: {
    settransportgoods(state,action){
      return Object.assign({},state,{
      	tData:action.Data,
      	loading:false,
      	selectedRowKeys: [],
      	total:action.total,
      	modalShow:false,
      	modalShowEdit: false,
      	gtype:action.gtype,
		    manufactor:action.manufactor,
		    name:action.name
      });
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
    packData(state,action){
       return Object.assign({},state,{packData:action.Data});
    },
    sunitData(state,action){
       return Object.assign({},state,{sunitData:action.Data});
    },
    typeData(state,action){
       return Object.assign({},state,{typeData:action.Data});
    },
    updatePage(state,action){
      return Object.assign({},state,{pageIndex:action.page});
    },
  },
  effects: {
    *gettransportgoods(action,{call,put}){
      const dat = yield call(TRAN_list,action);
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
    *searchlist(action,{call,put}){
    	const gtype=action.searchFields?(action.searchFields.gtype?action.searchFields.gtype:''):(action.gtype?action.gtype:'');
			const manufactor=action.searchFields?(action.searchFields.manufactor?action.searchFields.manufactor:''):(action.manufactor?action.manufactor:'');
			const name=action.searchFields?(action.searchFields.name?action.searchFields.name:''):(action.name?action.name:'');
      action.gtype = gtype;
			action.manufactor = manufactor;
			action.name = name;
			const dat = yield call(TRAN_searchlist,action);
      if(!dat.err){
        let {Success,Data,Message} = dat.data;
        if(Success){
          const total=parseInt(Message);
          let page = 1;
          yield put({
            type:'settransportgoods',
            Data,
            total,page,name,gtype,manufactor
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
      const dat = yield call(TRAN_add,action);
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
      const dat = yield call(TRAN_update,action);
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
      const dat = yield call(TRAN_delete,action);
      if(!dat.err){
        let {Success,Message} = dat.data;
        if(Success){
          let page=action.pageIndex;
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
    *packtransportgoods(action,{call,put}){
      const dat = yield call(PACK_listall,action);
      if(!dat.err){
        let {Success,Message,Data} = dat.data;
        if(Success){
          let page=action.pageIndex;
          yield put({type:'packData',Data});
        }else{
          message.destroy();
          message.error(Message);
        }
      }else{
        message.destroy();
        message.error('请求异常');
      }
    },
    *sunittransportgoods(action,{call,put}){
      const dat = yield call(SUNIT_listall,action);
      if(!dat.err){
        let {Success,Message,Data} = dat.data;
        if(Success){
          let page=action.pageIndex;
          yield put({type:'sunitData',Data});
        }else{
          message.destroy();
          message.error(Message);
        }
      }else{
        message.destroy();
        message.error('请求异常');
      }
    },
    *typetransportgoods(action,{call,put}){
      const dat = yield call(GTYPE_listall,action);
      if(!dat.err){
        let {Success,Message,Data} = dat.data;
        if(Success){
          let page=action.pageIndex;
          yield put({type:'typeData',Data});
        }else{
          message.destroy();
          message.error(Message);
        }
      }else{
        message.destroy();
        message.error('请求异常');
      }
    }
  },
  subscriptions: {},
};

