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

function Gtype({dispatch,item,tData,loading,modalShow,modalShowEdit,modalOptions,pageIndex, selectedRowKeys,confirmLoading,optionsDisabled,total,pruBtnList,addBool}) {
    //表头设置
    const tableHeader = [
            {
                title: '类型名称',
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
     	dispatch({type:'gtype/showAddmodal'})
     }
    //关闭增加弹窗
    function onCancel() {
        dispatch({type:'gtype/closeAddmodal'})
    }

    //关闭修改弹框
    function onCancelEdit() {
      dispatch({type:'gtype/closeEditmodal'})
    }
    //添加调接口
    function onOk(param) {
       dispatch({
         type:'gtype/addtransportgoods',
         param,
         pageIndex
        })
    }

    //修改调接口
    function onOkEdit(param) {
        param.id=item.Id;
        dispatch({
         type:'gtype/edittransportgoods',
         param,
          pageIndex
        })
    }

    //按钮修改和删除
      function tableAction(actionKey, item){

        if (actionKey === 'edit') {
          dispatch({
            type:'gtype/edittansdata',
            item
          })
        } else if(actionKey === 'delete') {
            confirm({
                title: '提示',
                content: '确定删除'+item.Name+'吗',
                onOk: () => {
                    const id=item.Id;
                    dispatch({
                      type:'gtype/deletetransportgoods',
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
            label: '类型名称',
            type: 'input',
            name: 'Name',
            options: {
                rules: [
                    {
                        required: true,
                        message: '请填写货物类型!',
                    },
                    {
                        pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
                        message: '类型名称只能输入中文、英文字母、数字和下划线!',
                    },
                    {
                        max: 50,
                        message: '请不要超过50个字符!',
                    }
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
            label: '类型名称',
            type: 'input',
            name: 'Name',
            options: {
                initialValue: item.Name,
                rules: [
                  {
                    required: true,
                    message: '请填写货物类型!',
                  },
                  {
                    pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
                    message: '类型名称只能输入中文、英文字母、数字和下划线!',
                  },
                  {
                    max: 50,
                    message: '请不要超过50个字符!',
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
		      type:'gtype/gettransportgoods',
		      page
		    })
        dispatch({
          type:'gtype/updatePage',
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
                            action={row =>pruBtnList}
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
                    title="添加类型"
                    fields={fields}
                    onOk={onOk}
                    onCancel={onCancel}
                    okText="保存"
                />
                <FormModal
                    modalKey="Edit"
                    visible={modalShowEdit}
                    title="修改类型"
                    fields={fieldsEdit}
                    onOk={onOkEdit}
                    onCancel={onCancelEdit}
                    okText="保存"
                />
            </div>
        )
}

function mapStateToProps(state) {
  return {...state.gtype,...state.login,...state.common};
}

export default connect(mapStateToProps)(Gtype);
