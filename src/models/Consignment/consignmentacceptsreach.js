import {message} from 'antd';
import {ACCEPT_detail,getProvinces,getCitys,getAreas,getProvinces1,getCitys1,getAreas1,ACCEPT_accept,ACCEPT_refuse,CON_carrierList,CON_assign} from '../../services/consignment';
import {arrList} from '../../utils/fun_config';

export default {
  namespace: 'consignmentacceptsreach',
  state: {
  	item:{},
  	provinceData:{},
  	cityData:{},
  	areaData:{},
  	provinceData1:{},
  	cityData1:{},
  	areaData1:{},
  	modalShow:false,
  	ModalShow:false,
  	batchAssignData:[],
  	pageIndex:1,
  },
  reducers: {
  	//显示弹出框
  	detail(state,action){
      return Object.assign({},state,{item:action.Data});
    },
    getProvinceData(state,action){
    	return Object.assign({},state,{provinceData:action.Data});
    },
    getCityData(state,action){
    	return Object.assign({},state,{cityData:action.Data});
    },
    getAreaData(state,action){
    	return Object.assign({},state,{areaData:action.Data});
    },
    getProvinceData1(state,action){
    	return Object.assign({},state,{provinceData1:action.Data});
    },
    getCityData1(state,action){
    	return Object.assign({},state,{cityData1:action.Data});
    },
    getAreaData1(state,action){
    	return Object.assign({},state,{areaData1:action.Data});
    },
    //列表点击指派弹框开启
  	showAssign(state,action){
  		return Object.assign({},state,{modalShow:true})
  	},
  	closeAssign(state,action){
  		return Object.assign({},state,{modalShow:false})
  	},
  	//受理
    accept(state,action){
       return Object.assign({},state,{tData:action.Data,total:action.total});
    },
    //refusemodal
    refusemodal(state,action){
       return Object.assign({},state,{ModalShow:action.modal});
    },
    //当前操作对象
    updateparam(state,action){
      return Object.assign({},state,{ModalShow:action.modal,item:action.item});
    },
    //拒绝
    refuse(state,action){
       return Object.assign({},state,{tData:action.Data,total:action.total});
    },
    //指派数据表格
  	batchAssignData(state,action){
  		return Object.assign({},state,{batchAssignData:action.Data})
  	},
  	updatePage(state,action){
  		return Object.assign({},state,{pageIndex:action.page})
  	},
  },
  effects: {
    //列表托运单详情
    *getacceptdetail(action,{call,put}){
      const dat = yield call(ACCEPT_detail,action);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        let pId=Data.StartingProvinceId;
        let cId=Data.StartingCityId;
        let aId=Data.StartingDistrictId;
        let pId1=Data.DestinationProvinceId;
        let cId1=Data.DestinationCityId;
        let aId1=Data.DestinationDistrictId;
        if(Success){
          yield put({type:'detail',Data});
          yield put({type:'getprovincedata',pId});
	        yield put({type:'getcitydata',cId});
	        yield put({type:'getareadata',aId});
	        yield put({type:'getprovincedata1',pId1});
	        yield put({type:'getcitydata1',cId1});
	        yield put({type:'getareadata1',aId1});
	        yield put({type:'batchassign'});
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    //省
    *getprovincedata(action,{call,put}){
      const dat = yield call(getProvinces,action);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        if(Success){
          yield put({type:'getProvinceData',Data})
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    //市
    *getcitydata(action,{call,put}){
      const dat = yield call(getCitys,action);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        if(Success){
          yield put({type:'getCityData',Data})
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    //区
    *getareadata(action,{call,put}){
      const dat = yield call(getAreas,action);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        if(Success){
          yield put({type:'getAreaData',Data})
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    //省
    *getprovincedata1(action,{call,put}){
      const dat = yield call(getProvinces1,action);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        if(Success){
          yield put({type:'getProvinceData1',Data})
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    //市
    *getcitydata1(action,{call,put}){
      const dat = yield call(getCitys1,action);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        if(Success){
          yield put({type:'getCityData1',Data})
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    //区
    *getareadata1(action,{call,put}){
      const dat = yield call(getAreas1,action);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        if(Success){
          yield put({type:'getAreaData1',Data})
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    //请求受理
    *getaccept(action,{call,put}){
      const dat = yield call(ACCEPT_accept,action);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        let page=action.page;
        if(Success){
        	message.success('受理成功!')
          window.history.go(-1)
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    //请求拒绝受理
    *getrefuse(action,{call,put}){
      const dat = yield call(ACCEPT_refuse,action);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        if(Success){
         	window.history.go(-1)
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    //指派数据表格
  	*batchassign(action,{call,put}){
      const dat = yield call(CON_carrierList,action);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        if(Success){
        	if(Data.length>0){
        		yield put({type:'batchAssignData',Data})
        	}
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    //指派
    *assignGo(action,{call,put}){
      const dat = yield call(CON_assign,action);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        let page=action.page;
        if(Success){
        	yield put({type:'getassignlist',page});
          message.destroy()
        	message.success('指派成功!')
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
  },
  subscriptions: {},
};
