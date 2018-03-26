/**
 * Created by Administrator on 2017/8/7.
 */
import React from 'react';
import { connect } from 'dva';
import {Button,message, Modal } from 'antd';
import {FormModal} from '../../components/modalForm'
import Table from '../../components/table';
import styles from '../Authorization/SysAdmin.css';

// //require('es6-promise').polyfill();
 const confirm = Modal.confirm;

function Sunit({dispatch,item,tData,loading,modalShow,modalShowEdit,modalOptions, selectedRowKeys,confirmLoading,optionsDisabled,total,pruBtnList,addBool,pageIndex}) {
    //表头设置
    const tableHeader = [
            {
                title: '单位名称',
                dataIndex: 'Name',
                key: 'Name',
            },
            {
                title: '排序',
                dataIndex: 'DisplayOrder',
                key: 'DisplayOrder',
            }
        ];
     //添加弹框
     function add(){
     	dispatch({type:'sunit/showAddmodal'})
     }
    //关闭增加弹窗
    function onCancel() {
        dispatch({type:'sunit/closeAddmodal'})
    }

    //关闭修改弹框
    function onCancelEdit() {
      dispatch({type:'sunit/closeEditmodal'})
    }
    //添加调接口
    function onOk(param) {
       dispatch({
         type:'sunit/addtransportgoods',
         param,
         pageIndex
        })
    }

    //修改调接口
    function onOkEdit(param) {
        param.id=item.Id;
        dispatch({
         type:'sunit/edittransportgoods',
         param,
          pageIndex
        })
    }

    //按钮修改和删除
      function tableAction(actionKey, item){

        if (actionKey === 'edit') {
          dispatch({
            type:'sunit/edittansdata',
            item
          })
        } else if(actionKey === 'delete') {
            confirm({
                title: '提示',
                content: '确定删除'+item.Name+'吗',
                onOk: () => {
                    const id=item.Id;
                    dispatch({
                      type:'sunit/deletetransportgoods',
                      id,
                      pageIndex
                      })
                },
                onCancel() {}
            })
        }
    };
    //添加时弹框内容
    const fields =[{
            label: '单位名称',
            type: 'input',
            name: 'Name',
            options: {
                rules: [
                    {
                        required: true,
                        message: '请填写单位名称!',
                    },
                    {
                        pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
                        message: '请输入格式正确的值!',
                    },
                ]
            }

        },{
                label: '排序',
                type: 'inputNumber',
                name: 'DisplayOrder',
                placeholder:'数值越小，列表显示越靠前',
                options: {
                    rules: [{
                        required: true,
                        message: '请填写显示顺序!',
                    },{
                        pattern:/^[1-9]\d*$/,
                        message:'只能输入正整数!'
                    }],
                    min:1
                }
            }];
    //修改时弹框内容
      const fieldsEdit =[{
            label: '单位名称',
            type: 'input',
            name: 'Name',
            options: {
                initialValue: item.Name,
                rules: [
                    {
                        required: true,
                        message: '请填写单位名称!',
                    },
                    {
                      pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
                        message: '请输入格式正确的值!',
                    }
                ]
            }

        },{
                label: '排序',
                type: 'inputNumber',
                name: 'DisplayOrder',
                placeholder:'数值越小，列表显示越靠前',
                options: {
                    initialValue: item.DisplayOrder,
                    rules: [{
                        required: true,
                        message: '请填写显示顺序!',
                    },{
                        pattern:/^[1-9]\d*$/,
                        message:'只能输入正整数!'
                    }],
                    min:1
                }
            }];
		  function addPage(page, filters, sorter){
		    dispatch({
		      type:'sunit/gettransportgoods',
		      page
		    })
        dispatch({
          type:'sunit/updatePage',
          page
        })
		  }
    //组装表格

        const hasSelected = selectedRowKeys.length > 0;
        let pad=33;
        // if(!addBool){
        //     pad=0;
        // }
        return (
            <div id="wrap">
                <div className="tableBox">
                  {addBool?<Button type="primary" className={`${styles.optionsBtnGroup}`} onClick={add}>添加</Button>:''}
                    <div style={{ paddingTop: pad }}>
                        <Table
                            onCtrlClick={ tableAction }
                            pagination={ true }
                            header={ tableHeader }
                            data={tData }
                            loading={loading }
                            action={row => pruBtnList}
                            pageSize = {15}
                            total={total}
                            onChange={addPage}
                            currentPage={pageIndex}
                        />
                    </div>
                </div>
                <FormModal
                    modalKey="add"
                    visible={modalShow}
                    title="添加单位"
                    fields={fields}
                    onOk={onOk}
                    onCancel={onCancel}
                    okText="保存"
                />
                <FormModal
                    modalKey="Edit"
                    visible={modalShowEdit}
                    title="修改单位"
                    fields={fieldsEdit}
                    onOk={onOkEdit}
                    onCancel={onCancelEdit}
                    okText="保存"
                />
            </div>
        )
}

function mapStateToProps(state) {
  return {...state.sunit,...state.login,...state.common};
}

export default connect(mapStateToProps)(Sunit);
