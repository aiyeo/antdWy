import {
	TLINE_list,TLINE_lineAttribute,TLINE_lineType,TLINE_lineGoodsType,
	TLINE_lineIndustry,TLINE_lineService,TLINE_lineShipType,TLINE_addLine,TLINE_updateLine,TLINE_deleteLine,
	getProvinces,getPCitys,getCDistricts,getPCitysStart,getPCitysEnd
} from '../../services/index';
import {message} from 'antd';
import {loadsh} from '../../utils/fun_config'

export default {
  namespace: 'transportline',
  state: {
    tData: [],
    item: {},
    loading: false,
    modalShow: false,
    modalShowEdit: false,
    selectedRowKeys: [],
    modalOptions:false,
    total:'',
  	lineAttribute:[],
  	lineType:[],
  	lineGoodsType:[],
  	lineIndustry:[],
  	lineService:[],
  	lineShipType:[],
  	cData:[],
  	dData:[],
    pageIndex:1,
},
  reducers: {
    settransportline(state,action){
      return Object.assign({},state,{tData:action.Data,loading:false,selectedRowKeys: [],total:action.total,modalShow:false,modalShowEdit: false});
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
    showEditmodal(state,action){
      return Object.assign({},state,{item:action.item,modalShowEdit:true});
    },
    closeEditmodal(state,action){
      return Object.assign({},state,{modalShowEdit:false});
    },
    //获取线路属性
    getLineAttribute(state,action){
    	return Object.assign({},state,{lineAttribute:action.data});
    },
    //获取线路类型
    getLineType(state,action){
    	return Object.assign({},state,{lineType:action.data});
    },
    //获取线路产品类型
    getLineGoodsType(state,action){
    	return Object.assign({},state,{lineGoodsType:action.data});
    },
    //获取线路行业优势
    getLineIndustry(state,action){
    	return Object.assign({},state,{lineIndustry:action.data});
    },
    //获取线路服务优势
    getLineService(state,action){
    	return Object.assign({},state,{lineService:action.data});
    },
    //获取线路运输方式
    getLineShipType(state,action){
    	return Object.assign({},state,{lineShipType:action.data});
    },
    //省市区级联状态
    updateCData(state, action){
      return Object.assign({},state,{cData: action.arrs})
    },
    updateCDatas(state, action) {
      return Object.assign({},state,{cData: [...state.cData]})
    },
    getChosePCitysStart(state, action) {
      return Object.assign({},state,{cData: [...state.cData],item:action.obj,modalShowEdit:true})
    },
    getChoseAreaStart(state, action) {
      return Object.assign({},state,{dData: action.arrs})
    },
    updatePage(state,action){
      return Object.assign({},state,{pageIndex:action.page});
    },
  },
  effects: {
  	//获取列表
    *gettransportgoodslist(action,{call,put}){
      const dat = yield call(TLINE_list,action);
      if(!dat.err){
        let {Success,Data,Message} = dat.data;
        if(Success){
          const total=parseInt(Message)
          yield put({
            type:'settransportline',
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
    //添加内容
    *addtransportline(action,{call,put}){
      const dat = yield call(TLINE_addLine,action);
      if(!dat.err){
        const {Success,Message} = dat.data;
        if(Success){
          let page=action.pageIndex;
          message.destroy();
          message.success('添加成功！');
          yield put({
            type:'gettransportgoodslist',
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
    //获取线路属性
    *getlineattribute(action,{call,put}){
      const dat = yield call(TLINE_lineAttribute,action);
      if(!dat.err){
        let {Success,Data,Message} = dat.data;
        const data = Data;
        if(Success){
          yield put({
            type:'getLineAttribute',data
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
    //获取线路类型
    *getlinetype(action,{call,put}){
      const dat = yield call(TLINE_lineType,action);
      if(!dat.err){
        let {Success,Data,Message} = dat.data;
        const data = Data;
        if(Success){
          yield put({
            type:'getLineType',data
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
    //获取线路产品类型
    *getlinegoodstype(action,{call,put}){
      const dat = yield call(TLINE_lineGoodsType,action);
      if(!dat.err){
        let {Success,Data,Message} = dat.data;
        const data = Data;
        if(Success){
          yield put({
            type:'getLineGoodsType',data
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
    //获取线路行业优势
    *getlineindustry(action,{call,put}){
      const dat = yield call(TLINE_lineIndustry,action);
      if(!dat.err){
        let {Success,Data,Message} = dat.data;
        const data = Data;
        if(Success){
          yield put({
            type:'getLineIndustry',data
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
    //获取线路服务优势
    *getlineservice(action,{call,put}){
      const dat = yield call(TLINE_lineService,action);
      if(!dat.err){
        let {Success,Data,Message} = dat.data;
        const data = Data;
        if(Success){
          yield put({
            type:'getLineService',data
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
    //获取线路运输方式
    *getlineshiptype(action,{call,put}){
      const dat = yield call(TLINE_lineShipType,action);
      if(!dat.err){
        let {Success,Data,Message} = dat.data;
        const data = Data;
        if(Success){
          yield put({
            type:'getLineShipType',data
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
    //编辑内容
    *edittransportline(action,{call,put}){
      const dat = yield call(TLINE_updateLine,action);
      if(!dat.err){
        const {Success,Message} = dat.data;
        if(Success){
          let page=action.pageIndex;
          message.destroy();
          message.success('修改成功！');
          yield put({
            type:'gettransportgoodslist',
            page
          })
        }else{
        	yield put({type:'closeEditmodal'})
          message.destroy();
          	message.error(Message);
        }
      }else{
        message.destroy();
        message.error('请求异常');
      }
    },
    //删除内容
    *deletetransportline(action,{call,put}){
      const dat = yield call(TLINE_deleteLine,action);
      if(!dat.err){
        let {Success,Message} = dat.data;
        if(Success){
          let page=action.pageIndex;
          message.destroy();
          message.success('删除成功！');
          yield put({type:'gettransportgoodslist',page});
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
            type:'updateCDatas'
          });
        }else{

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
            type:'updateCDatas'
          });
        }else{

          message.error(Message);
        }
      }
    },
    *geteditPcitysStart(payload, { call, put }) {
      let obj=payload.targetOption;
      const dat = yield call(getPCitysStart,payload);
      if(dat){
         const {Success,Data,Message} = dat.data;
        if(Success){
          let arrs=[];
          payload.cData.map(item =>{
            if(item.value==payload.targetOption.StartingProvinceId){
              item.children = Data.map(item=>({
                label:item.Name,
                value:item.CityId
              }))
            }
            arrs.push(item)
          })
          yield put({
          	type:'getChosePCitysStart',arrs,obj
          })
        }else{

            message.error(Message);
        }
      }else{

        message.success('请求异常');
      }
    },
  },
  subscriptions: {},
};

