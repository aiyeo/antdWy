import React from 'react';
import { connect } from 'dva';
import styles from './MyConsignment.less';
import SearchBar from '../../components/searchbar';
import Table from '../../components/table';
import {Button,Modal,Icon,Input,Timeline} from 'antd';
import ColumnForm from '../../components/modalForm/complicform2';
import {FormModal} from '../../components/modalForm';
import Moment from 'moment';
import {RQHEADER} from '../../utils/config'
const confirm = Modal.confirm;

function ConsignmentDetailTrans({dispatch,item,provinceData,cityData,areaData,provinceData1,cityData1,areaData1,modalShow,signModal,token,pageIndex}) {
  //详情数据
  const formfields=()=>{
  	const DateOfArrival = item.DateOfArrival;
  	const StartProvince = provinceData!=null&&provinceData.Name?provinceData.Name:'';
  	const StartCity = cityData!=null&&cityData.Name?cityData.Name:'';
  	const StartArea = areaData!=null&&areaData.Name?areaData.Name:'';
  	const EndProvince = provinceData1!=null&&provinceData1.Name?provinceData1.Name:'';
  	const EndCity = cityData1!=null&&cityData1.Name?cityData1.Name:'';
  	const EndArea = areaData1!=null&&areaData1.Name?areaData1.Name:'';
  	const ConsignmentCarrierModel = item.ConsignmentCarrierModel!=null&&item.ConsignmentCarrierModel?item.ConsignmentCarrierModel:{};
    const ConsignmentShipperModel = item.ConsignmentShipperModel!=null&&item.ConsignmentShipperModel?item.ConsignmentShipperModel:{};
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
	      label: '运单时间',
	      span:5,
	      name: 'CreateTime',
	      options:{
	        initialValue:item.CreateTime
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
	      label: '要求到货日',
	      span:5,
	      name: 'DateOfArrival',
	      options:{
	        initialValue:DateOfArrival?DateOfArrival:''
	      }
	    },
    	{
    		label:'',
    		type:'space',
    		span:9,
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
      	},
	    {
	      label: '承运批次',
	      span:5,
	      name: 'LoadingBatch',
	      options:{
	        initialValue:ConsignmentCarrierModel.LoadingBatch
	      }
	    },
      {
        label:'',
        type:'space',
        span:9,
        name:'spancasdasdaseqs'
      },
      {
        label:'创建人',
        name:'CreateUserName',
        span:24,
        options:{
          initialValue:ConsignmentShipperModel?ConsignmentShipperModel.CreateUserName+' - '+ConsignmentShipperModel.CompanyName: ''
        },
      }
  	]
  }
  const formfields2 = ()=>{
  	const ConsignmentCarrierModel = item.ConsignmentCarrierModel!=null&&item.ConsignmentCarrierModel?item.ConsignmentCarrierModel:{};
  	return [
  		{
	      label: '司机姓名',
	      name: 'DriverName',
	      span:5,
	      options: {
	        initialValue:ConsignmentCarrierModel.DriverName
	      }
      },
      {
	      label: '联系电话',
	      name: 'ContactTel',
	      span:5,
	      options: {
	        initialValue:ConsignmentCarrierModel.ContactTel
	      }
      },
      {
	      label: '车牌号码',
	      name: 'LicensePlateNumber',
	      span:5,
	      formItemLayout:{
		      labelCol: { span: 8},
		      wrapperCol: { span:14 }
	      },
	      options: {
	        initialValue:ConsignmentCarrierModel.LicensePlateNumber
	      }
      }
  	]
  }
  const formfields4 = ()=>{
  	const ReceivingModel = item.ConsignmentReceivingModel!=null&&item.ConsignmentReceivingModel?item.ConsignmentReceivingModel:{};
  	const ShipperModel = item.ConsignmentShipperModel!=null&&item.ConsignmentShipperModel?item.ConsignmentShipperModel:{};
  	const ConsignmentCarrierModel = item.ConsignmentCarrierModel!=null&&item.ConsignmentCarrierModel?item.ConsignmentCarrierModel:{};
  	return [
  		{
		    name: 'CompanyNamef1',
		    span:3,
		    options: {
		        initialValue:<span style={{fontSize:14,color:'black'}}>发货信息</span>
		    }
  		},
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
		    span:4,
		    options:{
		      initialValue:ShipperModel.ShipperName
		    }
	    },
	    {
		    label: '发货电话',
		    name: 'ShipperTel',
		    span:4,
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
    	},
    	{
    		label:'',
    		type:'space',
    		span:4,
    		name:'spanceqs1'
    	},
    	{
		    name: 'CompanyNamef2',
		    span:3,
		    options: {
		        initialValue:<span style={{fontSize:14,color:'black'}}>承运信息</span>
		    }
  		},
  		{
		    label: '承运单位',
		    name: 'CompanyNameC',
		    span:5,
		    options: {
		      initialValue:ConsignmentCarrierModel.CompanyName
		    }
	    },
	    {
		    label: '负责人',
		    name: 'ShipperNameC',
		    span:4,
		    options:{
		      initialValue:ConsignmentCarrierModel.ContactName
		    }
	    },
	    {
		    label: '承运电话',
		    name: 'ShipperTelC',
		    span:4,
		    formItemLayout:{
			    labelCol: { span: 8},
			    wrapperCol: { span:14 }
		    },
		    options: {
		      initialValue:ConsignmentCarrierModel.ContactTel
		    }
  		},
    	{
    		label:'',
    		type:'space',
    		span:8,
    		name:'spanceqs2'
    	},
    	{
		    name: 'CompanyNamef3',
		    span:3,
		    options: {
		        initialValue:<span style={{fontSize:14,color:'black'}}>收货信息</span>
		    }
  		},
  		{
		    label: '收货单位',
		    name: 'CompanyNameR',
		    span:5,
		    options: {
		      initialValue:ReceivingModel.CompanyName
		    }
	    },
	    {
		    label: '收货人',
		    name: 'ShipperNameR',
		    span:4,
		    options:{
		      initialValue:ReceivingModel.ReceivingName
		    }
	    },
	    {
		    label: '收货电话',
		    name: 'ShipperTelR',
		    span:4,
		    formItemLayout:{
			    labelCol: { span: 8},
			    wrapperCol: { span:14 }
		    },
		    options: {
		      initialValue:ReceivingModel.ReceivingTel
		    }
  		},
		  {
		    label: '收货地址',
		    name: 'ShipperAddressR',
		    span:4,
		    formItemLayout:{
			    labelCol: { span: 8},
			    wrapperCol: { span:14 }
		  	},
		  	options:{
		  		initialValue:ReceivingModel.ReceivingAddress
		  	}
    	},
    	{
    		label:'',
    		type:'space',
    		span:4,
    		name:'spanceqs3'
    	},
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
	const ReceiptRequirement = item.ReceiptRequirement || '';
  	const VehicleType = item.VehicleType || '';
  	const ReceivingModel = item.ConsignmentReceivingModel!=null&&item.ConsignmentReceivingModel?item.ConsignmentReceivingModel:{};
  	const ShipperModel = item.ConsignmentShipperModel!=null&&item.ConsignmentShipperModel?item.ConsignmentShipperModel:{};
  	const ConsignmentCarrierModel = item.ConsignmentCarrierModel!=null&&item.ConsignmentCarrierModel?item.ConsignmentCarrierModel:{};
  const formfields5 = [
    {
	    label:'发货方式',
	    name:'Delivery',
	    span:6,
	    formItemLayout:{
	      labelCol: { span: 6},
	      wrapperCol: { span: 18}
	    },
	    options: {
	      initialValue:Delivery=='1'?'网点自提' : '上门提货'
	    }
    },
	  {
		  label: '取货时间',
		  name: 'PickupTime',
		  span:6,
		  formItemLayout:{
	      		labelCol: { span: 6},
		      	wrapperCol: { span: 18}
		    },
		  options: {
	      	initialValue:DeliveryTime
	    }
	  },
	  {
		  label: '保险金额',
		  name: 'InsuranceAmount',
		  span:6,
		  formItemLayout:{
		      labelCol: { span: 6},
		      wrapperCol: { span: 18}
		    },
		  options: {
		    initialValue:InsuranceAmount>0?InsuranceAmount:'未购买保险'
		  }
	  },
    {
      label:'收货方式',
      name:'ReceivingMode',
      span:6,
      formItemLayout:{
	      labelCol: { span: 6},
	      wrapperCol: { span: 18}
	    },
      options: {
      	initialValue:ReceivingMode=='1'? '客户自提' : '送货上门',
      }
    },
    {
	    label: '送货时间',
	    name: 'DeliveryTime',
	    span:6,
	    formItemLayout:{
	      labelCol: { span: 6},
	      wrapperCol: { span: 18}
	    },
	    options: {
	      initialValue:PickupTime
	    }
    },
    {
      label:'收款方式',
      name:'PaymentMethod',
      span:6,
      formItemLayout:{
	      labelCol: { span: 6},
	      wrapperCol: { span: 18}
	    },
      options: {
      	initialValue:PaymentMethod==1?'发货方付款（先付/回付/月结）':'收货方付款(到付)',
      }
    },
    {
      label: '本次运费(元)',
      type: 'ctext',
      span:6,
      formItemLayout:{
	      labelCol: { span: 6},
	      wrapperCol: { span: 18}
	    },
      style:{color:'red'},
      name: 'freight',
      text:ConsignmentDistPaymentModel.Freight
    },
    {
      label: '代收货款(元)',
      span:6,
      formItemLayout:{
	      labelCol: { span: 6},
	      wrapperCol: { span: 18}
	    },
      name: 'CollectPayment',
      options:{
        initialValue:ConsignmentDistPaymentModel.CollectPayment
      }
    },
    {
	    label: '回单要求',
	    name: 'lasia',
	    span:6,
	    formItemLayout:{
	      labelCol: { span: 6},
	      wrapperCol: { span: 18}
	    },
      options: {
         initialValue:ReceiptRequirement==1?'签字':ReceiptRequirement==2?'盖章':ReceiptRequirement==3?'签字盖章':'不限'
      }
    },
    {
      label:'通知发货',
      name:'waitingDispatch',
      span:6,
      formItemLayout:{
	      labelCol: { span: 6},
	      wrapperCol: { span: 18}
	    },
      options: {
         initialValue:item.waitingDispatch==true?'等通知发货':'随时发货'
      }
    },
    {
      label: '车型要求',
      name: 'VehicleType',
      span:6,
      formItemLayout:{
	      labelCol: { span: 6},
	      wrapperCol: { span: 18}
	    },
      options: {
        initialValue:VehicleType==1?'不限':VehicleType==2?'箱式':VehicleType==3?'平板式':VehicleType==4?'栏板式':VehicleType==5?'仓栅式':VehicleType==6?'冷藏车':VehicleType==7?'油罐车':'其他'
      }
    },
    {
      label: '车长要求',
      name: 'CommanderAsked',
      span:6,
      formItemLayout:{
	      labelCol: { span: 6},
	      wrapperCol: { span: 18}
	    },
      options: {
        initialValue:item.CommanderAsked
      }
    },
    {
      label: '备注',
      name: 'Remark',
      formItemLayout:{
	      labelCol: { span: 4},
	      wrapperCol: { span: 20}
	    },
      options: {
        initialValue:item.Remark
      }
    }
  ];
  const fieldforms = [
  	{
  		name: 'CompanyNamef3',
	    span:0,
  	}
  ]
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
  ];
  const Status = item.Status&&item.Status!=null?item.Status:'';
	const timeline = (
		<Timeline>
		    <Timeline.Item color='red'>要求到货时间 {item.DateOfArrival}</Timeline.Item>
		    {Status>=9?<Timeline.Item color='green'>货物已签收 {ShipperModel.SignDate}</Timeline.Item>:<span></span>}
		    {Status>=9?<Timeline.Item color='green'>完成卸货 {ConsignmentCarrierModel.DischargingTime}</Timeline.Item>:<span></span>}
		    {Status>=8?<Timeline.Item color='green'>货物已到站 {ConsignmentCarrierModel.ArrivalTime}</Timeline.Item>:<span></span>}
		    {Status>=7?<Timeline.Item>预计到货时间 {ConsignmentCarrierModel.EstimatedTimeOfArrival}</Timeline.Item>:<span></span>}
		    {Status>=7?<Timeline.Item>货物运输中... </Timeline.Item>:<span></span>}
		    {Status>6?<Timeline.Item>货物装车 {ConsignmentCarrierModel.LoadingTime}</Timeline.Item>:<span></span>}
		    <Timeline.Item>受理托运单 {item.AcceptanceTime}</Timeline.Item>
		    <Timeline.Item>提交托运单 {item.CreateTime}</Timeline.Item>
		</Timeline>
	)
  	const ConsignGoodsModelList = item.ConsignGoodsModelList!=null&&item.ConsignGoodsModelList.length>0?item.ConsignGoodsModelList:[];
	const fhtyp=[{key:'1',value:'网点自提'},{key:'2',value:'上门提货'}];
	const shtyp=[{key:'1',value:'客户自提'},{key:'2',value:'送货上门'}];
	const sktyp=[{key:'1',value:'发货方付款（先付/回付/月结）'},{key:'2',value:'收货方付款(到付)'}];
	const yunshu=[{key:'1',value:'hoa'},{key:'2',value:'hoda'}]
  	const formitem = [
	  {fields:formfields(),ColumnText:'运单信息'},
	  {fields:formfields2(),ColumnText:'车辆信息'},
	  {fields:formfields4(),ColumnText:'三方信息'},
	  {fields:formfields5,ColumnText:'其他信息',layout:'after'},
	  {fields:fieldforms,ColumnText:'运输信息',layout:'after'},
  ];

  const signModalData=[
  	{
        label: '托运单号',
        name: 'SysCode',
        options:{
        	initialValue:item.SysCode
        }
   },
   {
        label: '验收单号',
        name: 'CheckCode',
        options:{
        	initialValue:ReceivingModel.CheckCode
        }
   },
   {
        label: '签收日期',
        name: 'SignDate',
        options:{
        	initialValue:ReceivingModel.SignDate
        }
   },
   {
        label: '签收人',
        name: 'SignUserName',
        options:{
        	initialValue:ReceivingModel.SignUserName
        }
   },
   {
        label: '证件类型',
        name: 'LicenceType',
        options:{
        	initialValue:ReceivingModel.LicenceType
        }
    },
    {
        label: '证件号码',
        name: 'LicenceCode',
        options:{
        	initialValue:ReceivingModel.LicenceCode
        }
    },
    {
        label: '收货净重',
        name: 'SignWeight',
        options:{
        	initialValue:ReceivingModel.SignWeight
        }
    },
    {
        label: '备注',
        name: 'Remark',
        options:{
        	initialValue:ReceivingModel.Remark
        }
    }
  ];
  const fieldsExamine = [
		{
          	label: '托运单号',
          	name: 'SysCode',
          	options:{
          		initialValue:item.SysCode,
          	}
      	},
      	{
          	label: '签收日期',
          	name: 'SignDate',
          	type:'date',
          	options:{
          		rules:[
          			{
          				required: true,
                  		message: '请选择签收日期!',
          			},
          		]
          	}
      	},
      	{
          	label: '签收人',
          	name: 'SignUserName',
          	type:'input',
          	options:{
          		rules:[
          			{
          				required: true,
                  		message: '请填写签收人!',
          			},
          			{
          				max: 20,
                  		message: '请不要超过20个字符!',
          			},
          			{
          				min: 2,
                  		message: '请不要少于2个字符!',
          			},
          			{
          				pattern: /^([A-Za-z]|[\u4E00-\u9FA5])+$/,
                  		message: '只能输入大小写字母、汉字!',
          			}
          		]
          	}
      	},
      	{
          	label: '收货净重(吨)',
          	name: 'SignWeight',
          	type: 'input',
		    options:{
		      	rules:[
          			{
          				pattern: /^[+|-]?\d*\.?\d*$/,
                  		message: '只能输入数字!',
          			},
          			{
          				required:true,
          				message:'请输入收货净重!'
          			}
          		]
		    }
      	},
      	{
          	label: '验收单号',
          	name: 'CheckCode',
          	type:'input',
          	options:{
          		rules:[
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
      	},
      	{
          	label: '证件类型',
          	name: 'LicenceType',
          	type: 'select',
		    items:()=>licenseType.map(ele=>({
		      	key:ele.value,
		      	value:ele.mean
		    })),
      	},
      	{
          	label: '证件号码',
          	name: 'LicenceCode',
          	type: 'input',
		    options:{
		      	rules:[
          			{
          				pattern: /^[+|-]?\d*\.?\d*$/,
                  		message: '只能输入数字!',
          			}
          		]
		    }
      	},
      	{
          	label: '备注',
          	name: 'Remark',
          	type: 'input',
      	},
      	{
		    label: '上传单据',
		    type: 'upload',
		    name: 'BusinesslicensePhoto',
		    uploadUrl:'',
		    action:RQHEADER+'//companyauth/saveimage',
		    headers:{'Authorization': 'token '+token},
		    beforeUpload:beforeUpload,
		    onChange:changeUploadBusiness,
		    options: {
        		//initialValue:Status==1 ? [] : [{ uid: 1,name:'行驶证.png',url:Information.BusinesslicensePhoto || '',thumbUrl:Information.BusinesslicensePhoto || '',status:'done'}],
    		}
		}
    ];
    const licenseType = [
	  {
	    value: '1',
	    mean: '身份证',
	  },
	  {
	    value: '2',
	    mean: '工作证',
	  }
	]
    //上传图片前事件
  	function beforeUpload(file) {
    	const isLt2M = file.size / 1024 / 1024 < 2;
    	if (!isLt2M) {
        	message.error('请不要上传大于2M的图片!');
    	}
    	return  isLt2M;
	}
  	//上传单据
  	function changeUploadBusiness(info) {
    	if (info.file.status === 'done') {
      		dispatch({type:'certification/saveBusinessimage',Businessimage:info.file.response.Message})
    	}
  	}
  	//点击列表指派
  	function sureBtn(record){
  		let Data = record;
  		dispatch({type:'consignmentdetailtrans/showAssign'});
  		dispatch({type:'consignmentdetailtrans/getSingleData',Data})
  	}
  	//关闭指派弹框
  	function closeModal(){
  		dispatch({type:'consignmentdetailtrans/closeAssign'})
  	}
  const buttons=(
  	<div className={styles.btnDiv}>
  		{Status==8?<Button type="primary" onClick={sureBtn}>签收</Button>:''}
  	</div>
  )

  function goBack(){
		window.history.go(-1);
  }
  //签收
  	function onOkExamine(param){
  		let SignDate = Moment(param.SignDate).format('YYYY-MM-DD');
  		let id = item.ConsignmentId;
  		let CheckCode = param.CheckCode;
  		let SignUserName = param.SignUserName;
  		let LicenceType = param.LicenceType;
  		let LicenceCode = param.LicenceCode;
  		let SignWeight = param.SignWeight;
  		let Remark = param.Remark;
  		let Receipts = param.Receipts;
  		let options = {
  			'ConsignmentId':id,
	  		'CheckCode':CheckCode,
	  		'SignDate':SignDate,
	  		'SignUserName':SignUserName,
	  		'LicenceType':LicenceType,
	  		'LicenceCode':LicenceCode,
	  		'SignWeight':SignWeight,
	  		'Remark':Remark,
	  		'Receipts':Receipts
  		}
  		dispatch({type:'signconsignment/assignGo',options});
  		dispatch({type:'signconsignment/closeAssign'});
  	}
  return (
  	<div className={styles.contentBox}>
  		<Button type='primary' className={styles.buttonTop} onClick={goBack}>返回</Button>
	    <ColumnForm
	      colums={tableHeader}
	      formitems={formitem}
	      dataSource={ConsignGoodsModelList}
	      tableText="货物信息"
	      showBtn={false}
	      layout='three' />
	    <div className={styles.Timeline}>{timeline}</div>
	    {buttons}
	    <FormModal modalKey="examine"
        visible={modalShow}
        title="托运单签收"
        fields={fieldsExamine}
        onOk={onOkExamine}
        onCancel={closeModal}
        okText="签收"
        layout={'inline'}
        cancelText="拒绝"
        width={860}
      />
	  </div>
  );
}

function mapStateToProps(state) {
  return {...state.consignmentdetailtrans};
}

export default connect(mapStateToProps)(ConsignmentDetailTrans);
