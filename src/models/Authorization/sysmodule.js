import {getModule,deleteModule,editModule,addModule,getBtnModule,getAllButton,setButtonData} from '../../services/index';
import {loadsh} from '../../utils/fun_config'
import {message} from 'antd';

export default {
  namespace: 'sysmodule',
  state: {
    tData: [],
    treeModule:[],
    item: {},
    loading: true,
    modalShow: false,
    modalShowEdit: false,
    modelUse: [{key: true, value: true, mean: '启用'},{key: false, value: false, mean: '禁用'}],
    modelOperation: [{key: true, value: true, mean: '是'},{key: false, value: false, mean: '否'}],
    modules:[],
    showbtn: false,
    moduleId: '',
    moduleRow: {},
    buttonList: [],
    checkedButton: []
  },
  reducers: {
    setdata(state,action){
      return Object.assign({},state,{tData:action.treedata,treeModule:action.Data,modules:action.Data,loading:false,modalShowEdit: false,modalShow:false,showbtn: false});
    },
    showEditmodal(state,action){
      return Object.assign({},state,{modalShowEdit:true});
    },
    closeEditmodal(state,action){
      return Object.assign({},state,{modalShowEdit:false});
    },
    editdata(state,action){
       return Object.assign({},state,{item:action.item,modalShowEdit:true});
    },
    showAddmodal(state,action){
      return Object.assign({},state,{modalShow:true});
    },
    closeAddmodal(state,action){
      return Object.assign({},state,{modalShow:false});
    },
    //选择一行模块
    selectModuleRow(state,action){
      return Object.assign({},state,{moduleId:action.MenuId,moduleRow:action.moduleRow});
    },
    //按钮状态显示
    closeButtonModal(state,action){
      return Object.assign({},state,{showbtn:false,checkedButton:[]});
    },
    saveButtonData(state,action){
      return Object.assign({},state,{buttonList:action.Data});
    },
    //获取到已启用的按钮
    getBtnData(state,action){
      return Object.assign({},state,{checkedButton:action.Data,showbtn:true})
    },
    changeCheckBtn(state,action){
      return Object.assign({},state,{checkedButton:action.Data})
    },
  },
  effects: {
    *getdata(action,{call,put}){
      const dat = yield call(getModule,action);
      if(!dat.err){
        let {Success,Data} = dat.data;
        if(Data.children === []){
          delete res.Data.children;
        }
        if(Success){
          let treedata = loadsh(Data,'MenuId');
          yield put({
            type:'setdata',
            Data,
            treedata
          });
        }
      }else{
      	
        message.error('请求异常');
      }

    },
    *delete(action,{call,put}){
      const dat = yield call(deleteModule,action);
      if(!dat.err){
          let {Success,Message} = dat.data;
          if(Success){
            message.success('删除成功！');
            yield put({type:'getdata'});
          }else{
          	
            message.error(Message);
          }
      }else{
      	
        message.error('请求异常');
      }

    },
    *editmodule(action,{call,put}){
      const dat = yield call(editModule,action);
      if(!dat.err){
          const {Success,Message} = dat.data;
          if(Success){
             message.success('修改成功！');
             yield put({
              type:'getdata'
            })
          }else{
          	
             message.error(Message);
          }
      }else{
      	
        message.error('请求异常');
      }

    },
    *addmodule(action,{call,put}){
      const dat = yield call(addModule,action);
      if(!dat.err){
        const {Success,Message} = dat.data;
        if(Success){
           message.success('添加成功！');
           yield put({
            type:'getdata'
          })
        }else{
        	
           message.error(Message);
        }
      }else{
      	
        message.error('请求异常');
      }

    },
    *getButtonModal(action,{call,put}){
      const dat = yield call(getBtnModule,action);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        if(Success){
          yield put({
          type:'getBtnData',
          Data
          })
        }else{
        	
          message.error(Message);
        }

      }else{
      	
        message.error('请求异常');
      }
    },
    *getButtonData(action,{call,put}){
      const dat = yield call(getAllButton,action);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        if(Success){
            yield put({
          type:'saveButtonData',
          Data
        })
        }else{
        	
          message.error(Message);
        }

      }
    },
    *setButtonData(action,{call,put}){
      const dat = yield call(setButtonData,action.payload);
      if(!dat.err){
          let {Success,Message} = dat.data;
          if(Success){
            message.success('修改成功！');
            yield put({
              type:'getdata'
            });
          }else{
          	
            message.error(Message);
          }
      }else{
      	
          message.error('请求异常');
      }

    },
  },
  subscriptions: {},
};
