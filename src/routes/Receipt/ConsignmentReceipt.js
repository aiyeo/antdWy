import React from 'react';
import { connect } from 'dva';
import { Button,Row,Col,Modal,Tooltip,Icon} from 'antd';
import {Link} from 'dva/router';
import {FormModal} from '../../components/modalForm';
import Table from '../../components/table';
import styles from './Receipt.css';
import SearchBar from '../../components/searchbar';

function ConsignmentReceipt({dispatch,tData,loading,modalShow,modalShowEdit,total,item,pruBtnList,pageIndex,startTime, endTime, syscode,
                              shipperCompanyName, receiverCompanyName,receiptStatus,transportStatus,customerNumber}) {
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
        title: '上交时间',
        dataIndex: 'ReceiptTime',
        key: 'HandInTime',
        render:(text,item)=>{
          return (<div>{item.ConsignReceiptModel?(item.ConsignReceiptModel.HandInTime?item.ConsignReceiptModel.HandInTime:'/'):'/'}</div>)
        }
      },
      {
        title: '状态',
        dataIndex: 'ReceiptStatus',
        key: 'ReceiptStatus',
        render:(text,item)=>{
          if(item.ReceiptStatus==1){
            return (<div style={{color:'red'}}>未回单</div>)
          }else if(item.ReceiptStatus==2){
            return (<div style={{color:'orange'}}>已回单</div>)
          }else{
            return (<div style={{color:'green'}}>已上交</div>)
          }
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
                  if(item.icon=="rollback"&&record.ReceiptStatus?record.ReceiptStatus==1:false){
                    return (<Tooltip title={item.name} onClick={()=>{Receipt(record)}}>
                      <a className={styles.icon}><Icon type={item.icon}/></a></Tooltip>)
                  }
                  if(item.icon=="to-top"&&record.ReceiptStatus?record.ReceiptStatus==2:false){
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
  function addPage(page, filters, sorter){
    dispatch({type:'consignmentreceipt/search',
      page,
      startTime,
      endTime,
      syscode,
      customerNumber,
      shipperCompanyName,
      receiverCompanyName,receiptStatus,transportStatus
    })
    dispatch({type:'consignmentreceipt/getPageNum',page})
  };
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
      title:'收货单位',
      key:'receiverCompanyName',
      type:'input'
    },{
      title:'发货单位',
      key:'shipperCompanyName',
      type:'input'
    }
  ];
  const searchFileds = [{fields:searchFields1,visible:'visible'}];
  //点击搜索按钮
  function onSearch(searchFields){
    if(searchFields.length<1){
      addPage(1);
    }
    dispatch({type:'consignmentreceipt/search',searchFields})
  }
  const statusSelect = [
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
    },
  ]
  return (
    <div id = "wrap" >
      <SearchBar
        onSubmit={onSearch}
        searchFileds={searchFileds}
      />
      <div className = "tableBox" >
        <Row >
          <Col span={24}>
            <Table
              pagination={ true }
              header={tableHeader()}
              data={tData?tData:[]}
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
  return {...state.consignmentreceipt,...state.login,...state.common};
}

export default connect(mapStateToProps)(ConsignmentReceipt);
