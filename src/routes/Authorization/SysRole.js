import React from 'react';
import { connect } from 'dva';
import {Button,message, Modal,Input,Col,Switch,Checkbox} from 'antd';
import {FormModal} from '../../components/modalForm';
import Table from '../../components/table';
import styles from './SysRole.css';
import {uniqeByKeys,authAdminButtons} from '../../utils/fun_config'
import {isEnable} from '../../utils/config';


const confirm = Modal.confirm;

function SysRole({roleId,saveBtns,arrs,buttonsData,permissionData,dispatch,item,tData,loading,modalShow,modalShowEdit,modalOptions, selectedRowKeys,confirmLoading,
                   optionsDisabled,total,keyNum,pruBtnList,addBool,pageIndex,stauts}) {
    //按钮修改和删除
      function tableAction(actionKey, item){
        if (actionKey === 'edit') {
          dispatch({
            type:'sysrole/updateRole',
            item
          })
        } else if(actionKey === 'delete') {
            confirm({
                title: '提示',
                content: '确定删除'+item.Name+'吗',
                onOk: () => {
                    const id=item.Id;
                    dispatch({
                      type:'sysrole/deleterole',
                      	id,
                        pageIndex
                      })
                },
                onCancel() {}
            })
        }else if(actionKey==='exclamation-circle-o'){
        	let id = item.Id;
          dispatch({
          type:'common/keynum',
          })
          if(stauts){
              dispatch({type:'sysrole/updateStauts'});
            }
        	dispatch({type:'sysrole/PermissionButtons',id});
        	dispatch({type:'sysrole/getRoleID',id});
        }
    };
    //表头设置
    const tableHeader = [
        {
            title: '角色名称',
            dataIndex: 'Name',
            key: 'Name',
        },
        {
            title: '是否可用',
            dataIndex: 'IsEnable',
            key: 'IsEnable',
            render:(text)=>{
            	let t = text;
            	if(t==false){
            		t='不可用'
            		return (<span style={{color:'#e74c3c'}}>{t}</span>)
            	}else{
            		t='可用'
            		return (<span style={{color:'#2ecc71'}}>{t}</span>)
            	}
            }
        },
        {
            title: '备注',
            dataIndex: 'Remark',
            key: 'Remark',
        }
    ];
    //权限表格设置
    const tableHeader2 = () =>{
        return [{
            title: '模块名称',
            dataIndex: 'Name',
            key: 'MenuId',
            width:'200px'
        }, {
            title: '操作权限',
            dataIndex: 'Display_order',
            key: 'Display_order',
            render:(item,record,index)=>{
               	let allBtns=record.ButtonList;
                return(
                	<div style={{textAlign:'left'}}>
    				        {
                        allBtns.map((option)=>{
                            return(
                                <Checkbox
                                  onChange={onChange1}
                                  defaultChecked={option.InAuthorization}
                                  value={{Menu_id:record.MenuId,Role_id:roleId,Button_id:option.Id}}
                                >
                                  {option.Name}
                                </Checkbox>
                              );
                        })
                    }
			            </div>
			    )
			}
		}];
   	};

   	function onChange1(v){
    	let val=v.target.value;
    	if(v.target.checked===true){
    		buttonsData.push(v.target.value)
    	}else{
    		for(let i=0;i<buttonsData.length;i++){
    			if(buttonsData[i].Menu_id==val.Menu_id&&buttonsData[i].Button_id==val.Button_id){
    				buttonsData.splice(i,1)
    			}
    		}
    	}
   	};
	function handleOk () {
    	let oldBtnList=arrs.length>0?arrs:buttonsData;
    	let newBtnList = uniqeByKeys(oldBtnList,['Menu_id','Button_id'])
    	const obj={
   			Role_id:roleId,
			  RoleMenuButtonRefConfigModel:newBtnList
		}
    	dispatch({type:'sysrole/savePermissionButtons',obj});
        dispatch({type:'sysrole/closeModalOption'});
        dispatch({
          type:'common/keynum',
          })
    };
    function handleCancel () {
        dispatch({type:'sysrole/closeModalOption'});
        dispatch({
          type:'common/keynum',
          })
    };
     //添加弹框
     function add(){
     	dispatch({type:'sysrole/showAddmodal'})
     }
    //关闭增加弹窗
    function onCancel() {
        dispatch({type:'sysrole/closeAddmodal'})
    }
    //关闭修改弹框
    function onCancelEdit() {
      	dispatch({type:'sysrole/closeEditmodal'})
    }
    //添加调接口
    function onOk(param) {
    	param.Remark=param.Remark?param.Remark:'';
    	param.DisplayOrder=param.DisplayOrder?param.DisplayOrder:1;
       	dispatch({type:'sysrole/addrole',param,pageIndex});
    }
    //修改调接口
    function onOkEdit(param) {
        param.Id=item.Id;
        param.Remark=param.Remark?param.Remark:'';
        param.DisplayOrder=param.DisplayOrder?param.DisplayOrder:1;
        dispatch({
         type:'sysrole/updaterole',
         param,
          pageIndex
        })
    }

    //添加时弹框内容
    const fields =[{
            label: '角色名称',
            type: 'input',
            name: 'Name',
            options: {
                rules: [
                    {
                        required: true,
                        message: '请填写角色名称!',
                    },
                    {
                        pattern: /^([A-Za-z]|[\u4E00-\u9FA5])+$/,
                        message: '只能输入大小写字母、汉字!',
                    },
                    {
                        max: 10,
                        message: '请不要超过10个字符!',
                    },
                    {
                        min: 2,
                        message: '请不要小于2个字符!',
                    }
                ]
            }

        },{
        label: '角色状态',
        type: 'radioGroup',
        name: 'IsEnable',
        items: () => isEnable.map(ele => ({
          key: ele.value,//bool值，是否显示模块
          value: ele.mean//单选提示文字
        })),
        options: {
          rules: [{
            required: true,
            message: '请选择角色状态!',
          }]
        }
      },{
            label: '备注',
            type: 'input',
            name: 'Remark',
            options:{
                rules:[{
                    max: 50,
                    message: '请不要超过50个字符!',
                }]
            }
        }];
    //修改时弹框内容
    const fieldsEdit =()=>{
      let IsEnable=item.IsEnable?'true':'false';
      return [{
        label: '角色名称',
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
            },
            {
              min: 2,
              message: '请不要小于2个字符!',
            }
          ]
        }
      },{
        label: '角色状态',
        type: 'radioGroup',
        name: 'IsEnable',
        items: () => isEnable.map(ele => ({
          key: ele.value,//bool值，是否显示模块
          value: ele.mean//单选提示文字
        })),
        options: {
          initialValue:IsEnable,
          rules: [{
            required: true,
            message: '请选择角色状态!',
          }]
        }
      },{
        label: '备注',
        type: 'input',
        name: 'Remark',
        options: {
          initialValue: item.Remark,
          rules:[{
            max: 50,
            message: '请不要超过50个字符!',
          }]
        }
      }];
  }
	function addPage(page, filters, sorter){
	    dispatch({
	      type:'sysrole/getrole',
	      page
	    })
    dispatch({
      type:'sysrole/updatePage',
      page
    })
	}
  function checkAll1(stauts){
    checkAll(permissionData,stauts);
    dispatch({type:'sysrole/updateModal',permissionData})
    let btns=[];
    authAdminButtons(permissionData,roleId,btns)
    dispatch({type:'sysrole/updateBtns',btns});
    dispatch({type:'sysrole/updateStauts',stauts})
    dispatch({type:'common/keynum'})
  }
  //全选
  function checkAll(datas,stauts){
        datas.map(item=>{
            if(item.children&&item.children.length>0){
                checkAll(item.children,stauts)
            }else{
                item.ButtonList.map(obj=>{
                    obj.InAuthorization=stauts;
                })
            }
        })
    }
    //组装表格
    const hasSelected = selectedRowKeys.length > 0;
    let pad=33;
    return (
        <div id="wrap">
            <div className="tableBox">
            	<Col>{
            		addBool?<Button className={styles.addBtn} type="primary"  onClick={add}>添加</Button>:''
                    }
            	</Col>
                <div style={{ paddingTop: addBool?pad:0 }}>
                    <Table
                        onCtrlClick={ tableAction }
                        pagination={ true }
                        header={ tableHeader }
                        data={tData}
                        loading={loading}
                        pageSize = {15}
                        total={total}
                        onChange={addPage}
                        action={row => pruBtnList}
						            currentPage={pageIndex}
                    />
                </div>
            </div>
            <FormModal
                modalKey="add"
                visible={modalShow}
                title="添加角色"
                fields={fields}
                onOk={onOk}
                onCancel={onCancel}
                okText="保存"
            />
            <FormModal
                modalKey="Edit"
                visible={modalShowEdit}
                title="修改角色"
                fields={fieldsEdit()}
                onOk={onOkEdit}
                onCancel={onCancelEdit}
                okText="保存"
            />
            <Modal
                title="权限设置"
                visible={modalOptions}
                onOk={handleOk}
                maskClosable={false}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                okText="保存"
                key={keyNum}
                width='800px'
            >
                <Button onClick = {()=>checkAll1(true)}  type="primary" className={`${styles.selects}`}>全选</Button>
                <Button onClick = {()=>checkAll1(false)}  type="primary" className={`${styles.selectsRight}`}>反选</Button>
                <Table
                    header={tableHeader2()}
                    data={permissionData}
                    pageSize={10}
                    scroll={{y:500}}
                    pagination={true}
                    defaultExpandAllRows={true}
                />
            </Modal>
        </div>
    )
}

function mapStateToProps(state) {
  return {...state.sysrole,...state.login,...state.common};
}

export default connect(mapStateToProps)(SysRole);
