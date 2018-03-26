import React from 'react';
import { connect } from 'dva';
import {FormModal} from '../../components/modalForm'
import Table from '../../components/table'
import {Button,Modal,Row,Col} from 'antd'

const confirm = Modal.confirm;
function Bankaccount({dispatch,tData,loading,modalShow,modalShowEdit,item,total,pruBtnList,addBool,pageIndex}) {
  const tableHeader= [
    {
      title: '开户银行',
      dataIndex: 'OpeningBankName',
      key: 'OpeningBankName',
    },
    {
      title: '户主',
      dataIndex: 'BankAccountName',
      key: 'BankAccountName',
    },
    {
      title: '卡号',
      dataIndex: 'CardNumber',
      key: 'CardNumber',
    },
    {
      title: '所属公司',
      dataIndex: 'CompanyName',
      key: 'CompanyName',
    },
    {
      title: '排序',
      dataIndex: 'DisplayOrder',
      key: 'DisplayOrder',
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
        label: '开户银行',
        type: 'input',
        name: 'OpeningBankName',
        options:{
          rules:[{
            required: true,
            message: '请填写开户银行名称!',
          },{
            pattern:/^[\u4E00-\u9FFF]+$/,
            message:'只能输入汉字!'
          },{
            min: 2,
            message: '请不要小于2个字符!',
          }]
        }
      },
      {
        label: '户主',
        type: 'input',
        name: 'BankAccountName',
        options:{
          rules:[{
            required: true,
            message: '请填写户主姓名!',
          },{
            pattern:/^[\u4E00-\u9FFF]+$/,
            message:'只能输入汉字!'
          },{
            min: 2,
            message: '请不要小于2个字符!',
          }]
        }
      },
      {
        label: '银行卡号',
        type: 'input',
        name: 'CardNumber',
        options: {
          rules: [{
            required: true,
            message: '请填写银行卡号!',
          },{
            pattern:/^[0-9]\d*$/,
            message:'只能输入正整数!'
          }]
        }
      },
      {
        label: '排序',
        type: 'inputNumber',
        name: 'DisplayOrder',
        placeholder:'数值越小，列表显示越靠前',
        options: {
          rules: [{
            required: true,
            message: '请填写排序!',
          },{
            pattern:/^[1-9]\d*$/,
            message:'只能输入正整数!'
          }],
          min:1
        }
      },
      {
        label: '所属公司',
        type: 'input',
        name: 'CompanyName',
        options:{
          rules:[{
            required: false,
          }]
        }
      },
      {
        label: '备注',
        type: 'input',
        name: 'Remark',
        options:{
          rules:[{
            required: false,
          }]
        }
      },
    ]};
  const fieldsEdit = () => {
    return [
      {
        label: '开户银行',
        type: 'input',
        name: 'OpeningBankName',
        options:{
          initialValue:item.OpeningBankName,
          rules:[{
            required: true,
            message: '请填写开户银行名称!',
          },{
            pattern:/^[\u4E00-\u9FFF]+$/,
            message:'只能输入汉字!'
          },{
            min: 2,
            message: '请不要小于2个字符!',
          }]
        }
      },
      {
        label: '户主',
        type: 'input',
        name: 'BankAccountName',
        options:{
          initialValue:item.BankAccountName,
          rules:[{
            required: true,
            message: '请填写户主姓名!',
          },{
            pattern:/^[\u4E00-\u9FFF]+$/,
            message:'只能输入汉字!'
          },{
            min: 2,
            message: '请不要小于2个字符!',
          }]
        }
      },
      {
        label: '银行卡号',
        type: 'input',
        name: 'CardNumber',
        options: {
          initialValue:item.CardNumber,
          rules: [{
            required: true,
            message: '请填写银行卡号!',
          },{
            pattern:/^[0-9]\d*$/,
            message:'只能输入正整数!'
          }]
        }
      },
      {
        label: '排序',
        type: 'inputNumber',
        name: 'DisplayOrder',
        placeholder:'数值越小，列表显示越靠前',
        options: {
          initialValue:item.DisplayOrder,
          rules: [{
            required: true,
            message: '请填写排序!',
          },{
            pattern:/^[1-9]\d*$/,
            message:'只能输入正整数!'
          }],
          min:1
        }
      },
      {
        label: '所属公司',
        type: 'input',
        name: 'CompanyName',
        options:{
          initialValue:item.CompanyName,
          rules:[{
            required: false,
          }]
        }
      },
      {
        label: '备注',
        type: 'input',
        name: 'Remark',
        options:{
          initialValue:item.Remark,
          rules:[{
            required: false,
          }]
        }
      },
    ]};
  //添加弹框
  function add(){
    dispatch({type:'bankaccount/showAddmodal'})
  }
  //关闭增加弹窗
  function onCancel() {
    dispatch({type:'bankaccount/closeAddmodal'})
  }
  //确认添加
  function onOk(param) {
    if(!param.CompanyName){param.CompanyName=''}
    if(!param.Remark){param.Remark=''}
    dispatch({
      type:'bankaccount/addbankaccount',
      param,
      pageIndex
    })
  }
  //修改调接口
  function onOkEdit(param) {
    param.Id=item.Id;
    param.MemberId=item.MemberId;
    if(!param.CompanyName){param.CompanyName=''}
    if(!param.Remark){param.Remark=''}
    dispatch({
      type:'bankaccount/editbankaccount',
      param,
      pageIndex
    })
  }
  //关闭修改弹框
  function onCancelEdit() {
    dispatch({type:'bankaccount/closeEditmodal'})
  }
  //按钮修改和删除
  function tableAction(actionKey, item){
    if (actionKey === 'edit') {
      dispatch({
        type:'bankaccount/editbankaccountdata',
        item
      })
    } else if(actionKey === 'delete') {
      confirm({
        title: '提示',
        content: '确定删除'+item.BankAccountName+'吗',
        onOk: () => {
          const id=item.Id;
          dispatch({
            type:'bankaccount/deletebankaccount',
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
      type:'bankaccount/getbankaccount',
      page
    })
    dispatch({
      type:'bankaccount/updatePage',
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
        title="添加账户"
        fields={fields()}
        onOk={onOk}
        onCancel={onCancel}
        okText="保存"
      />
      <FormModal
        modalKey="Edit"
        visible={modalShowEdit}
        title="修改账户"
        fields={fieldsEdit()}
        onOk={onOkEdit}
        onCancel={onCancelEdit}
        okText="保存"
      />
    </div>
  );
}

function mapStateToProps(state) {
  return {...state.bankaccount,...state.login,...state.common};
}

export default connect(mapStateToProps)(Bankaccount);
