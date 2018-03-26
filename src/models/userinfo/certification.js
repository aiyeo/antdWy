import {message} from 'antd';
import {getProvinces,getPCitys,getCDistricts,submitauth,getCompanytype,getManagers,getDriverInfo,AUTH_single,AUTH_update,SHIPPER_submitauth,SHIPPER_update,SHIPPER_single} from '../../services/index';
import {Link,routerRedux} from 'dva/router';

export default {
  namespace: 'certification',
  state: {
    modalShowuser:false,
    Businessimage:'',
    RoadTransportimage:'',
    Facadeimage:'',
    Corporateimage:'',
    ownerManagers:[],
    Information:{},
    typeData:[],
    RoleId:0,
    Area:[],
    yesStatus:false,
  },
  reducers: {
    Showusermodal(state,action){
      return Object.assign({},state,{modalShowuser:true});
    },
    Closeusermodal(state,action){
      return Object.assign({},state,{modalShowuser:false});
    },
    //省市区级联状态
		updateCData(state, action) {
      return Object.assign({},state,{cData: action.arrs})
    },
    updateCDatas(state, action) {
      return Object.assign({},state,{cData: [...state.cData]})
    },
    saveBusinessimage(state,action){
      return Object.assign({},state,{Businessimage:action.Businessimage});
    },
    saveRoadTransportimage(state,action){
      return Object.assign({},state,{RoadTransportimage:action.RoadTransportimage});
    },
    saveFacadeimage(state,action){
      return Object.assign({},state,{Facadeimage:action.Facadeimage});
    },
    saveCorporateimage(state,action){
      return Object.assign({},state,{Corporateimage:action.Corporateimage});
    },
    setManagers(state,action){
      return Object.assign({},state,{ownerManagers:action.Data});
    },
    setauthSingle(state,action){
       return Object.assign({},state,{Information:action.data});
    },
    gettype(state,action){
       return Object.assign({},state,{typeData:action.Data});
    },
    updatetype(state,action){
       return Object.assign({},state,{RoleId:action.RoleId});
    },
    getArea(state,action){
      return Object.assign({},state,{Area:action.obj});
    },
    //判断是否选择到区
    getyesStatus(state,action){
      return Object.assign({},state,{yesStatus:true});
    },
  },
  effects: {
    *getprovines(payload, { call, put }) {
      const dat = yield call(getProvinces,payload);
      if(!dat.err){
         const {Success,Data,Message} = dat.data;
        if(Success){
          let arrs=[];
          Data.map(item => {
                let tempObj = {}
                tempObj.label = item.Name
                tempObj.value = item.ProvinceId
                tempObj.isLeaf = false
                arrs.push(tempObj)
              }
           );
          yield put({
            type:'updateCData',
            arrs
          });
        }else{
          message.destroy()
            message.error(Message);
        }
      }
    },
    *getPcitys(payload, { call, put }) {
      payload.targetOption.loading = true;
      const dat = yield call(getPCitys,payload);
      let arrs=payload.cData;
      if(!dat.err){
         const {Success,Data,Message} = dat.data;
        if(Success){
          payload.targetOption.loading = false;
				payload.targetOption.children = Data.map(item=>({
                label:item.Name,
                value:item.CityId,
                isLeaf:false
              }))
        yield put({
                type:'updateCDatas',
              });
        }else{
          message.destroy()
            message.error(Message);
        }
      }
    },
    *getcdistricts(payload, { call, put }) {
      payload.targetOption.loading = true;
      let cData=payload.cData;
      const dat = yield call(getCDistricts,payload);
      if(!dat.err){
         const {Success,Data,Message} = dat.data;
        if(Success){
         let arrs=[];
          payload.targetOption.loading = false;
          payload.targetOption.children=Data.map(item=>({
          					label:item.Name,
          					value:item.DistrictId
          				}))
          yield put({
                type:'updateCDatas',

            });
        }else{
          message.destroy()
            message.error(Message);
        }
      }
    },
    *getType(action,{put,call}){
      const dat = yield call(getCompanytype,action);
      if(!dat.err){
        const {Message,Success,Data} = dat.data;
        if(Success){
          yield put({
                type:'gettype',
                Data
            });
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    //承运方保存
    *saveInfo(action,{put,call}){
      const dat = yield call(submitauth,action);
      if(!dat.err){
        const {Message,Success} = dat.data;
        if(Success){
          message.destroy()
          message.success('保存成功，等待审核');
          yield put(routerRedux.push('/home'));
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    //承运方修改
    *updateauth(action,{put,call}){
      const dat = yield call(AUTH_update,action);
      if(!dat.err){
        const {Message,Success} = dat.data;
        if(Success){
          message.destroy()
          message.success('修改成功，等待审核');
          yield put(routerRedux.push('/home'));
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    //发货方保存
    *shippersaveInfo(action,{put,call}){
      const dat = yield call(SHIPPER_submitauth,action);
      if(!dat.err){
        const {Message,Success} = dat.data;
        if(Success){
          message.destroy()
          message.success('保存成功，等待审核');
          yield put(routerRedux.push('/home'));
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    //发货方修改
    *shipperupdateauth(action,{put,call}){
      const dat = yield call(SHIPPER_update,action);
      if(!dat.err){
        const {Message,Success} = dat.data;
        if(Success){
          message.destroy()
          message.success('修改成功，等待审核');
          yield put(routerRedux.push('/home'));
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    *getManager(action,{call,put}){
        const dat = yield call(getManagers,action);
        if(!dat.err){
          const {Message,Success,Data} = dat.data;
          if(Success){
            yield put({
                type:'setManagers',
                Data
            });
          }else{
            message.destroy()
            message.error(Message);
          }
        }
    },
    *getDriverInfo(action,{call,put}){
      const dat = yield call(getDriverInfo,action);

      if(!dat.err){
        const {Message,Success,Data} = dat.data;
        if(Success){
          yield put({
              type:'setDriverInfo',
              Data
          });
        }else{
          message.destroy()
            message.error(Message);

        }
      }
    },
    //承运方查询
    *getanthSingle(action,{call,put,select}){
      const dat = yield call(AUTH_single,action);
      const Status = yield select(state => state.login.Status);
      if(!dat.err){
        const {Message,Success,Data} = dat.data;

        if(Success){
          if(Data){
            let data=Data.CarrierIdentificationModel;
            yield put({
              type:'setauthSingle',
              data
          });
          }
        }else{
          if(Status!=1){
            message.destroy()
            message.error(Message);
          }

        }
      }
    },
    //发货方查询
    *getshipperSingle(action,{call,put,select}){
      const dat = yield call(SHIPPER_single,action);
      const Status = yield select(state => state.login.Status);
      if(!dat.err){
        const {Message,Success,Data} = dat.data;

        if(Success){
          if(Data){
            let data=Data.ShipperIdentificationModel;
            yield put({
              type:'setauthSingle',
              data
          });
          }
        }else{
          if(Status!=1){
            message.destroy()
            message.error(Message);
          }

        }
      }
    }
  },
  subscriptions: {},
};
