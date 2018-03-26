import React from 'react';
import { connect } from 'dva';
import styles from './MyConsignment.less';
import {Link} from 'dva/router';
import Table from '../../components/table';
import {FormModal} from '../../components/modalForm';
import SearchBar from '../../components/searchbar';
import {Button,Modal,Input,message,Tooltip,Icon} from 'antd';
import Moment from 'moment';
const confirm = Modal.confirm;

function Reconciliation({tData,total,loading,dispatch,pageIndex,startTime,customerNumber,endTime,syscode}) {
  const tableHeader= [
    {
      title: '托运日期',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
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
    },{
      title: '到达地',
      dataIndex: 'DestinationAddress',
      key: 'DestinationAddress'
    },{
      title: '发货单位',
      dataIndex: 'carrier',
      key: 'carrier',
      render:(text,record) =>{
        return (<div>{record.ConsignmentShipperModel!=null?record.ConsignmentShipperModel.CompanyName:''}</div>)
      }
    },{
      title: '发货电话',
      dataIndex: 'carnum',
      key: 'carnum',
      render:(text,record) =>{
        return (<div>{record.ConsignmentShipperModel!=null?record.ConsignmentShipperModel.ShipperTel:''}</div>)
      }
    },{
      title: '收货单位',
      dataIndex: 'recivecom',
      key: 'recivecom',
      render:(text,record) =>{
        return (<div>{record.ConsignmentReceivingModel!=null?record.ConsignmentReceivingModel.CompanyName:''}</div>)
      }
    },{
      title: '收货电话',
      dataIndex: 'recivephone',
      key: 'recivephone',
      render:(text,record) =>{
        return (<div>{record.ConsignmentReceivingModel!=null?record.ConsignmentReceivingModel.ReceivingTel:''}</div>)
      }
    },{
      title: '货物信息',
      dataIndex: 'ContentDesc',
      key: 'ContentDesc',
      render:(text,record)=>{
        return (<div style={{maxWidth:'200px',overflow: 'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{record.ContentDesc}</div>)
      }
    },{
      title: '运费(元)',
      dataIndex: 'Freight',
      key: 'Freight',
      render:(text,record) =>{
        return (<div>{record.ConsignmentDistPaymentModel!=null?record.ConsignmentDistPaymentModel.Freight:''}</div>)
      }
    },{
      title: '代收货款(元)',
      dataIndex: 'CollectPayment',
      key: 'CollectPayment',
      render:(text,record) =>{
        return (<div>{record.ConsignmentDistPaymentModel!=null?record.ConsignmentDistPaymentModel.CollectPayment:''}</div>)
      }
    },{
      title: '保险(元)',
      dataIndex: 'InsuranceAmount',
      key: 'InsuranceAmount',
      render:(text,record) =>{
        return (<div>{record.ConsignmentInsuranceModel!=null?record.ConsignmentInsuranceModel.InsuranceAmount:''}</div>)
      }
    },{
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render:(text, record) =>{
        return (
          <div>
            <Tooltip title="查看"><Link to={{pathname:"ReconciliationDetail/"+record.ConsignmentId}} className={styles.icon}><Icon type="eye-o" style={{color:'blue'}}/></Link></Tooltip>
          </div>
        )
      }
    }
  ];
  const searchFields1 =  [
    {
      title: '托运日期',
      key: ['startTime', 'endTime'],
      type: 'rangePicker',
      width:'200px',
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
  ];
  const searchFileds = [{fields:searchFields1,visible:'visible'}];

  //点击搜索按钮
  function onSearch(searchFields){
    dispatch({
      type:'reconciliation/updatePage',
      page:1
    });
    if(searchFields.length<1){
      addPage(pageIndex);
    }
    dispatch({type:'reconciliation/search',searchFields})

  }
  function addPage(page, filters, sorter){
    dispatch({
      type:'reconciliation/search',
      page,startTime,endTime,syscode,customerNumber
    })
    dispatch({
      type:'reconciliation/updatePage',
      page
    })
  };
  return (
    <div className={styles.normal}>
      <SearchBar
        onSubmit={onSearch}
        searchFileds={searchFileds}
      />
      <Table
        pagination={ true }
        header={tableHeader}
        data={tData?tData:[]}
        defaultExpandAllRows={ true }
        onChange={addPage}
        currentPage={pageIndex}
        total={total}
      />
    </div>
  );
}

function mapStateToProps(state) {
  return {...state.reconciliation};
}

export default connect(mapStateToProps)(Reconciliation);
