//import {getUserinfo} from '../../services/index';
import {message} from 'antd';
import {getUserinfo,getProvinces,getPCitys,getCDistricts,saveMemberinfo,saveImage,getManagers,getDriverInfo,upadateDriverInfo} from '../../services/index';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'userinfo',
  state: {
    Driverimage:'',
    Driveimage:'',
    Manageimage:'',
    ownerManagers:[],
    DriverInfo:{},
    Username:'',
    Identphone:'',
    Area:[],
    yesStatus:false,
  },
  reducers: {
    //省市区级联状态
		updateCData(state, action){
      return Object.assign({},state,{cData: action.arrs})
    },
    updateCDatas(state, action) {
      return Object.assign({},state,{cData: [...state.cData]})
    },
    //保存驾驶证图片上传
    saveDriverimage(state,action){
      return Object.assign({},state,{Driverimage:action.Driverimage});
    },
    //保存行驶证图片上传
    saveDriveimage(state,action){
      return Object.assign({},state,{Driveimage:action.Driveimage});
    },
    //保存运营证图片上传
    saveManageimage(state,action){
      return Object.assign({},state,{Manageimage:action.Manageimage});
    },
    //保存车属单位
    setManagers(state,action){
      return Object.assign({},state,{ownerManagers:action.Data});
    },
    //保存司机填写的详细信息
    setDriverInfo(state,action){
       return Object.assign({},state,{DriverInfo:action.Data.PersonalIdentificationModel,Identphone:action.Data.MemberAccountModel.PhoneNumber});
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
    //获取省数据
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
    //获取市数据
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
    //获取区域数据
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
    //保存提交司机认证信息
    *saveInfo(action,{put,call}){
      const dat = yield call(saveMemberinfo,action);
      if(!dat.err){
        const {Message,Success} = dat.data;
        if(Success){
          message.destroy()
          message.success('保存成功，等待审核')
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    },
    //获取车属单位
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
    //获取司机填写的认证详细信息
    *getDriverInfo(action,{call,put,select}){
      const dat = yield call(getDriverInfo,action);
      const Status = yield select(state => state.login.Status);
      console.log(Status);
      if(!dat.err){
        const {Message,Success,Data} = dat.data;
        if(Success){
          yield put({
              type:'setDriverInfo',
              Data
          });
        }else{
          if(Status!=1){
            message.destroy()
            message.error(Message);
          }

        }
      }
    },
    //修改司机认证信息
    *upadateDriverInfo(action,{call,put}){
      const dat = yield call(upadateDriverInfo,action);
      if(!dat.err){
        const {Message,Success} = dat.data;
        if(Success){
          message.destroy()
           message.success('修改成功');
          yield put(routerRedux.push('/home'));
        }else{
          message.destroy()
          message.error(Message);
        }
      }
    }
  },
  subscriptions: {},
};
