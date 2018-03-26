import {CTER_Contacterlist,CTER_addContacter,CTER_editContacter,CTER_deleteContacter,IDT_getindustrieslist,getProvinces,getPCitys,getCDistricts} from '../../services/index';
import {message} from 'antd';

export default {
  namespace: 'contacter',
  state: {
    tData: [],
    item: {},
    loading: false,
    modalShow:false,
    modalShowEdit:false,
    total:'',
    IndustriesList:[],
    ProvinceList:[],
    Contactertypes:[{ value: '1', mean: '收货联系人'},{value: '2', mean: '发货联系人'}],
    pageIndex:1,
    Area:[],
    yesStatus:false,
  },
  reducers: {
    setcontacter(state,action){
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
    editcontacterdata(state,action){
      return Object.assign({},state,{modalShowEdit:true,item:action.item,Area:action.Area});
    },
    //获取行业
    setindustries(state,action){
      return Object.assign({},state,{IndustriesList:action.Data})
    },
    //省市区级联状态
    updateCData(state, action){
      return Object.assign({},state,{cData: action.arrs})
    },
    updateCDatas(state, action) {
      return Object.assign({},state,{cData: [...state.cData]})
    },
    updatePage(state,action){
      return Object.assign({},state,{pageIndex:action.page});
    },
    getArea(state,action){
      return Object.assign({},state,{Area:action.s});
    },
    getyesStatus(state,action){
      return Object.assign({},state,{yesStatus:true});
    },
  },
  effects: {
    *getcontacter(action,{call,put}){
      const dat = yield call(CTER_Contacterlist,action);
      if(!dat.err){
        let {Success,Data,Message} = dat.data;
        if(Success){
          const total=parseInt(Message)
          yield put({
            type:'setcontacter',
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
    *addcontacter(action,{call,put}){
      const dat = yield call(CTER_addContacter,action);
      if(!dat.err){
        const {Success,Message} = dat.data;
        if(Success){
          let page=action.pageIndex;
          message.destroy();
          message.success('添加成功！');
          yield put({
            type:'getcontacter',
            page
          })
        }else{
        	yield put({type:'closeAddmodal'})
          message.destroy();
          message.error(Message);
        }
      }else{
      	yield put({type:'closeAddmodal'})
        message.destroy();
        message.error('请求异常');
      }
    },
    *editcontacter(action,{call,put}){
      const dat = yield call(CTER_editContacter,action);
      if(!dat.err){
        const {Success,Message} = dat.data;
        if(Success){
          let page=action.pageIndex;
          message.destroy();
          message.success('修改成功！');
          yield put({
            type:'getcontacter',
            page
          })
        }else{
        	yield put({type:'closeEditmodal'})
          message.destroy();
          message.error(Message);
        }
      }else{
      	yield put({type:'closeEditmodal'})
        message.destroy();
        message.error('请求异常');
      }
    },
    *deletecontacter(action,{call,put}){
      const dat = yield call(CTER_deleteContacter,action);
      if(!dat.err){
        let {Success,Message} = dat.data;
        if(Success){
          let page=action.pageIndex;
          message.destroy()
          message.success('删除成功！');
          yield put({
            type:'getcontacter',
            page
          });
        }else{
          message.destroy();
          message.error(Message);
        }
      }else{
        message.destroy();
        message.error('请求异常');
      }
    },
    *getindustrieslist(action,{call,put}){
      const dat = yield call(IDT_getindustrieslist,action);
      if(!dat.err){
        const {Success,Message,Data} = dat.data;
        if(Success){
          yield put({
            type:'setindustries',
            Data
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
          message.destroy();
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
          message.destroy();
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
          message.destroy();
          message.error(Message);
        }
      }
    },
  },
  subscriptions: {},
};
