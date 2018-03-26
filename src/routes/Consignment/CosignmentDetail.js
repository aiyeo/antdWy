
import React from 'react';
import { connect } from 'dva';
import EditTableCell from '../../components/editTable/editTableCell';
import { Table as AntdTable,Icon,Checkbox,Modal,form,Timeline,Button } from 'antd';
import {history} from 'dva/router';
import {routerRedux} from 'dva/router';
import Moment from 'moment';
import Table from '../../components/table';
import ColumnForm from '../../components/modalForm/complicform';
import ComponentMap from '../../components/editTable/ComponentMap'
import SearchBar from '../../components/searchbar';
import styles from './AddConsignment.less';
import {formatDate} from '../../utils/fun_config';
import {FormModal} from '../../components/modalForm'


function ConsignmentDetail({
                             dispatch, GoodsData,orderInfo,UesedGoods,cData,RequestList,VerTYpelist,modal_id,signModal,unloadModal,DischargingModal,RoleId
                           }) {
  function goback(){
    window.history.go(-1);
  }
  //查看签收信息
  function showSign(){
    dispatch({type:'addconsignment/showSignModal'})
  }
  function showDischargingTime(){
    dispatch({type:'addconsignment/showDischargingModal'})
  }
  //关闭查询签收信息弹框
  function handleCancel(){
    dispatch({type:'addconsignment/closeSignModal'})
  }
  //查看卸货信息
  function showUnload(){
    dispatch({type:'addconsignment/showunloadModal'})
  }
  function UnloadCancel(){
    dispatch({type:'addconsignment/closeunloadModal'})
  }
  const ConsignGoodsModelList = orderInfo.ConsignGoodsModelList!=null&&orderInfo.ConsignGoodsModelList.length>0?orderInfo.ConsignGoodsModelList:[];
  const ConsignmentShipperModel = orderInfo.ConsignmentShipperModel || {};
  const ConsignmentReceivingModel = orderInfo.ConsignmentReceivingModel||{};
  const ConsignmentDistPaymentModel = orderInfo.ConsignmentDistPaymentModel || {};
  const ConsignmentInsuranceModel = orderInfo.ConsignmentInsuranceModel || {};
  const ConsignmentCarrierModel = orderInfo.ConsignmentCarrierModel||{};
  const ConsignmentSignModel=orderInfo.ConsignmentSignModel||{};
  const ConsignmentArrivalModel=orderInfo.ConsignmentArrivalModel||{};
  const ConsignmentLoadingBatchModel=orderInfo.ConsignmentLoadingBatchModel||{};
  const ConsignTruckModelList=orderInfo.ConsignTruckModelList||[];

  const formfields=[{
    label: '运单编号',
    type: 'ctext',
    span:6,
    name: 'SysCode',
    disabled:true,
    text:orderInfo.SysCode
  },{
    label: '客户单号',
    type: 'ctext',
    name: 'CustomerNumber',
    span:6,
    text:orderInfo.CustomerNumber
  },
    {
      label: '要求到货日期',
      type: 'ctext',
      span:6,
      formItemLayout:{
        labelCol: { span: 6},
        wrapperCol: { span:15  }
      },
      name: 'DateOfArrival',
      text:orderInfo.DateOfArrival ? orderInfo.DateOfArrival : ''
    },
    {
      label:'受理状态',
      type:'ctext',
      name:'AcceptanceStatus',
      span:6,
      style:{fontWeight:'bold',color:'#108ee9'},
      text:orderInfo.AcceptanceStatus==1?'待提交':orderInfo.AcceptanceStatus==2 ? '待受理':orderInfo.AcceptanceStatus==3?'已受理':orderInfo.AcceptanceStatus==4?'受理被拒':''
    },
    {
      label: '起始地',
      type: 'ctext',
      span:6,
      name: 'StartingAddress',
      text:orderInfo.StartingAddress
    },
    {
      label: '到达地',
      type: 'ctext',
      name: 'DestinationAddress',
      span:6,
      text:orderInfo.DestinationAddress,
    },
    {label:'',type:'space',span:6,name:'spanceqs'},
    {
      label:'运输状态',
      type:'ctext',
      name:'TransportStatus',
      span:6,
      style:{fontWeight:'bold',color:'#108ee9'},
      text:orderInfo.TransportStatus==1?'未装车':orderInfo.TransportStatus==2 ? '运输中':orderInfo.TransportStatus==3?'已到站':orderInfo.TransportStatus==4?'已签收':''
    },
    {
      label:'创建人',
      type:'ctext',
      name:'CreateUserName',
      span:18,
      formItemLayout:{
        labelCol: { span: 2},
        wrapperCol: { span:15  }
      },
      text:ConsignmentShipperModel ? ConsignmentShipperModel.CreateUserName: '',
    }
  ];

  const formfields5 = [
    {
      label:'发货方式',
      type:'ctext',
      name:'Delivery',
      span:6,
      text:ConsignmentDistPaymentModel.Delivery=='1'?'网点自提' : '上门提货',

    },
    {
      label: '取货时间',
      type: 'ctext',
      name: 'PickupTime',
      span:6,
      text:ConsignmentDistPaymentModel.PickupTime&&ConsignmentDistPaymentModel.PickupTime!='NaN-NaN-NaN'?ConsignmentDistPaymentModel.PickupTime: ''

    },
    {
      label:'收货方式',
      type:'ctext',
      name:'ReceivingMode',
      span:6,
      text:ConsignmentDistPaymentModel.ReceivingMode=='1'? '客户自提' : '送货上门',

    },
    {
      label: '送货时间',
      type: 'ctext',
      name: 'DeliveryTime',
      span:6,
      text:ConsignmentDistPaymentModel.DeliveryTime&&ConsignmentDistPaymentModel.DeliveryTime!='NaN-NaN-NaN'? ConsignmentDistPaymentModel.DeliveryTime: ''

    },
    {
      label:'货款方式',
      type:'ctext',
      name:'PaymentMethod',
      span:6,
      disabled:true,
      text:ConsignmentDistPaymentModel.PaymentMethod==1?'发货方付款（先付/回付/月结）':'收货方付款(到付)',
    },
    {
      label: '本次运费(元)',
      type: 'ctext',
      span:6,
      style:{color:'red'},
      name: 'freight',
      text: ConsignmentDistPaymentModel.Freight ? ConsignmentDistPaymentModel.Freight :'',
      options:{
        initialValue:0
      }
    },
    {
      label: '代收货款(单位元)',
      type: 'ctext',
      span:6,
      style:{color:'red'},
      name: 'CollectPayment',
      text: ConsignmentDistPaymentModel.CollectPayment || 0,
      formItemLayout:{
        labelCol: { span: 9},
        wrapperCol: { span:12 }
      },
    },
    {
      label: '保险金额(元)',
      type: 'ctext',
      name: 'InsuranceAmount',
      span:6,
      style:{color:'red'},
      text:ConsignmentInsuranceModel.InsuranceAmount || 0,
      formItemLayout:{
        labelCol: { span: 6},
        wrapperCol: { span:14 }
      },
    },
  ];
  const formfields3=[
    {
      label: '回单要求',
      type: 'ctext',
      name: 'ReceiptRequirement',
      span:6,
      text:orderInfo.ReceiptRequirementName || '',
    },
    {
      label:'是否等通知发货',
      type:'ctext',
      name:'waitingDispatch',
      span:6,
      formItemLayout:{
        labelCol: { span: 8},
        wrapperCol: { span:12 }
      },
      text:orderInfo.waitingDispatch?'是':'否',
    },
    {
      label: '车型要求',
      type: 'ctext',
      name: 'VehicleType',
      span:6,
      text:orderInfo.VehicleTypeName || ''

    },
    {
      label: '车长要求(单位米)',
      type: 'ctext',
      name: 'CommanderAsked',
      span:6,
      disabled:true,
      formItemLayout:{
        labelCol: { span: 8},
        wrapperCol: { span:12 }
      },
      text:orderInfo.CommanderAsked || ''
    },
    {
      label:'备注',
      type:'ctext',
      name:'Remark',
      span:18,
      disabled:true,
      formItemLayout:{
        labelCol: { span: 2},
        wrapperCol: { span:16  }
      },
      text:orderInfo.Remark

    }
  ];
  //三方信息
  const formfieldsThree=[
    {
      label: '发货单位',
      type: 'ctext',
      name: 'CompanyName',
      span:6,
      text:ConsignmentShipperModel ? ConsignmentShipperModel.CompanyName : '',

    },
    {
      label: '发货人',
      type: 'ctext',
      name: 'ShipperName',
      span:6,
      text: ConsignmentShipperModel ? ConsignmentShipperModel.ShipperName : '',

    },
    {
      label: '发货电话',
      type: 'ctext',
      name: 'ShipperTel',
      span:6,
      text:ConsignmentShipperModel ? ConsignmentShipperModel.ShipperTel :'',
    },
    {
      label: '发货地址',
      type: 'ctext',
      name: 'ShipperAddress',
      span:6,
      formItemLayout:{
        labelCol: { span: 5},
        wrapperCol: { span:18 }
      },
      text:ConsignmentShipperModel.ShipperAddress
    },
    {
      label: '承运单位',
      type: 'ctext',
      name: 'cyCompanyName',
      span:6,
      text:ConsignmentCarrierModel ? ConsignmentCarrierModel.CompanyName :' ',
    },
    {
      label: '联系人',
      type: 'ctext',
      name: 'ctReceivingName',
      span:6,
      text:ConsignmentCarrierModel ? ConsignmentCarrierModel.ContactName : ' ',
    },
    {
      label: '联系电话',
      type: 'ctext',
      name: 'cyReceivingTel',
      span:6,
      text:ConsignmentCarrierModel ? ConsignmentCarrierModel.ContactTel  : ' ',

    },
    {label:'',type:'space',span:6,name:'spance12'},
    {
      label: '收货单位',
      type: 'ctext',
      name: 'reCompanyName',
      span:6,
      text:ConsignmentReceivingModel ? ConsignmentReceivingModel.CompanyName :' ',
    },
    {
      label: '收货人',
      type: 'ctext',
      name: 'ReceivingName',
      span:6,
      text:ConsignmentReceivingModel ? ConsignmentReceivingModel.ReceivingName : ' ',
    },
    {
      label: '收货电话',
      type: 'ctext',
      name: 'ReceivingTel',
      span:6,
      text:ConsignmentReceivingModel ? ConsignmentReceivingModel.ReceivingTel  : ' ',

    },
    {
      label: '收货地址',
      type: 'ctext',
      name: 'ReceivingAddress',
      span:6,
      formItemLayout:{
        labelCol: { span: 5},
        wrapperCol: { span:18 }
      },
      text:ConsignmentReceivingModel? ConsignmentReceivingModel.ReceivingAddress : ''
    },
  ];
//车辆信息
  const carfields = [
    {
      label: '驾驶员',
      type: 'ctext',
      name: 'DriverName',
      span:6,

      text:ConsignTruckModelList&&ConsignTruckModelList.length>0? ConsignTruckModelList[0].DriverName : ''
    },
    {
      label: '车牌号',
      type: 'ctext',
      name: 'LicensePlateNumber',
      span:6,
      text:ConsignTruckModelList&&ConsignTruckModelList.length>0? ConsignTruckModelList[0].LicensePlateNumber : ''
    },
    {
      label: '联系电话',
      type: 'ctext',
      name: 'DriverTel',
      span:6,
      text:ConsignTruckModelList&&ConsignTruckModelList.length>0? ConsignTruckModelList[0].DriverTel : ''
    },

    {
      label: '车辆类型',
      type: 'ctext',
      name: 'cartype',
      span:6,
      formItemLayout:{
        labelCol: { span: 5},
        wrapperCol: { span:18 }
      },
      text:ConsignTruckModelList&&ConsignTruckModelList.length>0? ConsignTruckModelList[0].TruckType: ''
    },
  ];
//其他（综合）
  const  formfieldsother = [
    {
      label:'发货方式',
      type:'ctext',
      name:'Delivery',
      span:5,
      text:ConsignmentDistPaymentModel.Delivery=='1'?'网点自提' : '上门提货',

    },
    {
      label: '取货时间',
      type: 'ctext',
      name: 'PickupTime',
      span:6,
      text:ConsignmentDistPaymentModel.PickupTime ?ConsignmentDistPaymentModel.PickupTime: ''

    },
    {
      label:'收货方式',
      type:'ctext',
      name:'ReceivingMode',
      span:6,
      text:ConsignmentDistPaymentModel.ReceivingMode=='1'? '客户自提' : '送货上门',

    },
    {
      label: '送货时间',
      type: 'ctext',
      name: 'DeliveryTime',
      span:6,
      text:ConsignmentDistPaymentModel.DeliveryTime ? ConsignmentDistPaymentModel.DeliveryTime: ''

    },
    {
      label:'货款方式',
      type:'ctext',
      name:'PaymentMethod',
      span:5,
      disabled:true,
      text:ConsignmentDistPaymentModel.PaymentMethod==1?'发货方付款（先付/回付/月结）':'收货方付款(到付)',
    },
    {
      label: '本次运费(元)',
      type: 'ctext',
      span:6,
      style:{color:'red'},
      name: 'freight',
      text: ConsignmentDistPaymentModel.Freight ? ConsignmentDistPaymentModel.Freight :'',
      options:{
        initialValue:0
      }
    },
    {
      label: '代收货款(单位元)',
      type: 'ctext',
      span:6,
      style:{color:'red'},
      name: 'CollectPayment',
      text: ConsignmentDistPaymentModel.CollectPayment || 0,
      formItemLayout:{
        labelCol: { span: 9},
        wrapperCol: { span:12 }
      },
    },
    {
      label: '保险金额(元)',
      type: 'ctext',
      name: 'InsuranceAmount',
      span:6,
      style:{color:'red'},
      text:ConsignmentInsuranceModel.InsuranceAmount || 0,
      formItemLayout:{
        labelCol: { span: 6},
        wrapperCol: { span:14 }
      },
    },
    {
      label: '回单要求',
      type: 'ctext',
      name: 'ReceiptRequirement',
      span:5,
      text:orderInfo.ReceiptRequirementName || '',
    },
    {
      label: '车型要求',
      type: 'ctext',
      name: 'VehicleType',
      span:6,
      text:orderInfo.VehicleTypeName || ''
    },
    {
      label: '车长要求(单位米)',
      type: 'ctext',
      name: 'CommanderAsked',
      span:6,
      disabled:true,
      formItemLayout:{
        labelCol: { span: 9},
        wrapperCol: { span:12 }
      },
      text:orderInfo.CommanderAsked || ''
    },
    {
      label:'备注',
      type:'ctext',
      name:'Remark',
      span:19,
      disabled:true,
      formItemLayout:{
        labelCol: { span: 1},
        wrapperCol: { span:16  }
      },
      text:orderInfo.Remark
    }
  ];
  let formitem = [
    {fields:formfields,ColumnText:'运单信息',linestyle:'bigline',leftstyle:'leftarque'},
    {fields:formfieldsThree,ColumnText:'三方信息',layout:'after',linestyle:'bigblueline',leftstyle:'leftbluebig'},
    // {fields:formfields2,ColumnText:'发货信息',linestyle:'smallline',leftstyle:'leftarque'},
    //  {fields:formfields4,ColumnText:'收货信息',linestyle:'blueline',leftstyle:'leftblue'},
    {fields:formfields5,ColumnText:'支付，配送',layout:'after',linestyle:'blueline',leftstyle:'leftblue'},
    {fields:formfields3,ColumnText:'其他',layout:'after',linestyle:'blueline',leftstyle:'leftblue'}
  ];
  if(orderInfo.TransportStatus>1&&orderInfo.AcceptanceStatus>=3){
    formitem = [
      {fields:formfields,ColumnText:'运单信息',linestyle:'bigline',leftstyle:'leftarque'},
      {fields:formfieldsThree,ColumnText:'三方信息',layout:'after',linestyle:'bigblueline',leftstyle:'leftbluebig'},
      {fields:carfields,ColumnText:'车辆信息',layout:'after',linestyle:'blueline',leftstyle:'leftblue'},
      {fields:formfields5,ColumnText:'支付，配送',layout:'after',linestyle:'blueline',leftstyle:'leftblue'},
      {fields:formfields3,ColumnText:'其他',layout:'after',linestyle:'blueline',leftstyle:'leftblue'}
    ]
  }
  //    formitem = [
  //     {fields:formfields,ColumnText:'运单信息',linestyle:'bigline',leftstyle:'leftarque'},{fields:carfields,ColumnText:'车辆信息',layout:'after',linestyle:'blueline',leftstyle:'leftblue'},
  //     {fields:formfieldsThree,ColumnText:'三方信息',layout:'after',linestyle:'bigblueline',leftstyle:'leftbluebig'},{fields:formfieldsother,ColumnText:'其他',layout:'after',linestyle:'blueline',leftstyle:'leftblue'}
  //   ];
  //签收信息数据
  const signModalData=[
    {
      label: '托运单号',
      name: 'SysCode',
      options:{
        initialValue:orderInfo.SysCode
      }
    },
    {
      label: '验收单号',
      name: 'CheckCode',
      options:{
        initialValue:ConsignmentSignModel.CheckCode
      }
    },
    {
      label: '签收日期',
      name: 'SignDate',
      options:{
        initialValue:ConsignmentSignModel.SignDate
      }
    },
    {
      label: '签收人',
      name: 'SignUserName',
      options:{
        initialValue:ConsignmentSignModel.SignUserName
      }
    },
    {
      label: '证件类型',
      name: 'LicenceType',
      options:{
        initialValue:ConsignmentSignModel.LicenceType
      }
    },
    {
      label: '证件号码',
      name: 'LicenceCode',
      options:{
        initialValue:ConsignmentSignModel.LicenceCode
      }
    },
    {
      label: '收货净重',
      name: 'SignWeight',
      options:{
        initialValue:ConsignmentSignModel.SignWeight
      }
    },
    {
      label: '备注',
      name: 'Remark',
      options:{
        initialValue:ConsignmentSignModel.Remark
      }
    },
    {
      label: '签收单据',
      name: 'Receipts',
      type:'image',
      options:{
        url:ConsignmentSignModel?(ConsignmentSignModel.ConsignPictureModelList?ConsignmentSignModel.ConsignPictureModelList.length>0?ConsignmentSignModel.ConsignPictureModelList[0].PicturePath:'':''):'',
        click:()=>{
          let url=ConsignmentSignModel?(ConsignmentSignModel.ConsignPictureModelList?ConsignmentSignModel.ConsignPictureModelList.length>0?ConsignmentSignModel.ConsignPictureModelList[0].PicturePath:'':''):'';
          dispatch({type:'login/ImgModalHide'});
          dispatch({type:'login/ImgUrl',url});
        }
      }
    },
    {
      name: 'Receipts1',
      type:'image',
      options:{
        url:ConsignmentSignModel?(ConsignmentSignModel.ConsignPictureModelList?ConsignmentSignModel.ConsignPictureModelList.length>1?ConsignmentSignModel.ConsignPictureModelList[1].PicturePath:'':''):'',
        click:()=>{
          let url=ConsignmentSignModel?(ConsignmentSignModel.ConsignPictureModelList?ConsignmentSignModel.ConsignPictureModelList.length>1?ConsignmentSignModel.ConsignPictureModelList[1].PicturePath:'':''):'';
          dispatch({type:'login/ImgModalHide'});
          dispatch({type:'login/ImgUrl',url});
        }
      }
    }
  ];
  //卸货信息数据
  const unloadModalData=[
    {
      label: '备注',
      name: 'ArrivalRemark',
      options:{
        initialValue:ConsignmentArrivalModel.ArrivalRemark
      }
    },
    {
      label: '卸货单据',
      name: 'unloadImg',
      type:'image',
      options:{
        url:ConsignmentArrivalModel?(ConsignmentArrivalModel.ConsignPictureModelList?ConsignmentArrivalModel.ConsignPictureModelList.length>0?ConsignmentArrivalModel.ConsignPictureModelList[0].PicturePath:'':''):'',
        click:()=>{
          let url=ConsignmentArrivalModel?(ConsignmentArrivalModel.ConsignPictureModelList?ConsignmentArrivalModel.ConsignPictureModelList.length>0?ConsignmentArrivalModel.ConsignPictureModelList[0].PicturePath:'':''):'';
          dispatch({type:'login/ImgModalHide'});
          dispatch({type:'login/ImgUrl',url});
        }
      }
    },
    {
      name: 'unloadImg1',
      type:'image',
      options:{
        url:ConsignmentArrivalModel?(ConsignmentArrivalModel.ConsignPictureModelList?ConsignmentArrivalModel.ConsignPictureModelList.length>1?ConsignmentArrivalModel.ConsignPictureModelList[1].PicturePath:'':''):'',
        click:()=>{
          let url=ConsignmentArrivalModel?(ConsignmentArrivalModel.ConsignPictureModelList?ConsignmentArrivalModel.ConsignPictureModelList.length>1?ConsignmentArrivalModel.ConsignPictureModelList[1].PicturePath:'':''):'';
          dispatch({type:'login/ImgModalHide'});
          dispatch({type:'login/ImgUrl',url});
        }
      }
    }
  ];
  const timeline = (
    <div className={styles.timelines}>
      {orderInfo.TransportStatus>0&&orderInfo.AcceptanceStatus>=3?<div className={styles.columtag}>
        <div className={styles.leftText}>
          <div className={styles.bluesmallbox}></div>
          运输信息
        </div>
        <span className={styles.blueline2}></span>
      </div>:<span></span>}
      {orderInfo.TransportStatus>0&&orderInfo.AcceptanceStatus>=3?<Timeline >
        {orderInfo.TransportStatus>=4?<Timeline.Item color='green'>货物已签收 {ConsignmentSignModel.SignDate} <a onClick={showSign}>查看签收信息</a></Timeline.Item>:<span></span>}
        {orderInfo.TransportStatus>=3?<Timeline.Item color='green'>完成卸货 {ConsignmentArrivalModel.DischargingTime} <a onClick={showUnload}>查看卸货信息</a></Timeline.Item>:<span></span>}
        {orderInfo.TransportStatus>=3?<Timeline.Item color='green'>货物已到站 {ConsignmentArrivalModel.ArrivalTime}</Timeline.Item>:<span></span>}
        {orderInfo.TransportStatus>=2?<Timeline.Item>预计到货时间 {ConsignmentLoadingBatchModel.EstimatedTimeOfArrival}</Timeline.Item>:<span></span>}
        {orderInfo.TransportStatus>=2?<Timeline.Item>货物运输中... </Timeline.Item>:<span></span>}
        {orderInfo.TransportStatus>1?<Timeline.Item>货物装车 {ConsignmentLoadingBatchModel.LoadingTime}</Timeline.Item>:<span></span>}
        <Timeline.Item>受理托运单 {orderInfo.AcceptanceTime }</Timeline.Item>
        <Timeline.Item color='red'>提交托运单 {orderInfo.CreateTime}</Timeline.Item>
      </Timeline>:<span></span>}
    </div>
  )
  const tableColumns=[
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
  //拒绝理由
  const rejectReason = (
    <span>
			{orderInfo.AssignStatus==3&&RoleId==4?<span>拒绝理由 : {orderInfo.PackageRemark?orderInfo.PackageRemark:''}</span>:''}
      {orderInfo.AcceptanceStatus==4&&RoleId==2?<span>拒绝理由 : {orderInfo.ReviewRemark?orderInfo.ReviewRemark:''}</span>:''}
		</span>
  )
  return (
    <div className={styles.contentBox}>
      <Button type='primary' className={styles.buttonTop}  onClick={goback}>返回</Button>
      <div className={styles.rejectReason}>{rejectReason}</div>
      <ColumnForm editable={false}
                  tableText='货物信息'
                  hasTable='noedit' dataSource={ConsignGoodsModelList} colums={tableColumns} formitems={formitem}  layout='three'
                  moreButton={true}
                  noBtn={true}
      >

      </ColumnForm>
      <FormModal
        modalKey="signmsg"
        visible={signModal}
        title="签收信息"
        fields={signModalData}
        onCancel={handleCancel}
        layout={'inline'}
        onOk={handleCancel}
        width={600}
        noBtn={true}
        showCancel={true}
      >
      </FormModal>
      <FormModal
        modalKey="unloadmsg"
        visible={unloadModal}
        title="卸货信息"
        fields={unloadModalData}
        onCancel={UnloadCancel}
        layout={'inline'}
        onOk={UnloadCancel}
        width={600}
        noBtn={true}
        showCancel={true}
      >
      </FormModal>
      <div className={styles.Timeline}>{timeline}</div>
    </div>
  );
}

function mapStateToProps(state) {
  return {...state.addconsignment,...state.login};
}

export default connect(mapStateToProps)(ConsignmentDetail);



