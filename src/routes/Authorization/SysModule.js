import React from 'react';
import {connect} from 'dva';
import {Button, Icon, message, Modal, Form, Radio, Checkbox} from 'antd';
import {FormModal} from '../../components/modalForm';
import Table from '../../components/table';
import styles from './SysAdmin.css';
import { routerRedux } from 'dva/router';

const confirm = Modal.confirm;

function SystemModel ({moduleId,dispatch,item,tData,loading,modalShowEdit,modalShow,showbtn,modelOperation,buttonList,moduleRow,pruBtnList,addBool,checkedButton,modelUse,treeModule}){

  function add() {
     dispatch({ type:'sysmodule/showAddmodal'})
  }

  function onCancel() {
       dispatch({ type:'sysmodule/closeAddmodal'})
  }

  function edit(){
      dispatch({ type:'sysmodule/showEditmodal'})
  }

  function onCancelEdit(){
       dispatch({ type:'sysmodule/closeEditmodal'})
  }
  //删除模块
  function showConfirm (){
      confirm({
          title: '提示',
          content: '确定删除'+tData.Name+'吗？',
          onOk:() => {
              const id = tData.ModuleId;
              dispatch({ type:'sysmodule/delete',id})
          },
          onCancel() {}
      });
  }
  //添加模块
  function onOk(param) {
      if(!param.Parent_id || param.Parent_id === '00000000-0000-0000-0000-000000000000'){
          param.Parent_id = '';
      }
      dispatch({
          type:'sysmodule/addmodule',
          param
      })
  }
  //修改成功
  function onOkEdit(param) {
      if(param.Parent_id === '00000000-0000-0000-0000-000000000000' || !param.Parent_id ){
          param.Parent_id = '';
      }
      param.MenuId = item.MenuId;
      dispatch({
          type:'sysmodule/editmodule',
          param
      });
  }

  //单条模块删除及编辑
  const tableAction = (actionKey, item) => {
      if (actionKey === 'edit') {
          dispatch({ type:'sysmodule/editdata',item});
          if (item.Parent_id === '00000000-0000-0000-0000-000000000000'){
              item.Parent_id = '';
          }
      } else if (actionKey === 'delete') {
          confirm({
              title: '提示',
              content: '确认删除该系统模块吗?',
              onOk: () => {
                  const id = item.MenuId
                  dispatch({ type:'sysmodule/delete',id})
              },
              onCancel() {}
          })
      } else if (actionKey === 'exclamation-circle-o') {
          const MenuId = item.MenuId;
          const moduleRow = item;
          if(moduleRow.children){
              message.error('请选择一个没有子集的模块！');
          }else {
              //获取所有button列表
              // dispatch({
              //   type: 'sysmodule/getButtonData',
              // });

              // dispatch({
              //   type: 'sysmodule/getButtonModal',
              //   MenuId
              // });
              dispatch(routerRedux.push('/sysbutton/'+MenuId));
          }
          dispatch({
            type: 'sysmodule/selectModuleRow',
            MenuId, moduleRow
        });
      }
  };

 function  onButtonCancel(){
    const checkedButtons = [];
    dispatch({type:'sysmodule/closeButtonModal',checkedButtons})
  }

  //弹窗表格多选框
  let MenuId='';
  let MenuButtonRefModel=[];
  let payload={};
  function onCheckChange(e){
    if(e.target.checked){
      checkedButton.push(e.target.value);
    }else if(!e.target.checked) {
        for(let i=0; i<checkedButton.length; i++) {
          if(checkedButton[i].MenuButtonRefModel.Button_id === e.target.value.MenuButtonRefModel.Button_id) {
            checkedButton.splice(i, 1);
            break;
          }
        }
    }
     MenuId = e.target.value.MenuButtonRefModel.Menu_id;
  }

  //提交按钮数据

  function onButtonOk(){
      if(checkedButton.length!=0){
        checkedButton.map(button=>{
            MenuButtonRefModel.push(button.MenuButtonRefModel);
        })
        }else{
            MenuButtonRefModel=[];
        }
    payload = {Menu_id:MenuId,MenuButtonRefModelList:MenuButtonRefModel}
    dispatch({
      type:'sysmodule/setButtonData',
      payload
    });
    dispatch({
      type:'sysmodule/closeButtonModal'
    })
  }

  const tableHeader =[
          {
              title: '模块名称',
              dataIndex: 'Name',
              key: 'Name'
          },
          {
              title: '图标CSS',
              dataIndex: 'IconCss',
              key: 'IconCss'
          },
          {
              title: '模块状态',
              dataIndex: 'Is_enable',
              key: 'Is_enable',
              render: function(text){
                  if(text){
                      return <Icon type="check" style={{color:'#00ff00', fontSize:22}}/>;
                  }
                  if(!text){
                      return <Icon type="close" style={{color:'#ff0000', fontSize:22}}/>;
                  }
              }
          },
          {
              title: '链接地址',
              dataIndex: 'Url',
              key: 'Url'
          },
          {
              title: '显示顺序',
              dataIndex: 'Display_order',
              key: 'Display_order'
          },
          {
              title: '描述',
              dataIndex: 'Description',
              key: 'Description'
          }
      ];
  const tableHeader2 = () => {
      //通过比较Button_id渲染多选框
    let _self = this;
    let nowButton_id = [];
    if(checkedButton !== []){
      for (let i=0; i<checkedButton.length; i++){
          nowButton_id.push(checkedButton[i].MenuButtonRefModel.Button_id);
        }
        let idStr = nowButton_id.toString();
        return [
          {
            title: '操作编号',
            dataIndex: 'DisplayOrder',
            key: 'DisplayOrder',
          },
          {
            title: '操作名称',
            dataIndex: 'Name',
            key: 'Name',
          },
          {
            title: '选择',
            dataIndex: 'Button_id',
            key: 'Button_id',
            render: (text, record, index) => {
              return(
                <Checkbox
                  value={{MenuButtonRefModel: {Menu_id: moduleRow.MenuId, Button_id: record?record.Id:''}}}
                  defaultChecked={idStr.indexOf(record.Id) > -1}
                  key={idStr}
                  onChange={onCheckChange}
                />
              )
            }
          }
        ];
      }

  };

  const fields = () => {
      return [{
          label: '模块名称',
          type: 'input',
          name: 'Name',
          options: {
              rules: [{
                  required: true,
                  message: '请填写模块名!',
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
      }, {
          label: '所属模块',
          type: 'treeSelect',
          name: 'Parent_id',
          items: treeModule,
          id:'MenuId',
          options: {
              rules: [{
                  required: false
              }]
          }
      }, {
          label: '显示顺序',
          type: 'inputNumber',
          name: 'Display_order',
          options: {
              rules: [{
                  required: true,
                  message: '请填写显示顺序!',
              },{
                  pattern:/^[0-9]\d*$/,
                  message:'只能输入正整数!'
              }]
          }
      },{
          label: '图标CSS',
          type: 'input',
          name: 'IconCss',
          options: {
              rules: [{
                  required: true,
                  message: '请填写图标CSS!',
              }]
          }
      },{
          label: '模块状态',
          type: 'radioGroup',
          name: 'Is_enable',
          items: () => modelUse.map(ele => ({
              key: ele.key,//bool值，是否显示模块
              value: ele.mean//单选提示文字
          })),
          options: {
              rules: [{
                  required: true,
                  message: '请选择该模块状态!',
              }]
          }
      },{
        label: '权限授予',
        type: 'radioGroup',
        name: 'Is_OperationMenu',
        items: () => modelOperation.map(ele => ({
          key: ele.key,//bool值，是否显示模块
          value: ele.mean//单选提示文字
        })),
        options: {
          rules: [{
            required: true,
            message: '请选择该模块权限!',
          }]
        }
      },{
          label: '链接地址',
          type: 'input',
          name: 'Url',
          options: {
              rules: [{
                  required: true,
                  message: '请填写链接地址!',
              }]
          }
      },
      {
          label: '权限名称',
          type: 'input',
          name: 'ControllerName',
          options: {
              rules: [{
                  required: true,
                  message: '请填写权限名称!',
              }]
          }
      }
      ,{
          label: '描述',
          type: 'textarea',
          name: 'Description',
              options: {
              rules: [{
                  required: true,
                  message: '请填写该模块描述!',
              }]
          }
      }
  ]};

  const fieldsEdit = () => {
      const bool=item.Is_enable ? 'true':'false';
      const bool1=item.Is_OperationMenu ? 'true':'false';
      return [{
          label: '模块名称',
          type: 'input',
          name: 'Name',
          options: {
              initialValue: item.Name,
              rules: [{
                  required: true,
                  message: '请填写模块名!',
              }]
          }
      }, {
          label: '所属模块',
          type: 'treeSelect',
          name: 'Parent_id',
          items: treeModule,
          id:'MenuId',
          options: {
              initialValue: item.Parent_id,
              rules: [{
                  required: false
              }]
          }
      }, {
          label: '显示顺序',
          type: 'inputNumber',
          name: 'Display_order',
          options: {
              initialValue: item.Display_order,
              rules: [{
                  required: true,
                  message: '请填写显示顺序!',
              },{
                  pattern:/^[0-9]\d*$/,
                  message:'只能输入正整数!'
              }]
          }
      },{
          label: '图标CSS',
          type: 'input',
          name: 'IconCss',
          options: {
              initialValue: item.IconCss,
              rules: [{
                  required: true,
                  message: '请填写图标CSS!',
              }]
          }
      },{
          label: '模块状态',
          type: 'radioGroup',
          name: 'Is_enable',
          items: () => modelUse.map(ele => ({
              key: ele.key,//bool值，是否显示模块
              value: ele.mean//单选提示文字
          })),
          options: {
              initialValue: bool,
              rules: [{
                  required: true,
                  message: '请选择该模块状态!',
              }]
          }
      },{
        label: '权限授予',
        type: 'radioGroup',
        name: 'Is_OperationMenu',
        items: () => modelOperation.map(ele => ({
          key: ele.key,//bool值，是否显示模块
          value: ele.mean//单选提示文字
        })),
        options: {
          initialValue: bool1,
          rules: [{
            required: true,
            message: '请选择该模块权限!',
          }]
        }
      },{
          label: '链接地址',
          type: 'input',
          name: 'Url',
          options: {
              initialValue: item.Url,
              rules: [{
                  required: true,
                  message: '请填写链接地址!',
              }]
          }
      },
          {
              label: '权限名称',
              type: 'input',
              name: 'ControllerName',
              options: {
                  initialValue: item.ControllerName,
                  rules: [{
                      required: true,
                      message: '请填写权限名称!',
                  }]
              }
          }
          ,{
              label: '描述',
              type: 'input',
              name: 'Description',
              options: {
                  initialValue: item.Description,
                  rules: [{
                      required: true,
                      message: '请填写该模块的描述!',
                  }]
              }
          }
      ]
  };

  let pad=33;
    // if(!addBool){
    //     pad=0;
    // }
      return (
          <div id = "wrap" >
              <div className = "tableBox" >
                  <Button type="primary" onClick={add} className={`${styles.addButton} ${styles.optionsBtnGroup}`}>添加</Button>
                  <FormModal modalKey="add"
                             visible={modalShow}
                             title="新增系统模块"
                             fields={fields()}
                             onOk={onOk}
                             onCancel={onCancel}
                             okText="提交保存"
                  />
                  <FormModal modalKey="edit"
                             visible={modalShowEdit}
                             title="编辑系统模块"
                             fields={fieldsEdit()}
                             onOk={onOkEdit}
                             onCancel={onCancelEdit}
                             okText="提交保存"
                  />
                  <Modal
                    visible={showbtn}
                    title={moduleRow.Name + ' 按钮权限'}
                    okText="提交保存"
                    onCancel={onButtonCancel}
                    onOk={onButtonOk}
                    key={moduleRow.ModuleId}
                  >
                    <Table
                      header={tableHeader2()}
                      data={buttonList}
                      key={moduleRow.ModuleId}
                      pagination={false}
                      loading={ loading }
                    />
                  </Modal>
                  <Table
                      onCtrlClick={ tableAction }
                      pagination={ true }
                      header={tableHeader }
                      data={tData}
                      loading={loading }
                      defaultExpandAllRows={ true }
                      action={row => [{
                              key: 'edit',
                              name: '修改',
                              color: 'blue',
                              icon: 'edit',
                            }, {
                              key: 'delete',
                              name: '删除',
                              color: 'red',
                              icon: 'delete'
                            },{
                              key:'exclamation-circle-o',
                              name:'按钮权限管理',
                              color:'#ddd',
                              icon:'setting'
                            }
                            ]
                            }
                  />
              </div>
          </div>
      )

}
function mapStateToProps(state) {

  return {...state.sysmodule,...state.login};
}

export default connect(mapStateToProps)(SystemModel);
