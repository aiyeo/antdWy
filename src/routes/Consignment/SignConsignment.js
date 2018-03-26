import React from 'react';
import { connect } from 'dva';
import styles from './MyConsignment.less';
import {Link} from 'dva/router';
import Table from '../../components/table';
import {FormModal} from '../../components/modalForm';
import SearchBar from '../../components/searchbar';
import {Button,Modal,Input,message,Tooltip,Icon} from 'antd';
import Moment from 'moment';
import {RQHEADER} from '../../utils/config'
const confirm = Modal.confirm;

function SignConsignment({tData,item,modalShow,modalShowEdit,dispatch,keyNum,batchAssignData,token,SignImageList
                           ,startTime,endTime,syscode,startAddress,endAddress,transportStatus,total,pageIndex,customerNumber}) {
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
      title: '要求到货时间',
      dataIndex: 'DateOfArrival',
      key: 'DateOfArrival',
      render:(text,record) =>{
        return (<div>{record.DateOfArrival?record.DateOfArrival:'/'}</div>)
      }
    },{
      title: '货物信息',
      dataIndex: 'ContentDesc',
      key: 'ContentDesc',
      render:(text,record)=>{
        return (<div style={{maxWidth:'200px',overflow: 'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{record.ContentDesc}</div>)
      }
    },{
      title: '运输状态',
      dataIndex: 'TransportStatus',
      key: 'TransportStatus',
      render:(text,record)=>{
        let t = record.TransportStatus;
        if(t===1){
          t='未装车';
          return (<div><span>{t}</span></div>)
        }else if(t===2){
          t='运输中';
          return (<div><span style={{color:'#e67e22'}}>{t}</span></div>)
        }else if(t===3){
          t='已到站';
          return (<div><span style={{color:'#1c78e7'}}>{t}</span></div>)
        }else if(t===4){
          t='已签收';
          return (<div><span style={{color:'#2ecc71'}}>{t}</span></div>)
        }
      }
    }
    ,{
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render:(text, record) =>{
        return (
          <div>
            {record.TransportStatus>=1?
              <Tooltip title="查看"><Link to={{pathname:"consignmentdetail/"+record.ConsignmentId}} className={styles.icon}><Icon type="eye-o" style={{color:'blue'}}/></Link></Tooltip>:null}
            {
              record.TransportStatus==3?(<span>
                      <Tooltip title="签收" onClick={()=>{showAssign(record)}} className={styles.assignButton}>
                      <a className={styles.icon}><Icon type="exception" style={{color:'#2ecc71'}}/></a></Tooltip>
                      </span>):''
            }
          </div>
        )
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
        ],
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
      label: '收货电话',
      name: 'SignPhone',
      type: 'input',
      options:{
        rules:[
          {
            pattern: /0?(13|14|15|18)[0-9]{9}/,
            message: '请输入正确的手机号码!',
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
            min:2,
            message: '请不要少于2个字符',
          },
          {
            max:20,
            message: '请不要超过20个字符',
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
      type: 'uploadNumImage',
      name: 'BusinesslicensePhoto',
      uploadUrl:'',
      action:RQHEADER+'/consignment/saveimage',
      headers:{'Authorization': 'token '+token},
      imgNum:2,
      onChange:uploadSignImage,
      fileList:SignImageList,
    }
  ];
  function uploadSignImage(info){
    let {file} = info;
    let fileList = SignImageList;
    if(file.status=="done" ){
      if(file.response.Success){
        fileList.push({uid:file.uid,status:file.status,name:file.name,url:file.response.Message});
        dispatch({
          type:'signconsignment/SetSignImage',
          fileList
        })
      }else{
        message.error(file.response.Message)
      }
    }else if(file.status=='removed'){
      if(file.response.Success){
        let removelist=fileList.filter(item=>item.uid!=file.uid);
        dispatch({
          type:'signconsignment/deletSignImage',
          removelist
        })
      }else{
        message.error(file.response.Message)
      }
    }
  }
  const statusSelect = [
    {
      value:0,
      mean:'全部'
    },
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
  ]
  const searchFields1 =  [
    {
      title:'运输状态',
      key:'transportStatus',
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
  const searchFileds = [{fields:searchFields1,visible:'visible'}];

  //点击搜索按钮
  function onSearch(searchFields){
    if(searchFields.length<1){
      addPage(1);
    }
    dispatch({type:'signconsignment/search',searchFields})
  }
  //点击列表指派
  function showAssign(record){
    let Data = record;
    dispatch({type:'signconsignment/showAssign'});
    dispatch({type:'signconsignment/getSingleData',Data})
  }
  //关闭指派弹框
  function handleCancel(){
    dispatch({type:'signconsignment/closeAssign'})
  }
  //签收
  function onOkExamine(param){
    let SignDate = Moment(param.SignDate).format('YYYY-MM-DD');
    let id = item.ConsignmentId;
    let CheckCode = param.CheckCode?param.CheckCode:'';
    let SignUserName = param.SignUserName?param.SignUserName:'';
    let LicenceType = param.LicenceType?param.LicenceType:'';
    let LicenceCode = param.LicenceCode?param.LicenceCode:'';
    let SignWeight = param.SignWeight?param.SignWeight:'';
    let Remark = param.Remark?param.Remark:'';
    let imgurl = [];
    let SignPhone = param.SignPhone?param.SignPhone:'';
    SignImageList.map(function(item){
      imgurl.push(item.url)
    })
    param.ArriveImg=imgurl.join(',');
    let options = {
      ConsignmentId:id,
      CheckCode:CheckCode,
      SignDate:SignDate,
      SignUserName:SignUserName,
      LicenceType:LicenceType,
      LicenceCode:LicenceCode,
      SignWeight:SignWeight,
      Remark:Remark,
      SignPhone:SignPhone,
      Receipts:imgurl.join(',')
    }
    dispatch({type:'signconsignment/assignGo',options});
    dispatch({type:'signconsignment/closeAssign'});
  }
  //关闭弹框
  function closeModal(){
    dispatch({type:'signconsignment/closeAssign'})
  }

  //分页获取列表数据
  function addPage(page){
    dispatch({type:'signconsignment/search',page,startTime,endTime,syscode,startAddress,endAddress,transportStatus,customerNumber});
    dispatch({
      type:'signconsignment/updatePage',
      page
    })
  }

  return (
    <div className={styles.normal}>
      <SearchBar
        onSubmit={onSearch}
        searchFileds={searchFileds}
      />
      <Table
        pagination={ true }
        header={tableHeader}
        data={tData}
        defaultExpandAllRows={ true }
        onChange={addPage}
        pageSize={15}
        total={total}
        currentPage={pageIndex}
      />
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
  return {...state.login,...state.signconsignment};
}

export default connect(mapStateToProps)(SignConsignment);

