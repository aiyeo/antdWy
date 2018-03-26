/**
 * Created by Administrator on 2017/8/7.
 */
import React from 'react';
import { connect } from 'dva';
import {Button,message, Modal } from 'antd';
import {FormModal} from '../../components/modalForm'
import Table from '../../components/table';
import styles from './SysAdmin.css';

// //require('es6-promise').polyfill();
 const confirm = Modal.confirm;

function SysButtons({dispatch,item,tData,loading,modalShow,modalShowEdit,modalOptions, selectedRowKeys,confirmLoading,optionsDisabled,MenuId,modalOptionsButton}) {
    //表头设置
    const tableHeader = [
            {
                title: '操作名称',
                dataIndex: 'Name',
                key: 'Name',
            },
            {
                title: '权限标识',
                dataIndex: 'ActionName',
                key: 'ActionName',
            },
            {
                title: '图标',
                dataIndex: 'IconCss',
                key: 'IconCss',
            },
            {
                title: '按钮颜色',
                dataIndex: 'ColorValue',
                key: 'ColorValue',
            },
            {
                title: '排序',
                dataIndex: 'DisplayOrder',
                key: 'DisplayOrder',
            },
            {
                title: '说明',
                dataIndex: 'DescText',
                key: 'DescText',
            }
        ];
     //添加弹框
     function add(){
     	dispatch({type:'sysbutton/showAddmodal'})
     }
    //关闭增加弹窗
    function onCancel() {
        dispatch({type:'sysbutton/closeAddmodal'})
    }

    //关闭修改弹框
    function onCancelEdit() {
      dispatch({type:'sysbutton/closeEditmodal'})
    }
    //添加调接口
    function onOk(param) {
        param.MenuId=MenuId;
       dispatch({
         type:'sysbutton/addbutton',
         param,
         MenuId
        })
    }

    //修改调接口
    function onOkEdit(param) {
        param.Id=item.Id;
        param.MenuId=MenuId;
        dispatch({
         type:'sysbutton/editbutton',
         param,
         MenuId
        })
    }

    //按钮修改和删除
      function tableAction(actionKey, item){

        if (actionKey === 'edit') {
          dispatch({
            type:'sysbutton/editbutdata',
            item
          })
        } else if(actionKey === 'delete') {
            confirm({
                title: '提示',
                content: '确定删除'+item.Name+'吗',
                onOk: () => {
                    const id=item.Id;
                    dispatch({
                      type:'sysbutton/deletebutton',
                      id,
                      MenuId
                      })
                },
                onCancel() {}
            })
        }
    };
    //添加时弹框内容
    const fields =[{
            label: '操作名称',
            type: 'input',
            name: 'Name',
            options: {
                rules: [
                    {
                        required: true,
                        message: '请填写操作名称!',
                    },
                    {
                        pattern: /^([A-Za-z]|[\u4E00-\u9FA5])+$/,
                        message: '只能输入大小写字母、汉字!',
                    },
                    {
                        max: 10,
                        message: '请不要超过10个字符!',
                    }
                ]
            }

        }, {
            label: '权限标识',
            type: 'input',
            name: 'ActionName',
            options:{
                rules:[{
                    required: true,
                    message: '请填写权限标识!',
                },{
                    max: 50,
                    message: '请不要超过50个字符!',
                },{
                    pattern:/^[A-Za-z]+$/,
                    message: '只能输入英文字母!',
                }]
            }
        },{
          label: '权限授予',
          type: 'radioGroup',
          name: 'Is_OperationButton',
          items: () => modalOptionsButton.map(ele => ({
            key: ele.key,//bool值，是否显示模块
            value: ele.mean//单选提示文字
          })),
          options: {
            rules: [{
              required: true,
              message: '请选择该按钮权限!',
            }]
          }
        },{
            label: '图标',
            type: 'input',
            name: 'IconCss',
            options:{
                rules:[{
                    required: true,
                    message: '请填写图标!',
                },{
                    max: 50,
                    message: '请不要超过50个字符!',
                }]
            }
        },
        {
            label: '按钮颜色',
            type: 'input',
            name: 'ColorValue',
            options:{
                rules:[{
                    required: true,
                    message: '请填写按钮颜色!',
                },{
                    max: 50,
                    message: '请不要超过50个字符!',
                },{
                    pattern:/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/,
                    message: '只能输入类似#c034e3!',
                }]
            }
        },{
            label: '说明',
            type: 'input',
            name: 'DescText',
            options:{
                rules:[{
                    required: true,
                    message: '请填写说明!',
                },{
                    max: 50,
                    message: '请不要超过50个字符!',
                },{
                    pattern:/[\u4e00-\u9fa5]/,
                    message: '只能输入汉字!',
                }]
            }
        }
        , {
            label: '排序',
            type: 'inputNumber',
            name: 'DisplayOrder',
            options: {
                rules: [{
                    required: true,
                    message: '请填写显示顺序!',
                },{
                    pattern:/^[1-9]\d*$/,
                    message:'只能输入正整数!'
                }]
            }
        }];
    //修改时弹框内容
    const fieldsEdit =()=>{
      const bool1=item.Is_OperationButton ? 'true':'false';
      return [{
        label: '操作名称',
        type: 'input',
        name: 'Name',
        options: {
          initialValue:item.Name,
          rules: [
            {
              required: true,
              message: '请填写操作名称!',
            },
            {
              pattern: /^([A-Za-z]|[\u4E00-\u9FA5])+$/,
              message: '只能输入大小写字母、汉字!',
            },
            {
              max: 10,
              message: '请不要超过10个字符!',
            }
          ]
        }
      }, {
        label: '权限标识',
        type: 'input',
        name: 'ActionName',
        options: {
          initialValue: item.ActionName,
          rules:[{
            required: true,
            message: '请填写权限标识',
          },{
            max: 50,
            message: '请不要超过50个字符!',
          },{
            pattern:/^[A-Za-z]+$/,
            message: '只能输入英文字母!',
          }]
        }
      },{
        label: '权限授予',
        type: 'radioGroup',
        name: 'Is_OperationButton',
        items: () => modalOptionsButton.map(ele => ({
          key: ele.key,//bool值，是否显示模块
          value: ele.mean//单选提示文字
        })),
        options: {
          initialValue: bool1,
          rules: [{
            required: true,
            message: '请选择该按钮权限!',
          }]
        }
      },{
        label: '图标',
        type: 'input',
        name: 'IconCss',
        options: {
          initialValue: item.IconCss,
          rules:[{
            required: true,
            message: '请填写图标',
          },{
            max: 50,
            message: '请不要超过50个字符!',
          }]
        }
      },
        {
          label: '按钮颜色',
          type: 'input',
          name: 'ColorValue',
          options: {
            initialValue: item.ColorValue,
            rules:[{
              required: true,
              message: '请填写按钮颜色',
            },{
              max: 50,
              message: '请不要超过50个字符!',
            },{
              pattern:/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/,
              message: '只能输入类似#c034e3!',
            }]
          }
        },
        {
          label: '说明',
          type: 'input',
          name: 'DescText',
          options: {
            initialValue: item.DescText,
            rules:[{
              required: true,
              message: '请填写说明',
            },{
              max: 50,
              message: '请不要超过50个字符!',
            },{
              pattern:/[\u4e00-\u9fa5]/,
              message: '只能输入汉字!',
            }]
          }
        }, {
          label: '排序',
          type: 'inputNumber',
          name: 'DisplayOrder',
          options: {
            initialValue: item.DisplayOrder,
            rules: [{
              required: true,
              message: '请填写显示顺序',
            },{
              pattern:/^[1-9]\d*$/,
              message:'只能输入正整数!'
            }]
          }
        }]
    };
		  function addPage(page, filters, sorter){
		    dispatch({
		      type:'sysbutton/getbutton',
		      page
		    })
		  }
    //组装表格

        const hasSelected = selectedRowKeys.length > 0;
        let pad=33;
        return (
            <div id="wrap">
                <div className="tableBox">
                    <Button type="primary" className={`${styles.optionsBtnGroup}`} onClick={()=>{window.history.go(-1)}}>返回</Button>
                    <Button type="primary" className={`${styles.optionsBtnGroup}`} onClick={add}>添加</Button>
                    <div style={{ paddingTop: pad }}>
                        <Table
                            onCtrlClick={ tableAction }
                            pagination={ false }
                            header={ tableHeader }
                            data={tData }
                            loading={loading }
                            action={row => [{
                                key: 'edit',
                                name: '修改',
                                color: '#2ecc71',
                                icon: 'edit'
                            },{
                                key: 'delete',
                                name: '删除',
                                color: '#2e6671',
                                icon: 'delete'
                            }]
                        }
                            pageSize = {15}
                            onChange={addPage}
                        />
                    </div>
                </div>
                <FormModal
                    modalKey="add"
                    visible={modalShow}
                    title="添加按钮"
                    fields={fields}
                    onOk={onOk}
                    onCancel={onCancel}
                    okText="保存"
                />
                <FormModal
                    modalKey="Edit"
                    visible={modalShowEdit}
                    title="修改按钮"
                    fields={fieldsEdit()}
                    onOk={onOkEdit}
                    onCancel={onCancelEdit}
                    okText="保存"
                />
            </div>
        )
}

function mapStateToProps(state) {
  return {...state.sysbutton,...state.login};
}

export default connect(mapStateToProps)(SysButtons);
