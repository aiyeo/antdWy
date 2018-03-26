import React from 'react';
import { connect } from 'dva';
import { Button,Row,Col,Modal,Tooltip,Icon,message} from 'antd';
import {Link} from 'dva/router';
import {FormModal} from '../../components/modalForm';
import Table from '../../components/table';
import styles from './Receipt.css';
import {RQHEADER} from '../../utils/config';
import {formatDate,formatDateTime} from '../../utils/fun_config'
import SearchBar from '../../components/searchbar';

const confirm = Modal.confirm;
function CarrierReceipt({dispatch,tData,loading,modalShow,modalShowEdit,total,item,pruBtnList,AddSecondPhoto,AddFirstPhoto,HandInFirstPhoto,HandInSecondPhoto,keyNum,
                          pageIndex,startTime,endTime,syscode,shipperCompanyName,receiverCompanyName,receiptStatus,customerNumber,RoleId,transportStatus}) {
  const tableHeader =()=> {
    return [
      {
        title: '托运日期',
        dataIndex: 'CreateTime',
        key: 'CreateTime',
        render:(t)=>{
          return (<div>{t}</div>)
        }
      },
      {
        title: '托运单号',
        dataIndex: 'SysCode',
        key: 'SysCode',
      },
      {
        title: '客户单号',
        dataIndex: 'CustomerNumber',
        key: 'CustomerNumber',
      },
      {
        title: '起始地',
        dataIndex: 'StartingAddress',
        key: 'StartingAddress',
      },
      {
        title: '到达地',
        dataIndex: 'DestinationAddress',
        key: 'DestinationAddress',
      },
      {
        title: '发货单位',
        dataIndex: 'CompanyName',
        key: 'CompanyName',
        render:(text,item)=>{
          return (<div>{item.ConsignmentShipperModel.CompanyName}</div>)
        }
      },

      {
        title: '发货电话',
        dataIndex: 'ShipperTel',
        key: 'ShipperTel',
        render:(text,item)=>{
          return (<div>{item.ConsignmentShipperModel.ShipperTel}</div>)
        }
      },
      {
        title: '收货单位',
        dataIndex: 'ReciveCompanyName',
        key: 'ReciveCompanyName',
        render:(text,item)=>{
          return (<div>{item.ConsignmentReceivingModel.CompanyName}</div>)
        }
      },
      {
        title: '收货电话',
        dataIndex: 'ReceivingTel',
        key: 'ReceivingTel',
        render:(text,item)=>{
          return (<div>{item.ConsignmentReceivingModel.ReceivingTel}</div>)
        }
      },
      {
        title: '货物信息',
        dataIndex: 'ContentDesc',
        key: 'ContentDesc',
        render:(text,record)=>{
          return (<div style={{maxWidth:'200px',overflow: 'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{record.ContentDesc}</div>)
        }
      },
      {
        title: '回单时间',
        dataIndex: 'ReceiptTime',
        key: 'ReceiptTime',
        render:(text,item)=>{
          return (<div>{item.ConsignReceiptModel?item.ConsignReceiptModel.ReceiptTime:'/'}</div>)
        }
      },
      {
        title: '回单接收人',
        dataIndex: 'Recipienter',
        key: 'Recipienter',
        render:(text,item)=>{
          return (<div>{item.ConsignReceiptModel?item.ConsignReceiptModel.Recipienter:''}</div>)
        }
      },
      {
        title: '上交时间',
        dataIndex: 'HandInTime',
        key: 'HandInTime',
        render:(text,item)=>{
          return (<div>{item.ConsignReceiptModel?(item.ConsignReceiptModel.HandInTime?(item.ConsignReceiptModel.HandInTime==='0001-01-01 00:00:00'?'':item.ConsignReceiptModel.HandInTime):''):''}</div>)
        }
      },
      {
        title: '回单状态',
        dataIndex: 'ReceiptStatus',
        key: 'ReceiptStatus',
        render:(text,item)=>{
          return (<div>{item.ReceiptStatus?(item.ReceiptStatus===3?<span style={{color:'green'}}>已上交</span>:
            (item.ReceiptStatus===2?<span style={{color:'orange'}}>已回单</span>:(item.ReceiptStatus===1?<span style={{color:'red'}}>未回单</span>:''))):''}
          </div>)
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render:(text,record) =>{
          return (
            <div>
              {
                pruBtnList.map(item=>{
                  if(item.icon=="eye-o"){
                    return (<Tooltip title={item.name}><Link to={{pathname:"carrierreceiptdetail/"+record.ConsignmentId}}  className={styles.icon}>
                      <Icon type={item.icon} className={styles.greencolor}/></Link></Tooltip>)
                  }
                  if(item.icon=="rollback"&&record.ReceiptStatus?record.ReceiptStatus===1:false){
                    return (<Tooltip title={item.name} onClick={()=>{Receipt(record)}}>
                      <a className={styles.icon}><Icon type={item.icon}/></a></Tooltip>)
                  }
                  if(item.icon=="to-top"&&record.ConsignReceiptModel?record.ReceiptStatus===2:false){
                    return (<Tooltip title={item.name} onClick={()=>{Handin(record)}}>
                      <a className={styles.icon}><Icon type={item.icon} /></a></Tooltip>)
                  }
                })
              }
            </div>
          )
        }
      }
    ]
  };
  //回单回收模态框
  function Receipt(item) {
    dispatch({
      type:'common/keynum'
    })
    dispatch({
      type:'carrierreceipt/showretrievemodel',
      item
    });
  }
  //回单上交模态框
  function Handin(item) {
    dispatch({
      type:'common/keynum'
    })
    dispatch({
      type:'carrierreceipt/showhandinmodel',
      item
    });
  }
  //上传图片前事件
  function beforeUpload(file) {
    if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/bmp') {
      message.error('只能上传jpg,jpeg,png或bmp格式的图片!');
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片大小不能超过5MB!');
    }
    return  isLt5M;
  }
  //上传回单凭证
  function changeUploadreceipt(info) {
    let {file} = info;
    let fileList = AddFirstPhoto;
    if(file.status=="done" ) {
      if (file.response.Success) {
        fileList.push({DisplayOrder:1,Remark:file.name,PicturePath:file.response.Message});
        dispatch({
          type: 'carrierreceipt/saveReceiptimage',
          fileList
        })
      } else {
        message.error(file.response.Message)
      }
    }else if(file.status=='removed'){
      if(file.response.Success){

        let removelist=fileList.filter(item=>item.uid!=file.uid);
        dispatch({
          type:'carrierreceipt/deleteReceiptimage',
          removelist
        })
      }
    }
  }
  //上传上交凭证
  function changeUploadhandin(info) {
    let {file} = info;
    let fileList = HandInFirstPhoto;
    if(file.status=="done" ) {
      if (file.response.Success) {
        fileList.push({DisplayOrder:1,Remark:file.name,PicturePath:file.response.Message});
        dispatch({
          type: 'carrierreceipt/saveHandinimage',
          fileList
        })
      } else {
        message.error(file.response.Message)
      }
    }else if(file.status=='removed'){
      if(file.response.Success){

        let removelist=fileList.filter(item=>item.uid!=file.uid);
        dispatch({
          type:'carrierreceipt/deleteHandinimage',
          removelist
        })
      }
    }
  }
  const  retrievefields = [
    {
      label: '托运单号',
      name: 'SysCode',
      options: {
        initialValue:item.SysCode,
      }
    },{
      label: '承运方',
      name: 'ReceiptCompanyName',
      options: {
        initialValue:item.ConsignmentCarrierModel?item.ConsignmentCarrierModel.CompanyName:'',
      }
    },{
      label: '回单时间',
      type: 'datetime',
      name: 'ReceiptTime',
      formate:"YYYY/MM/DD HH:mm:ss",
      options: {
        rules: [{
          required: true,
          message: '请选择回单时间!',
        }]
      }
    },
    {
      label: '回单接收人',
      type: 'input',
      name: 'Recipienter',
      options: {
        rules: [{
          required: true,
          message: '请填写回单接收人!',
        },{
          max:20,
          message:'请不要超过20个字符'
        },{
          min:2,
          message:'请不要少于2个字符'
        }]
      }
    },
    {
      label: '备注',
      type: 'textarea',
      name: 'Remark',
      options: {
        rules: [{
          required: false,
        },{
          max:40,
          message:'请不要超过40个字符'
        }]
      }
    },
    {
      label: '上传回执单据',
      type: 'uploadNumImage',
      name: 'AddFirstPhoto',
      action:`${RQHEADER}/receipt/saveimage`,
      headers:{'Authorization': 'token '+sessionStorage.access_token},
      beforeUpload:beforeUpload,
      onChange:changeUploadreceipt,
      imgNum:2,
      fileList:AddFirstPhoto,
      options: {
        rules: [{
          required: false,
        }]
      }
    },
  ];
  const  handinfields = [
    {
      label: '托运单号',
      name: 'SysCode',
      options: {
        initialValue:item.SysCode,
      }
    },
    {
      label: '承运方',
      name: 'ReceiptCompanyName',
      options: {
        initialValue:item.ConsignmentCarrierModel?item.ConsignmentCarrierModel.CompanyName:'',
      }
    },
    {
      label: '上交人',
      type: 'input',
      name: 'HandInPersion',
      options: {
        rules: [{
          required: true,
          message: '请填写回单上交人!',
        }]
      }
    },{
      label: '上交时间',
      type: 'datetime',
      name: 'HandInTime',
      formate:"YYYY/MM/DD HH:mm:ss",
      options: {
        rules: [{
          required: true,
          message: '请选择回单上交时间!',
        }]
      }
    },
    {
      label: '备注',
      type: 'textarea',
      name: 'HandInRemark',
      options: {
        initialValue: item.ConsignReceiptModel?item.ConsignReceiptModel.HandInRemark:'',
        rules: [{
          required: false,
        }]
      }
    },
    {
      label: '上传回执单据',
      type: 'uploadNumImage',
      name: 'HandInFirstPhoto',
      action:`${RQHEADER}/receipt/saveimage`,
      headers:{'Authorization': 'token '+sessionStorage.access_token},
      beforeUpload:beforeUpload,
      onChange:changeUploadhandin,
      imgNum:2,
      fileList:HandInFirstPhoto,
      options: {
        rules: [{
          required: false,
        }]
      }
    },
  ];
  //回收回单
  function onOk(param){
    param.ConsignmentId=item.ConsignmentId;
    param.Remark=param.Remark||'';
    param.ConsignPictureAddModelList=AddFirstPhoto;
    param.ReceiptTime=formatDateTime(param.ReceiptTime._d)+':00';
    delete param.AddFirstPhoto;delete param.SysCode;
    dispatch({
      type:'carrierreceipt/addreceipt',
      param,
      pageIndex
    });
  }
  //关闭回收弹出框
  function onCancel(){
    dispatch({ type:'carrierreceipt/closeretrievemodel'})
  }
  //关闭上交弹出框
  function onCancelHandin(){
    dispatch({ type:'carrierreceipt/closehandinmodel'})
  }
  //保存修改
  function onOkHandin(param){
    param.ConsignmentId=item.ConsignmentId;
    param.HandInRemark=param.HandInRemark||'';
    param.ConsignPictureAddModelList=HandInFirstPhoto;
    param.HandInTime=formatDateTime(param.HandInTime._d)+':00';
    delete param.HandInFirstPhoto;delete param.SysCode;delete param.ReceiptCompanyName;
    dispatch({
      type:'carrierreceipt/addhandin',
      param,
      pageIndex
    });

  }
  function addPage(page, filters, sorter){
    dispatch({
      type:'carrierreceipt/search',
      page,
      startTime,
      endTime,
      syscode,
      customerNumber,
      shipperCompanyName,
      receiverCompanyName,
      transportStatus,
      receiptStatus
    })
    dispatch({
      type:'carrierreceipt/updatePage',
      page
    })
  };
  const statusSelect = [
    {
      value:0,
      mean:'全部'
    },
    {
      value:1,
      mean:'未回单'
    },
    {
      value:2,
      mean:'已回单'
    },
    {
      value:3,
      mean:'已上交'
    }
  ]
  const searchFields1 =  [
    {
      title:'回单状态',
      key:'receiptStatus',
      type:'select',
      items: () => statusSelect.map(ele => ({
        mean: ele.mean,
        value: ele.value
      })),
    },
    {
      title: '托运日期',
      key: ['startTime', 'endTime'],
      type: 'rangePicker',
      width:'200px'
    },
    {
      title:'托运单号',
      key:'syscode',
      type:'input'
    },
    {
      title:'客户单号',
      key:'customerNumber',
      type:'input'
    },
    {
      title:'发货单位',
      key:'shipperCompanyName',
      type:'input'
    },
    {
      title:'收货单位',
      key:'receiverCompanyName',
      type:'input'
    }
  ];
  const searchFileds = [{fields:searchFields1,visible:'visible'}];
  //点击搜索按钮
  function onSearch(searchFields){
    if(searchFields.length<1){
      addPage(pageIndex);
    }
    dispatch({type:'carrierreceipt/search',searchFields})
  }
  return (
    <div id = "wrap" >
      <SearchBar
        onSubmit={onSearch}
        searchFileds={searchFileds}
      />
      <div className = "tableBox" >
        <Row>
          <Col span={24}>
            <FormModal modalKey={keyNum}
                       visible={modalShow}
                       title="回单收回"
                       fields={retrievefields}
                       onOk={onOk}
                       onCancel={onCancel}
                       okText="保存"
                       layout={'inline'}
                       width={1000}
            />
            <FormModal modalKey={keyNum}
                       visible={modalShowEdit}
                       title="回单上交"
                       fields={handinfields}
                       onOk={onOkHandin}
                       onCancel={onCancelHandin}
                       okText="保存"
                       layout={'inline'}
                       width={1000}
            />
            <Table
              pagination={ true }
              header={tableHeader()}
              data={tData}
              total={total}
              pageSize = {15}
              loading={loading }
              defaultExpandAllRows={ true }
              onChange={addPage}
              currentPage={pageIndex}
            />
          </Col>
        </Row>
      </div>
    </div>

  );
}

function mapStateToProps(state) {
  return {...state.carrierreceipt,...state.login,...state.common};
}

export default connect(mapStateToProps)(CarrierReceipt);
