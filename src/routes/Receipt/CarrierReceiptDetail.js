import React from 'react';
import { connect } from 'dva';
import { Button,Steps } from 'antd';
import ColumnForm from '../../components/modalForm/complicform';
import styles from './Receipt.css';
import {FormModal} from '../../components/modalForm'
const Step=Steps.Step;

function CarrierReceiptDetail({dispatch,ConsignmentList,tData,modalShowDischarge,modalShowSign,RoleId}) {
  function goback() {
    window.history.go(-1);
  }
  const ConsignTruckModelList=ConsignmentList.ConsignTruckModelList||[];
  const ConsignmentCarrierModel=ConsignmentList.ConsignmentCarrierModel||{};
  const ConsignmentShipperModel = ConsignmentList.ConsignmentShipperModel || {};
  const ConsignmentReceivingModel = ConsignmentList.ConsignmentReceivingModel||{};
  const ConsignReceiptModel = ConsignmentList.ConsignReceiptModel || {};
  const ConsignmentSignModel=ConsignmentList.ConsignmentSignModel||{};
  const ConsignmentArrivalModel=ConsignmentList.ConsignmentArrivalModel||{};
  const ConsignmentLoadingBatchModel=ConsignmentList.ConsignmentLoadingBatchModel||{};
  //运单信息配置
  const formfields=[
    {
      label: '运单编号',
      type: 'ctext',
      span:5,
      name: 'SysCode',
      disabled:true,
      text:ConsignmentList.SysCode
    },
    {
      label: '托运日期',
      type: 'ctext',
      span:5,
      name: 'CreateTime',
      disabled:true,
      text:ConsignmentList.CreateTime
    },
    {
      label: '承运方',
      type: 'ctext',
      span:5,
      name: 'ReceiptCompanyName',
      disabled:true,
      text:ConsignmentCarrierModel?ConsignmentCarrierModel.CompanyName:''
    },
    {
      label: '承运批次',
      type: 'ctext',
      span:5,
      name: 'LoadingBatch',
      disabled:true,
      text:ConsignmentLoadingBatchModel.LoadingBatch||'',
    },
    {label:'',type:'space',span:4,name:'spanceyd123'},
    {
      label: '起始地',
      type: 'ctext',
      span:5,
      name: 'StartingAddress',
      disabled:true,
      text:ConsignmentList.StartingAddress
    },
    {
      label: '到达地',
      type: 'ctext',
      span:5,
      name: 'DestinationAddress',
      disabled:true,
      text:ConsignmentList.DestinationAddress
    },
    {label:'',type:'space',span:14,name:'spanceyd'},
    {
      label: '发货单位',
      type: 'ctext',
      span:5,
      name: 'ShipperCompanyName',
      disabled:true,
      text:ConsignmentShipperModel?ConsignmentShipperModel.CompanyName:''
    },
    {
      label: '发货电话',
      type: 'ctext',
      span:5,
      name: 'ShipperTel',
      disabled:true,
      text:ConsignmentShipperModel?ConsignmentShipperModel.ShipperTel:''
    },
    {label:'',type:'space',span:14,name:'spanceyd2'},
    {
      label: '收货单位',
      type: 'ctext',
      span:5,
      name: 'ReciveCompanyName',
      disabled:true,
      text:ConsignmentReceivingModel?ConsignmentReceivingModel.CompanyName:''
    },
    {
      label: '收货电话',
      type: 'ctext',
      span:5,
      name: 'ReceivingTel',
      disabled:true,
      text:ConsignmentReceivingModel?ConsignmentReceivingModel.ReceivingTel:''
    },
    {label:'',type:'space',span:14,name:'spanceyd3'},
    {
      label: '驾驶员',
      type: 'ctext',
      span:5,
      name: 'DriverName',
      disabled:true,
      text:ConsignTruckModelList&&ConsignTruckModelList.length>0?ConsignTruckModelList[0].DriverName:''
    },
    {
      label: '车牌号',
      type: 'ctext',
      span:5,
      name: 'LicensePlateNumber',
      disabled:true,
      text:ConsignTruckModelList&&ConsignTruckModelList.length>0?ConsignTruckModelList[0].LicensePlateNumber:''
    },
    {
      label: '联系电话',
      type: 'ctext',
      span:5,
      name: 'ContactTel',
      disabled:true,
      text:ConsignTruckModelList&&ConsignTruckModelList.length>0?ConsignTruckModelList[0].DriverTel:''
    },
    {label:'',type:'space',span:9,name:'spanceyd311'},
  ];
  //上交信息配置
  const handinSet=[
    {
      label: '运单编号',
      type: 'ctext',
      span:5,
      name: 'SysCode',
      disabled:true,
      text:ConsignmentList.SysCode
    },
    {
      label: '承运方',
      type: 'ctext',
      span:5,
      name: 'ReceiptCompanyName',
      disabled:true,
      text:ConsignmentCarrierModel?ConsignmentCarrierModel.CompanyName:''
    },
    {label:'',type:'space',span:14,name:'spanceyasdasd'},
    {
      label: '上交时间',
      type: 'ctext',
      span:5,
      name: 'HandInTime',
      disabled:true,
      text:ConsignReceiptModel?ConsignReceiptModel.HandInTime:'/'
    },
    {
      label: '回单上交人',
      type: 'ctext',
      span:5,
      name: 'HandInPersion',
      disabled:true,
      text:ConsignReceiptModel?ConsignReceiptModel.HandInPersion:''
    },
    {label:'',type:'space',span:14,name:'spanceyd3333sdaasd'},
    {
      label: '备注',
      type: 'ctext',
      span:5,
      name: 'HandInRemark',
      disabled:true,
      text:ConsignReceiptModel?(ConsignReceiptModel.HandInRemark?ConsignReceiptModel.HandInRemark:'暂无'):''
    },
    {label:'',type:'space',span:19,name:'spanceyd32asda2'},
    {
      label: '上交凭证',
      type: 'ctext',
      span:5,
      name: 'imgText',
      disabled:true,
      text:''
    },
    {label:'',type:'space',span:19,name:'spanc2asda2'},
    {label:'',type:'space',span:1,name:'spanc2asdasdasda2'},
    {
      type: 'image',
      span:8,
      name: 'ReceiptImg1',
      disabled:true,
      url:ConsignReceiptModel?(ConsignReceiptModel.ConsignPictureHandInModelList?ConsignReceiptModel.ConsignPictureHandInModelList.length>0?ConsignReceiptModel.ConsignPictureHandInModelList[0].PicturePath:'':''):'',
      options:{
        click:()=>{
          let url=ConsignReceiptModel?(ConsignReceiptModel.ConsignPictureHandInModelList?ConsignReceiptModel.ConsignPictureHandInModelList.length>0?ConsignReceiptModel.ConsignPictureHandInModelList[0].PicturePath:'':''):'';
          dispatch({type:'login/ImgModalHide'});
          dispatch({type:'login/ImgUrl',url});
        }
      }
    },{
      type: 'image',
      span:8,
      name: 'ReceiptImg2',
      disabled:true,
      url:ConsignReceiptModel?(ConsignReceiptModel.ConsignPictureHandInModelList?ConsignReceiptModel.ConsignPictureHandInModelList.length>1?ConsignReceiptModel.ConsignPictureHandInModelList[1].PicturePath:'':''):'',
      options:{
        click:()=>{
          let url=ConsignReceiptModel?(ConsignReceiptModel.ConsignPictureHandInModelList?ConsignReceiptModel.ConsignPictureHandInModelList.length>1?ConsignReceiptModel.ConsignPictureHandInModelList[1].PicturePath:'':''):'';
          dispatch({type:'login/ImgModalHide'});
          dispatch({type:'login/ImgUrl',url});
        }
      }
    },
  ];
  //回单信息配置
  const receiptSet=[
    {
      label: '运单编号',
      type: 'ctext',
      span:5,
      name: 'SysCode',
      disabled:true,
      text:ConsignmentList.SysCode
    },
    {
      label: '承运方',
      type: 'ctext',
      span:5,
      name: 'ReceiptCompanyName',
      disabled:true,
      text:ConsignmentCarrierModel?ConsignmentCarrierModel.CompanyName:''
    },
    {
      label: '收货单位',
      type: 'ctext',
      span:5,
      name: 'ReciveCompanyName',
      disabled:true,
      text:ConsignmentReceivingModel?ConsignmentReceivingModel.CompanyName:''
    },
    {
      label: '收货电话',
      type: 'ctext',
      span:5,
      name: 'ReceivingTel',
      disabled:true,
      text:ConsignmentReceivingModel?ConsignmentReceivingModel.ReceivingTel:''
    },
    {label:'',type:'space',span:4,name:'spanceyasdasd'},
    {
      label: '回单时间',
      type: 'ctext',
      span:5,
      name: 'ReceiptTime',
      disabled:true,
      text:ConsignReceiptModel?ConsignReceiptModel.ReceiptTime:'/'
    },
    {
      label: '回单接收人',
      type: 'ctext',
      span:5,
      name: 'Recipienter',
      disabled:true,
      text:ConsignReceiptModel?ConsignReceiptModel.Recipienter:''
    },
    {label:'',type:'space',span:14,name:'spanceyd3333sdaasd'},
    {
      label: '备注',
      type: 'ctext',
      span:5,
      name: 'Remark',
      disabled:true,
      text:ConsignReceiptModel?(ConsignReceiptModel.Remark?ConsignReceiptModel.Remark:'暂无'):''
    },
    {label:'',type:'space',span:19,name:'spanceyd32asda2'},
    {
      label: '回收凭证',
      type: 'ctext',
      span:5,
      name: 'imgText',
      disabled:true,
      text:''
    },
    {label:'',type:'space',span:19,name:'spanc2asda2'},
    {label:'',type:'space',span:1,name:'spanc2asdasdasda2'},
    {
      type: 'image',
      span:8,
      name: 'ReceiptImg1',
      disabled:true,
      url:ConsignReceiptModel?(ConsignReceiptModel.ConsignPictureAddModelList?ConsignReceiptModel.ConsignPictureAddModelList.length>0?ConsignReceiptModel.ConsignPictureAddModelList[0].PicturePath:'':''):'',
      options:{
        click:()=>{
          let url=ConsignReceiptModel?(ConsignReceiptModel.ConsignPictureAddModelList?ConsignReceiptModel.ConsignPictureAddModelList.length>0?ConsignReceiptModel.ConsignPictureAddModelList[0].PicturePath:'':''):'';
          dispatch({type:'login/ImgModalHide'});
          dispatch({type:'login/ImgUrl',url});
        }
      }
    },{
      type: 'image',
      span:8,
      name: 'ReceiptImg2',
      disabled:true,
      url:ConsignReceiptModel?(ConsignReceiptModel.ConsignPictureAddModelList?ConsignReceiptModel.ConsignPictureAddModelList.length>1?ConsignReceiptModel.ConsignPictureAddModelList[1].PicturePath:'':''):'',
      options:{
        click:()=>{
          let url=ConsignReceiptModel?(ConsignReceiptModel.ConsignPictureAddModelList?ConsignReceiptModel.ConsignPictureAddModelList.length>1?ConsignReceiptModel.ConsignPictureAddModelList[1].PicturePath:'':''):'';
          dispatch({type:'login/ImgModalHide'});
          dispatch({type:'login/ImgUrl',url});
        }
      }
    },
  ];
  //卸货凭证弹框
  const fieldsDischarge =()=>{
    return [
      {
        label: '备注',
        name: 'Remark',
        options:{
          initialValue:ConsignmentArrivalModel.Remark
        }
      },
      {
        name: 'space'
      },
      {
      label: '卸货凭证',
      name: 'DischargeImg1',
      type: 'image',
        options:{
          url:ConsignmentArrivalModel?(ConsignmentArrivalModel.ConsignPictureModelList?ConsignmentArrivalModel.ConsignPictureModelList.length>0?ConsignmentArrivalModel.ConsignPictureModelList[0].PicturePath:'':''):'',
          click:()=>{
            let url=ConsignmentArrivalModel?(ConsignmentArrivalModel.ConsignPictureModelList?ConsignmentArrivalModel.ConsignPictureModelList.length>0?ConsignmentArrivalModel.ConsignPictureModelList[0].PicturePath:'':''):'';
            dispatch({type:'login/ImgModalHide'});
            dispatch({type:'login/ImgUrl',url});
          }
        }
    },{
      name: 'DischargeImg2',
      type: 'image',
      options:{
        url:ConsignmentArrivalModel?(ConsignmentArrivalModel.ConsignPictureModelList?ConsignmentArrivalModel.ConsignPictureModelList.length>1?ConsignmentArrivalModel.ConsignPictureModelList[1].PicturePath:'':''):'',
        click:()=>{
          let url=ConsignmentArrivalModel?(ConsignmentArrivalModel.ConsignPictureModelList?ConsignmentArrivalModel.ConsignPictureModelList.length>1?ConsignmentArrivalModel.ConsignPictureModelList[1].PicturePath:'':''):'';
          dispatch({type:'login/ImgModalHide'});
          dispatch({type:'login/ImgUrl',url});
        }
      }
    },
    ]
  };
  //签收信息
  const fieldsSign =()=>{
    return [
      {
        label: '托运单号',
        name: 'SysCode',
        options:{
          initialValue:ConsignmentList.SysCode
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
    ]
  };
  //卸货凭证弹框
  function Discharge(){
    dispatch({ type: 'carrierreceipt/showDischargemodel',ConsignmentList})
  }
  //签收凭证弹框
  function Sign(){
    dispatch({ type: 'carrierreceipt/showSignmodel',ConsignmentList})
  }
  //关闭卸货凭证弹框
  function onCancelDischarge() {
    dispatch({type:'carrierreceipt/closemodalDischarge'})
  }
  //关闭签收凭证弹框
  function onCancelSign() {
    dispatch({type:'carrierreceipt/closemodalSign'})
  }
  let formitem = [{fields:formfields,ColumnText:'运单信息',linestyle:'bigline',leftstyle:'leftarque'}];
  let receiptTitle = [{fields:receiptSet,ColumnText:'回单信息',linestyle:'smallline',leftstyle:'leftarque'}];
  let handinTitle = [{fields:handinSet,ColumnText:'上交信息',linestyle:'smallline',leftstyle:'leftarque'}];
  const timeline=(
    <Steps progressDot current={6}>
      <Step title="提交托运单" description={ConsignmentList.CreateTime} />
      <Step title="受理托运单" description={ConsignmentList.AcceptanceTime} />
      <Step title="货物装车" description={ConsignmentLoadingBatchModel.LoadingTime} />
      <Step title="货物到站" description={ConsignmentArrivalModel.ArrivalTime} />
      <Step title={<span style={{color:'green'}}>预计到货时间</span>}
            description={<span style={{color:'green'}}>{ConsignmentLoadingBatchModel.EstimatedTimeOfArrival||'暂未指定'}</span>} />
      <Step title="完成卸货" description={<div>{ConsignmentArrivalModel.DischargingTime}<br />
        {ConsignmentArrivalModel.DischargingTime?<a onClick={Discharge}>查看卸货凭证</a>:''}</div>} />
      <Step title="货物签收" description={<div>{ConsignmentSignModel.SignDate}<br />
        {ConsignmentSignModel.SignDate?<a onClick={Sign}>查看签收信息</a>:''}</div>} />
      <Step title={<span style={{color:'red'}}>要求到货时间</span>}
            description={<span style={{color:'red'}}>{ConsignmentList.DateOfArrival||'暂未指定'}</span>} />
    </Steps>
  )
    //上交信息
  const handinInfo=(
    <ColumnForm editable={false}
                dataSource={tData} formitems={handinTitle} colums=''
                layout='three'
                moreButton={false}
                noBtn={true}
                pagination={false}
    >
    </ColumnForm>
  )
  //回单信息
  const receiptInfo=(
    <ColumnForm editable={false}
                dataSource={tData} formitems={receiptTitle} colums=''
                layout='three'
                moreButton={false}
                noBtn={true}
                pagination={false}
    >
    </ColumnForm>
  )
  return (
    <div className={styles.contentBox}>
      <Button type='primary' className={styles.buttonTop} onClick={goback}>返回</Button>
      <ColumnForm editable={false}
                  dataSource={tData} formitems={formitem} colums=''
                    layout='three'
                  moreButton={false}
                  noBtn={true}
                  pagination={false}
      >
      </ColumnForm>

      <div style={{marginTop:'30px'}}>{timeline}</div>
      <div style={{marginTop:'40px'}}>{(ConsignmentList.ReceiptStatus>=2&&RoleId==4?receiptInfo:'')}</div>
      <div style={{marginTop:'40px'}}>
        {(ConsignmentList.ReceiptStatus===3?handinInfo:'')}
      </div>
      <FormModal
        modalKey="Discharge"
        visible={modalShowDischarge}
        title="到站卸货凭证"
        fields={fieldsDischarge()}
        onCancel={onCancelDischarge}
        onOk={onCancelDischarge}
        layout={'inline'}
        width={1000}
        noBtn={true}
        showCancel={false}
      />
      <FormModal
        modalKey="Sign"
        visible={modalShowSign}
        title="到站卸货凭证"
        fields={fieldsSign()}
        onCancel={onCancelSign}
        onOk={onCancelSign}
        layout={'inline'}
        width={1000}
        noBtn={true}
        showCancel={false}
      />
    </div>
  );
}
function mapStateToProps(state) {
  return {...state.carrierreceipt,...state.login,...state.common};
}

export default connect(mapStateToProps)(CarrierReceiptDetail);
