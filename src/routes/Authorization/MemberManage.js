import React from 'react';
import { connect } from 'dva';
import {FormModal} from '../../components/modalForm'
import Table from '../../components/table'
import {Button,Modal,Row,Col,Icon,Input} from 'antd'
import {isEnable,publicSex} from '../../utils/config'
import styles from './SysRole.css';

const confirm = Modal.confirm;
function MemberManage({dispatch,tData,loading,modalShow,modalShowEdit,item,total,RoleList,pruBtnList,addBool,pageIndex}) {
  const tableHeader= [
    {
      title: '账号',
      dataIndex: 'Account',
      key: 'Account'
    },
    {
      title: '用户姓名',
      dataIndex: 'Realname',
      key: 'Realname',
    },
    {
      title: '角色信息',
      dataIndex: 'RoleName',
      key: 'RoleName',
    },
    {
      title: '联系电话',
      dataIndex: 'PhoneNumber',
      key: 'PhoneNumber',
    },

    {
      title: '身份证号',
      dataIndex: 'CardNo',
      key: 'CardNo',
    },
    {
      title: '性别',
      dataIndex: 'Sex',
      key: 'Sex',
    },
    {
      title: '创建时间',
      dataIndex: 'Regtime',
      key: 'Regtime',
    },
    {
      title: '备注',
      dataIndex: 'Remark',
      key: 'Remark',
    },
  ];
  const fields = () => {
    return [
    {
      label: '账号(手机号)',
      type: 'input',
      name: 'Account',
      options:{
        rules:[{
          required: true,
          message: '请填写登录账号(手机号)!',
        },{
          pattern:/^1[34578]\d{9}$/ ,
          message:'请填写正确格式的手机号码!'
        },{
        	max:11,
        	message:'请不要超过11位'
        }]
      }
    },
    {
      label: '真实姓名',
      type: 'input',
      name: 'Realname',
      options:{
        rules:[{
          required: true,
          message: '请填写真实姓名!',
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
      label: '性别',
      type: 'radioGroup',
      name: 'Sex',
      items: () => publicSex.map(ele => ({
        key: ele.value,
        value: ele.mean
      })),
      options:{
        rules:[{
          required: true,
          message: '请选择性别!',
        },]
      }
    },
    {
      label: '联系电话',
      type: 'input',
      name: 'PhoneNumber',
      options:{
        rules:[{
          required: false,
        },{
          pattern:/^0\d{2,3}-?\d{7,8}$|^1[34578]\d{9}$/,
          message:'请填写正确格式的固定电话号码或者手机号!'
        }]
      }
    },
    {
      label: '身份证号',
      type: 'input',
      name: 'CardNo',
      options:{
        rules:[{
          required: false,
        },{
          pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/ ,
          message:'请填写正确格式身份证号码!'
        }]
      }
    },
    {
      label: '备注',
      type: 'input',
      name: 'Remark',
    },
    {
      label: '角色',
      type: 'select',
      name: 'RolePermissionId',
      items: () => RoleList.map(ele => ({
        key: ele.Id,
        value: ele.Name
      })),
      options:{
        rules:[{
          required: true,
          message: '请选择角色!',
        },]
      }
    },
  ]};
  const fieldsEdit = () => {
    return [
    {
      label: '账号(手机号)',
      type: 'input',
      name: 'Account',
      options:{
        initialValue:item.Account,
        rules:[{
          required: true,
          message: '请填写登录账号(手机号)!',
        },{
          pattern:/^1[34578]\d{9}$/,
          message:'请填写正确格式的手机号码!'
        },{
        	max:11,
        	message:'请不要超过11位'
        }]
      }
    },
    {
      label: '真实姓名',
      type: 'input',
      name: 'Realname',
      options:{
        initialValue:item.Realname,
        rules:[{
          required: true,
          message: '请填写真实姓名!',
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
      label: '性别',
      type: 'radioGroup',
      name: 'Sex',
      items: () => publicSex.map(ele => ({
        key: ele.value,
        value: ele.mean
      })),
      options:{
        initialValue:item.Sex,
        rules:[{
          required: true,
          message: '请选择性别!',
        },]
      }
    },
    {
      label: '联系电话',
      type: 'input',
      name: 'PhoneNumber',
      options:{
        initialValue:item.PhoneNumber,
        rules:[{
          required: false,
        },{
          pattern:/^0\d{2,3}-?\d{7,8}$|^1[34578]\d{9}$/,
          message:'请填写正确格式的固定电话号码或者手机号!'
        }]
      }
    },
    {
      label: '身份证号',
      type: 'input',
      name: 'CardNo',
      options:{
        initialValue:item.CardNo,
        rules:[{
          required: false,
        },{
          pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/ ,
          message:'请填写正确格式身份证号码!'
        }]
      }
    },
    {
      label: '备注',
      type: 'input',
      name: 'Remark',
      options:{
        initialValue:item.Remark,
      }
    },
    {
      label: '角色',
      type: 'select',
      name: 'RolePermissionId',
      items: () => RoleList.map(ele => ({
        key: ele.Id,
        value: ele.Name
      })),
      options:{
        initialValue:item.RolePermissionId,
        rules:[{
          required: true,
          message: '请选择角色!',
        },]
      }
    },
  ]};
  //添加弹框
  function add(){
    dispatch({type:'membermanage/showAddmodal'})
  }
  //关闭增加弹窗
  function onCancel() {
    dispatch({type:'membermanage/closeAddmodal'})
  }
  //确认添加
  function onOk(param) {
    param.PhoneNumber=param.PhoneNumber?param.PhoneNumber:'';
    param.Remark=param.Remark?param.Remark:'';
    param.CardNo=param.CardNo?param.CardNo:'';
    dispatch({
      type:'membermanage/addmember',
      param,
      pageIndex
    })
  }
  //修改调接口
  function onOkEdit(param) {
    param.UserId=item.UserId;
    param.RoleId = parseInt(item.RoleId);
    param.MemberId = item.MemberId;
    param.PhoneNumber=param.PhoneNumber?param.PhoneNumber:'';
    param.Remark=param.Remark?param.Remark:'';
    param.CardNo=param.CardNo?param.CardNo:'';
    dispatch({
      type:'membermanage/editmember',
      param,
      pageIndex
    })
  }
  //关闭修改弹框
  function onCancelEdit() {
    dispatch({type:'membermanage/closeEditmodal'})
  }
  //按钮修改和删除
  function tableAction(actionKey, item){

    if (actionKey === 'edit') {
      dispatch({
        type:'membermanage/editmemberdata',
        item
      })
    } else if(actionKey === 'delete') {
      confirm({
        title: '提示',
        content: '确定删除'+item.Account+'吗',
        onOk: () => {
          const id=item.MemberId;
          dispatch({
            type:'membermanage/deletemember',
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
      type:'membermanage/getmember',
      page
    })
    dispatch({
      type:'membermanage/updatePage',
      page
    })
  }
  return (
    <div id = "wrap" >
      <div className = "tableBox" >
        <Row>
          <Col>{
            addBool?<Button type="primary" onClick={add}>添加</Button>:''
            }
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
        title="添加用户"
        fields={fields()}
        onOk={onOk}
        onCancel={onCancel}
        okText="保存"
      />
      <FormModal
        modalKey="Edit"
        visible={modalShowEdit}
        title="修改用户"
        fields={fieldsEdit()}
        onOk={onOkEdit}
        onCancel={onCancelEdit}
        okText="保存"
      />
    </div>
);
}

function mapStateToProps(state) {
  return {...state.membermanage,...state.login,...state.common};
}

export default connect(mapStateToProps)(MemberManage);
