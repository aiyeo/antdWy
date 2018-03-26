
import React from 'react';
import { connect } from 'dva';
import {FormModal} from '../../components/modalForm'
import Table from '../../components/table'
import {Button,Modal,Row,Col} from 'antd'

const confirm = Modal.confirm;
function Industries({dispatch,tData,loading,modalShow,modalShowEdit,item,total,pruBtnList,addBool,pageIndex}) {
  const tableHeader= [
    {
      title: '行业类型',
      dataIndex: 'Name',
      key: 'Name',
    },
    {
      title: '排序',
      dataIndex: 'DisplayOrder',
      key: 'DisplayOrder',
    },
  ];
  const fields = () => {
    return [
      {
        label: '行业类型',
        type: 'input',
        name: 'Name',
        options:{
          rules:[{
            required: true,
            message: '请填写行业类型!',
          },{
          pattern:/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
          message:'行业类型只能只能输入中文、英文字母、数字和下划线!'
          },{
            max: 50,
            message: '请不要超过50个字符!',
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
    ]};
  const fieldsEdit = () => {
    return [
      {
        label: '行业类型',
        type: 'input',
        name: 'Name',
        options:{
          initialValue:item.Name,
          rules:[{
            required: true,
            message: '请填写行业类型!',
          },{
            pattern:/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
            message:'行业类型只能只能输入中文、英文字母、数字和下划线!'
          },{
            max: 50,
            message: '请不要超过50个字符!',
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
            message:'只能输入0或正整数!'
          }],
          min:1
        }
      },
    ]};
  //添加弹框
  function add(){
    dispatch({ type: 'industries/showAddmodal' })
  }
  //关闭增加弹窗
  function onCancel() {
    dispatch({ type: 'industries/closeAddmodal' })
  }
  //确认添加
  function onOk(param) {
    dispatch({
      type:'industries/addindustries',
      param,
      pageIndex
    })
  }
  //修改调接口
  function onOkEdit(param) {
    param.Id=item.Id;
    dispatch({
      type:'industries/editindustries',
      param,
      pageIndex
    })
  }
  //关闭修改弹框
  function onCancelEdit() {
    dispatch({type:'industries/closeEditmodal'})
  }
  //按钮修改和删除
  function tableAction(actionKey, item){
    if (actionKey === 'edit') {
      dispatch({
        type:'industries/editindustriesdata',
        item
      })
    } else if(actionKey === 'delete') {
      confirm({
        title: '提示',
        content: '确定删除'+item.Name+'吗',
        onOk: () => {
          const id=item.Id;
          dispatch({
            type:'industries/deleteindustries',
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
      type:'industries/getindustries',
      page
    })
    dispatch({
      type:'industries/updatePage',
      page
    })
  }
  let pad=33;
  return (
    <div id = "wrap" >
      <div className = "tableBox" >
        <Row>
          <Col>
            {addBool?<Button type="primary" onClick={add}>添加</Button>:''}
          </Col>
        </Row>
        <Row  style={{ marginTop: addBool?pad:0 }}>
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
        title="添加行业"
        fields={fields()}
        onOk={onOk}
        onCancel={onCancel}
        okText="保存"
      />
      <FormModal
        modalKey="Edit"
        visible={modalShowEdit}
        title="修改行业"
        fields={fieldsEdit()}
        onOk={onOkEdit}
        onCancel={onCancelEdit}
        okText="保存"
      />
    </div>
  );
}

function mapStateToProps(state) {
  return {...state.industries,...state.login,...state.common};
}

export default connect(mapStateToProps)(Industries);
