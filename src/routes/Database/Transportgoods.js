/**
 * Created by Administrator on 2017/8/7.
 */
import React from 'react';
import { connect } from 'dva';
import {Button,message, Modal } from 'antd';
import {FormModal} from '../../components/modalForm'
import Table from '../../components/table';
import styles from '../Authorization/SysAdmin.css';
import SearchBar from '../../components/searchbar';
// //require('es6-promise').polyfill();
 const confirm = Modal.confirm;

function Transportgoods({dispatch,item,tData,loading,modalShow,modalShowEdit,modalOptions, selectedRowKeys,confirmLoading,optionsDisabled,
		total,packData,sunitData,typeData,pruBtnList,addBool,pageIndex,gtype,manufactor,name}) {
    //表头设置
    const tableHeader = [
            {
                title: '货物名称',
                dataIndex: 'Name',
                key: 'Name',
            },
            {
                title: '包装',
                dataIndex: 'Packing',
                key: 'Packing',
                render:(text)=>packData.map(item=>{
                    if(item.Id==text){
                        return item.Name
                    }
                })
            },
            {
                title: '类型',
                dataIndex: 'Gtype',
                key: 'Gtype',
                render:(text)=>typeData.map(item=>{
                    if(item.Id==text){
                        return item.Name
                    }
                })
            },
            {
                title: '单位',
                dataIndex: 'Gunit',
                key: 'Gunit',
                render:(text)=>sunitData.map(item=>{
                    if(item.Id==text){
                        return item.Name
                    }
                })
            },
             {
                title: '规格',
                dataIndex: 'Specifications',
                key: 'Specifications',
            },
            {
                title: '保质期(月)',
                dataIndex: 'QualityGuaranteePeriod',
                key: 'QualityGuaranteePeriod',
            },
             {
                title: '型号',
                dataIndex: 'ItemType',
                key: 'ItemType',
            },
            {
                title: '单价(元)',
                dataIndex: 'UnitPrice',
                key: 'UnitPrice',
            },
            {
                title: '厂家',
                dataIndex: 'Manufactor',
                key: 'Manufactor',
            },
            {
                title: '备注',
                dataIndex: 'Remark',
                key: 'Remark',
            }
        ];
     //添加弹框
     function add(){
     	dispatch({type:'transportgoods/showAddmodal'})
       dispatch({type:'transportgoods/packtransportgoods'})
       dispatch({type:'transportgoods/sunittransportgoods'})
       dispatch({type:'transportgoods/typetransportgoods'})

     }
    //关闭增加弹窗
    function onCancel() {
        dispatch({type:'transportgoods/closeAddmodal'})
    }

    //关闭修改弹框
    function onCancelEdit() {
      dispatch({type:'transportgoods/closeEditmodal'})
    }
    //添加调接口
    function onOk(param) {
    	param.Name = param.Name?param.Name:'';
		param.Packing = param.Packing?param.Packing:'';
		param.Gtype = param.Gtype?param.Gtype:'';
		param.Specifications = param.Specifications?param.Specifications:'';
		param.ItemType = param.ItemType?param.ItemType:'';
		param.Gunit = param.Gunit?param.Gunit:'';
		param.QualityGuaranteePeriod = param.QualityGuaranteePeriod?param.QualityGuaranteePeriod:'';
		param.UnitPrice = parseFloat(param.UnitPrice)?parseFloat(param.UnitPrice):0;
		param.Manufactor = param.Manufactor?param.Manufactor:'';
		param.Remark = param.Remark?param.Remark:'';
		param.DisplayOrder = 0;
       dispatch({
         type:'transportgoods/addtransportgoods',
         param,
         pageIndex
        })
    }

    //修改调接口
    function onOkEdit(param) {
        param.id=item.Id;
        param.Name = param.Name?param.Name:'';
		param.Packing = param.Packing?param.Packing:'';
		param.Gtype = param.Gtype?param.Gtype:'';
		param.Specifications = param.Specifications?param.Specifications:'';
		param.ItemType = param.ItemType?param.ItemType:'';
		param.Gunit = param.Gunit?param.Gunit:'';
		param.QualityGuaranteePeriod = param.QualityGuaranteePeriod?param.QualityGuaranteePeriod:'';
		param.UnitPrice = parseFloat(param.UnitPrice)?parseFloat(param.UnitPrice):0;
		param.Manufactor = param.Manufactor?param.Manufactor:'';
		param.Remark = param.Remark?param.Remark:'';
		param.DisplayOrder = 0;
        param.Packing =param.Packing?param.Packing:'';
        dispatch({
         type:'transportgoods/edittransportgoods',
         param,
          pageIndex
        })
    }

    //按钮修改和删除
      function tableAction(actionKey, item){

        if (actionKey === 'edit') {
          dispatch({
            type:'transportgoods/edittansdata',
            item
          })
          dispatch({type:'transportgoods/packtransportgoods'})
          dispatch({type:'transportgoods/sunittransportgoods'})
          dispatch({type:'transportgoods/typetransportgoods'})
        } else if(actionKey === 'delete') {
            confirm({
                title: '提示',
                content: '确定删除'+item.Name+'吗',
                onOk: () => {
                    const id=item.Id;
                    dispatch({
                      type:'transportgoods/deletetransportgoods',
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
            label: '货物名称',
            type: 'input',
            name: 'Name',
            options: {
                rules: [
                    {
                        required: true,
                        message: '请填写货物名称!',
                    },
                    {
                        pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
                        message: '货物名称只能输入中文、英文字母、数字和下划线!',
                    },
                    {
                        max: 20,
                        message: '请不要超过20个字符!',
                    }
                ]
            }

        },{
            label: '包装',
            type: 'select',
            name: 'Packing',
            items:()=>packData.map(item=>({
                value:item.Name,
                key:item.Id
            })),
            options:{
            }
        },{
            label: '类型',
            type: 'select',
            name: 'Gtype',
            items:()=>typeData.map(item=>({
                value:item.Name,
                key:item.Id
            })),
            options:{
                rules:[{
                    required: true,
                    message: '请选择类型!',
                }]
            }
        },
        {
            label: '规格',
            type: 'input',
            name: 'Specifications',
            options:{
                rules:[{
                    max: 20,
                    message: '请不要超过20个字符!',
                },{
                	min:2,
                	message:'请不要少于2个字符!'
                },{
                    pattern:/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
                    message: '规格只能输入中文、英文字母、数字和下划线!',
                }]
            }
        },{
            label: '型号',
            type: 'input',
            name: 'ItemType',
            options:{
                rules:[{
                  pattern:/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
                  message: '型号只能输入中文、英文字母、数字和下划线!',
                },{
                    max: 20,
                    message: '请不要超过20个字符!',
                },{
                  min: 2,
                  message: '请不要少于2个字符!',
                }]
            }
        },{
            label: '单位',
            type: 'select',
            name: 'Gunit',
            items:()=>sunitData.map(item=>({
                value:item.Name,
                key:item.Id
            })),
            options:{
                
            }
        }
        ,{
            label: '保质期',
            type: 'input',
            name: 'QualityGuaranteePeriod',
            options:{
                rules:[{
                    max: 20,
                    message: '请不要超过20个字符!',
                },{
                    pattern:/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
                    message: '保质期只能输入中文、英文字母、数字和下划线!',
                }]
            }
        }
        ,{
            label: '单价',
            type: 'inputNumber',
            name: 'UnitPrice',
            options:{
                rules:[{
                  pattern: /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/,
                  message: '只能输入大于0的数!',
                }]
            }
            },
             {
                label: '厂家',
                type: 'input',
                name: 'Manufactor',
                options: {
                  rules: [{
                    pattern:/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
                    message:'厂家只能输入中文、英文字母、数字和下划线!'
                  },
                  {
                    max: 50,
                    message: '请不要超过50个字符!',
                  },
                    {
                      min: 2,
                      message: '请不要少于2个字符!',
                    }
                  ]
                }
            },{
                label: '备注',
                type: 'input',
                name: 'Remark',
                options: {
                  rules: [{
                    required: false,
                  },{
                    pattern:/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
                    message:'备注只能输入中文、英文字母、数字和下划线!'
                  },{
                    max:50,
                    message:'请不要超过50个字符'
                  },{
                  	min:2,
                  	message:'请不要少于2个字符'
                  }]
              }
        }];
    //修改时弹框内容
      const fieldsEdit =[{
            label: '货物名称',
            type: 'input',
            name: 'Name',
            options: {
                initialValue: item.Name,
                rules: [
                  {
                    required: true,
                    message: '请填写货物名称!',
                  },
                  {
                    pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
                    message: '货物名称只能输入中文、英文字母、数字和下划线!',
                  },
                  {
                    max: 20,
                    message: '请不要超过20个字符!',
                  }
                ]
            }

        }, {
            label: '包装',
            type: 'select',
            name: 'Packing',
            items:()=>packData.map(item=>({
                value:item.Name,
                key:item.Id
            })),
            options:{
                initialValue: item.Packing,
            }
        },{
            label: '类型',
            type: 'select',
            name: 'Gtype',
            items:()=>typeData.map(item=>({
                value:item.Name,
                key:item.Id
            })),
            options:{
                initialValue: item.Gtype,
                rules:[{
                  required: true,
                  message: '请选择类型!',
                }]
            }
        },
        {
            label: '规格',
            type: 'input',
            name: 'Specifications',
            options:{
                initialValue: item.Specifications,
                rules:[{
                  max: 20,
                  message: '请不要超过20个字符!',
                },{
                  pattern:/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
                  message: '规格只能输入中文、英文字母、数字和下划线!',
                }]
            }
        },{
            label: '型号',
            type: 'input',
            name: 'ItemType',
            options:{
                initialValue: item.ItemType,
                rules:[{
                  pattern:/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
                  message: '型号只能输入中文、英文字母、数字和下划线!',
                },{
                  max: 20,
                  message: '请不要超过20个字符!',
                }]
            }
        },{
            label: '单位',
            type: 'select',
            name: 'Gunit',
            items:()=>sunitData.map(item=>({
                value:item.Name,
                key:item.Id
            })),
            options:{
                initialValue: item.Gunit,
            }
        }
        ,{
            label: '保质期',
            type: 'input',
            name: 'QualityGuaranteePeriod',
            options:{
                initialValue: item.QualityGuaranteePeriod,
                rules:[{
                  max: 20,
                  message: '请不要超过20个字符!',
                },{
                  pattern:/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
                  message: '保质期只能输入中文、英文字母、数字和下划线!',
                }]
            }
        }
        ,{
            label: '单价',
            type: 'inputNumber',
            name: 'UnitPrice',
            options:{
                initialValue: item.UnitPrice==0?'':item.UnitPrice,
                rules:[{
                  pattern: /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/,
                  message: '只能输入大于0的数!',
                }]
            }
        },{
            label: '厂家',
            type: 'input',
            name: 'Manufactor',
            options: {
              initialValue: item.Manufactor,
              rules: [{
                  required: false,
                },{
                  pattern:/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
                  message:'厂家只能输入中文、英文字母、数字和下划线!'
                },
                  {
                    max: 50,
                    message: '请不要超过50个字符!',
                  },
                  {
                    min: 2,
                    message: '请不要小于2个字符!',
                  }]
            }
        },{
            label: '备注',
            type: 'input',
            name: 'Remark',
            options: {
                initialValue: item.Remark,
                rules: [{
                  required: false,
                },{
                  pattern:/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
                  message:'备注只能输入中文、英文字母、数字和下划线!'
                },{
                  max:50,
                  message:'请不要超过50个字符'
                }]
            }
        }];
        const searchFields1 =  [
        {
          title:'货物名称',
          key:'name',
          type:'input',
        },
        {
          title:'厂家',
          key:'manufactor',
          type:'input',
        },
        {
          title:'货物类型',
          key:'gtype',
          type:'select',
          items:()=>typeData.map(item=>({
            value:item.Id,
            mean:item.Name
          }))
        },
        ];
        const searchFileds = [{fields:searchFields1,visible:'visible'}]
		  function addPage(page, filters, sorter){
		    dispatch({
		      type:'transportgoods/searchlist',
		      page,gtype,name,manufactor
		    })
        dispatch({
          type:'transportgoods/updatePage',
          page
        })
		  }
          function onSearch(searchFields){
          	dispatch({
          		type:'transportgoods/updatePage',
          		page:1
        	})
          	if(searchFields?searchFields.status==0:false){
        		addPage(pageIndex);
      		}else{
      			searchFields.page=1;
	            dispatch({
	              type:'transportgoods/searchlist',
	              searchFields
	            })
      		}
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
                  <SearchBar
                    onSubmit={onSearch}
                    searchFileds={searchFileds}
                    hasMore={false}
                  />
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
                    title="添加货品维护"
                    fields={fields}
                    onOk={onOk}
                    onCancel={onCancel}
                    okText="保存"
                />
                <FormModal
                    modalKey="Edit"
                    visible={modalShowEdit}
                    title="修改货品维护"
                    fields={fieldsEdit}
                    onOk={onOkEdit}
                    onCancel={onCancelEdit}
                    okText="保存"
                />
            </div>
        )
}

function mapStateToProps(state) {
  return {...state.transportgoods,...state.login,...state.common};
}

export default connect(mapStateToProps)(Transportgoods);
