import React from 'react';
import { connect } from 'dva';
import styles from './MyConsignment.less';
import SearchBar from '../../components/searchbar';
import Table from '../../components/table';
import {Button,Modal,Icon,Input} from 'antd';
import ColumnForm from '../../components/modalForm/complicform';
import {FormModal} from '../../components/modalForm'
const confirm = Modal.confirm;

function ConsignmentAcceptSreach({dispatch,item,provinceData,cityData,areaData,provinceData1,cityData1,areaData1,modalShow,ModalShow,batchAssignData}) {
  //详情数据
  const formfields=()=>{
  	const DateOfArrival = item.DateOfArrival;
  	const StartProvince = provinceData!=null&&provinceData.Name?provinceData.Name:'';
  	const StartCity = cityData!=null&&cityData.Name?cityData.Name:'';
  	const StartArea = areaData!=null&&areaData.Name?areaData.Name:'';
  	const EndProvince = provinceData1!=null&&provinceData1.Name?provinceData1.Name:'';
  	const EndCity = cityData1!=null&&cityData1.Name?cityData1.Name:'';
  	const EndArea = areaData1!=null&&areaData1.Name?areaData1.Name:'';
  	return [
  		{
	      label: '运单编号',
	      span:5,
	      name: 'SysCode',
	      options:{
	        initialValue:item.SysCode
	      }
      },
      {
	      label: '客户单号',
	      name: 'CustomerNumber',
	      span:5,
	      options: {
	        initialValue:item.CustomerNumber
	      }
	    },
	    {
	      label: '要求到货日期',
	      span:6,
	      name: 'DateOfArrival',
	      options:{
	        initialValue:DateOfArrival?DateOfArrival:''
	      }
	    },
		 	{
		  	label:'状态',
		  	span:8,
		  	name:'Status',
			  options:{
			    initialValue:item.Status==1?<span style={{color:'rgb(16,142,233)',fontWeight:'bold'}}>待提交</span>:item.Status==2?<span style={{color:'rgb(16,142,233)',fontWeight:'bold'}}>待受理</span>:
			    	item.Status==3?<span style={{color:'rgb(16,142,233)',fontWeight:'bold'}}>受理被拒</span>:
			    	item.Status==4&&item.ConsignmentCarrierModel.MemberId!=''?<span style={{color:'rgb(16,142,233)',fontWeight:'bold'}}>未装车</span>:
			    	item.Status==4&&item.ConsignmentCarrierModel.MemberId==''?<span style={{color:'rgb(16,142,233)',fontWeight:'bold'}}>待指派</span>:
			    	item.Status==5&&item.ConsignmentCarrierModel.MemberId==''?<span style={{color:'rgb(16,142,233)',fontWeight:'bold'}}>指派被拒</span>:
			    	item.Status==5&&item.ConsignmentCarrierModel.MemberId!=''?<span style={{color:'rgb(16,142,233)',fontWeight:'bold'}}>未装车</span>:
			    	item.Status==6?<span style={{color:'rgb(16,142,233)',fontWeight:'bold'}}>未装车</span>:
			    	item.Status==7?<span style={{color:'rgb(16,142,233)',fontWeight:'bold'}}>运输中</span>:item.Status==8?<span style={{color:'rgb(16,142,233)',fontWeight:'bold'}}>已到站</span>:<span style={{color:'rgb(16,142,233)',fontWeight:'bold'}}>已签收</span>
			  }
			},
	    {
	      label: '起始地',
	      span:5,
	      name: 'qsddd',
	      options: {
	        initialValue:item.StartingAddress
	      }
	  	},
      {
			  label: '省市区',
			  name: 'startport',
			  span:5,
			  options: {
			    initialValue:StartProvince+' '+StartCity+' '+StartArea
			  }
    	},
    	{
    		label:'',
    		type:'space',
    		span:14,
    		name:'spanceqs'
    	},
      {
	      label: '到达地',
	      name: 'receivep',
	      span:5,
	      options: {
	          initialValue:item.DestinationAddress
	      }
    	},
    	{
	      label: '省市区',
	      name: 'receiveport',
	      span:5,
	      options: {
	        initialValue:EndProvince+' '+EndCity+' '+EndArea
	      }
      }
  	]
  }
  const formfields2 = ()=>{
  	const ShipperModel = item.ConsignmentShipperModel?item.ConsignmentShipperModel:'';
  	return [
  		{
	      label: '开户银行',
	      name: 'VehicleType',
	      span:5,
	      options: {
	        initialValue:ShipperModel.OpeningBankName
	      }
      },
      {
	      label: '户名',
	      name: 'ExaminedTime',
	      span:5,
	      options: {
	        initialValue:ShipperModel.BankAccountName
	      }
      },
      {
	      label: '银行账号',
	      name: 'KerbWeight',
	      span:5,
	      formItemLayout:{
		      labelCol: { span: 8},
		      wrapperCol: { span:14 }
	      },
	      options: {
	        initialValue:ShipperModel.CardNumber
	      }
      },
      {label:'',type:'space',span:9,name:'spanceqs'},
	    {
		    label: '发货单位',
		    name: 'CompanyName',
		    span:5,
		    options: {
		      initialValue:ShipperModel.CompanyName
		    }
	    },
	    {
		    label: '发货人',
		    name: 'ShipperName',
		    span:5,
		    options:{
		      initialValue:ShipperModel.ShipperName
		    }
	    },
	    {
		    label: '发货电话',
		    name: 'ShipperTel',
		    span:5,
		    formItemLayout:{
			    labelCol: { span: 8},
			    wrapperCol: { span:14 }
		    },
		    options: {
		      initialValue:ShipperModel.ShipperTel
		    }
  		},
		  {
		    label: '发货地址',
		    name: 'ShipperAddress',
		    span:4,
		    formItemLayout:{
			    labelCol: { span: 8},
			    wrapperCol: { span:14 }
		  	},
		  	options:{
		  		initialValue:ShipperModel.ShipperAddress
		  	}
    	}
  	]
  }
  const formfields4 = ()=>{
  	const ReceivingModel = item.ConsignmentReceivingModel&&item.ConsignmentReceivingModel!=null?item.ConsignmentReceivingModel:'';
  	return [
  		{
	      label: '收货单位',
	      name: 'CompanyNamef',
	      span:5,
	      options: {
	        initialValue:ReceivingModel.CompanyName
	      }
      },
	    {
		    label: '收货人',
		    name: 'ReceivingName',
		    span:5,
		    options:{
		      initialValue:ReceivingModel.ReceivingName
		    }
	    },
	    {
		    label: '收货电话',
		    formItemLayout:{
			    labelCol: { span: 8},
			    wrapperCol: { span:14 }
	    	},
		    name: 'ReceivingTel',
		    span:5,
		    options: {
		      initialValue:ReceivingModel.ReceivingTel
		    }
		  },
		  {
		    label: '收货地址',
		    name: 'ReceivingAddress',
		    span:4,
		    formItemLayout:{
			    labelCol: { span: 8},
			    wrapperCol: { span:14 }
			  },
			  options: {
		      initialValue:ReceivingModel.ReceivingAddress==null?'未填写':ReceivingModel.ReceivingAddress
		    }
		  }
  	]
  }
	const ConsignmentDistPaymentModel = item.ConsignmentDistPaymentModel?item.ConsignmentDistPaymentModel:{};
	const ConsignmentInsuranceModel = item.ConsignmentInsuranceModel?item.ConsignmentInsuranceModel:{};
	const Delivery = ConsignmentDistPaymentModel.Delivery!=null&&ConsignmentDistPaymentModel.Delivery?ConsignmentDistPaymentModel.Delivery:'';
	const DeliveryTime = ConsignmentDistPaymentModel.DeliveryTime!=null&&ConsignmentDistPaymentModel.DeliveryTime?ConsignmentDistPaymentModel.DeliveryTime:'';
	const InsuranceAmount = ConsignmentInsuranceModel.InsuranceAmount;
	const ReceivingMode = ConsignmentDistPaymentModel.ReceivingMode!=null&&ConsignmentDistPaymentModel.ReceivingMode?ConsignmentDistPaymentModel.ReceivingMode:'';
	const PickupTime = ConsignmentDistPaymentModel.PickupTime!=null&&ConsignmentDistPaymentModel.PickupTime?ConsignmentDistPaymentModel.PickupTime:'';
	const PaymentMethod = ConsignmentDistPaymentModel.PaymentMethod!=null&&ConsignmentDistPaymentModel.PaymentMethod?ConsignmentDistPaymentModel.PaymentMethod:'';
  const formfields5 = [
		{
		  label: '指定运输公司',
		  name: 'lasia',
		  span:10,
		  formItemLayout:{
		    labelCol: { span: 4},
		    wrapperCol: { span:20 }
		  },
		  options: {
		    initialValue:'123467989'
		  }
		},
    {label:'',type:'space',span:14,name:'spance1'},
    {
	    label:'发货方式',
	    name:'Delivery',
	    span:10,
	    formItemLayout:{
	      labelCol: { span: 4},
	      wrapperCol: { span:20 }
	    },
	    options: {
	      initialValue:Delivery=='1'?'网点自提' : '上门提货'
	    }
    },
	  {
		  label: '取货时间',
		  name: 'PickupTime',
		  span:6,
		  options: {
	      initialValue:DeliveryTime&&DeliveryTime!='NaN-NaN-NaN'?DeliveryTime:""
	    }
	  },
	  {
		  label: '保险金额',
		  name: 'InsuranceAmount',
		  span:5,
		  options: {
		    initialValue:InsuranceAmount>0?InsuranceAmount:'未购买保险'
		  }
	  },
    {
      label:'收货方式',
      name:'ReceivingMode',
      span:10,
      formItemLayout:{
        labelCol: { span: 4},
        wrapperCol: { span:20 }
      },
      options: {
      	initialValue:ReceivingMode=='1'? '客户自提' : '送货上门',
      }
    },
    {
	    label: '送货时间',
	    name: 'DeliveryTime',
	    span:6,
	    options: {
	      initialValue:PickupTime
	    }
    },
    {
      label:'收款方式',
      name:'PaymentMethod',
      span:20,
      formItemLayout:{
        labelCol: { span: 2},
        wrapperCol: { span:22 }
      },
      options: {
      	initialValue:PaymentMethod==1?'发货方付款（先付/回付/月结）':'收货方付款(到付)',
      }
    },
    {label:'',type:'space',span:2,name:'spance3'},
    {
      label: '本次运费(元)',
      type: 'ctext',
      span:10,
      formItemLayout:{
        labelCol: { span: 4},
        wrapperCol: { span:20 }
      },
      style:{color:'red'},
      name: 'freight',
      text:ConsignmentDistPaymentModel.Freight
    },
    {
      label: '代收货款(元)',
      span:6,
      name: 'CollectPayment',
      options:{
        initialValue:ConsignmentDistPaymentModel.CollectPayment
      }
    }
  ];
  const ReceiptRequirement = item.ReceiptRequirement || '';
  const VehicleType = item.VehicleType || '';
	const formfields6 = [
    {
	    label: '回单要求',
	    name: 'lasia',
	    span:5,
      options: {
         initialValue:ReceiptRequirement==1?'签字':ReceiptRequirement==2?'盖章':ReceiptRequirement==3?'签字盖章':'不限'
      }
    },
    {
      label:'通知发货',
      name:'waitingDispatch',
      span:5,
      formItemLayout:{
        labelCol: { span: 5},
        wrapperCol: { span:19 }
      },
      options: {
         initialValue:item.waitingDispatch==true?'等通知发货':'随时发货'
      }
    },
    {
      label: '车型要求',
      name: 'VehicleType',
      span:5,
      options: {
        initialValue:VehicleType==1?'不限':VehicleType==2?'箱式':VehicleType==3?'平板式':VehicleType==4?'栏板式':VehicleType==5?'仓栅式':VehicleType==6?'冷藏车':VehicleType==7?'油罐车':'其他'
      }
    },
    {
      label: '车长要求',
      name: 'CommanderAsked',
      span:5,
      options: {
        initialValue:item.CommanderAsked
      }
    },
    {label:'',type:'space',span:4,name:'spance3'},
    {
      label: '备注',
      name: 'Remark',
      span:5,
      options: {
        initialValue:item.Remark
      }
    }
  ];
//表头设置
  const tableHeader = [
    {
	    title: '货物名称',
	    dataIndex: 'GoodsName',
	    key: 'GoodsName',
    },
    {
	    title: '批号',
	    dataIndex: 'BatchNumber',
	    key: 'BatchNumber',
    },
    {
	    title: '型号',
	    dataIndex: 'TypeOfGoods',
	    key: 'TypeOfGoods',
    },
    {
	    title: '材质',
	    dataIndex: 'TextureOfMaterial',
	    key: 'TextureOfMaterial',
    },
    {
	    title: '规格',
	    dataIndex: 'Specifications',
	    key: 'Specifications',
    },
    {
	    title: '件数',
	    dataIndex: 'PiecesNumber',
	    key: 'PiecesNumber',
    },
    {
	    title: '体积',
	    dataIndex: 'Volume',
	    key: 'Volume',
    },
    {
	    title: '重量',
	    dataIndex: 'Weight',
	    key: 'Weight',
    },
    {
	    title: '计费数量',
	    dataIndex: 'BillingQuantity',
	    key: 'BillingQuantity',
    },
    {
	    title: '单价',
	    dataIndex: 'UnitPrice',
	    key: 'UnitPrice',
    },
    {
	    title: '运费（元）',
	    dataIndex: 'Freight',
	    key: 'Freight',
    },
    {
	    title: '计量单位',
	    dataIndex: 'MeasurementUnit',
	    key: 'MeasurementUnit',
    }
  ];
  const tableHeader2=[
		{
			title:'公司名称',
			dataIndex:'CompanyName',
			render:(text,record)=>{
				return (
					<div>{record.CarrierIdentificationModel.CompanyName}</div>
				)
			}
		}
		,{
			title:'联系电话',
			dataIndex:'Tel',
			render:(text,record)=>{
				return (
					<div>{record.CarrierIdentificationModel.Tel}</div>
				)
			}
		},{
			title:'操作',
			key:'action',
			render:(text,record)=>{
				return(
					<div>
						<Button onClick={()=>{
							confirm({
						        title: '提示',
						        content: '确定要指派托运单给 '+record.CarrierIdentificationModel.CompanyName+' 吗？',
						        onOk: () => {
						        		let consignmentId = item.ConsignmentId;
						        		let carrierMemberId = record.CarrierIdentificationModel.MemberId;
						        		dispatch({type:'consignmentacceptsreach/assignGo',consignmentId,carrierMemberId})
						            handleCancel();
						            window.history.go(-1);
						        },
						        handleCancel() {}
						    })
						}}>指派</Button>
					</div>
				)
			}
		}
	];
  const ConsignGoodsModelList = item.ConsignGoodsModelList!=null&&item.ConsignGoodsModelList.length>0?item.ConsignGoodsModelList:[];
	const fhtyp=[{key:'1',value:'网点自提'},{key:'2',value:'上门提货'}];
	const shtyp=[{key:'1',value:'客户自提'},{key:'2',value:'送货上门'}];
	const sktyp=[{key:'1',value:'发货方付款（先付/回付/月结）'},{key:'2',value:'收货方付款(到付)'}];
	const yunshu=[{key:'1',value:'hoa'},{key:'2',value:'hoda'}]
  const formitem = [
	  {fields:formfields(),ColumnText:'运单信息'},
	  {fields:formfields2(),ColumnText:'发货信息'},
	  {fields:formfields4(),ColumnText:'收货信息'},
	  {fields:formfields5,ColumnText:'支付，配送',layout:'after'},
	  {fields:formfields6,ColumnText:'其他',layout:'after'}
  ];
  let btnShow = true;
  let btnName = '';
  const Status = item.Status&&item.Status!=null?item.Status:'';
  //按条件查询
  function goBack(){
		window.history.go(-1);
		let modal=false;
	  dispatch({type:'consignmentacceptsreach/refusemodal',modal})
  }
  //受理或指派确定
  function sureBtn (){
  	let id = item.ConsignmentId;
  	if(Status==2){
  		confirm({
	        title: '提示',
	        content: '确定要受理 '+item.SysCode+' 吗？',
	        onOk: () => {
	           	dispatch({type:'consignmentacceptsreach/getaccept',id})
	            handleCancel();
	        },
	        handleCancel() {}
	    })
  	}else if(Status==4||Status==5){
  		dispatch({type:'consignmentacceptsreach/showAssign'})
  	}

  }
  function handleCancel(){
  	dispatch({type:'consignmentacceptsreach/closeAssign'})
  }
  //受理或指派拒绝
  function cancelBtn(){
  	let modal=true;
    dispatch({type:'consignmentacceptsreach/updateparam',modal,item})
  }
  function onOk(param){
  	param.ConsignmentId=item.ConsignmentId;
    dispatch({type:'consignmentacceptsreach/getrefuse',param})
  }
  function onCancel(){
	  let modal=false;
	  dispatch({type:'consignmentacceptsreach/refusemodal',modal})
	}
  const buttons=(
  	<div className={styles.btnDiv}>
  		{Status==2?<span>
  			<Button onClick={cancelBtn}>拒绝</Button>
  			<Button type="primary" onClick={sureBtn}>受理</Button>
  		</span>:''}
  		{Status==4&&item.ConsignmentCarrierModel.MemberId==''||Status==5&&item.ConsignmentCarrierModel.MemberId==''?<Button type="primary" onClick={sureBtn}>指派</Button>:''}
  	</div>
  )
  const fields = [{
	    label: '拒绝理由',
	    type: 'textarea',
	    name: 'ReviewRemark',
	    options: {
	        rules: [{
	            required: true,
	            message: '请填写拒绝理由!',
	        }]
	    }
	}];
	//拒绝理由
	const rejectReason = (
		<span>
			{Status==3||Status==5?<span>拒绝理由 : {item.ReviewRemark}</span>:''}
		</span>
	)
  return (
  	<div>
  		<div className={styles.rejectReason}>{rejectReason}</div>
  		<Button type='primary' className={styles.goBack} onClick={goBack}>返回</Button>
	    <ColumnForm
	      colums={tableHeader}
	      formitems={formitem}
	      dataSource={ConsignGoodsModelList}
	      tableText="货物信息"
	      showBtn={false}
	      layout='three'>
	    </ColumnForm>
	    {buttons}
	    <Modal
        title="托运单指派运输"
        visible={modalShow}
        onCancel={handleCancel}
        footer={null}
    	>
      	<div className={styles.tableSearchDiv}>
      		指派运输 : <Input placeholder='请输入物流公司或联系电话'/> <Button type='primary' icon='search' className={styles.tableSearchBtn}>搜索</Button>
      	</div>
        <Table
            header={ tableHeader2 }
            data={batchAssignData }
            pageSize={10}
            pagination={true}
        />
    	</Modal>
    	<FormModal
            modalKey = "add"
            visible = {ModalShow}
            title = "确认拒绝受理"
            fields = {fields}
            onOk = {onOk}
            onCancel = {onCancel}
            okText = "确认" />
	  </div>
  );
}

function mapStateToProps(state) {
  return {...state.consignmentacceptsreach};
}

export default connect(mapStateToProps)(ConsignmentAcceptSreach);
