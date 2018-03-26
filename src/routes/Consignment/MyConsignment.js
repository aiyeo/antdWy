import React from 'react';
import { connect } from 'dva';
import {routerRedux} from 'dva/router';
import styles from './MyConsignment.less';
import SearchBar from '../../components/searchbar';
import Table from '../../components/table';
import {Button,Tooltip,Icon,Modal} from 'antd';
import {RQHEADER} from '../../utils/config';
import {formatDate} from '../../utils/fun_config';
import Moment from 'moment';

const confirm = Modal.confirm;
function MyConsignment({dispatch,myCosignList,loadingTable,totalConsign,pageIndex,startTime,endTime,syscode,customerNumber,shipperCompanyName,receiverCompanyName,startAddress,endAddress,
                         acceptanceStatus,assignStatus,transportStatus,receiptStatus
                       }) {

  //点击搜索按钮--搜索托运单列表
  function onSearch(searchFields){
    if(searchFields.length<1){
      getListpage(pageIndex);
    }
    dispatch({type:'myconsignment/search',searchFields})
  }
  //点击添加按钮
  function add(){
    dispatch(routerRedux.push( '/addConsignment/1'));
  }
  //筛选操作按钮
  function selectBtn(AcceptanceStatus){
    let rowaction = [];
    if(AcceptanceStatus == 1 || AcceptanceStatus == 4){//待提交和被拒的 可以修修改和删除按钮
      rowaction = [{
        key: 'edit',
        name: '修改',
        color: 'blue',
        icon: 'edit',
      }, {
        key: 'delete',
        name: '删除',
        color: 'red',
        icon: 'delete'
      },{
        key:'scan',
        name:'查看',
        color:'#108EE9',
        icon:'eye'
      }
      ];
    }else{
      rowaction = [{
        key:'scan',
        name:'查看',
        color:'#108EE9',
        icon:'eye'
      }
      ];
    }
    return rowaction;
  }
  //表格操作
  function tableAction(actionKey,item,index){
    let {ConsignmentId,Status} = item;//运单id
    if(actionKey=='edit'){
      dispatch(routerRedux.push(`/addConsignment/${ConsignmentId}`));
    }else if( actionKey == 'scan'){//查看
      dispatch(routerRedux.push(`/ConsignmentDetail/${ConsignmentId}`));
    }else if(actionKey == 'delete'){
      confirm({
        title: '提示',
        content: '确定删除这条托运单吗',
        onOk: () => {
          //调用接口删除数据
          dispatch({
            type:'myconsignment/deletCosignment',
            id:ConsignmentId
          })
        },
        onCancel() {}
      })
    }
  }
  //分页获取列表数据
  function getListpage(page){
    dispatch({type:'myconsignment/search',page,startTime,endTime,syscode,customerNumber,shipperCompanyName,receiverCompanyName,startAddress,endAddress,acceptanceStatus,assignStatus,transportStatus,receiptStatus});
    dispatch({
      type:'myconsignment/updatePage',
      page
    })
  }
  const tableHeader =[
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
      key: 'StartingAddress'
    },
    {
      title: '到达地',
      dataIndex: 'DestinationAddress',
      key: 'DestinationAddress'
    },
    {
      title: '收货单位',
      dataIndex: 'ReceiveCompanyName',
      key: 'ReceiveCompanyName'
    },
    {
      title: '收货电话',
      dataIndex: 'ReceivingTel',
      key: 'ReceivingTel'
    },
    {
      title: '发货单位',
      dataIndex: 'shipperCompanyName',
      key: 'shipperCompanyName'
    },
    {
      title: '发货电话',
      dataIndex: 'ShipperTel',
      key: 'ShipperTel'
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
      title: '受理状态',
      dataIndex: 'AcceptanceStatus',
      key: 'AcceptanceStatus',
      render:(text,record,index)=>{
        let t = text;
        if(t==1){
          t='待提交';
          return (<div><span style={{color:'#595959'}}>{t}</span></div>)
        }else if(t==2){
          t='待受理';
          return (<div><span style={{color:'#e67e22'}}>{t}</span></div>)
        }else if(t==3){
          t='已受理';
          return (<div><span style={{color:'#2ecc71'}}>{t}</span></div>)
        }else if(t==4){
          t='被拒绝';
          return (<div><span style={{color:'#e74c3c'}}>{t}</span></div>)
        }
      }
    },
    {
      title: '运输状态',
      dataIndex: 'TransportStatus',
      key: 'TransportStatus',
      render:(text,record,index)=>{
        let t = text;
        if(t==1){
          t='未装车';
          return (<div><span style={{color:'#595959'}}>{t}</span></div>)
        }else if(t==2){
          t='运输中';
          return (<div><span style={{color:'#e67e22'}}>{t}</span></div>)
        }else if(t==3){
          t='已到站';
          return (<div><span style={{color:'#1383cc'}}>{t}</span></div>)
        }else if(t==4){
          t='已签收';
          return (<div><span style={{color:'#2ecc71'}}>{t}</span></div>)
        }
      }
    },
    {
      key: 'x',
      title: '操作',
      dataIndex:'x',
      render: (text,record,index) => {
        const actions =selectBtn(record.AcceptanceStatus,record.AssignStatus);
        if (!actions) {
          return <div />;
        }
        const buttons = actions.map(({ color, name, key, icon, hidden,}) => {

          return (<Tooltip title={ name }><a
            key={key}
            onClick={(e) => {
              e.preventDefault();
              tableAction(key, record,index);

            }}
            style={{
              color,
              marginRight: 12,
              display: hidden ? 'none' : 'inline-block',
              fontSize: 14,
            }}
          ><Icon type={ icon } /></a></Tooltip>)
        });
        return (<div>
          {buttons}
        </div>);
      },
    },

  ];
  const searchFields1 =  [
    {
      title:'受理状态',
      key:'acceptanceStatus',
      type:'select',
      items: () => statusSelect1.map(ele => ({
        mean: ele.mean,
        value: ele.value
      })),
    },
    {
      title:'运输状态',
      key:'transportStatus',
      type:'select',
      items: () => statusSelect3.map(ele => ({
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
      title:'起始地',
      key:'startAddress',
      type:'input'
    },
    {
      title:'到达地',
      key:'endAddress',
      type:'input'
    },
  ];
  const searchFields2 =  [
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
  const searchFileds = [{fields:searchFields1,visible:'visible'},{fields:searchFields2,visible:'hidden'}];
  const statusSelect1 = [
    {
      value:1,
      mean:'待提交'
    },
    {
      value:2,
      mean:'待受理'
    },
    {
      value:3,
      mean:'已受理'
    },
    {
      value:4,
      mean:'被拒绝'
    }
  ];
  const statusSelect3 = [
    {
      value:1,
      mean:'未装车'
    },
    {
      value:2,
      mean:'运输中'
    },
    {
      value:3,
      mean:'已到站'
    },
    {
      value:4,
      mean:'已签收'
    }
  ];
  function Export() {
    window.open(RQHEADER+'/consignment/export?token='+sessionStorage.access_token+'&pageIndex='+pageIndex+'&acceptanceStatus='+acceptanceStatus+'&assignStatus='+assignStatus+'&transportStatus='+transportStatus+'&receiptStatus='+receiptStatus+'&startTime='+startTime+'&endTime='+endTime+'&syscode='+syscode+'&shipperCompanyName='+shipperCompanyName+'&receiverCompanyName='+receiverCompanyName
      +'&startAddress='+startAddress+'&endAddress='+endAddress
    )
  }
  return (
    <div className={styles.normal}>
      <Button  className={styles.ExportBtn} onClick={Export}>导出</Button>
      <SearchBar
        onSubmit={onSearch}
        searchFileds={searchFileds}
        hasMore={true}
      />
      <div className ={styles.tableBox}>
        <Button type="primary" onClick={add} className={`${styles.addButton} ${styles.optionsBtnGroup}`}>添加托运单</Button>
      </div>
      <Table
        onCtrlClick={ tableAction }
        pagination={ true }
        header={tableHeader }
        data={myCosignList}
        defaultExpandAllRows={ true }
        loading={loadingTable}
        onChange={getListpage}
        pageSize={15}
        total={totalConsign}
        currentPage={pageIndex}
      />
    </div>
  );
}

function mapStateToProps(state) {
  return {...state.myconsignment,...state.login,...state.common};
}

export default connect(mapStateToProps)(MyConsignment);
