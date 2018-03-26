import React from 'react';
import { connect } from 'dva';
import EditTableCell from '../../components/editTable/editTableCell';
import { Table as AntdTable,Icon,Checkbox,Modal,form,message,Button,Input,Row,Col } from 'antd';
import {history} from 'dva/router';
import Moment from 'moment';
import Table from '../../components/table';
import ColumnForm from '../../components/modalForm/editTableForm';
import ValiInput from '../../components/modalForm/ValidateInput';
import ComponentMap from '../../components/editTable/ComponentMap'
import SearchBar from '../../components/searchbar';
import styles from './AddConsignment.less';
import {formatDate,formatDateTime} from '../../utils/fun_config'
const confirm = Modal.confirm;

function AddConsignment({
  dispatch,showCard,showShipper,cData,cardlist,
  totalcard,ShipperList,totalShipper,showReceive,ReceiveList,totalReceive,forwardingName,Consignor,DispatchTel,
  ReceivingName,Consignee,ReceivingTel,btnid,
  OpeningBankName,BankAccountName,CardNumber,CardId,GoodsData,BuyInsurance,
  TotalFreight,orderStatus,orderInfo,RequestList,UesedGoods, VerTYpelist,location,
  shipperchange,receiverchange,PickupTime,DeliveryTime,CarrierCompanyName,
  showCompany,totalCompany,companylist,CompanyName,companyId,Measuret,CosignmentCode,loadingPeople,loadingCompany,StartAddName,EndAddName,
  receivePageIndex,shipPageIndex,companyPageIndex,initFreight,testValue=0,ReceivDrress,DispatchDrress,waitingDispatch,InsuranceAmount
}) {
  //根据 Status 判断表单项编辑状态和按钮显示内容
let moreButtons =[{btntext:'保存草稿'}];
//装载级联数据
const loadData = (selectedOptions) => {
  const  id= selectedOptions[0].value;
      const targetOption = selectedOptions[selectedOptions.length - 1];
      if(selectedOptions.length>1){
          dispatch({ type:'addconsignment/getcdistricts',targetOption,cData,id});
      }else{
          dispatch({ type:'addconsignment/getPcitys',targetOption,cData});
      }
 	}

  //显示联系人弹框
  function showDisPeopleModal(param){
    dispatch({
      type:'addconsignment/showShipperModal',
      btnid:'dispa'
    });
    dispatch({
      type:'addconsignment/getShipperList',
      page:1,
      searchCriteria:''
    });

}
//收货人弹框 与发货联系人是一个弹框一个数据，但是不同按钮
function showRecPeopleModal(){
    dispatch({
      type:'addconsignment/showReceiveModal',
      btnid:'receive'
    });
      dispatch({
      type:'addconsignment/getReceiveList',
      page:1,
      searchCriteria:''
    });

  }
  //关闭发货联系人
  function onPeopleCancel(){
    dispatch({type:'addconsignment/closeShipperModal'});
  }
  //关闭收货联系人
  function onReceiveCancel(){
    dispatch({type:'addconsignment/closeReceiveModal'});
  }
  //选择发货联系人
  function onPeopleonOk(record, index, event){
    const {CompanyName,ContacterName,MobileNo,Address} = record;
    let url = btnid=='dispa' ?'setDispatch' : btnid=='receive' ?'setReceiving' :'';
    dispatch({
      type:`addconsignment/${url}`,
      CompanyName,
      ContacterName,
      MobileNo,
      Address
    })
    dispatch({type:'addconsignment/closeShipperModal'});
  }
  //选择收货联系人
  function onReceiveOk(record, index, event){

    const {CompanyName,ContacterName,MobileNo,Address} = record;
    let url = btnid=='dispa' ?'setDispatch' : btnid=='receive' ?'setReceiving' :'';
    dispatch({
      type:`addconsignment/${url}`,
      CompanyName,
      ContacterName,
      MobileNo,
      Address
    })
    dispatch({type:'addconsignment/closeReceiveModal'});
  }
//搜索联系人
  function onSearchPeople(value){
    let searchCriteria= value.people || '';
    dispatch({
      type:'addconsignment/getShipperList',
      page:shipPageIndex,
      searchCriteria
    });
  }
  function onSearchReceive(value){
    let searchCriteria= value.people || '';
    dispatch({
      type:'addconsignment/getReceiveList',
      page:shipPageIndex,
      searchCriteria
    });
  }
//发货人分页
  function getShipperPage(page){

    let shipperPage=page?page:1;
    dispatch({
      type:'addconsignment/getShipperList',
      shipperPage,
      searchCriteria:''
    });

  }
//收货联系人分页
  function getReceivePage(page){

    let receivePage=page?page:1;
    dispatch({
      type:'addconsignment/getReceiveList',
      receivePage,
      searchCriteria:''
    });

  }
    //显示承运方选择弹框
function showCompanyModal(){
  dispatch({
      type:'addconsignment/showComModal'
    });
    if(companylist.length==0){//有数据的时候不用再请求
      dispatch({
      type:'addconsignment/getCompanylist',
      page:1,
    });
    }else{
      return
    }
}
  //关闭选择承运方
  function onCompanyCancel(){
    dispatch({type:'addconsignment/closeComModal'});
  }
  //承运方选择确定  将承运方公司id保存
  function onCompanyonOk(record, index, event){
    const {companyId,CompanyName} = record;
    dispatch({
      type:`addconsignment/saveCompany`,
      companyId,
      CompanyName
    })
    dispatch({type:'addconsignment/closeComModal'});
  }
//搜索承运方
  function onSearchCompany(value){
    let searchCriteria= value.carrier || '';
    dispatch({
      type:'addconsignment/getCompanylist',
      page:1,
      searchCriteria
    });
  }

//承运方分页
function getCompanyPage(page){
  let companyPageIndex=page?page:1;
    dispatch({
    type:'addconsignment/getCompanylist',
      companyPageIndex,
    searchCriteria:''
  });
}
//切换是否购买保险
function InsuranceChange(e){
   let BuyInsurance=e.target.checked;
   dispatch({
    type:'addconsignment/changeBuyInsurance',
    BuyInsurance
  });
}
//保险金额
function ChangeInsuranseInput(e){
  dispatch({
    type:'addconsignment/setInsuranceAmount',
    InsuranceAmount:e
  })
}


  //自动完成变化事件
  function onautoSerch(value){
    //根据value进行常用货品搜索，设置autodata
    dispatch({
      type:'addconsignment/getUesedGoods',
      value
    })

  }

  //表单提交
  function handleSubmit(param,action,goods){
    let state = action == 'draft' ? 1 : action == 'save'? 2 : '';
      //货物信息
      let ConsignGoodsViewModelList =[];
      let freight = 0;

        goods.map(good=>{
          let goodslist = {}
          freight+=good.Freight.value
          for(var i in good){
            goodslist[i]= good[i].value;
          }
          //delete goodslist[0];
        ConsignGoodsViewModelList.push(goodslist);
      })
      if(ConsignGoodsViewModelList.length==0){
        Modal.warning({
                title: '提示',
                content: '请添加货物信息...',
            });
        preventDefault()
      }

      if(!forwardingName || !Consignor ||!DispatchTel||!ReceivingName||!Consignee||!ReceivingTel){
       Modal.warning({
                title: '提示',
                content: '发货和收货信息未填写完整...',
            });
       preventDefault()
      }
      //发货方信息
      let ConsignmentShipperViewModel = {
          "OpeningBankName": param.OpeningBankName,
          "BankAccountName":param.BankAccountName,
          "CardNumber": param.CardNumber,
          "CompanyName":forwardingName,
          "ShipperName": Consignor,
          "ShipperTel": DispatchTel,
          "ShipperAddress":DispatchDrress,
      }
      //收货方信息
      let ConsignmentReceivingViewModel =  {
        "CompanyName": ReceivingName,
        "ReceivingName": Consignee,
        "ReceivingTel": ReceivingTel,
        "ReceivingAddress": ReceivDrress,
      }
      //支付，配送方式
      let ConsignmentDistPaymentViewModel = {
        "Delivery": parseInt(param.Delivery),
        "ReceivingMode":parseInt(param.ReceivingMode),
        "PaymentMethod": parseInt(param.PaymentMethod),
        "PickupTime":param.PickupTime? formatDate(param.PickupTime._d):'',
        "DeliveryTime":param.DeliveryTime? formatDate(param.DeliveryTime._d):'',
        "Freight": freight,
        "CollectPayment": param.CollectPayment
      }
      if(param.PickupTime && param.DeliveryTime){
         if(Date.parse(param.PickupTime._d)> Date.parse(param.DeliveryTime._d)){
          Modal.warning({
                title: '提示',
                content: '取货时间应小于送货时间...',
            });
            preventDefault()
         }
      }
      //承运方信息
      let ConsignmentCarrierViewModel = {
        MemberId:companyId,
      }
      //保险
       let Insuranceamount=0
      if(BuyInsurance){
        Insuranceamount=InsuranceAmount;
        if(InsuranceAmount==null){
          Modal.warning({
                title: '提示',
                content: '保险金额未填写...',
            });
            preventDefault()
        }
      }else{
        Insuranceamount= 0;
      }
      let  ConsignmentInsuranceViewModel = {
        "InsuranceAmount": Insuranceamount
      }
      let orderDetail ={
          "SysCode": param.SysCode,
          "CustomerNumber": param.CustomerNumber,
          "DateOfArrival":param.DateOfArrival? formatDateTime(param.DateOfArrival._d):'',
          "StartingAddress": param.StartingAddress,
          "StartingProvinceId":param.startport? param.startport[0] : '',
          "StartingCityId":param.startport?  param.startport[1] :'' ,
          "StartingDistrictId":param.startport? param.startport[2] :'',
          "DestinationAddress": param.DestinationAddress,
          "DestinationProvinceId":param.receiveport? param.receiveport[0] :'',
          "DestinationCityId":param.receiveport? param.receiveport[1] : '',
          "DestinationDistrictId":param.receiveport? param.receiveport[2] : '',
          "StartingProvinceName":StartAddName[0]?StartAddName[0].label:'',
          "StartingCityName":StartAddName[1]?StartAddName[1].label:'',
          "StartingDistrictName":StartAddName[2]?StartAddName[2].label:'',
          "DestinationProvinceName":EndAddName[0]?EndAddName[1].label:'',
          "DestinationCityName":EndAddName[1]?EndAddName[1].label:'',
          "DestinationDistrictName":EndAddName[2]?EndAddName[0].label:'',
          "AcceptanceStatus": state,
          "ReceiptRequirement": param.ReceiptRequirement ||0,
          "VehicleType": param.VehicleType || 0,
          "CommanderAsked":param.CommanderAsked? `${param.CommanderAsked}m`:'',
          "waitingDispatch": param.waitingDispatch || false,
          "Remark": param.Remark,
          "IsBuyInsurance": BuyInsurance,
          ConsignGoodsViewModelList,
          ConsignmentShipperViewModel,
          ConsignmentReceivingViewModel,
          ConsignmentDistPaymentViewModel,
          ConsignmentInsuranceViewModel,
          ConsignmentCarrierViewModel
      }
    // !orderInfo.Status  新增  其他为修改
     if(orderInfo.AcceptanceStatus == null){//新增
      dispatch({
          type:'addconsignment/AddCosignment',
          orderDetail
          })
     }else{//修改
        orderDetail.ConsignmentId = orderInfo.ConsignmentId;
        dispatch({
          type:'addconsignment/UpdateCosignment',
          orderDetail
          })
     }
  }
//表单数据(初始化)
      //发货方信息
const ConsignmentShipperModel = orderInfo.ConsignmentShipperModel || {};
      //收货信息
const ConsignmentReceivingModel = orderInfo.ConsignmentReceivingModel;
    //支付配送信息
const ConsignmentDistPaymentModel = orderInfo.ConsignmentDistPaymentModel || {};
  //保险信息
const ConsignmentInsuranceModel = orderInfo.ConsignmentInsuranceModel || {};

const formfields=[{
          label: '运单编号',
          type: 'input',
          span:6,
          name: 'SysCode',
          disabled:true,
          options:{
            initialValue:orderInfo.SysCode||CosignmentCode
          }
      },{
          label: '客户单号',
          type: 'input',
          name: 'CustomerNumber',
          span:5,
          options: {
            initialValue:orderInfo.CustomerNumber,
            rules:[
              {
                pattern:  /^[A-Za-z0-9]+$/,
                message: '只能输入数字和英文字母!',
              }
            ]
          }
        },
        {
          label: '要求到货日期',
          type: 'datetime',
          span:6,
          name: 'DateOfArrival',
          formate:"YYYY/MM/DD HH:mm:ss",
          disabledDate:(current)=>{
                let ttt = new Date();
                let  year = ttt.getFullYear();
                let date = ttt.getDate();
                let month = ttt.getMonth()+1;
                let today = new Date(`${year}/${month}/${date}`)
              return current && current<today;
            },
          options:{
            initialValue:orderInfo.DateOfArrival ? Moment(orderInfo.DateOfArrival) : '',
          }
        },
        {label:'',type:'space',span:7,name:'spaceasda'},
        {
          label: '起始地',
          type: 'input',
          span:6,
          name: 'StartingAddress',
          options: {
            initialValue:orderInfo.StartingAddress,
            rules: [{
                  required: true,
                  message: '请填写起始地!',
              },{
                  pattern: /^([A-Za-z]|[\u4E00-\u9FA5])+$/,
                  message: '只能输入大小写字母、汉字!',
              },{
                  max: 10,
                  message: '请不要超过10个字符!',
              },{
                  min: 2,
                  message: '请不要小于2个字符!',
              }
              ]
          }
      },
    //   {
    //   label: '省市区',
    //   type: 'cascader',
    //   name: 'startport',
    //   onClick:casClick,
    //   items:cData,
    //   loadData:loadData,
    //   span:5,
    //   options: {
    //     initialValue:[orderInfo.StartingProvinceId,orderInfo.StartingCityId,orderInfo.StartingDistrictId],
    //     onChange:(v,s)=>{
    //     	dispatch({type:'addconsignment/san',s})
    //     }
    //   }
    // },
    // {label:'',type:'space',span:18,name:'spancasdasdeqs'},
      {
      label: '到达地',
      type: 'input',
      name: 'DestinationAddress',
      span:5,
      options: {
        initialValue:orderInfo.DestinationAddress,
          rules:[{
            required: true,
            message: '请填写到达地!',
            },{
                pattern: /^([A-Za-z]|[\u4E00-\u9FA5])+$/,
                message: '只能输入大小写字母、汉字!',
            },{
                max: 10,
                message: '请不要超过10个字符!',
            },{
                min: 2,
                message: '请不要小于2个字符!',
            }
        ]
      }
    },
    // {
    //   label: '省市区',
    //   type: 'cascader',
    //   name: 'receiveport',
    //   items:cData,
    //   loadData:loadData,
    //   span:5,
    //   options: {
    //     initialValue:[orderInfo.DestinationProvinceId,orderInfo.DestinationCityId,orderInfo.DestinationDistrictId],
    //     onChange:(v,s)=>{
    //     	dispatch({type:'addconsignment/ean',s})
    //     }
    //   }
    // },
     {label:'',type:'space',span:12,name:'span487s'},
      ];


    const fhtyp=[{key:1,value:'网点自提'},{key:2,value:'上门提货'}];
    const shtyp=[{key:1,value:'客户自提'},{key:2,value:'送货上门'}];
    const sktyp=[{key:1,value:'发货方付款（现付/回付/月结）'},{key:2,value:'收货方付款(到付)'}];

    const formfields5 = [
  {
  label:'',
  type:'btn',
  name:'companyclss',
  span:4,
  style:{marginLeft:'30px',backgroundColor:'#0B8EE9',color:'#fff'},
  formItemLayout:{
  labelCol: { span: 22},
  wrapperCol: { span:2 }
  },
  btnid:'company',
  click:showCompanyModal,
  text:'选择承运公司'
},
{
  label:'承运公司',
  type:'ctext',
  name:'CompanyNamecy',
  span:6,
  style:{fontSize:'14px',color:'#108EE9'},
  text:CarrierCompanyName,
  formItemLayout:{
  labelCol: { span: 6},
  wrapperCol: { span:18 }
  },
},
  {label:'',type:'space',span:10,name:'spance1'},
  {
  label:'发货方式',
  type:'radioGroup',
  name:'Delivery',
  span:6,
  items:()=>fhtyp.map(ele=>({
    key:ele.key,
    value:ele.value
  })),
  options: {
    initialValue:ConsignmentDistPaymentModel.Delivery?`${ConsignmentDistPaymentModel.Delivery}` :'2',
    rules: [{
    required: true,
    message: '请选择发货方式!',
    }
    ]
  }
},
{
label: '取货时间',
type: 'date',
name: 'PickupTime',
span:6,
disabledDate:(current)=>{
    let ttt = new Date();
    let  year = ttt.getFullYear();
    let date = ttt.getDate();
    let month = ttt.getMonth()+1;
    let today = new Date(`${year}/${month}/${date}`)
    return current && current<today;
},
onChange:(c)=>{
  dispatch({
    type:'addconsignment/setPickupTime',
    value:c.valueOf()
  })
},
options:{
  initialValue:ConsignmentDistPaymentModel.PickupTime ? Moment(ConsignmentDistPaymentModel.PickupTime) : ''
}
},
{
label:'',
type:'checkbox',
name:'IsBuyInsurance',
span:2,
checked:BuyInsurance,
formItemLayout:{
  labelCol: { span: 2},
  wrapperCol: { span:22 }
  },
onChange:InsuranceChange,
text:'购买保险',
},
{
 labelText: '保险金额',
type: 'inputNumber2',
name: 'InsuranceAmount',
span:7,
inputspan:18,
labelspan:6,
disabled:!BuyInsurance,
handleChange:ChangeInsuranseInput,
inputVlue:InsuranceAmount
},
{
  label:'收货方式',
  type:'radioGroup',
  name:'ReceivingMode',
  span:6,
  items:()=>shtyp.map(ele=>({
    key:ele.key,
    value:ele.value
  })),
  options: {
  initialValue:ConsignmentDistPaymentModel.ReceivingMode?`${ConsignmentDistPaymentModel.ReceivingMode}` : '2',
  rules: [{
  required: true,
  message: '请选择收货方式!',
  }
  ]
  }
},
{
label: '送货时间',
type: 'date',
name: 'DeliveryTime',
span:6,
onChange:(c)=>{
  dispatch({
    type:'addconsignment/setDeliveryTime',
    value:c.valueOf()
  })

},
disabledDate:(current)=>{
      let ttt = new Date();
      let  year = ttt.getFullYear();
      let date = ttt.getDate();
      let month = ttt.getMonth()+1;
      let today = new Date(`${year}/${month}/${date}`)
     return current && current<today;
  },
options:{
initialValue:ConsignmentDistPaymentModel.DeliveryTime ? Moment(ConsignmentDistPaymentModel.DeliveryTime) : '',
}
},
{label:'',type:'space',span:12,name:'spance1233'},
{
  label:'收款方式',
  type:'radioGroup',
  name:'PaymentMethod',
  span:12,
  formItemLayout:{
    labelCol: { span: 3},
    wrapperCol: { span:14 }
  },
  items:()=>sktyp.map(ele=>({
    key:ele.key,
    value:ele.value
  })),
  options: {
 initialValue:ConsignmentDistPaymentModel.PaymentMethod?`${ConsignmentDistPaymentModel.PaymentMethod}` : '1',
  rules: [{
  required: true,
  message: '请选择收款方式!',
    }
    ]
  }
},
{label:'',type:'space',span:10,name:'spance3'},
{
  label: '本次运费(元)',
  type: 'ctext',
  span:5,
  style:{color:'red'},
  name: 'freight',
  text:initFreight?initFreight.toFixed(2):TotalFreight.toFixed(2),
  formItemLayout:{
    labelCol: { span: 8},
    wrapperCol: { span:14 }
  },
  options:{
    initialValue:12
  }
},
{
  label: '代收货款(元)',
  type: 'inputNumber',
  span:9,
  name: 'CollectPayment',
  options:{
  initialValue: ConsignmentDistPaymentModel.CollectPayment || 0,
    step:0.1
  }
},
 {label:'',type:'space',span:10,name:'spa788s'},
];
const formfields3=[
    {
      label: '回单要求',
      type: 'select',
      name: 'ReceiptRequirement',
      span:6,
      items:()=>RequestList.map(ele=>({
      key:ele.EnumValue,
      value:ele.Desction
    })),
    options:{
      initialValue:orderInfo.ReceiptRequirement
    }
  },
  {
    label:'',
    type:'checkbox',
    name:'waitingDispatch',
    span:2,
    checked:waitingDispatch,
    formItemLayout:{
      labelCol: { span: 2},
      wrapperCol: { span:22 }
      },
    text:'等通知发货',
  },
   {
    label: '车型要求',
    type: 'select',
    name: 'VehicleType',
    span:6,
    items:()=>VerTYpelist.map(ele=>({
    key:ele.EnumValue,
    value:ele.Desction
  })),
  options:{
    initialValue:orderInfo.VehicleType
  }
  },
   {
    label: '车长要求(米)',
    type: 'inputNumber',
    name: 'CommanderAsked',
    span:6,
    formItemLayout:{
      labelCol: { span: 8},
      wrapperCol: { span:16 }
    },
    options:{
      initialValue:orderInfo.CommanderAsked?parseFloat(orderInfo.CommanderAsked):''
    }
},
{
  label:'备注',
  type:'textarea',
  name:'Remark',
  span:24,
  formItemLayout:{
    labelCol: { span: 1},
    wrapperCol: { span:6 }
  },
  options:{
    initialValue:orderInfo.Remark
  }
}
  ];
    const formitem = [
      {fields:formfields,ColumnText:'运单信息',linestyle:'bigline',leftstyle:'leftarque'},{fields:[],ColumnText:'发货信息',linestyle:'smallline',leftstyle:'leftarque'},
      {fields:formfields5,ColumnText:'支付，配送',layout:'after',linestyle:'blueline',leftstyle:'leftblue'},
      {fields:formfields3,ColumnText:'其他',layout:'after',linestyle:'blueline',leftstyle:'leftblue'}
      ];

  const peopleHeader=[
    {
      title:'公司名称',
      dataIndex:'CompanyName',
      key:'CompanyName'
    },
    {
      title:'联系电话',
      dataIndex:'MobileNo',
      key:'MobileNo'
    },
    {
      title:'联系人',
      dataIndex:'ContacterName',
      key:'ContacterName'
    },
    {
      title:'行业',
      dataIndex:'IndustriesName',
      key:'IndustriesName'
    },
     {
      title:'地区',
      dataIndex:'provience',
      key:'provience',
      render:(text, record, index)=>(
        `${record.ProvinceName}`
      )
    },
    {
      title:'详细地址',
      dataIndex:'Address',
      key:'Address',
      render:(text, record, index)=>(
        `${record.Address}`
      )
    },
     {
      title:'备注',
      dataIndex:'Remark',
      key:'Remark'
    },
  ];
  const CompanyHeader  = [
    {
      title:'公司名称',
      dataIndex:'CompanyName',
      key:'CompanyName'
    },
    {
      title:'负责人',
      dataIndex:'companyLegal',
      key:'companyLegal'
    },
    {
      title:'联系电话',
      dataIndex:'Tel',
      key:'Tel'
    },
  ];

  const searchPeopleFields = [
    {
    title:'搜索联系人',
    key:'people',
    width:'260px',
    placeholder:'搜索公司名称、联系电话、联系人',
    type:'input'
    }
   ];
   const searchComFields = [
    {
    title:'搜索承运方',
    key:'carrier',
    width:'260px',
    placeholder:'搜索公司名称、联系电话',
    type:'input'
    }
   ];
  const searchPFileds = [{fields:searchPeopleFields,visible:'visible'}];
  const searchCompanyFileds = [{fields:searchComFields,visible:'visible'}];
  function goback(){
    window.history.go(-1);
  }
  function changeInput(v,setvalue){
    let url='';
    switch(setvalue){
      case 'forwardingName':url='setCompanyName';
      break;
      case 'Consignor':url='setShipperName';
      break;
      case 'DispatchTel':url='setShipperTel';
      break;
      case 'DispatchDrress':url='setShipperDrress';
      break;
      case 'ReceivingName':url='setReceivingName';
      break;
      case 'Consignee':url='setConsignee';
      break;
      case 'ReceivingTel':url='setReceivingTel';
      break;
      case 'ReceivDrress':url='setReceivDrress';
      break;
      default:url='';
      break
    }
    dispatch({
      type:`addconsignment/${url}`,
      [setvalue]:v.target.value
    })
  }
  //发货方信息
  const shipper =(
    <Row style={{marginBottom:'10px'}} >
      <ValiInput
      spans={6} labelspan={6} inputspan={14} required={true} max={20} min={2}
      labelText='发货单位' message='请输入2-20个字符'
      inputValue={forwardingName} handleChange={(e)=>changeInput(e,'forwardingName')}
      />
      <ValiInput
      spans={5} labelspan={6} inputspan={14} max={20} min={2}
      labelText='发货人' message='只能输入2-10个大小写字母或汉字!'
      inputValue={Consignor} handleChange={(e)=>changeInput(e,'Consignor')}
       />
      <ValiInput  required={true} inputValue={DispatchTel}
      spans={5} labelspan={8} inputspan={14} handleChange={(e)=>changeInput(e,'DispatchTel')}
      labelText='发货电话' patter={/^1[34578]\d{9}$/} max={11} min={11} message='请输入正确电话号码'  />
      <ValiInput
      spans={5} labelspan={8} inputspan={14} handleChange={(e)=>changeInput(e,'DispatchDrress')}
      labelText='发货地址' inputValue={DispatchDrress}  />
      <Button onClick={showDisPeopleModal}>选择联系人</Button>
    </Row>
  )
  //收货方信息
  const receiver =(
    <Row  style={{marginBottom:'10px'}}>
      <ValiInput
      spans={6} labelspan={6} inputspan={14} required={true}
      labelText='收货单位' message='请输入2-20个字符' max={20} min={2}
      inputValue={ReceivingName} handleChange={(e)=>changeInput(e,'ReceivingName')}
       />
      <ValiInput
      spans={5} labelspan={6} inputspan={14} required={true}
      inputValue={Consignee} handleChange={(e)=>changeInput(e,'Consignee')}
      labelText='收货人' message='只能输入2-10个大小写字母或汉字!' max={10} min={2}
      patter={/^[A-Za-z\u4e00-\u9fa5]+$/} />
      <ValiInput  required={true} patter={/^1[34578]\d{9}$/} max={11} min={11}
      spans={5} labelspan={8} inputspan={14} message='请输入正确电话号码'
      labelText='收货电话' inputValue={ReceivingTel} handleChange={(e)=>changeInput(e,'ReceivingTel')} />
      <ValiInput inputValue={ReceivDrress}
      spans={5} labelspan={8} inputspan={14} handleChange={(e)=>changeInput(e,'ReceivDrress')}
      labelText='收货地址'  />
      <Button onClick={showRecPeopleModal}>选择联系人</Button>
    </Row>
  )

  return (
    <div className={styles.contentBox}>
      <Button type='primary' className={styles.buttonTop}  onClick={goback}>返回</Button>
      <ColumnForm
      tableButton='添加货物'  tableText='货物信息'
       hasTable='edit' tabelData={GoodsData}
        onOk={handleSubmit} formitems={formitem}  layout='three'
        moreButton={true}
        moreButtons={moreButtons}
        okText='提交'
        Measuret={Measuret}
        shipper={shipper}
        receiver={receiver}
        >
      </ColumnForm>
      {/*发货联系人*/}
      <Modal
        visible={showShipper}
        title={'请选择发货联系人'}
        okText="确定"
        onCancel={onPeopleCancel}
        key='people'
        footer={null}
        width={820}
      >
      <SearchBar
        onSubmit={onSearchPeople}
        searchFileds={searchPFileds}
        searchCls='nopadding'
      />
        <Table
        header={peopleHeader}
        data={ShipperList}
        key='people'
        pagination={true}
        pageSize = {5}
        total={totalShipper}
        onRowClick={onPeopleonOk}
        onChange={getShipperPage}
        currentPage={shipPageIndex}
        loading={loadingPeople}
      />
      </Modal>
      {/*收货联系人*/}
      <Modal
        visible={showReceive}
        title={'请选择收货联系人'}
        okText="确定"
        onCancel={onReceiveCancel}
        key='receive'
        footer={null}
        width={800}
      >
        <SearchBar
          onSubmit={onSearchReceive}
          searchFileds={searchPFileds}
          searchCls='nopadding'
        />
        <Table
          header={peopleHeader}
          data={ReceiveList}
          key='receive'
          pagination={true}
          pageSize = {5}
          total={totalReceive}
          onRowClick={onReceiveOk}
          onChange={getReceivePage}
          currentPage={receivePageIndex}
        />
      </Modal>
      {/*承运公司*/}
      <Modal
        visible={showCompany}
        title={'请选择承运公司'}
        okText="确定"
        onCancel={onCompanyCancel}
        key='company'
        footer={null}
        width={620}
      >
      <SearchBar
        onSubmit={onSearchCompany}
        searchFileds={searchCompanyFileds}
        searchCls='nopadding'
      />
        <Table
        header={CompanyHeader}
        data={companylist}
        key='company'
        pagination={true}
        pageSize = {5}
        total={totalCompany}
        onRowClick={onCompanyonOk}
        onChange={getCompanyPage}
        loading={loadingCompany}
        currentPage={companyPageIndex}
      />
    </Modal>
    </div>
  );
}

function mapStateToProps(state) {
  return {...state.addconsignment,...state.myconsignment};
}

export default connect(mapStateToProps)(AddConsignment);



