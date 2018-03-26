import React from 'react';
import { connect } from 'dva';
import {routerRedux} from 'dva/router';
import styles from './MyConsignment.less';
import SearchBar from '../../components/searchbar';
import {FormModal} from '../../components/modalForm'
import Table from '../../components/table';
import ValiInput from '../../components/modalForm/ValidateInput';
import {Button,Tooltip,Icon,Modal,message,Row,Col,Checkbox} from 'antd';
import {formatDate,formatDateTime} from '../../utils/fun_config';
import {RQHEADER} from '../../utils/config'
import Moment from 'moment';

const confirm = Modal.confirm;
function CarrierConsignment({
                              dispatch,carrierCosignList,arriveConsignmentId,loadingModalShow,refuseModalShow,signModalShow,showDriverModal,driverlist,totalDriver,showCar,carList,
                              totalCar,currentConsignmentId,keyNum,carNo,driverName,DriverTel,driverId,totalList,loadingCarrList,loadingDriver,loadingCar,
                              arriveImageList,showSignConsignModal,currentCode,SignImageList,SignConsignmentId,pageIndex,carPage,driverPage,startTime,endTime,
                              syscode,shipperCompanyName,receiverCompanyName,startAddress,endAddress,acceptanceStatus,assignStatus,transportStatus,receiptStatus,getDataArr,newCosignList,TruckType,
                              getBatchSignArr,getBatchInArr,CarId,customerNumber
                            }) {
  //点击搜索按钮--搜索托运单列表
  function onSearch(searchFields){
    if(searchFields?searchFields.transportStatus===0:false){
      getConsignListPage(pageIndex)
    }
    dispatch({type:'consignmentCarrier/search',searchFields})
  }
  //筛选操作按钮
  function selectBtn(status){
    let rowaction = [{
      key:'scan',
      name:'查看',
      color:'#108EE9',
      icon:'eye'
    }];
    if(status == 1){//未装车
      let packge = [{
        key: 'loading',
        name: '装车',
        color: '#10A54A',
        icon: 'car',
      }, {
        key: 'refuse',
        name: '拒绝',
        color: '#E74C3C',
        icon: 'close-square'
      }];
      rowaction = [...packge,...rowaction ];
    }else if( status == 2){
      let packge = [{
        key:'sign',
        name:'确认到站',
        color:'#B0E11E',
        icon:'check-circle'
      }];
      rowaction = [...packge,...rowaction];
    }else if(status == 3){
      let packge = [{
        key:'signConsign',
        name:'签收',
        color:'#2ecc71',
        icon:'exception'
      }];
      rowaction = [...packge,...rowaction];
    }
    return rowaction;
  }
  //确认装车弹框  loadingOk  loadingCancel
  function loadingOk(param){
    param.ConsignmentIds = getDataArr;
    param.LoadingTruckBatchModel={
      LoadingBatch:param.LoadingBatch||'',
      StartingAddress:param.StartingAddress?param.StartingAddress:'',
      DestinationAddress:param.DestinationAddress?param.DestinationAddress:'',
      LoadingTime:param.LoadingTime ? formatDateTime(param.LoadingTime._d)+':00': '',
      LoadingAddress:param.LoadingAddress?param.LoadingAddress:'',
      EstimatedTimeOfArrival:param.EstimatedTimeOfArrival? formatDateTime(param.EstimatedTimeOfArrival._d)+':00' : '',
      BatchRemark:param.BatchRemark||'',
    };
    param.ConsignTruckSaveModel={
      CarId:CarId,
      LicensePlateNumber:carNo,
      TruckType:TruckType?TruckType:'',
      DriverName:driverName,
      DriverTel:DriverTel,
      CarriageExpenses:param.CarriageExpenses||'',
      Remark:param.Remark||'',
    };

    delete param.CarriageExpenses;delete param.DestinationAddress;delete param.EstimatedTimeOfArrival;
    delete param.LoadingAddress;delete param.LoadingBatch;delete param.LoadingTime;delete param.Remark;delete param.StartingAddress;

    if(!carNo || !driverName||!DriverTel){
      Modal.warning({
        title: '提示',
        content: '车牌号和驾驶员信息未填写完整...',
      });
      preventDefault()
    }
    if(!(/^1[34578]\d{9}$/.test(DriverTel))){
      Modal.warning({
        title: '提示',
        content: '请填写正确司机电话...',
      });
      preventDefault()
    }
    getDataArr=[];
    dispatch({type:'consignmentCarrier/loadingGoodsBatch',param})
  }
  //取消装车
  function loadingCancel(){
    dispatch({type:'consignmentCarrier/closeLoadingGoods'})
    dispatch({type:'common/keynum'})
  }
  //确认拒绝装车
  function refuseOk(param){
    param.consignmentId = currentConsignmentId;
    dispatch({
      type:'consignmentCarrier/refuseLoading',
      param
    })
  }
  //取消拒绝装车
  function refuseCancel(){
    dispatch({type:'consignmentCarrier/closeRefuseModal'})
  }
  //取消到站卸货
  function signCancel(){
    dispatch({type:'consignmentCarrier/closeSignModal'})
  }
  //确认到站卸货
  function signOk(param){
    param.ConsignmentIds = arriveConsignmentId?[arriveConsignmentId]:getBatchInArr;
    param.ConsignmentArriveModel={
      ArrivalTime:formatDateTime( param.arriveTime._d)+':00'||'',
      DischargingTime:formatDateTime( param.unloadTime._d)+':00'||'',
      ArrivalRemark:param.ArrivalRemark||'',
      ConsignPictureAddModelList:arriveImageList,
    }
    delete param.arriveTime;delete param.unloadTime;delete param.ArrivalRemark;delete param.arriveImage;
    getBatchInArr=[];
    dispatch({type:'consignmentCarrier/arriveSignBatch',param});

  }
  //到站上传图片时间
  function uploadArriveImage(info){
    let {file} = info;
    let fileList = arriveImageList;

    if(file.status=="done"){
      if(file.response.Success){
        fileList.push({DisplayOrder:1,Remark:file.name,PicturePath:file.response.Message});
        dispatch({
          type:'consignmentCarrier/SetArriveImage',
          fileList
        })
      }else{
        message.error(file.response.Message)
      }
    }else if(file.status=='removed'){
      if(file.response.Success){
        let removelist=fileList.filter(item=>item.uid!=file.uid);
        dispatch({
          type:'consignmentCarrier/deletArriveImage',
          removelist
        })
      }else{
        message.error(file.response.Message)
      }

    }
  }
//关闭驾驶选选择弹框
  function onDriverCancel(){
    dispatch({type:'consignmentCarrier/closeDriverModal'});
  }
  //搜索驾驶员
  function onSearchDriver(value){
    if(value.length<1){
      getDriverPage(1)
    }
    let name = value.driver || '';
    dispatch({
      type:'consignmentCarrier/getDriverlist',
      page:1,
      name
    })
  }
  //点击驾驶员信息，选择
  function onDriveronOk(record, index, event){
    let {DriverId,Name,Phone} = record;
    dispatch({
      type:'consignmentCarrier/setSelectDriver',
      DriverId,
      driverName:Name,
      Phone
    })
    dispatch({type:'consignmentCarrier/closeDriverModal'});
  }
  //驾驶员列表分页
  function getDriverPage(page){
    dispatch({
      type:'consignmentCarrier/getDriverlist',
      page,
      name:''
    })
    dispatch({
      type:'consignmentCarrier/updateDriverPage',
      page
    })
  }
  //关闭车辆选择弹框
  function onCarCancel(){
    dispatch({type:'consignmentCarrier/closeCarModal'});
  }
  //搜索车辆
  function onSearchCar(value){
    if(value.length<1){
      getCarPage(1)
    }
    let carNo = value.car || '';
    dispatch({
      type:'consignmentCarrier/getCarlist',
      page:1,
      carNo
    });

  }
  //点击车辆信息，选择
  function onCaronOk(record, index, event){
    let {CarNo,Id,CarModelName} = record;
    dispatch({
      type:'consignmentCarrier/setSelectCarNo',
      carNo:CarNo,
      CarModelName,
      Id
    })
    dispatch({type:'consignmentCarrier/closeCarModal'});
  }
  //车辆列表分页
  function getCarPage(page){
    dispatch({
      type:'consignmentCarrier/getCarlist',
      page,
      carNo
    });
    dispatch({
      type:'consignmentCarrier/updateCarPage',
      page
    })
  }
  //表格操作
  function tableAction(actionKey,item,index){
    let {ConsignmentId,transportStatus} = item;//运单id
    dispatch({
      type:'consignmentCarrier/setCurrentId',
      currentConsignmentId:ConsignmentId,
    })
    if(actionKey=='loading'){//装车弹框显示
      dispatch(routerRedux.push(`/LoadingCar/${ConsignmentId}`));
    }else if( actionKey == 'scan'){//查看
      dispatch(routerRedux.push(`/ConsignmentDetail/${ConsignmentId}`));
    }else if(actionKey == 'refuse'){
      dispatch({type:'consignmentCarrier/showRefuseModal'})
    }else if(actionKey=='sign'){//到站卸货
      dispatch({type:'common/keynum'})
      dispatch({type:'consignmentCarrier/showSignModal',ConsignmentId})
    }else if(actionKey=='signConsign'){//签收
      dispatch({type:'common/keynum'})
      dispatch({
        type:'consignmentCarrier/showSignConsignModal',
        currentCode:item.SysCode,
        SignConsignmentId:ConsignmentId
      })
    }
  }
  //分页获取承运方列表
  function getConsignListPage(page){
    dispatch({
      type:'consignmentCarrier/search',
      page,startTime,endTime,syscode,customerNumber,startAddress,endAddress,shipperCompanyName,receiverCompanyName,transportStatus,assignStatus,receiptStatus
    });
    dispatch({
      type:'consignmentCarrier/updatePage',
      page
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
//上传签收图片事件
  function uploadSignImage(info){
    let {file} = info;
    let fileList = SignImageList;
    if(file.status=="done" ){
      if(file.response.Success){
        fileList.push({DisplayOrder:1,Remark:file.name,PicturePath:file.response.Message});
        dispatch({
          type:'consignmentCarrier/SetSignImage',
          fileList
        })
      }else{
        message.error(file.response.Message)
      }
    }else if(file.status=='removed'){
      if(file.response.Success){
        let removelist=fileList.filter(item=>item.uid!=file.uid);
        dispatch({
          type:'consignmentCarrier/deletSignImage',
          removelist
        })
      }
    }
  }

  //签收
  function onOkExamine(param){
    param.ConsignmentIds = SignConsignmentId?[SignConsignmentId]:getBatchSignArr;
    param.ConsignmentSignAddModel={
      CheckCode:param.CheckCode || '',
      SignDate:formatDateTime( param.SignDate._d)+':00'||'',
      SignUserName:param.SignUserName||'',
      SignPhone:param.SignPhone||'',
      LicenceType:param.LicenceType||'',
      LicenceCode : param.LicenceCode || '',
      SignWeight:param.SignWeight || '',
      Remark:param.Remark || '',
      ConsignPictureAddModelList:SignImageList,
    }
    delete param.BusinesslicensePhoto;delete param.CheckCode;delete param.LicenceCode;delete param.LicenceType;delete param.Remark;
    delete param.SignDate;delete param.SignPhone;delete param.SignUserName;delete param.SignWeight;
    getBatchSignArr=[];
    dispatch({type:'consignmentCarrier/assignBatchGo',param});
  }
  //关闭弹框
  function closeModal(){
    dispatch({type:'consignmentCarrier/closeSignConsignModal'})
  }

  //
  //确认装车表单数据
  const loadingfields=[
    {
      label: '承运批次',
      type: 'input',
      name: 'LoadingBatch',
      options:{
        rules:[{
          required:true,
          message:'请填写承运批次'
        },
          {
            min:2,
            message:'请不要少于2个字符'
          },
          {
            max:20,
            message:'请不要超过20个字符'
          }]
      }
    },
    {
      label: '起始地',
      type: 'input',
      name: 'StartingAddress',
      options:{
        rules:[{
          required:true,
          message:'请填写起始地'
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
      label: '到达地',
      type: 'input',
      name: 'DestinationAddress',
      options:{
        rules:[{
          required:true,
          message:'请填写到达地'
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
      label: '承运费用(元)',
      type: 'input',
      name: 'CarriageExpenses',
      options:{
        rules:[{
          required:true,
          message:'请填写承运费用'
        },{
          pattern:/^[1-9]\d*(\.\d+)?$/,
          message:'只能输入大于0的数!'
        }]
      }
    },
    {
      label:'装车地址',
      type:'input',
      name:'LoadingAddress',
    },
    {
      label:'装车时间',
      type:'datetime',
      name:'LoadingTime',
      formate:"YYYY/MM/DD HH:mm:ss",
      options:{
        rules:[{
          required:true,
          message:'请填写装车时间'
        }]
      }
    },
    {
      label:'预计到货时间',
      type:'datetime',
      formate:"YYYY/MM/DD HH:mm:ss",
      name:'EstimatedTimeOfArrival',
    },
    {
      label:'备注',
      type:'input',
      name:'Remark',
    },
  ];
//拒绝装车数据
  const refusefields = [
    {
      label:'拒绝装车理由',
      type:'input',
      name:'info',
      options:{
        rules:[
          {
            required: true,
            message: '请填写拒绝装车理由!',
          },{
            min:2,
            message:'请不要少于2个字符',
          },{
            max:50,
            message:'请不要超过50个字符',
          }
        ]
      }
    }
  ];
//确认到站卸货数据
  const signfields  = [
    {
      label:'到站时间',
      type:'datetime',
      name:'arriveTime',
      formate:"YYYY/MM/DD HH:mm:ss",
      options:{
        rules:[{
          required: true,
          message: '请填写到站时间!',
        }]
      }
    },
    {
      label:'卸货时间',
      type:'datetime',
      name:'unloadTime',
      formate:"YYYY/MM/DD HH:mm:ss",
      options:{
        rules:[{
          required: true,
          message: '请填写卸货时间!',
        }]
      }
    },
    {
      label:'备注',
      type:'input',
      name:'ArrivalRemark',
      options:{}
    },
    {
      label:'上传卸货凭证',
      type:'uploadNumImage',
      name:'arriveImage',
      action:RQHEADER+'/consignment/saveimage',
      headers:{'Authorization': 'token '+sessionStorage.access_token},
      imgNum:2,
      beforeUpload:beforeUpload,
      onChange:uploadArriveImage,
      fileList:arriveImageList,
    }
  ]
  const tableHeader =[
    {
      title:'',
      dataIndex:'chose',
      key:'chose',
      render:(item,record,index)=>{
        let arr=[];
        if(record.TransportStatus){
          if(record.TransportStatus==1){
            arr=getDataArr;
          }else if(record.TransportStatus==2){
            arr=getBatchInArr;
          }else if(record.TransportStatus==3){
            arr=getBatchSignArr
          }
        }
        if(record.TransportStatus&&record.TransportStatus!=4){
          return (
            <div>
              <Checkbox
                defaultChecked={arr.indexOf(record.ConsignmentId)!=-1}
                onChange={(item)=>{
                  if(item.target.checked==true){
                    if(record.TransportStatus==1){
                      getDataArr.push(record.ConsignmentId)
                      dispatch({type:'consignmentCarrier/getDataArr'});
                    }else if(record.TransportStatus==2){
                      getBatchInArr.push(record.ConsignmentId)
                      dispatch({type:'consignmentCarrier/getBatchInArr'});
                    }else if(record.TransportStatus==3){
                      getBatchSignArr.push(record.ConsignmentId)
                      dispatch({type:'consignmentCarrier/getBatchSignArr'});
                    }
                  }else{
                    for(let i=0;i<getDataArr.length;i++){
                      if(getDataArr[i]==record.ConsignmentId){
                        getDataArr.splice(i,1)
                      }
                    }
                    for(let i=0;i<getBatchInArr.length;i++){
                      if(getBatchInArr[i]==record.ConsignmentId){
                        getBatchInArr.splice(i,1)
                      }
                    }
                    for(let i=0;i<getBatchSignArr.length;i++){
                      if(getBatchSignArr[i]==record.ConsignmentId){
                        getBatchSignArr.splice(i,1)
                      }
                    }
                  }
                }}
              />
            </div>
          )
        }else{
          return (<div></div>)
        }
      }
    },
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
      title: '要求到货日期',
      dataIndex: 'DateOfArrival',
      key: 'DateOfArrival'
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
          return (<div><span style={{color:'#cc9a15'}}>{t}</span></div>)
        }else if(t==3){
          t='已到站';
          return (<div><span style={{color:'#1c78e7'}}>{t}</span></div>)
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
        const actions =selectBtn(record.TransportStatus);
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
  const searchFields1 =  [
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
  ];
  const searchFields2 =  [
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
      title:'收货单位',
      key:'receiverCompanyName',
      type:'input'
    },
    {
      title:'发货单位',
      key:'shipperCompanyName',
      type:'input'
    }
  ];
  const searchFileds = [{fields:searchFields1,visible:'visible'},{fields:searchFields2,visible:'hidden'}];
  //车辆列表表格表头
  const CarHeader = [
    {
      title:'车牌号',
      dataIndex:'CarNo',
      key:'CarNo'
    },
    {
      title:'载重',
      dataIndex:'CarLoad',
      key:'CarLoad'
    },
    {
      title:'车型',
      dataIndex:'CarModelName',
      key:'CarModelName'
    },
  ];
  //驾驶员表格表头
  const  DriverHeader = [
    {
      title:'司机姓名',
      dataIndex:'Name',
      key:'Name'
    },
    {
      title:'联系电话',
      dataIndex:'Phone',
      key:'Phone'
    },
    {
      title:'驾照类型',
      dataIndex:'DriverLicenseTypeName',
      key:'DriverLicenseTypeName'
    },
  ];
  //司机搜索
  const searchPeopleFields  =[
    {
      title:'搜索驾驶员',
      key:'driver',
      width:'260px',
      placeholder:'搜索驾驶员姓名',
      type:'input'
    }
  ];
  //车辆搜索
  const searchCarFields = [
    {
      title:'搜索车辆',
      key:'car',
      width:'260px',
      placeholder:'搜索车牌号',
      type:'input'
    }
  ];
  const searchCarFileds = [{fields:searchCarFields,visible:'visible'}];
  const searchDriverFileds = [{fields:searchPeopleFields,visible:'visible'}];
  //签收 证件类型
  const licenseType = [
    {
      value: '身份证',
      mean: '身份证',
    },
    {
      value: '工作证',
      mean: '工作证',
    }
  ]
  //签收表单内容
  const fieldsExamine = [
    {
      label: '签收日期',
      name: 'SignDate',
      type:'datetime',
      formate:"YYYY/MM/DD HH:mm:ss",
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
      options:{
        rules:[
          {
            max: 50,
            message: '请不要超过50个字符!',
          }
        ]
      }
    },
    {
      label: '上传签收单据',
      type: 'uploadNumImage',
      name: 'BusinesslicensePhoto',
      uploadUrl:'',
      action:RQHEADER+'/consignment/saveimage',
      headers:{'Authorization': 'token '+sessionStorage.access_token},
      imgNum:2,
      beforeUpload:beforeUpload,
      onChange:uploadSignImage,
      fileList:SignImageList,
    },
  ];
  function Export() {
    window.open(RQHEADER+'/consignment/export?token='+sessionStorage.access_token+'&pageIndex='+pageIndex+'&transportStatus='+transportStatus+'&startTime='+startTime+'&endTime='+endTime+'&syscode='+syscode+'&shipperCompanyName='+shipperCompanyName+'&receiverCompanyName='+receiverCompanyName
      +'&startAddress='+startAddress+'&endAddress='+endAddress+'&assignStatus='+assignStatus+'&acceptanceStatus='+acceptanceStatus
    )
  }
  //批量装车
  function batchCar(){
    if(getDataArr.length<1){
      message.destroy();
      message.error('请至少选择一条未装车的托运单!')
    }else{
      if(getBatchInArr.length>0||getBatchSignArr.length>0){
        message.destroy();
        message.error('请确认进行批量操作时托运单处于同一状态!')
      }else{
        dispatch({type:'common/keynum'})
        dispatch({ type:'consignmentCarrier/showLoadingGoods'})
      }
    }
  }
  //批量到站
  function batchIn(){
    if(getBatchInArr.length<1){
      message.destroy();
      message.error('请至少选择一条运输中的托运单!')
    }else{
      if(getDataArr.length>0||getBatchSignArr.length>0){
        message.destroy();
        message.error('请确认进行批量操作时托运单处于同一状态!')
      }else{
        dispatch({type:'common/keynum'})
        dispatch({ type:'consignmentCarrier/showSignModal'})
      }
    }
  }
  //批量签收
  function batchSign(){
    if(getBatchSignArr.length<1){
      message.destroy();
      message.error('请至少选择一条已到站的托运单!')
    }else{
      if(getBatchInArr.length>0||getDataArr.length>0){
        message.destroy();
        message.error('请确认进行批量操作时托运单处于同一状态!')
      }else{
        dispatch({type:'common/keynum'})
        dispatch({ type:'consignmentCarrier/showSignConsignModal'})
      }
    }
  }
  return (
    <div className={styles.normal}>
      <Button  className={styles.ExportBtn} onClick={Export}>导出</Button>
      <SearchBar
        onSubmit={onSearch}
        searchFileds={searchFileds}
        hasMore={true}
      />

      <div style={{margin:'-10px 0 20px 0'}}>
        <Button type='primary' onClick={batchCar}>批量装车</Button>
        <Button type='primary' className={styles.batch} onClick={batchIn}>批量到站</Button>
        <Button type='primary' className={styles.batch} onClick={batchSign}>批量签收</Button>
      </div>
      <Table
        onCtrlClick={ tableAction }
        pagination={ true }
        header={tableHeader }
        data={carrierCosignList}
        defaultExpandAllRows={ true }
        total={totalList}
        onChange={getConsignListPage}
        loading={loadingCarrList}
        currentPage={pageIndex}
      />
      <FormModal
        modalKey={keyNum+''}
        visible={loadingModalShow}
        title="确认装车"
        fields={loadingfields}
        otherFields='loading'
        onOk={loadingOk}
        onCancel={loadingCancel}
        okText="确定"
      />
      <FormModal
        modalKey="refuse"
        visible={refuseModalShow}
        title="拒绝装车"
        fields={refusefields}
        onOk={refuseOk}
        onCancel={refuseCancel}
        okText="拒绝"
      />
      <FormModal
        modalKey={keyNum+''}
        visible={signModalShow}
        title="到站卸货"
        fields={signfields}
        onOk={signOk}
        onCancel={signCancel}
        okText="确定"
      />
      <Modal
        visible={showDriverModal}
        title={'请选择驾驶员'}
        okText="确定"
        onCancel={onDriverCancel}
        key='driver'
        footer={null}
        width={620}
        zIndex={999999999999}
      >
        <SearchBar
          onSubmit={onSearchDriver}
          searchFileds={searchDriverFileds}
          searchCls='nopadding'
        />
        <Table
          header={DriverHeader}
          data={driverlist}
          key='dirver'
          pagination={true}
          total={totalDriver}
          onRowClick={onDriveronOk}
          onChange={getDriverPage}
          loading={loadingDriver}
          currentPage={driverPage}
        />
      </Modal>
      <Modal
        visible={showCar}
        title={'请选择车辆'}
        okText="确定"
        onCancel={onCarCancel}
        key='car'
        footer={null}
        width={620}
        zIndex={999999999999}
      >
        <SearchBar
          onSubmit={onSearchCar}
          searchFileds={searchCarFileds}
          searchCls='nopadding'
        />
        <Table
          header={CarHeader}
          data={carList}
          key='car'
          pagination={true}
          total={totalCar}
          onRowClick={onCaronOk}
          onChange={getCarPage}
          loading={loadingCar}
          currentPage={carPage}
        />
      </Modal>
      <FormModal modalKey={keyNum+''}
                 visible={showSignConsignModal}
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
  return {...state.consignmentCarrier,...state.login,...state.common};
}

export default connect(mapStateToProps)(CarrierConsignment);
