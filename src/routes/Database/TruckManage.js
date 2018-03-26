import React from 'react';
import { connect } from 'dva';
import {FormModal} from '../../components/modalForm/index'
import Table from '../../components/table/index'
import {Button,Modal,Row,Col,message} from 'antd'
import {RQHEADER} from '../../utils/config'
import SearchBar from '../../components/searchbar';
import moment from 'moment'

const confirm = Modal.confirm;
function TruckManage({dispatch,tData,loading,modalShow,modalShowEdit,item,total,
                       CarType,OperatingLicense,DrivingLicense,modalDetail,keyNum,pruBtnList,addBool,pageIndex,axesCount,carNo}) {
  //标题
  const tableHeader= [
    {
      title: '车牌号-车头',
      dataIndex: 'CarNo',
      key: 'CarNo',
    },
    {
      title: '车牌号-车尾',
      dataIndex: 'CarNoEnd',
      key: 'CarNoEnd',
    },
    {
      title: '车辆类型',
      dataIndex: 'CarModelName',
      key: 'CarModelName',
    },
    {
      title: '载重(吨)',
      dataIndex: 'CarLoad',
      key: 'CarLoad',
    },
    {
      title: '车轴数',
      dataIndex: 'AxesCount',
      key: 'AxesCount',
    },
    {
      title: '车长',
      dataIndex: 'CarLength',
      key: 'CarLength',
    },
    {
      title: '备注',
      dataIndex: 'Remark',
      key: 'Remark',
    },
  ];
  //上传图片前事件
  function beforeUpload(file) {
    if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/bmp') {
      message.error('只能上传jpg,jpeg,png或bmp格式的图片!');
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片大小不能超过5MB!');
    }
    return  isLt5M;
  }
  //上传行驶证
  function changeUploadDrivingLicense(info) {
    if(info.file.status === 'done'){
      dispatch({
        type:'truckmanage/saveDrivingLicenseimage',
        DrivingLicense:info.file.response.Message
      })
    }
  }
  //上传营运证
  function changeUploadYyz(info) {
    if(info.file.status === 'done'){
      dispatch({
        type:'truckmanage/saveYyzimage',
        OperatingLicense:info.file.response.Message
      })
    }
  }
  //添加表单字段
  const fields = () => {
    return [
      {
        label: '车牌号-车头',
        type: 'input',
        name: 'CarNo',
        options:{
          rules:[{
            required: true,
            message: '请输入车牌号!',
          },{
            pattern:/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/,
            message:'请输入正确格式的车牌号'
          }
          ]
        }
      },
      {
        label: '车牌号-车尾',
        type: 'input',
        name: 'CarNoEnd',
        options:{
          rules:[{
            pattern:/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/,
            message:'请输入正确格式的车牌号'
          }]
        }
      },
      {
        label: '年审日期',
        type: 'date',
        name: 'CheckDate',
        options: {
          rules: [{
            required: true,
            message: '请选择年审日期!',
          }]
        }
      },
      {
        label: '车型',
        type: 'select',
        name: 'CarModel',
        items:()=>CarType.map(ele=>({
          key:ele.EnumValue,
          value:ele.Desction
        })),
        options: {
          rules: [{
            required: true,
            message: '请填写车型!',
          }]
        }
      },
      {
        label: '购车时间',
        type: 'date',
        name: 'BuyDate',
        options: {
          rules: [{
            required: false,
          }]
        }
      },
      {
        label: '车辆自重(吨)',
        type: 'input',
        name: 'Weight',
        options: {
          rules: [{
            required: false,
          }]
        }
      },
      {
        label: '交强险到期时间',
        type: 'date',
        name: 'TCIExpData',
        options: {
          rules: [{
            required: false,
          }]
        }
      },
      {
        label: '载重(吨)',
        type: 'input',
        name: 'CarLoad',
        options: {
          rules: [{
            required: false,
          }]
        }
      },
      {
        label: '商业险到期时间',
        type: 'date',
        name: 'VCIExpData',
        options: {
          rules: [{
            required: false,
          }]
        }
      },
      {
        label: '车长(米)',
        type: 'input',
        name: 'CarLength',
        options: {
          rules: [{
            required: false,
          }]
        }
      },
      {
        label: '轴数',
        type: 'inputNumber',
        name: 'AxesCount',
        options: {
          rules: [{
            required: true,
            message: '请填写轴数!',
          },{
            pattern:/^[0-9]\d*$/,
            message:'只能输入正整数!'
          }]
        }
      },
      {
        label: '车宽(米)',
        type: 'input',
        name: 'CarWidth',
        options: {
          rules: [{
            required: false,
          }]
        }
      },
      {
        label: '营运证号',
        type: 'input',
        name: 'OperatingLicenseNo',
        options: {
          rules: [{
            required: true,
            message: '请填写营运证号!',
          }]
        }
      },
      {
        label: '车架号',
        type: 'input',
        name: 'VIN',
        options: {
          rules: [{
            required: true,
            message: '请填写车架号!',
          }]
        }
      },
      {
        label: '发动机号',
        type: 'input',
        name: 'EngineNo',
        options: {
          rules: [{
            required: true,
            message: '请填写发动机号!',
          }]
        }
      },
       {
        label: '备注',
        type: 'input',
        name: 'Remark',
        options: {
          rules: [{
            required: false,
          },{
            max:50,
            message:'请不要超过50个字符'
          }]
        }
      },
      {
        label: '行驶证',
        type: 'upload',
        name: 'DrivingLicense',
        action:`${RQHEADER}/car/saveimage`,
        headers:{'Authorization': 'token '+sessionStorage.access_token},
        beforeUpload:beforeUpload,
        onChange:changeUploadDrivingLicense,
        options: {
          rules: [{
            required: true,
            message: '请上传行驶证!',
          }]
        }
      },
      {
        label: '营运证',
        type: 'upload',
        name: 'OperatingLicense',
        action:`${RQHEADER}/car/saveimage`,
        headers:{'Authorization': 'token '+sessionStorage.access_token},
        beforeUpload:beforeUpload,
        onChange:changeUploadYyz,
        options: {
          rules: [{
            required: true,
            message: '请上传营运证!',
          }]
        }
      },

    ]};

  //编辑表单字段
  const fieldsEdit = () => {
    return [
      {
        label: '车牌号-车头',
        type: 'input',
        name: 'CarNo',
        options:{
          initialValue: item.CarNo,
          rules:[{
            required: true,
            message: '请输入车牌号!',
          },{
            pattern:/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/,
            message:'请输入正确格式的车牌号'
          }
          ]
        }
      },
      {
        label: '车牌号-车尾',
        type: 'input',
        name: 'CarNoEnd',
        options:{
          initialValue: item.CarNoEnd,
          rules:[{
            pattern:/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/,
            message:'请输入正确格式的车牌号'
          }
          ]
        }
      },
      {
        label: '年审日期',
        type: 'date',
        name: 'CheckDate',
        options: {
          initialValue:moment(item.CheckDate),
          rules: [{
            required: true,
            message: '请选择年审日期!',
          }]
        }
      },
      {
        label: '车型',
        type: 'select',
        name: 'CarModel',
        items:()=>CarType.map(ele=>({
          key:ele.EnumValue,
          value:ele.Desction
        })),
        options: {
          initialValue: item.CarModelName,
          rules: [{
            required: true,
            message: '请填写车型!',
          }]
        }
      },
      {
        label: '购车时间',
        type: 'date',
        name: 'BuyDate',
        options: {
          initialValue:item.BuyDate?moment(item.BuyDate):'',
          rules: [{
            required: false,
          }]
        }
      },
      {
        label: '车辆自重(吨)',
        type: 'input',
        name: 'Weight',
        options: {
          initialValue: item.Weight,
          rules: [{
            required: false,
          }]
        }
      },
      {
        label: '交强险到期时间',
        type: 'date',
        name: 'TCIExpData',
        options: {
          initialValue:item.TCIExpData?moment(item.TCIExpData):'',
          rules: [{
            required: false,
          }]
        }
      },
      {
        label: '载重(吨)',
        type: 'input',
        name: 'CarLoad',
        options: {
          initialValue: item.CarLoad,
          rules: [{
            required: false,
          }]
        }
      },
      {
        label: '商业险到期时间',
        type: 'date',
        name: 'VCIExpData',
        options: {
          initialValue:item.VCIExpData?moment(item.VCIExpData):'',
          rules: [{
            required: false,
          }]
        }
      },
      {
        label: '车长(米)',
        type: 'input',
        name: 'CarLength',
        options: {
          initialValue: item.CarLength,
          rules: [{
            required: false,
          }]
        }
      },
      {
        label: '轴数',
        type: 'input',
        name: 'AxesCount',
        options: {
          initialValue: item.AxesCount,
          rules: [{
            required: true,
            message: '请填写轴数!',
          },{
            pattern:/^[0-9]\d*$/,
            message:'只能输入正整数!'
          }]
        }
      },
      {
        label: '车宽(米)',
        type: 'input',
        name: 'CarWidth',
        options: {
          initialValue: item.CarWidth,
          rules: [{
            required: false,
          }]
        }
      },
      {
        label: '营运证号',
        type: 'input',
        name: 'OperatingLicenseNo',
        options: {
          initialValue: item.OperatingLicenseNo,
          rules: [{
            required: true,
            message: '请填写营运证号!',
          }]
        }
      },
      {
        label: '车架号',
        type: 'input',
        name: 'VIN',
        options: {
          initialValue: item.VIN,
          rules: [{
            required: true,
            message: '请填写车架号!',
          }]
        }
      },
      {
        label: '发动机号',
        type: 'input',
        name: 'EngineNo',
        options: {
          initialValue: item.EngineNo,
          rules: [{
            required: true,
            message: '请填写发动机号!',
          }]
        }
      },
      {
        label: '备注',
        type: 'input',
        name: 'Remark',
        options: {
          initialValue: item.Remark,
          rules: [{
            required: false,
          },{
            max:50,
            message:'请不要超过50个字符'
          }]
        }
      },
      {
        label: '行驶证',
        type: 'upload',
        name: 'DrivingLicense',
        action:`${RQHEADER}/car/saveimage`,
        headers:{'Authorization': 'token '+sessionStorage.access_token},
        beforeUpload:beforeUpload,
        onChange:changeUploadDrivingLicense,
        options: {
          initialValue: [{ uid: -1,name:'行驶证',url:item.DrivingLicense || '',thumbUrl:item.DrivingLicense || '',status:'done'}],
          rules: [{
            required: true,
            message: '请上传行驶证!',
          }]
        }
      },
      {
        label: '营运证',
        type: 'upload',
        name: 'OperatingLicense',
        action:`${RQHEADER}/car/saveimage`,
        headers:{'Authorization': 'token '+sessionStorage.access_token},
        beforeUpload:beforeUpload,
        onChange:changeUploadYyz,
        options: {
          initialValue: [{ uid: -1,name:'营运证',url:item.OperatingLicense || '',thumbUrl:item.OperatingLicense || '',status:'done'}],
          rules: [{
            required: true,
            message: '请上传营运证!',
          }]
        }
      },

    ]};

  //车辆详情弹框
  const fieldsDetail =()=>{
    return [{
      label: '车牌号-车头',
      name: 'CarNo',
      options:{
        initialValue:item.CarNo,
      }
    },{
      label: '车牌号-车尾',
      name: 'CarNoEnd',
      options:{
        initialValue:item.CarNoEnd,
      }
    },{
      label: '年审日期',
      name: 'CheckDate',
      options:{
        initialValue:item.CheckDate,
      }
    },{
      label: '车型',
      name: 'CarModel',
      options:{
        initialValue:item.CarModelName,
      }
    },{
      label: '购车时间',
      name: 'BuyDate',
      options:{
        initialValue:item.BuyDate?item.BuyDate:'',
      }
    },{
      label: '车辆自重(吨)',
      name: 'Weight',
      options:{
        initialValue:item.Weight,
      }
    },{
      label: '交强险到期时间',
      name: 'TCIExpData',
      options:{
        initialValue:item.TCIExpData,
      }
    },{
      label: '载重(吨)',
      name: 'CarLoad',
      options:{
        initialValue:item.CarLoad,
      }
    },{
      label: '商业险到期时间',
      name: 'VCIExpData',
      options:{
        initialValue:item.VCIExpData,
      }
    },{
      label: '车长(米)',
      name: 'CarLength',
      options:{
        initialValue:item.CarLength,
      }
    },{
      label: '轴数',
      name: 'AxesCount',
      options:{
        initialValue:item.AxesCount,
      }
    },{
      label: '车宽(米)',
      name: 'CarWidth',
      options:{
        initialValue:item.CarWidth,
      }
    },{
      label: '营运证号',
      name: 'OperatingLicenseNo',
      options:{
        initialValue:item.OperatingLicenseNo,
      }
    },{
      label: '车架号',
      name: 'VIN',
      options:{
        initialValue:item.VIN,
      }
    },{
      label: '发动机号',
      name: 'EngineNo',
      options:{
        initialValue:item.EngineNo,
      }
    },{
      label: '行驶证',
      name: 'DrivingLicense',
      type:'image',
      options:{
        url:item.DrivingLicense,
      }
    },{
      label: '营运证',
      name: 'OperatingLicense',
      type:'image',
      options:{
        url:item.OperatingLicense,
      }
    },{
      label: '备注',
      name: 'Remark',
      options:{
        initialValue:item.Remark,
      }
    }
    ]
  };
  console.log(item)
  //添加弹框
  function add(){
    dispatch({
      type:'common/keynum'
    })
    dispatch({type:'truckmanage/getcartype'});
    dispatch({ type: 'truckmanage/showAddmodal' });
  }
  //关闭增加弹窗
  function onCancel() {
    dispatch({ type: 'truckmanage/closeAddmodal' })
  }
  //确认添加
  function onOk(param) {
    param.Remark = param.Remark || ''
    param.BuyDate = param.BuyDate || ''
    param.Weight = param.Weight || ''
    param.TCIExpData = param.TCIExpData || ''
    param.CarLoad = param.CarLoad || ''
    param.VCIExpData = param.VCIExpData || ''
    param.CarLength = param.CarLength || ''
    param.CarWidth = param.CarWidth || ''
    param.DrivingLicense=DrivingLicense;
    param.OperatingLicense=OperatingLicense;
    dispatch({
      type:'truckmanage/addtruckmanage',
      param,
      pageIndex
    })
  }
  //修改调接口
  function onOkEdit(param) {
    param.Id=item.Id;
    param.Remark = param.Remark || '';
    param.BuyDate = param.BuyDate || '';
    param.Weight = param.Weight || '';
    param.TCIExpData = param.TCIExpData || '';
    param.CarLoad = param.CarLoad || '';
    param.VCIExpData = param.VCIExpData || '';
    param.CarLength = param.CarLength || '';
    param.CarWidth = param.CarWidth || '';
    param.DrivingLicense=DrivingLicense;
    param.OperatingLicense=OperatingLicense;
    if(param.CarModel === item.CarModelName){param.CarModel=item.CarModel}
    dispatch({
      type:'truckmanage/edittruckmanage',
      param,
      pageIndex
    })
  }
  //关闭修改弹框
  function onCancelEdit() {
    dispatch({type:'truckmanage/closeEditmodal'})
  }
  //关闭详情弹框
  function onCancelDetail() {
    dispatch({type:'truckmanage/closemodalDetail'})
  }
  //按钮修改和删除
  function tableAction(actionKey, item){
    if (actionKey === 'edit') {
      dispatch({
        type:'common/keynum'
      })
      dispatch({type:'truckmanage/getcartype'});
      dispatch({
        type:'truckmanage/edittruckmanagedata',
        item
      })
    } else if(actionKey === 'delete') {
      confirm({
        title: '提示',
        content: '确定删除'+item.CarNo+'吗',
        onOk: () => {
          const id=item.Id;
          dispatch({
            type:'truckmanage/deletetruckmanage',
            id,
            pageIndex
          })
        },
        onCancel() {}
      })
    } else if(actionKey === 'detail'){
      dispatch({
        type:'truckmanage/showmodalDetail',
        item
      })
    }
  };
  //分页
  function addPage(page, filters, sorter){
    dispatch({
      type:'truckmanage/search',
      page,axesCount,carNo
    })
    dispatch({
      type:'truckmanage/updatePage',
      page
    })
  }
  //搜索项目
  const searchFileds = [
    {
      title:'车牌号-车头',
      key:'carNo',
      type:'input'
    },{
      title:'轴数',
      key:'axesCount',
      type:'input'
    }
  ];
  const searchFiledsAll = [{fields:searchFileds,visible:'visible'}];
  function onSearch(param){
  	dispatch({
      type:'truckmanage/updatePage',
      page:1
    })
  	if(param.length<1){
        addPage(pageIndex);
      }else{
      	param.axesCount = param.axesCount?param.axesCount:'';
	  	param.carNo = param.carNo?param.carNo:'';
	  	dispatch({type:'truckmanage/search',param})
      }
  }
  return (
    <div id = "wrap" >
      <div>
        <Row>
          <Col>
            <SearchBar
            	onSubmit={onSearch}
	        	searchFileds={searchFiledsAll}
              	hasReset={false}
            />
          </Col>
          <Col style={{paddingBottom:'30px'}} >
          	{addBool?<Button type="primary" onClick={add}>添加车辆</Button>:''}
          </Col>
        </Row>
        <Row >
          <Col span={24}>
            <Table
              onCtrlClick={ tableAction }
              pagination={ true }
              header={ tableHeader }
              data={tData}
              loading={loading }
              action={row => pruBtnList}
              pageSize = {15}
              total={total}
              onChange={addPage}
              currentPage={pageIndex}
            />
          </Col>
        </Row>
      </div>
      <FormModal
        modalKey="detail"
        visible={modalDetail}
        title="司机信息详情"
        fields={fieldsDetail()}
        onCancel={onCancelDetail}
        onOk={onCancelDetail}
        layout={'inline'}
        width={1000}
        noBtn={true}
        showCancel={false}
      />
      <FormModal
        modalKey={keyNum}
        visible={modalShow}
        title="添加车辆"
        fields={fields()}
        onOk={onOk}
        onCancel={onCancel}
        okText="保存"
        layout='inline'
        width={1000}
      />
      <FormModal
        modalKey={keyNum}
        visible={modalShowEdit}
        title="修改车辆"
        fields={fieldsEdit()}
        onOk={onOkEdit}
        onCancel={onCancelEdit}
        okText="保存"
        layout='inline'
        width={1000}
      />
    </div>
  );
}

function mapStateToProps(state) {
  return {...state.truckmanage,...state.login,...state.common};
}

export default connect(mapStateToProps)(TruckManage);
