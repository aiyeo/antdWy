import React from 'react';
import { connect } from 'dva';
import {FormModal} from '../../components/modalForm'
import Table from '../../components/table/index'
import {Button,Modal,Row,Col,message} from 'antd'
import {RQHEADER} from '../../utils/config'
import SearchBar from '../../components/searchbar';

const confirm = Modal.confirm;
function DriverManage({dispatch,tData,loading,modalShow,modalShowEdit,item,total,modalDetail,ImgPath,DriverLicense,keyNum,pruBtnList,addBool,pageIndex,name,phone}) {
  //标题
  const tableHeader= [
    {
      title: '司机姓名',
      dataIndex: 'Name',
      key: 'Name',
    },
    {
      title: '联系电话',
      dataIndex: 'Phone',
      key: 'Phone',
    },
    {
      title: '身份证号码',
      dataIndex: 'CodeNo',
      key: 'CodeNo',
    },
    {
      title: '驾照类型',
      dataIndex: 'DriverLicenseTypeName',
      key: 'DriverLicenseTypeName',
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
  function changeUploaddriver(info) {
    if(info.file.status === 'done'){
      dispatch({
        type:'drivermanage/saveDriverimage',
        ImgPath:info.file.response.Message
      })
    }
  }
  //添加表单字段
  const fields = () => {
    return [
      {
        label: '司机姓名',
        type: 'input',
        name: 'Name',
        options:{
          rules:[{
            required: true,
            message: '请输入司机姓名!',
          },{
            max:10,
            message:'请不要超过10个字符'
          },{
            pattern:/^([A-Za-z]|[\u4E00-\u9FA5])+$/,
            message:'姓名只能输入英文字母和汉字'
          }]
        }
      },
      {
        label: '驾照类型',
        type: 'select',
        name: 'DriverLicenseType',
        items:()=>DriverLicense.map(ele=>({
          key:ele.EnumValue,
          value:ele.EnumName
        })),
        options: {
          rules: [{
            required: true,
            message: '请选择驾照类型!',
          }]
        }
      },
      {
        label: '联系电话',
        type: 'input',
        name: 'Phone',
        options: {
          rules: [{
            required: true,
            message: '请填写联系电话!',
          },{
            pattern:/^1[34578]\d{9}$/ ,
            message:'请填写正确格式的手机号码!'
          }]
        }
      },
      {
        label: '身份证号码',
        type: 'input',
        name: 'CodeNo',
        options: {
          rules: [{
            required: true,
            message: '请填写身份证号码!',
          },{
            pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            message:'请输入正确的身份证号码'
          }]
        }
      },
      {
        label: '驾驶证照片',
        type: 'upload',
        name: 'ImgPath',
        action:`${RQHEADER}/driver/saveimage`,
        headers:{'Authorization': 'token '+sessionStorage.access_token},
        beforeUpload:beforeUpload,
        onChange:changeUploaddriver,
        options: {
          rules: [{
            required: true,
            message: '请上传驾驶证!',
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
    ]};

  //编辑表单字段
  const fieldsEdit = () => {
    return [
      {
        label: '司机姓名',
        type: 'input',
        name: 'Name',
        options:{
          initialValue: item.Name,
          rules:[{
            required: true,
            message: '请输入司机姓名!',
          },{
            max:10,
            message:'请不要超过10个字符'
          },{
            pattern:/^([A-Za-z]|[\u4E00-\u9FA5])+$/,
            message:'姓名只能输入英文字母和汉字'
          }]
        }
      },
      {
        label: '驾照类型',
        type: 'select',
        name: 'DriverLicenseType',
        items:()=>DriverLicense.map(ele=>({
          key:ele.EnumValue,
          value:ele.EnumName
        })),
        options: {
          initialValue: item.DriverLicenseTypeName,
          rules: [{
            required: true,
            message: '请选择驾照类型!',
          }]
        }
      },
      {
        label: '联系电话',
        type: 'input',
        name: 'Phone',
        options: {
          initialValue: item.Phone,
          rules: [{
            required: true,
            message: '请填写联系电话!',
          },{
            pattern:/^1[34578]\d{9}$/ ,
            message:'请填写正确格式的手机号码!'
          }]
        }
      },
      {
        label: '身份证号码',
        type: 'input',
        name: 'CodeNo',
        options: {
          initialValue: item.CodeNo,
          rules: [{
            required: true,
            message: '请填写身份证号码!',
          },{
            pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            message:'请输入正确的身份证号码'
          }]
        }
      },
      {
        label: '驾驶证照片',
        type: 'upload',
        name: 'ImgPath',
        action:`${RQHEADER}/driver/saveimage`,
        headers:{'Authorization': 'token '+sessionStorage.access_token},
        beforeUpload:beforeUpload,
        onChange:changeUploaddriver,
        options: {
          initialValue:[{ uid: -2,name:'行驶证.png',url:item.ImgPath || ''}],
          rules: [{
            required: true,
            message: '请上传驾驶证!',
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
    ]};


  //司机详情弹框
  const fieldsDetail =()=>{
     return [{
      label: '司机姓名',
      name: 'Name',
      options:{
        initialValue:item.Name,
      }
    },{
      label: '驾照类型',
      name: 'DriverLicenseTypeName',
      options:{
        initialValue:item.DriverLicenseTypeName,
      }
    },{
      label: '联系电话',
      name: 'Phone',
      options:{
        initialValue:item.Phone,
      }
    },{
      label: '身份证号码',
      name: 'CodeNo',
      options:{
        initialValue:item.CodeNo,
      }
    },{
      label: '驾驶证照片',
      name: 'ImgPath',
      type: 'image',
      options:{
        url:item.ImgPath,
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
  //添加弹框
  function add(){
    dispatch({
      type:'common/keynum'
    })
    dispatch({ type: 'drivermanage/getdriverlicense' })
    dispatch({ type: 'drivermanage/showAddmodal' })
  }
  //关闭增加弹窗
  function onCancel() {
    dispatch({ type: 'drivermanage/closeAddmodal' })
  }
  //确认添加
  function onOk(param) {
    if(!param.Remark){param.Remark=''}
    param.ImgPath=ImgPath;
    dispatch({
      type:'drivermanage/adddrivermanage',
      param,
      pageIndex
    })
  }
  //关闭详情弹框
  function onCancelDetail() {
    dispatch({type:'drivermanage/closemodalDetail'})
  }
  //修改调接口
  function onOkEdit(param) {
    if(!param.Remark){param.Remark=''};
    if(param.DriverLicenseType === item.DriverLicenseTypeName){param.DriverLicenseType=item.DriverLicenseType}
    param.DriverId=item.DriverId;
    param.ImgPath=ImgPath;
    if(param.ImgPath==''){
    	message.destroy();
    	message.error('请上传驾驶证照片!')
    }else{
    	dispatch({
	      type:'drivermanage/editdrivermanage',
	      param,
	      pageIndex
    	})
    }
  }
  //关闭修改弹框
  function onCancelEdit() {
    dispatch({type:'drivermanage/closeEditmodal'})
  }
  //按钮修改和删除
  function tableAction(actionKey, item){
    if (actionKey === 'edit') {
      dispatch({
        type:'common/keynum'
      })
      dispatch({ type: 'drivermanage/getdriverlicense'})
      dispatch({
        type:'drivermanage/editdrivermanagedata',
        item
      })
    } else if(actionKey === 'delete') {
      confirm({
        title: '提示',
        content: '确定删除'+item.Name+'吗',
        onOk: () => {
          const id=item.DriverId;
          dispatch({
            type:'drivermanage/deletedrivermanage',
            id,
            pageIndex
          })
        },
        onCancel() {}
      })
    } else if(actionKey === 'detail'){
      dispatch({
        type:'drivermanage/showmodalDetail',
        item
      })
    }
  };
  //分页
  function addPage(page, filters, sorter){
    dispatch({
      type:'drivermanage/search',
      page,name,phone
    })
    dispatch({
      type:'drivermanage/updatePage',
      page
    })
  }
  //搜索项目
  const searchFileds = [
    {
      title:'司机姓名',
      key:'name',
      type:'input'
    },{
      title:'联系电话',
      key:'phone',
      type:'input'
    }
  ];
  const searchFiledsAll = [{fields:searchFileds,visible:'visible'}];
  function onSearch(param){
//	dispatch({
//    type:'drivermanage/updatePage',
//    page:1
//  })
  	if(param.length<1){
        addPage(pageIndex);
      }else{
      	param.name = param.name?param.name:'';
		    param.phone = param.phone?param.phone:'';
		    dispatch({type:'drivermanage/search',param})
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
          <Col style={{paddingBottom:'20px'}}>
          	{addBool?<Button type="primary" onClick={add}>添加司机</Button>:''}
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
        modalKey={keyNum}
        visible={modalShow}
        title="添加司机"
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
        title="修改司机"
        fields={fieldsEdit()}
        onOk={onOkEdit}
        onCancel={onCancelEdit}
        okText="保存"
        layout='inline'
        width={1000}
      />
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
    </div>
  );
}

function mapStateToProps(state) {
  return {...state.drivermanage,...state.login,...state.common};
}

export default connect(mapStateToProps)(DriverManage);

