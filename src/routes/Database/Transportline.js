import React from 'react';
import { connect } from 'dva';
import {Button,message, Modal} from 'antd';
import {FormModal} from '../../components/modalForm'
import Table from '../../components/table';
import styles from '../Authorization/SysAdmin.css';

const confirm = Modal.confirm;

function Transportline({cData,lineShipType,lineService,lineIndustry,lineGoodsType,lineType,lineAttribute,modelUse,
                         dispatch,item,tData,loading,modalShow,modalShowEdit,selectedRowKeys,confirmLoading,total,pruBtnList,addBool,pageIndex}) {
    //表头设置
    const tableHeader = [
    		{
    			title:'线路名称',
    			dataIndex:'LineName',
    			key:'LineName'
    		},
            {
                title: '里程(KM)',
                dataIndex: 'Mileage',
                key: 'Mileage',
            },
            {
                title: '所属区域',
                dataIndex: 'SubordinateArea',
                key: 'SubordinateArea',
            },
            {
                title: '运输时效',
                dataIndex: 'TransporPprescription',
                key: 'TransporPprescription',
            },
            {
                title: '回单时效',
                dataIndex: 'TheReceiptTime',
                key: 'TheReceiptTime',
            },
            {
                title: '创建时间',
                dataIndex: 'CreateTime',
                key: 'CreateTime',
                render:(text)=>{
	        		let t = text
	        	return (
	        		<div><span>{t}</span></div>
	        	)
	        }
            },
             {
                title: '备注',
                dataIndex: 'Remark',
                key: 'Remark',
            }
        ];
     //添加弹框
     function add(){
     	dispatch({type:'transportline/getlinegoodstype'});
     	dispatch({type:'transportline/getlinetype'});
     	dispatch({type:'transportline/getlineattribute'});
     	dispatch({type:'transportline/getlineindustry'});
     	dispatch({type:'transportline/getlineservice'});
     	dispatch({type:'transportline/getlineshiptype'})
       dispatch({type:'transportline/getprovines'});
     	dispatch({type:'transportline/showAddmodal'});
     }
    //关闭增加弹窗
    function onCancel() {
        dispatch({type:'transportline/closeAddmodal'})
    }

    //关闭修改弹框
    function onCancelEdit() {
      dispatch({type:'transportline/closeEditmodal'})
    }
    //添加调接口
    function onOk(param) {
    	param.StartingProvinceId=param.StartingAddress[0];
    	param.StartingCityId = param.StartingAddress[1];
    	param.StartingDistrictId = param.StartingAddress[2];
    	param.DestinationProvinceId = param.DestinationAddress[0];
    	param.DestinationCityId = param.DestinationAddress[1];
    	param.DestinationDistrictId = param.DestinationAddress[2];
    	const inAdvan = param.IndustryAdvantage;
    	param.IndustryAdvantage = inAdvan.join('|');
    	const seAdvan = param.ServiceAdvantage;
    	param.ServiceAdvantage = seAdvan.join('|');
    	param.TransporPprescription = param.TransporPprescription1+param.TransporPprescription2;
    	param.TheReceiptTime = param.TheReceiptTime1+param.TheReceiptTime2;
    	param.Remark = param.Remark?param.Remark:'';
       	dispatch({type:'transportline/addtransportline',param,pageIndex})
    }

    //修改调接口
    function onOkEdit(param) {
        param.Id=item.Id;
        param.StartingProvinceId=param.StartingAddress[0];
    	param.StartingCityId = param.StartingAddress[1];
    	param.StartingDistrictId = param.StartingAddress[2];
    	param.DestinationProvinceId = param.DestinationAddress[0];
    	param.DestinationCityId = param.DestinationAddress[1];
    	param.DestinationDistrictId = param.DestinationAddress[2];
    	const inAdvan = param.IndustryAdvantage;
    	param.IndustryAdvantage = inAdvan.join('|');
    	const seAdvan = param.ServiceAdvantage;
    	param.ServiceAdvantage = seAdvan.join('|');
    	param.TransporPprescription = param.TransporPprescription1+param.TransporPprescription2;
    	param.TheReceiptTime = param.TheReceiptTime1+param.TheReceiptTime2;
    	param.Remark = param.Remark?param.Remark:'';
        dispatch({type:'transportline/edittransportline',param,pageIndex})
    }

    //按钮修改和删除
      function tableAction(actionKey, item){
        if (actionKey === 'edit') {
          let targetOption = item;
          dispatch({type:'transportline/getlinegoodstype'});
          dispatch({type:'transportline/getlinetype'});
          dispatch({type:'transportline/getlineattribute'});
          dispatch({type:'transportline/getlineindustry'});
          dispatch({type:'transportline/getlineservice'});
          dispatch({type:'transportline/getlineshiptype'});
          dispatch({type:'transportline/geteditPcitysStart',targetOption,cData});
        } else if(actionKey === 'delete') {
            confirm({
                title: '提示',
                content: '确定删除'+item.LineName+'吗',
                onOk: () => {
                    const id=item.Id;
                    dispatch({type:'transportline/deletetransportline',id,pageIndex})
                },
                onCancel() {}
            })
        }
    };
  //装载级联数据
  const loadData = (selectedOptions) => {
    const  id= selectedOptions[0].value;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    if(selectedOptions.length>1){
      dispatch({ type:'transportline/getcdistricts',targetOption,cData,id});
    }else{
      dispatch({ type:'transportline/getPcitys',targetOption,cData});
    }
  }
    //添加时弹框内容
    const fields =[
    	{
            label: '线路名称',
            type: 'input',
            name: 'LineName',
            options:{
                rules:[{
                    required: true,
                    message: '请输入线路名称!',
                	},{
                        pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
                        message: '只能输入中文、英文字母、数字!',
                    },
                    {
                        max: 20,
                        message: '请不要超过20个字符!',
                    },
                    {
                      min: 2,
                      message: '请不要少于2个字符!',
                    }
                    ]
            }
        },{
            label: '起始地',
            type: 'cascader',
            name: 'StartingAddress',
            options: {
                rules: [
                    {
                        required: true,
                        message: '请选择运输起始地!',
                    }
                ]
            },
            items:cData,
        	loadData:loadData,
        }, {
            label: '到达地',
            type: 'cascader',
            name: 'DestinationAddress',
            options:{
                rules:[{
                    required: true,
                    message: '请选择运输到达地!',
                }]
            },
            items:cData,
        	loadData:loadData,
        },{
            label: '里程(公里)',
            type: 'input',
            name: 'Mileage',
            options:{
                rules:[{
	                    required: true,
	                    message: '请输入里程距离!',
                	},{
                    	pattern:/^[1-9].*$/,
                    	message: '请输入大于0的正整数或小数!',
                    }]
            }
        },{
            label: '所属区域',
            type: 'input',
            name: 'SubordinateArea',
            options:{
                rules:[{
	                    required: true,
	                    message: '请输入所属区域!',
                	},{
                  pattern:/^[\u4E00-\u9FA5a-zA-Z0-9_]*$/ ,
                  message: '所属区域只能输入中文、英文字母、数字和下划线!',
                }]
            }
        },{
            label: '线路属性',
            type: 'select',
            name: 'LineAttribute',
            options:{
                rules:[{
	                    required: true,
	                    message: '请选择线路属性!',
                	}]
            },
            items: () => lineAttribute.map(ele => ({
              key: ele.EnumValue,
              value: ele.Desction
          	})),
        },{
            label: '线路类型',
            type: 'select',
            name: 'LineType',
            options:{
                rules:[{
	                    required: true,
	                    message: '请选择线路类型!',
                	}]
            },
            items: () => lineType.map(ele => ({
              key: ele.EnumValue,
              value: ele.Desction
          	})),
        },{
            label: '产品类型',
            type: 'select',
            name: 'LineGoodsType',
            options:{
                rules:[{
	                    required: true,
	                    message: '请选择产品类型!',
                	}]
            },
            items: () => lineGoodsType.map(ele => ({
              key: ele.EnumValue,
              value: ele.Desction
          	})),
        },{
            label: '运输方式',
            type: 'select',
            name: 'TypeOfShipping', 
            options:{
                rules:[{
	                    required: true,
	                    message: '请选择运输方式!',
                	}],
            },
            items: () => lineShipType.map(ele => ({
              key: ele.EnumValue,
              value: ele.Desction
          	})),
        },{
            label: '行业优势',
            type: 'selectmut',
            name: 'IndustryAdvantage',
            items: () => lineIndustry.map(ele => ({
              key: ele.EnumValue,
              value: ele.Desction
          	})),
          	options:{
                rules:[{
	                    required: true,
	                    message: '请选择行业优势!',
                	}]
            },
        },{
            label: '服务优势',
            type: 'selectmut',
            name: 'ServiceAdvantage',
            options:{
                rules:[{
	                    required: true,
	                    message: '请选择服务优势!',
                	}]
            },
            items: () => lineService.map(ele => ({
              key: ele.EnumValue,
              value: ele.Desction
          	})),
        },{
	        label: <span className={styles.dot}><i>*</i>运输时效</span>,
	        type: 'inputgroup',
	        name: 'TransporPprescription',
	        selects:[
	        	{
			        type: 'input',
			        name: 'TransporPprescription1',
			        styles:{
			        	width:'170%'
			        },
			        options:{
			        	rules: [
		                    {
		                        required: true,
		                        message: '请输入运输时效!',
		                    },{
		                    	pattern:/^[1-9]\d*$/,
		                    	message: '请输入正整数!',
		                    }
		                ]
			        }
	        	},
	        	{
			        type: 'select',
			        name: 'TransporPprescription2',
			        styles:{
			        	width:'170%'
			        },
			        items:()=>[{
			        	key:'小时',
	        			value:'小时'
			        },{
			        	key:'天',
	        			value:'天'
			        }],
			        options:{
		        	rules: [
	                    {
	                        required: true,
	                        message: '请选择运输时效单位!',
	                    }
	                ]
		        }
	        	}
	        ]
        },{
	        label: <span className={styles.dot}><i>*</i>回单时效</span>,
	        type: 'inputgroup',
	        name: 'TheReceiptTime',
	        selects:[
	        	{
			        type: 'input',
			        name: 'TheReceiptTime1',
			        styles:{
			        	width:'170%'
			        },
			        options:{
			        	rules: [
		                    {
		                        required: true,
		                        message: '请输入回单时效!',
		                    },{
		                    	pattern:/^[1-9]\d*$/,
		                    	message: '请输入正整数!',
		                    }
		                ]
			        }
	        	},
	        	{
			        type: 'select',
			        name: 'TheReceiptTime2',
			        styles:{
			        	width:'170%'
			        },
			        items:()=>[{
			        	key:'小时',
	        			value:'小时'
			        },{
			        	key:'天',
	        			value:'天'
			        }],
			        options:{
		        	rules: [
	                    {
	                        required: true,
	                        message: '请选择回单时效单位!',
	                    }
	                ]
		        }
	        	}
	        ]
        },{
            label: '备注',
            type: 'input',
            name: 'Remark',
            options:{
	        	rules: [
                    {
                    	max:50,
                    	message: '请不要超过50个字符!',
                    },{
                      pattern: /^[\u4E00-\u9FA5a-zA-Z0-9]*$/,
                      message: '备注只能输入大小写字母、汉字、数字!',
                    }
                ],
	        }
        }];
    //修改时弹框内容
    const fieldsEdit = ()=>{
    	const linetype = JSON.stringify(item.LineType);
    	const lineattr = JSON.stringify(item.LineAttribute);
    	const linegoodstype = JSON.stringify(item.LineGoodsType);
    	const shippingtype = JSON.stringify(item.TypeOfShipping);
    	const industryadvantage = item.IndustryAdvantage;
    	const serviceadvantage  = item.ServiceAdvantage;
    	const transporpprescription  = item.TransporPprescription;
    	const thereceipttime = item.TheReceiptTime;
    	return [{
            label: '线路名称',
            type: 'input',
            name: 'LineName',
            options: {
                initialValue: item.LineName,
              rules:[{
                required: true,
                message: '请输入线路名称!',
              },{
                pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
                message: '只能输入中文、英文字母、数字!',
              },
                {
                  max: 20,
                  message: '请不要超过20个字符!',
                },
                {
                  min: 2,
                  message: '请不要少于2个字符!',
                }
              ]
            }

        }, {
            label: '起始地',
            type: 'cascader',
            name: 'StartingAddress',
            items:cData,
        	loadData:loadData,
            options:{
                initialValue:[item.StartingProvinceId ,item.StartingCityId ,item.StartingDistrictId ],
                rules:[{
                    required: true,
                    message: '请选择运输起始地!',
                }]
            }
        },{
            label: '到达地',
            type: 'cascader',
            name: 'DestinationAddress',
            items:cData,
        	loadData:loadData,
            options:{
                initialValue:[item.DestinationProvinceId ,item.DestinationCityId  ,item.DestinationDistrictId ],
                rules:[{
                    required: true,
                    message: '请选择运输到达地!',
                }]
            }
        },{
            label: '里程(公里)',
            type: 'input',
            name: 'Mileage',
            options:{
            	initialValue:item.Mileage,
                rules:[{
	                    required: true,
	                    message: '请输入里程信息!',
                	},{
                    	pattern:/^[0-9].*$/,
                    	message: '只能输入大于0的正整数或小数!',
                    }]
            }
        },{
            label: '所属区域',
            type: 'input',
            name: 'SubordinateArea',
            options:{
            	initialValue:item.SubordinateArea,
                rules:[{
	                    required: true,
	                    message: '请输入所属区域!',
                	},{
                  pattern:/^[\u4E00-\u9FA5a-zA-Z0-9_]*$/ ,
                  message: '所属区域只能输入中文、英文字母、数字和下划线!',
                }]
            }
        },{
            label: '线路属性',
            type: 'select',
            name: 'LineAttribute',
            options:{
            	initialValue:lineattr,
                rules:[{
	                    required: true,
	                    message: '请选择线路属性!',
                	}]
            },
            items: () => lineAttribute.map(ele => ({
              key: ele.EnumValue,
              value: ele.Desction
          	})),
        },{
            label: '线路类型',
            type: 'select',
            name: 'LineType',
            options:{
            	initialValue:linetype,
                rules:[{
	                    required: true,
	                    message: '请选择线路类型!',
                	}]
            },
            items: () => lineType.map(ele => ({
              key: ele.EnumValue,
              value: ele.Desction
          	})),
        },{
            label: '产品类型',
            type: 'select',
            name: 'LineGoodsType',
            options:{
            	initialValue:linegoodstype,
                rules:[{
	                    required: true,
	                    message: '请选择产品类型!',
                	}]
            },
            items: () => lineGoodsType.map(ele => ({
              key: ele.EnumValue,
              value: ele.Desction
          	})),
        },{
            label: '运输方式',
            type: 'select',
            name: 'TypeOfShipping',
            options:{
            	initialValue:shippingtype,
                rules:[{
	                    required: true,
	                    message: '请选择运输方式!',
                	}],
            },
            items: () => lineShipType.map(ele => ({
              key: ele.EnumValue,
              value: ele.Desction
          	})),
        },{
            label: '行业优势',
            type: 'selectmut',
            name: 'IndustryAdvantage',
            items: () => lineIndustry.map(ele => ({
              key: ele.EnumValue,
              value: ele.Desction
          	})),
          	options:{
          		initialValue:industryadvantage?industryadvantage.split('|'):'',
                rules:[{
	                    required: true,
	                    message: '请选择行业优势!',
                	}]
            },
        },{
            label: '服务优势',
            type: 'selectmut',
            name: 'ServiceAdvantage',
            options:{
            	initialValue:serviceadvantage?serviceadvantage.split('|'):'',
                rules:[{
	                    required: true,
	                    message: '请选择服务优势!',
                	}]
            },
            items: () => lineService.map(ele => ({
              key: ele.EnumValue,
              value: ele.Desction
          	})),
        },{
	        label: <span className={styles.dot}><i>*</i>运输时效</span>,
	        type: 'inputgroup',
	        name: 'TransporPprescription',
	        selects:[
	        	{
			        type: 'input',
			        name: 'TransporPprescription1',
			        styles:{
			        	width:'170%'
			        },
			        options:{
			        	initialValue:parseInt(item.TransporPprescription),
			        	rules: [
		                    {
		                        required: true,
		                        message: '请输入运输时效!',
		                    },{
		                    	pattern:/^[0-9].*$/,
		                    	message: '请输入大于0的整数或小数!',
		                    }
		                ]
			        }
	        	},
	        	{
			        type: 'select',
			        name: 'TransporPprescription2',
			        styles:{
			        	width:'170%'
			        },
			        items:()=>[{
			        	key:'时',
	        			value:'时'
			        },{
			        	key:'天',
	        			value:'天'
			        }],
			        options:{
			        	initialValue:transporpprescription?transporpprescription.slice(-1):'',
			        	rules: [
		                    {
		                        required: true,
		                        message: '请选择运输时效单位!',
		                    }
		                ]
			        }
	        	}
	        ]
        },{
	        label: <span className={styles.dot}><i>*</i>回单时效</span>,
	        type: 'inputgroup',
	        name: 'TheReceiptTime',
	        selects:[
	        	{
			        type: 'input',
			        name: 'TheReceiptTime1',
			        styles:{
			        	width:'170%'
			        },
			        options:{
			        	initialValue:parseInt(thereceipttime),
			        	rules: [
		                    {
		                        required: true,
		                        message: '请输入回单时效!',
		                    },{
		                    	pattern:/^[0-9].*$/,
		                    	message: '请输入大于0的整数或小数!',
		                    }
		                ]
			        }
	        	},
	        	{
			        type: 'select',
			        name: 'TheReceiptTime2',
			        styles:{
			        	width:'170%'
			        },
			        items:()=>[{
			        	key:'时',
	        			value:'时'
			        },{
			        	key:'天',
	        			value:'天'
			        }],
			        options:{
			        	initialValue:thereceipttime?thereceipttime.slice(-1):'',
			        	rules: [
		                    {
		                        required: true,
		                        message: '请选择回单时效单位!',
		                    }
		                ]
			        }
	        	}
	        ]
        },{
            label: '备注',
            type: 'input',
            name: 'Remark',
            options:{
            	initialValue:item.Remark,
	        	rules: [
                    {
                    	max:50,
                    	message: '请不要超过50个字符!',
                    },{
                      pattern: /^[\u4E00-\u9FA5a-zA-Z0-9]*$/,
                      message: '只能输入大小写字母、汉字、数字!',
                    }
                ],
	        }
        }]
    }
	function addPage(page, filters, sorter){
    	dispatch({
      		type:'transportline/gettransportgoodslist',
      		page
    	})
      dispatch({
        type:'transportline/updatePage',
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
                    <Button type="primary" className={`${styles.optionsBtnGroup}`} onClick={add}>添加</Button>
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
                    title="添加运输线路维护"
                    fields={fields}
                    onOk={onOk}
                    onCancel={onCancel}
                    okText="保存"
                    layout={'inline'}
                    width={1000}
                />
                <FormModal
                    modalKey="Edit"
                    visible={modalShowEdit}
                    title="修改运输线路维护"
                    fields={fieldsEdit()}
                    onOk={onOkEdit}
                    onCancel={onCancelEdit}
                    okText="保存"
                    layout={'inline'}
                    width={1000}
                />
            </div>
        )
}

function mapStateToProps(state) {
  return {...state.transportline,...state.login,...state.common};
}

export default connect(mapStateToProps)(Transportline);
