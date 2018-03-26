import React from 'react';
import { connect } from 'dva';
import { Button,Modal,Row,Col} from 'antd';
import ColumnForm from '../../components/modalForm/complicform';
import styles from './MyConsignment.less';
import {FormModal} from '../../components/modalForm'

function TransStowageDetail({dispatch,TransInfo,tData,modalShowDetail,consignmentLists}) {
  function goback() {
    window.history.go(-1);
  }
  const {ConsignmentLoadingBatchModel,ConsignTruckArrivalModel,TruckStatus}=TransInfo;
  //运单信息配置
  const carformfields=[
    {
      label: '起始地',
      type: 'ctext',
      span:6,
      name: 'StartingAddress',
      disabled:true,
      text:TransInfo.StartingAddress||'',
    },
    {
      label: '到达地',
      type: 'ctext',
      span:6,
      name: 'DestinationAddress',
      disabled:true,
      text:TransInfo.DestinationAddress||'',
    },
    {label:'',type:'space',span:12,name:'spanceyd'},
    {
      label: '承运批次',
      type: 'ctext',
      span:6,
      name: 'LoadingBatch',
      disabled:true,
      text:ConsignmentLoadingBatchModel?ConsignmentLoadingBatchModel.LoadingBatch:'',
    },
    {
      label: '承运费用',
      type: 'ctext',
      span:6,
      name: 'CarriageExpenses',
      disabled:true,
      text:TransInfo.CarriageExpenses+' 元 ',
    },
    {
      label: '装车时间',
      type: 'ctext',
      span:6,
      name: 'LoadingTime',
      disabled:true,
      text:TransInfo.LoadingTime||'',
    },
    {label:'',type:'space',span:6,name:'spanceyd2'},
    {
      label: '车牌号',
      type: 'ctext',
      span:6,
      name: 'LicensePlateNumber',
      disabled:true,
      text:TransInfo.LicensePlateNumber,
    },
    {
      label: '车牌号-车尾',
      type: 'ctext',
      span:6,
      name: 'CarNoEnd',
      disabled:true,
      text:TransInfo.CarNoEnd||'无',
    },
    {
      label: '驾驶员',
      type: 'ctext',
      span:6,
      name: 'DriverName',
      disabled:true,
      text:TransInfo.DriverName,
    },
    {
      label: '联系电话',
      type: 'ctext',
      span:6,
      name: 'DriverTel',
      disabled:true,
      text:TransInfo.DriverTel,
    },
  ];
  const goodformfields=[
    {
      label:'货物名称',
      type:'ctext',
      span:18,
      name: 'GoodsSummary',
      disabled:true,
      formItemLayout:{
        labelCol: { span: 2},
        wrapperCol: { span:18 }
      },
      text:TransInfo.GoodsSummary?TransInfo.GoodsSummary:'',
    },
    {label:'',type:'space',span:6,name:'ssdds1'},
    {
      label:'件数',
      type:'ctext',
      span:6,
      name: 'PiecesNumber',
      disabled:true,
      text:TransInfo.PiecesNumber?TransInfo.PiecesNumber+' 件 ':'',
    },
    {
      label:'重量',
      type:'ctext',
      span:6,
      name: 'Weight',
      disabled:true,
      text:TransInfo.Weight?TransInfo.Weight+' 吨 ':'',
    },
    {
      label:'体积',
      type:'ctext',
      span:6,
      name: 'Volume',
      disabled:true,
      text:TransInfo.Volume?TransInfo.Volume+' 方 ':'',
    },
    {label:'',type:'space',span:6,name:'spanasdds1'},
    {
      label:'备注',
      type:'ctext',
      span:6,
      name: 'Remark',
      disabled:true,
      text:TransInfo.Remark?TransInfo.Remark:'',
    },
  ];
//卸货信息
  const DischargeImg1=ConsignTruckArrivalModel&&ConsignTruckArrivalModel.ConsignTruckArrivalPictureList?
    ConsignTruckArrivalModel.ConsignTruckArrivalPictureList.length>0?ConsignTruckArrivalModel.ConsignTruckArrivalPictureList[0].PicturePath
      :'':'';
  const DischargeImg2=ConsignTruckArrivalModel&&ConsignTruckArrivalModel.ConsignTruckArrivalPictureList?
      ConsignTruckArrivalModel.ConsignTruckArrivalPictureList.length>1?ConsignTruckArrivalModel.ConsignTruckArrivalPictureList[1].PicturePath
      :'':'';
  const arriveSet=[
    {
      label:'到站时间',
      type:'ctext',
      span:6,
      name: 'ArrivalTime',
      disabled:true,
      text:ConsignTruckArrivalModel?ConsignTruckArrivalModel.ArrivalTime:'',
    },
    {
      label:'卸货时间',
      type:'ctext',
      span:6,
      name: 'DischargingTime',
      disabled:true,
      text:ConsignTruckArrivalModel?ConsignTruckArrivalModel.DischargingTime:'',
    },
    {
      label:'备注',
      type:'ctext',
      span:6,
      name: 'ArrivalRemark',
      disabled:true,
      text:ConsignTruckArrivalModel?ConsignTruckArrivalModel.ArrivalRemark:'',
    },
    {label:'',type:'space',span:6,name:'spans123'},
    {
      label:'单据图片',
      type:'ctext',
      span:6,
      name: 'ConsignTruckArrivalPicture',
      disabled:true,
    },
    {label:'',type:'space',span:18,name:'spans33123'},
    {
      type: 'image',
      span:8,
      name: 'ConsignTruckArrivalPicture1',
      disabled:true,
      url:DischargeImg1,
      options:{
        click:()=>{
          let url=DischargeImg1;
          dispatch({type:'login/ImgModalHide'});
          dispatch({type:'login/ImgUrl',url});
        }
      }
    },
    {
      type: 'image',
      span:8,
      name: 'ConsignTruckArrivalPicture2',
      disabled:true,
      url:DischargeImg2,
      options:{
        click:()=>{
          let url=DischargeImg2;
          dispatch({type:'login/ImgModalHide'});
          dispatch({type:'login/ImgUrl',url});
        }
      }
    }
  ];
  function ShowMoreDetail(){
    dispatch({type:'transstowage/getgoodsdetail',
      truckId:TransInfo.ConsignTruckId,
      loadingBatchId:ConsignmentLoadingBatchModel.LoadingBatchId
    })
  }
  function onCancelDetail() {
    dispatch({type:'transstowage/closemoredetailmodel'})
  }
  let formitem = [
    {fields:carformfields,ColumnText:'车辆信息',linestyle:'bigline',leftstyle:'leftarque'},
    {fields:goodformfields,ColumnText:'货物信息',leftstyle:'leftarque',showMore:true,MoreDetailClick:(e)=>ShowMoreDetail()},
    ];
  let arriveTitle = [{fields:arriveSet,ColumnText:'卸货信息',linestyle:'smallline',leftstyle:'leftarque'}];
  const arriveInfo=(
    <ColumnForm editable={false}
                dataSource={tData} formitems={arriveTitle} colums=''
                layout='three'
                moreButton={false}
                noBtn={true}
                pagination={false}
    />
  )
  const leftLabel=15; const rightLabel=8;
  return (
    <div className={styles.contentBox}>
      <Button type='primary' className={styles.buttonTop} onClick={goback}>返回</Button>
      <ColumnForm editable={false}
                  dataSource={tData} formitems={formitem} colums=''
                  layout='three'
                  moreButton={false}
                  noBtn={true}
                  pagination={false}
      />
      <div style={{marginTop:'40px'}}>{TruckStatus===2?arriveInfo:''}</div>
      <Modal
        key="Detail"
        visible={modalShowDetail}
        title="货物来源信息"
        onCancel={onCancelDetail}
        onOk={onCancelDetail}
        okText="确定"
        layout={'inline'}
        width={1000}
        maskClosable={false}
      >
        <div  className={styles.STOdetailBox} >
        {consignmentLists.map((list,index)=>
          <div style={{padding:'10px 20px 10px 20px',fontSize:'14px'}}>
            <Row className={styles.rowStyle}>
              <div className={styles.numberBtn}>{index+1}</div>
              <Col span={leftLabel}>
                运单号 : {list.SysCode}
              </Col>
              <Col span={rightLabel}>
                状态 : {list.TransportStatus===2?'运输中':list.TransportStatus===3?'已到站':list.TransportStatus===4?'已签收':''}
              </Col>
            </Row>
            <div className={styles.devideline}></div>
            <Row className={styles.rowStyle}>
              <Col span={leftLabel}>
                客户单号 : {list.CustomerNumber}
              </Col>
              <Col span={rightLabel}></Col>
            </Row>
            <Row className={styles.rowStyle}>
              <Col span={leftLabel}>
                起始地 : {list.StartingAddress}
              </Col>
              <Col span={rightLabel}>
                到达地 : {list.DestinationAddress }
              </Col>
            </Row>
            <Row className={styles.rowStyle}>
              <Col span={leftLabel}>
                发货单位 : {list.ConsignmentShipperModel.CompanyName}
              </Col>
              <Col span={rightLabel}>
                发货电话 : {list.ConsignmentShipperModel.ShipperTel }
              </Col>
            </Row>
            <Row className={styles.rowStyle}>
              <Col span={leftLabel}>
                收货单位 : {list.ConsignmentReceivingModel.CompanyName}
              </Col>
              <Col span={rightLabel}>
                收货电话 : {list.ConsignmentReceivingModel.ReceivingTel}
              </Col>
            </Row>
            <Row className={styles.rowStyle}>
              <Col span={leftLabel}>
                货物信息 : {list.ConsignGoodsModelList[0].GoodsName}
              </Col>
              <Col span={rightLabel}>
                {list.ConsignGoodsModelList[0].PiecesNumber+' 件　|　'+list.ConsignGoodsModelList[0].Weight+' 吨　|　'+list.ConsignGoodsModelList[0].Volume+' 方'}
              </Col>
            </Row>
            <Row className={styles.rowStyle}>
              <Col span={leftLabel}>
                收货地址 : {list.ConsignmentReceivingModel.ReceivingAddress}
              </Col>
              <Col span={rightLabel}>
              </Col>
            </Row>
          </div>
        )}
        </div>
      </Modal>
    </div>
  );
}
function mapStateToProps(state) {
  return {...state.transstowage,...state.login,...state.common};
}

export default connect(mapStateToProps)(TransStowageDetail);
