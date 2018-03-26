/**
 * Created by Administrator on 2017/8/7.
 */
import React from 'react';
import { connect } from 'dva';
import {FormModal} from '../../components/modalForm'
import Table from '../../components/table'
import {Button,Modal,Row,Col,message} from 'antd'

const confirm = Modal.confirm;
function Contacter({dispatch,tData,loading,modalShow,modalShowEdit,item,total,IndustriesList,cData,Contactertypes,pruBtnList,addBool,pageIndex,Area,yesStatus}) {
  const tableHeader= [
    {
      title: '公司名称',
      dataIndex: 'CompanyName',
      key: 'CompanyName'
    },
    {
      title: '联系人',
      dataIndex: 'ContacterName',
      key: 'ContacterName',
    },
    {
      title: '联系电话',
      dataIndex: 'MobileNo',
      key: 'MobileNo',
    },
    {
      title: '行业',
      dataIndex: 'IndustriesName',
      key: 'IndustriesName',
    },
    {
      title: '联系人类型',
      dataIndex: 'ContacterType',
      key: 'ContacterType',
      render:(text,item)=>{
        return (<div>{item.ContacterType===1?'收货联系人':(item.ContacterType===2?'发货联系人':'')}</div>)
      }
    },
    {
      title: '固定电话',
      dataIndex: 'Tel',
      key: 'Tel',
    },
    {
      title: '地区',
      dataIndex: 'ProvinceName',
      key: 'ProvinceName',
      render:(t,r)=>{
      	return (
      		<div>{r.ProvinceName+' '+r.CityName+' '+r.DistrictName}</div>
      	)
      }
    },
    {
      title: '详细地址',
      dataIndex: 'Address',
      key: 'Address',
    },
  ];
  const fields = () => {

    return [
      {
        label: '公司名称',
        type: 'input',
        name: 'CompanyName',
        options:{
          rules:[{
            required: true,
            message: '请填写公司名称!',
          },{
            pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
            message: '请输入正确格式的公司名称!',
          },{
            max: 20,
            message: '请不要超过20个字符!',
          },{
            min: 2,
            message: '请不要小于2个字符!',
          }]
        }
      },
      {
        label: '联系人',
        type: 'input',
        name: 'ContacterName',
        options:{
          rules:[{
            required: true,
            message: '请填写联系人真实姓名!',
          },{
            pattern: /^([A-Za-z]|[\u4E00-\u9FA5])+$/,
            message: '只能输入大小写字母、汉字!',
          },{
            max: 10,
            message: '请不要超过10个字符!',
          },{
            min: 2,
            message: '请不要小于2个字符!',
          }]
        }
      },
      {
        label: '联系人类别',
        type: 'radioGroup',
        name: 'ContacterType',
        items: () => Contactertypes.map(ele => ({
          key: ele.value,
          value: ele.mean
        })),
        options:{
          rules:[{
            required: true,
            message: '请选择联系人类别!',
          },]
        }
      },
      {
        label: '联系人行业',
        type: 'select',
        name: 'IndustriesId',
        items: () => IndustriesList.map(ele => ({
          key: ele.Id,
          value: ele.Name
        })),
        
      },
      {
        label: '手机号',
        type: 'input',
        name: 'MobileNo',
        options:{
          rules:[{
            required: true,
            message: '请填写手机号!',
          },{
            pattern:/^1[34578]\d{9}$/ ,
            message:'请填写正确格式的手机号码!'
          }]
        }
      },
      {
        label: '固定电话',
        type: 'input',
        name: 'Tel',
        options:{
          rules:[{
            pattern:/^0\d{2,3}-?\d{7,8}$/ ,
            message:'请填写正确格式的固定电话号码!'
          }]
        }
      },
      {
        label: '地区',
        type: 'cascader',
        name: 'region',
        items:cData,
        loadData:loadData,
        options: {
          rules: [{
            required: true,
            message: '请选择所属地区!',
          }],
          onChange:(v,s)=>{
            if(s.length<3){
              dispatch({type:'contacter/getyesStatus'});
            }
            dispatch({type:'contacter/getArea',s})
          }
        }
      },
      {
        label: '详细地址',
        type: 'input',
        name: 'Address',
        options:{
          rules:[{
            pattern:/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
            message:'详细地址只能输入中文、英文字母、数字和下划线!'
          },{
            max:20,
            message:'请不要超过20个字符'
          },{
            min:2,
            message:'请不要少于2个字符'
          }]
        }
      },
      {
        label: '排序',
        type: 'inputNumber',
        name: 'DisplayOrder',
        placeholder:'数值越小，列表排序越靠前',
        options: {
          rules: [{
            pattern:/^[1-9]\d*$/,
            message:'只能输入正整数!'
          }],
        }
      },
    ]};
  const fieldsEdit = () => {
    const type = JSON.stringify(item.ContacterType);
    return [
      {
        label: '公司名称',
        type: 'input',
        name: 'CompanyName',
        options:{
          initialValue:item.CompanyName,
          rules:[{
            required: true,
            message: '请填写公司名称!',
          },{
            pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
            message: '请输入正确格式的公司名称!',
          },{
            max: 20,
            message: '请不要超过20个字符!',
          },{
            min: 2,
            message: '请不要小于2个字符!',
          }]
        }
      },
      {
        label: '联系人',
        type: 'input',
        name: 'ContacterName',
        options:{
          initialValue:item.ContacterName,
          rules:[{
            required: true,
            message: '请填写联系人真实姓名!',
          },{
            pattern: /^([A-Za-z]|[\u4E00-\u9FA5])+$/,
            message: '只能输入大小写字母、汉字!',
          },{
            max: 10,
            message: '请不要超过10个字符!',
          },{
            min: 2,
            message: '请不要小于2个字符!',
          }]
        }
      },
      {
        label: '联系人类别',
        type: 'radioGroup',
        name: 'ContacterType',
        items: () => Contactertypes.map(ele => ({
          key: ele.value,
          value: ele.mean
        })),
        options:{
          initialValue:type,
          rules:[{
            required: true,
            message: '请选择联系人类别!',
          },]
        }
      },
      {
        label: '联系人行业',
        type: 'select',
        name: 'IndustriesId',
        items: () => IndustriesList.map(ele => ({
          key: ele.Id,
          value: ele.Name
        })),
        options:{
          initialValue:item.IndustriesId,
        }
      },
      {
        label: '手机号',
        type: 'input',
        name: 'MobileNo',
        options:{
          initialValue:item.MobileNo,
          rules:[{
            required: true,
            message: '请填写手机号!',
          },{
            pattern:/^1[34578]\d{9}$/ ,
            message:'请填写正确格式的手机号码!'
          }]
        }
      },
      {
        label: '固定电话',
        type: 'input',
        name: 'Tel',
        options:{
          initialValue:item.Tel,
          rules:[{
            pattern:/^0\d{2,3}-?\d{7,8}$/ ,
            message:'请填写正确格式的固定电话号码!'
          }]
        }
      },
      {
        label: '地区',
        type: 'cascader',
        name: 'region',
        items:cData,
        loadData:loadData,
        options: {
          initialValue:[item.ProvinceId,item.CityId,item.DistrictId],
          rules: [{
            required: true,
            message: '请选择所属地区!',
          }
          ],
          onChange:(v,s)=>{
            if(s.length<3){
              dispatch({type:'contacter/getyesStatus'});
            }
            dispatch({type:'contacter/getArea',s})
          }
        }
      },
      {
        label: '详细地址',
        type: 'input',
        name: 'Address',
        options:{
          initialValue:item.Address,
          rules:[{
            pattern:/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
            message:'详细地址只能输入中文、英文字母、数字和下划线!'
          },{
            max:20,
            message:'请不要超过20个字符'
          },{
            min:2,
            message:'请不要少于2个字符'
          }]
        }
      },
      {
        label: '排序',
        type: 'inputNumber',
        name: 'DisplayOrder',
        placeholder:'数值越小，列表排序越靠前',
        options: {
          initialValue:item.DisplayOrder==0?'':item.DisplayOrder,
          rules: [{
            pattern:/^[1-9]\d*$/,
            message:'只能输入正整数!'
          }]
        }
      },
    ]};
  //装载级联数据
  const loadData = (selectedOptions) => {
    const  id= selectedOptions[0].value;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    if(selectedOptions.length>1){
      dispatch({ type:'contacter/getcdistricts',targetOption,cData,id});
    }else{
      dispatch({ type:'contacter/getPcitys',targetOption,cData});
    }
  }
  //添加弹框
  function add(){
    dispatch({type:'contacter/showAddmodal'})
    dispatch({type:'contacter/getindustrieslist'})
    dispatch({type:'contacter/getprovines'})
  }
  //关闭增加弹窗
  function onCancel() {
    dispatch({type:'contacter/closeAddmodal'})
  }
  //确认添加
  function onOk(param) {
  	if(Area.length<3){
  		message.destroy();
    	message.error('请选择完整地区(到区一级)!');
    	dispatch({type:'contacter/getyesStatus'});
    	return false;
   }else{
   		param.DisplayOrder = param.DisplayOrder?param.DisplayOrder:0;
   		param.IndustriesId = param.IndustriesId?param.IndustriesId:'';
   		param.Tel = param.Tel?param.Tel:'';
   		param.Address = param.Address?param.Address:'';
    	param.ProvinceID = param.region[0];
	    param.CityID = param.region[1]?param.region[1]:'';
	    param.DistrictID = param.region[2]?param.region[2]:'';
    	dispatch({type:'contacter/addcontacter',param,pageIndex})
    }
  }
  //修改调接口
  function onOkEdit(param) {

  	if(Area.length<3){
  		message.destroy();
    	message.error('请选择完整地区(到区一级)!');
    	dispatch({type:'contacter/getyesStatus'});
    	return false;
  	}else{
      	param.Id=item.Id;
      	param.DisplayOrder = param.DisplayOrder?param.DisplayOrder:0;
   		param.IndustriesId = param.IndustriesId?param.IndustriesId:'';
   		param.Tel = param.Tel?param.Tel:'';
   		param.Address = param.Address?param.Address:'';
      	param.ProvinceID = param.region[0];
      	param.CityID = param.region[1];
      	param.DistrictID = param.region[2];
	    dispatch({type:'contacter/editcontacter',param,pageIndex})
  	}
  }
  //关闭修改弹框
  function onCancelEdit() {
    dispatch({type:'contacter/closeEditmodal'})
  }
  //按钮修改和删除
  function tableAction(actionKey, item){
    if (actionKey === 'edit') {
      dispatch({type:'contacter/getindustrieslist'})
      dispatch({type:'contacter/getprovines'})
      let Area=[
        item.ProvinceName?{label:item.ProvinceName,value:item.ProvinceId}:'',
        item.CityName?{label:item.CityName,value:item.CityId}:'',
        item.DistrictName?{label:item.DistrictName,value:item.DistrictId}:'',
      ]
      dispatch({
        type:'contacter/editcontacterdata',
        item,
        Area
      })
    } else if(actionKey === 'delete') {
      confirm({
        title: '提示',
        content: '确定删除'+item.ContacterName+'吗',
        onOk: () => {
          const id=item.Id;
          dispatch({
            type:'contacter/deletecontacter',
            id,
            pageIndex
          })
        },
        onCancel() {}
      })
    }
  };
  function addPage(page, filters, sorter){
    dispatch({
      type:'contacter/getcontacter',
      page
    })
    dispatch({
      type:'contacter/updatePage',
      page
    })
  }
  return (
    <div id = "wrap" >
      <div className = "tableBox" >
        <Row>
          <Col>
            {addBool?<Button type="primary" onClick={add}>添加</Button>:''}
          </Col>
        </Row>
        <Row  style={{marginTop:33}}>
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
        modalKey="add"
        visible={modalShow}
        title="添加联系人"
        fields={fields()}
        onOk={onOk}
        Yes={yesStatus}
        onCancel={onCancel}
        okText="保存"
      />
      <FormModal
        modalKey="Edit"
        visible={modalShowEdit}
        title="修改联系人"
        fields={fieldsEdit()}
        onOk={onOkEdit}
        onCancel={onCancelEdit}
        okText="保存"
      />
    </div>
  );
}

function mapStateToProps(state) {
  return {...state.contacter,...state.login,...state.common};
}

export default connect(mapStateToProps)(Contacter);
