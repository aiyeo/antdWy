import React from 'react';
import { connect } from 'dva';
import { Button,Row,Col,Modal,Tooltip,Icon,message} from 'antd';
import {Link} from 'dva/router';
import {FormModal} from '../../components/modalForm';
import Table from '../../components/table';
import styles from './MyConsignment.less';
import SearchBar from '../../components/searchbar';
import {RQHEADER} from '../../utils/config';
import {formatDate,formatDateTime} from '../../utils/fun_config'

function TransStowage({dispatch,tData,item,loading,modalShow,keyNum,total,pruBtnList,pageIndex,startTime,endTime, endAddress, startAddress,
                        driverName,status,licensePlateNumber,ConsignTruckArrivalPictureList}) {
  const tableHeader =()=> {
    return [
      {
        title: '车牌号',
        dataIndex: 'LicensePlateNumber',
        key: 'LicensePlateNumber',
      },
      {
        title: '车牌号-车尾',
        dataIndex: 'CarNoEnd',
        key: 'CarNoEnd',
        render:(text)=>{
          return (<div>{text?text:'/'}</div>)
        }
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
        title: '驾驶员',
        dataIndex: 'DriverName',
        key: 'DriverName',
      },
      {
        title: '联系电话',
        dataIndex: 'DriverTel',
        key: 'DriverTel',
      },
      {
        title: '货物信息',
        dataIndex: 'GoodsSummary',
        key: 'GoodsSummary',
        render:(text,record)=>{
          return (<div style={{maxWidth:'200px',overflow: 'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{record.GoodsSummary||''}</div>)
        }
      },
      {
        title: '装车时间',
        dataIndex: 'LoadingTime',
        key: 'LoadingTime',
      },
      {
        title: '承运批次',
        dataIndex: 'LoadingBatch',
        key: 'LoadingBatch',
        render:(text,record)=>{
          return (<div>{record.ConsignmentLoadingBatchModel?record.ConsignmentLoadingBatchModel.LoadingBatch:''}</div>)
        }
      },
      {
        title: '状态',
        dataIndex: 'TruckStatus',
        key: 'TruckStatus',
        render:(text,record)=>{
          if(record.TruckStatus===1){
            return (<div style={{color:'#1c78e7'}}>运输中</div>)
          }else if(record.TruckStatus===2){
            return (<div style={{color:'#19ff4a'}}>已到站</div>)
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
                    return (<Tooltip title={item.name}><Link to={{pathname:"TransStowageDetail/"+record.ConsignTruckId}}  className={styles.icon}>
                      <Icon type={item.icon} className={styles.greencolor}/></Link></Tooltip>)
                  }
                  if(item.icon=="check-circle"&&record.TruckStatus===1){
                    return (<Tooltip title={item.name} onClick={()=>{Arrive(record)}}>
                      <a className={styles.icon}><Icon type={item.icon}/></a></Tooltip>)
                  }
                })
              }
            </div>
          )
        }
      }
    ]
  };
  //打开到站模态框
  function Arrive(item) {
    dispatch({
      type:'common/keynum'
    })
    dispatch({
      type:'transstowage/showarrivemodel',
      item
    });
  }
  function onOkArrive(param){
    param.ConsignTruckId=item.ConsignTruckId;
    param.ArrivalTime=formatDateTime(param.ArrivalTime._d)+':00';
    param.DischargingTime=formatDateTime(param.DischargingTime._d)+':00';
    param.ArrivalRemark=param.ArrivalRemark||'';
    param.ConsignTruckArrivalPictureList=ConsignTruckArrivalPictureList;
    dispatch({
      type:'transstowage/Arrive',
      param,
      pageIndex
    });
  }
  //关闭到站模态框
  function onCancelArrive(){
    dispatch({ type:'transstowage/closearrivemodel'})
  };
  const Arrivefields=[
    {
      label: '到站时间',
      type: 'datetime',
      name: 'ArrivalTime',
      formate:"YYYY/MM/DD HH:mm:ss",
      options: {
        rules: [{
          required: true,
          message: '请选择到站时间!',
        }]
      }
    },
    {
      label: '卸货时间',
      type: 'datetime',
      name: 'DischargingTime',
      formate:"YYYY/MM/DD HH:mm:ss",
      options: {
        rules: [{
          required: true,
          message: '请选择卸货时间!',
        }]
      }
    },
    {
      label: '备注',
      type: 'input',
      name: 'ArrivalRemark',
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
      label: '上传到站凭证',
      type: 'uploadNumImage',
      name: 'ConsignTruckArrivalPictureList',
      action:`${RQHEADER}/consigntruck/saveimage`,
      headers:{'Authorization': 'token '+sessionStorage.access_token},
      beforeUpload:beforeUpload,
      onChange:changeUploadarrive,
      imgNum:2,
      fileList:ConsignTruckArrivalPictureList,
      options: {
        rules: [{
          required: false,
        }]
      }
    },
  ];
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
  };
  //上传第一张回单凭证
  function changeUploadarrive(info) {
    let {file} = info;
    let fileList = ConsignTruckArrivalPictureList;
    if(file.status=="done" ) {
      if (file.response.Success) {
        fileList.push({DisplayOrder:1,Remark:file.name,PicturePath:file.response.Message});
        dispatch({
          type: 'transstowage/saveArriveimage',
          fileList
        })
      } else {
        message.error(file.response.Message)
      }
    }else if(file.status=='removed'){
      if(file.response.Success){

        let removelist=fileList.filter(item=>item.uid!=file.uid);
        dispatch({
          type:'transstowage/deleteArriveimage',
          removelist
        })
      }
    }
  }
  function addPage(page, filters, sorter){
    dispatch({type:'transstowage/search',
      page,
      startTime,
      endTime,
      endAddress,
      startAddress,
      driverName,status,licensePlateNumber
    })
    dispatch({type:'transstowage/getPageNum',page})
  };
  const statusSelect = [
    {
      value:1,
      mean:'运输中'
    },
    {
      value:2,
      mean:'已到站'
    },
  ]
  const searchFields1 =  [
    {
      title:'运输状态',
      key:'status',
      type:'select',
      items: () => statusSelect.map(ele => ({
        mean: ele.mean,
        value: ele.value
      })),
    },
    {
      title:'车牌号',
      key:'licensePlateNumber',
      type:'input'
    },
    {
      title:'驾驶员',
      key:'driverName',
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
    {
      title: '托运日期',
      key: ['startTime', 'endTime'],
      type: 'rangePicker',
      width:'200px'
    },
  ];
  const searchFileds = [{fields:searchFields1,visible:'visible'}];
  //点击搜索按钮
  function onSearch(searchFields){
    if(searchFields.length<1){
      addPage(1);
    }
    dispatch({type:'transstowage/search',searchFields})
  }

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
              data={tData}
              total={total}
              pageSize = {15}
              loading={loading }
              defaultExpandAllRows={ true }
              onChange={addPage}
              currentPage={pageIndex}
            />
            <FormModal modalKey={keyNum}
                       visible={modalShow}
                       title="确认到站"
                       fields={Arrivefields}
                       onOk={onOkArrive}
                       onCancel={onCancelArrive}
                       okText="保存"
            />
          </Col>
        </Row>
      </div>
    </div>

  );
}

function mapStateToProps(state) {
  return {...state.transstowage,...state.login,...state.common};
}

export default connect(mapStateToProps)(TransStowage);
