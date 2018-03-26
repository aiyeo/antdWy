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
function BatchManage({
	dispatch,total,loading,pageIndex,tData,startTime,endTime,licensePlateNumber,driverName,loadingBatch,transportStatus,signModalShow,arriveImageList,keyNum,
	dateDischarge,dateArrive,LoadingBatchId,showSignConsignModal,SignImageList,Item
}) {
	//筛选操作按钮
	  function selectBtn(status){
	    let rowaction = [{
	      key:'scan',
	      name:'查看',
	      color:'#108EE9',
	      icon:'eye'
	    }];
	    if(status == 1){
	      let packge = [{
	        key:'sign',
	        name:'确认到站',
	        color:'#B0E11E',
	        icon:'check-circle-o'
	      }
	      ,{
	      	key:'list',
	        name:'批次运单',
	        color:'#8e44ad',
	        icon:'switcher'
	      }
	      ];
	      rowaction = [...packge,...rowaction];
	    }
//	    else if( status == 2){
//	      let packge = [{
//	        key:'signConsign',
//	        name:'签收',
//	        color:'#2ecc71',
//	        icon:'exception'
//	      }];
//	      rowaction = [...packge,...rowaction];
//	    }
	    return rowaction;
	  }
	const stateField = [
		{
	      value:1,
	      mean:'运输中'
	    },
	    {
	      value:2,
	      mean:'已到站'
	    },
	    {
	      value:3,
	      mean:'已签收'
	    },
	]
	const searchFields1 =  [
		{
	      title:'批次状态',
	      key:'truckBatchStatus',
	      type:'select',
	      items: () => stateField.map(ele => ({
	        mean: ele.mean,
	        value: ele.value
	      })),
	    },
        {
          title: '装车日期',
          key: ['startTime', 'endTime'],
          type: 'rangePicker',
          width:'200px'
        },
        {
          title:'承运批次',
          key:'loadingBatch',
          type:'input'
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
        }
        ];
  	const searchFileds = [{fields:searchFields1,visible:'visible'}];
  	const tableHeader =[
        {
	        title: '承运批次',
	        dataIndex: 'LoadingBatch',
	        key: 'LoadingBatch',
        },
        {
	        title: '装车时间',
	        dataIndex: 'LoadingTime',
	        key: 'LoadingTime'
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
	        title: '车牌号',
	        dataIndex: 'LicensePlateNumber',
	        key: 'LicensePlateNumber'
        },
        {
	        title: '驾驶员',
	        dataIndex: 'DriverName',
	        key: 'DriverName'
        },
        {
	        title: '联系电话',
	        dataIndex: 'DriverTel',
	        key: 'DriverTel'
        },
        {
	        title: '装车地址',
	        dataIndex: 'LoadingAddress',
	        key: 'LoadingAddress'
        },
        {
	        title: '承运费用(元)',
	        dataIndex: 'CarriageExpenses',
	        key: 'CarriageExpenses'
    	},
    	{
		    title: '批次状态',
		    dataIndex: 'TruckBatchStatus',
		    key: 'TruckBatchStatus',
		    render:(text,record,index)=>{
        	let t = text;
		    	if(t==1){
		    		t='运输中';
	        		return (<div><span style={{color:'#595959'}}>{t}</span></div>)
		    	}else if(t==2){
		    		t='已到站';
	        		return (<div><span style={{color:'#2ecc71'}}>{t}</span></div>)
		    	}else if(t==3){
		    		t='已签收';
	        		return (<div><span style={{color:'#e74c3c'}}>{t}</span></div>)
		    	}
      		}
    	},
		{
			key: 'x',
			title: '操作',
			dataIndex:'x',
			render: (text,record,index) => {
    			const actions = selectBtn(record.TruckBatchStatus);
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
  	//点击搜索按钮--搜索托运单列表
  	function onSearch(searchFields){
    	if(searchFields.length<1){
      		getConsignListPage(pageIndex)
    	}
    	dispatch({type:'batchmanage/search',searchFields,pageIndex})
  	}
  	//分页获取承运方列表
  	function getConsignListPage(page){
    	dispatch({
        	type:'batchmanage/search',
        	pageIndex,startTime,endTime,licensePlateNumber,driverName,loadingBatch,truckBatchStatus
      	});
  	}
  	//表格操作
  	function tableAction(actionKey,item,index){
    	let {LoadingBatchId,TransportStatus} = item;//运单id
    	dispatch({
	      type:'batchmanage/setBatchId',
	      LoadingBatchId
	    })
    	if(actionKey=='loading'){//装车弹框显示
      		dispatch({ type:'batchmanage/showLoadingGoods'})
    	}else if( actionKey == 'scan'){//查看
      		dispatch(routerRedux.push(`/BatchDetails/${LoadingBatchId}`));
    	}else if(actionKey=='sign'){//到站卸货
    		dispatch({type:'common/keynum'})
    		dispatch({type:'batchmanage/showSignModal'})
    	}else if(actionKey=='signConsign'){//签收
      		dispatch({type:'common/keynum'})
      		dispatch({
        		type:'batchmanage/showSignConsignModal',item
      		})
    	}else if(actionKey == 'list'){
    		dispatch(routerRedux.push(`/BatchList/${LoadingBatchId}`));
    	}
  	}
  	//取消到站卸货
  function signCancel(){
    dispatch({type:'batchmanage/closeSignModal'})
  }
  //确认到站卸货
  function signOk(param){
    param.LoadingBatchId = LoadingBatchId;
    param.ArrivalTime = formatDateTime( param.arriveTime._d);
    param.DischargingTime = formatDateTime( param.unloadTime._d);
    param.ArriveRemark = param.info;
    let imgurl = [];
    arriveImageList.map(function(item){
      imgurl.push(item.url)
    })
    param.ArriveImg=imgurl.join(',');
    delete param.arriveImage;
    dispatch({type:'batchmanage/LoadBatchArrive',param})
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
  //到站上传图片时间
  function uploadArriveImage(info){
    let {file} = info;
    let fileList = arriveImageList;
    if(file.status=="done"){
      if(file.response.Success){
        fileList.push({uid:file.uid,status:file.status,name:file.name,url:file.response.Message});
        dispatch({
          type:'batchmanage/SetArriveImage',
          fileList
        })
      }else{
        message.error(file.response.Message)
      }
    }else if(file.status=='removed'){
      if(file.response.Success){
        let removelist=fileList.filter(item=>item.uid!=file.uid);
        dispatch({
          type:'batchmanage/deletArriveImage',
          removelist
        })
      }else{
        message.error(file.response.Message)
      }
    }
  }
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
      },
      onChange:(e,dateArrive)=>{
      	dispatch({type:'batchmanage/getDateArrive',dateArrive})
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
      },
      onChange:(e,dateDischarge)=>{
      	dispatch({type:'batchmanage/getDateDischarge',dateDischarge})
      },
      disabledDate:(c)=>{
      	let arrive = new Date(dateArrive.replace(/-/g,"\/"));
      	return c && c.valueOf() <= arrive;
      }
    },
    {
      label:'备注',
      type:'textarea',
      name:'info',
      options:{}
    },
    {
      label:'上传卸货凭证',
      type:'uploadNumImage',
      name:'arriveImage',
      action:RQHEADER+'/loadingbatch/saveimage',
      headers:{'Authorization': 'token '+sessionStorage.access_token},
      imgNum:2,
      beforeUpload:beforeUpload,
      onChange:uploadArriveImage,
      fileList:arriveImageList,
    }
  ];
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
  		label:'承运批次',
  		name:'loadingBatch',
  		type:'',
  		options:{
  			initialValue:Item.LoadingBatch
  		}
  	},
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
      },
      disabledDate:(c)=>{
      	let arrive = new Date(Item.ArrivalTime.replace(/-/g,"\/"));
      	return c && c.valueOf() < arrive;
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
      label: '签收人电话',
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
      name: 'SignRemark',
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
      action:RQHEADER+'/loadingbatch/saveimage',
      headers:{'Authorization': 'token '+sessionStorage.access_token},
      imgNum:2,
      beforeUpload:beforeUpload,
      onChange:uploadSignImage,
      fileList:SignImageList,
    },
  ];
  //上传签收图片事件
  function uploadSignImage(info){
    let {file} = info;
    let fileList = SignImageList;
    if(file.status=="done" ){
      if(file.response.Success){
        fileList.push({uid:file.uid,status:file.status,name:file.name,url:file.response.Message});
        dispatch({
          type:'batchmanage/SetSignImage',
          fileList
        })
      }else{
        message.error(file.response.Message)
      }
    }else if(file.status=='removed'){
      if(file.response.Success){
        let removelist=fileList.filter(item=>item.uid!=file.uid);
        dispatch({
          type:'batchmanage/deletSignImage',
          removelist
        })
      }
    }
  }
  //签收
  function onOkExamine(param){
    let SignDate = Moment(param.SignDate).format('YYYY-MM-DD');
    let LoadingBatchId = Item.LoadingBatchId;
//  let CheckCode = param.CheckCode || '';
    let SignUserName = param.SignUserName || '';
    let LicenceType = param.LicenceType || '';
    let LicenceCode = param.LicenceCode || '';
//  let SignWeight = param.SignWeight || '';
    let SignRemark = param.SignRemark || '';
    let SignPhone = param.SignPhone || '';
    let imgurl = [];
    SignImageList.map(function(item){
      imgurl.push(item.url)
    })
    param.ArriveImg=imgurl.join(',');
    let options = {
      LoadingBatchId:LoadingBatchId,
//    CheckCode:CheckCode,
      SignDate:SignDate,
      SignUserName:SignUserName,
      LicenceType:LicenceType,
      LicenceCode:LicenceCode,
//    SignWeight:SignWeight,
      SignRemark:SignRemark,
      SignPhone:SignPhone,
      Receipts:imgurl.join(',')
    }
    dispatch({type:'batchmanage/LoadBatchSign',options});
    dispatch({type:'batchmanage/closeSignConsignModal'});
  }
  //关闭弹框
  function closeModal(){
    dispatch({type:'batchmanage/closeSignConsignModal'})
  }
  	return (
    	<div className={styles.normal}>
      		<SearchBar
        		onSubmit={onSearch}
        		searchFileds={searchFileds}
      		/>
       		<Table
          		pagination={ true }
          		header={tableHeader }
          		data={tData}
          		defaultExpandAllRows={ true }
          		total={total}
          		onChange={getConsignListPage}
          		loading={loading}
          		currentPage={pageIndex}
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
  return {...state.batchmanage,...state.login,...state.common};
}

export default connect(mapStateToProps)(BatchManage);
