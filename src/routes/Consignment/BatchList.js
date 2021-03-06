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
function BatchList({
	dispatch,total,loading,pageIndex,tData,startTime,endTime,licensePlateNumber,driverName,loadingBatch,transportStatus,signModalShow,arriveImageList,keyNum,removeArr,
	dateDischarge,dateArrive,LoadingBatchId,showSignConsignModal,SignImageList,Item,totalItem,getBatchInArr,getBatchSignArr,showPageModal,pageData,totalPage,pagePage,batchIds
}) {
	//筛选操作按钮
	  function selectBtn(status){
	    let rowaction = [{
	      key:'scan',
	      name:'查看',
	      color:'#108EE9',
	      icon:'eye'
	    }];
	    if(status == 2){
	      let packge = [{
	        key:'sign',
	        name:'确认到站',
	        color:'#B0E11E',
	        icon:'check-circle-o'
	      }
	      ];
	      rowaction = [...packge,...rowaction];
	    }else if( status == 3){
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
      title:'',
      dataIndex:'chose',
      key:'chose',
      render:(item,record,index)=>{
        let arr=[];
        if(record.TransportStatus){
          if(record.TransportStatus==2){
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
                    if(record.TransportStatus==2){
                      getBatchInArr.push(record.ConsignmentId);
                      removeArr.push(record.ConsignmentId);
                      dispatch({type:'batchlist/getRemoveArr'})
                      dispatch({type:'batchlist/getBatchInArr'});
                    }else if(record.TransportStatus==3){
                      getBatchSignArr.push(record.ConsignmentId)
                      dispatch({type:'batchlist/getBatchSignArr'});
                    }
                  }else{
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
                    for(let i=0;i<removeArr.length;i++){
                      if(removeArr[i]==record.ConsignmentId){
                        removeArr.splice(i,1)
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
	      title: '托运单号',
	      dataIndex: 'SysCode',
	      key: 'SysCode',
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
	      key: 'ReceiveCompanyName',
	      render:(text,record)=>{
					return (<div>{record.ConsignmentReceivingModel.CompanyName}</div>)
	      }
	    },
	    {
	      title: '收货电话',
	      dataIndex: 'ReceivingTel',
	      key: 'ReceivingTel',
	      render:(text,record)=>{
	      	return (<div>{record.ConsignmentReceivingModel.ReceivingTel}</div>)
	      }
	    },
	    {
	      title: '发货单位',
	      dataIndex: 'shipperCompanyName',
	      key: 'shipperCompanyName',
	      render:(text,record)=>{
	      	return (<div>{record.ConsignmentShipperModel.CompanyName}</div>)
	      }
	    },
	    {
	      title: '发货电话',
	      dataIndex: 'ShipperTel',
	      key: 'ShipperTel',
	      render:(text,record)=>{
	      	return (<div>{record.ConsignmentShipperModel.ShipperTel}</div>)
	      }
	    },
	    {
	      title: '要求到货日期',
	      dataIndex: 'DateOfArrival',
	      key: 'DateOfArrival',
	      render:(text,record)=>{
	      	return (<div>{record.DateOfArrival}</div>)
	      }
	    },
	    {
	      title: '装车日期',
	      dataIndex: 'LoadingTime',
	      key: 'LoadingTime',
	      render:(text,record)=>{
	      	return (<div>{record.ConsignmentCarrierModel.LoadingTime}</div>)
	      }
	    },
	    {
	      title: '运输状态',
	      dataIndex: 'TransportStatus',
	      key: 'TransportStatus',
	      render:(text,record)=>{
	        let t = text;
	        if(t==1){
	          t='未装车';
	          return (<div><span style={{color:'#595959'}}>{t}</span></div>)
	        }else if(t==2){
	          t='运输中';
	          return (<div><span style={{color:'#595959'}}>{t}</span></div>)
	        }else if(t==3){
	          t='已到站';
	          return (<div><span style={{color:'#3498db'}}>{t}</span></div>)
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
    			const actions = selectBtn(record.TransportStatus);
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
  	//分页获取承运方列表
  	function getConsignListPage(page){
    	dispatch({
        	type:'batchlist/search',
        	pageIndex
      	});
  	}
  	//表格操作
  	function tableAction(actionKey,item,index){
    	let {LoadingBatchId,TransportStatus,ConsignmentId} = item;//运单id
    	dispatch({
	      type:'batchlist/setBatchId',
	      LoadingBatchId
	    })
    	if(actionKey=='loading'){//装车弹框显示
      		dispatch({ type:'batchlist/showLoadingGoods'})
    	}else if( actionKey == 'scan'){//查看
      		dispatch(routerRedux.push(`/ConsignmentDetail/${ConsignmentId}`));
    	}else if(actionKey=='sign'){//到站卸货
    		dispatch({type:'common/keynum'})
    		dispatch({type:'batchlist/showSignModal'})
    	}else if(actionKey=='signConsign'){//签收
      		dispatch({type:'common/keynum'})
      		dispatch({
        		type:'batchlist/showSignConsignModal',item
      		})
    	}else if(actionKey == 'list'){
    		dispatch(routerRedux.push(`/BatchList/${LoadingBatchId}`));
    	}
  	}
  	//取消到站卸货
  function signCancel(){
    dispatch({type:'batchlist/closeSignModal'})
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
    let ArriveTime = param.arriveTime;
    let UnloadTime = param.unloadTime;
    let Info = param.info;
    let ArriveImg = param.ArriveImg;
    let ConsignmentIds = getBatchInArr;
    let ConsignmentArriveModel = {
	      ArriveTime:ArriveTime,
	      UnloadTime:UnloadTime,
	      Info:Info,
	      ArriveImg:ArriveImg
    }
    dispatch({type:'batchlist/arriveSignBatch',ConsignmentIds,ConsignmentArriveModel});
    getBatchInArr=[];
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
          type:'batchlist/SetArriveImage',
          fileList
        })
      }else{
        message.error(file.response.Message)
      }
    }else if(file.status=='removed'){
      if(file.response.Success){
        let removelist=fileList.filter(item=>item.uid!=file.uid);
        dispatch({
          type:'batchlist/deletArriveImage',
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
      	dispatch({type:'batchlist/getDateArrive',dateArrive})
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
          type:'batchlist/SetSignImage',
          fileList
        })
      }else{
        message.error(file.response.Message)
      }
    }else if(file.status=='removed'){
      if(file.response.Success){
        let removelist=fileList.filter(item=>item.uid!=file.uid);
        dispatch({
          type:'batchlist/deletSignImage',
          removelist
        })
      }
    }
  }
  //签收
  function onOkExamine(param){
    let SignDate = Moment(param.SignDate).format('YYYY-MM-DD');
    let CheckCode = param.CheckCode || '';
    let SignUserName = param.SignUserName || '';
    let LicenceType = param.LicenceType || '';
    let LicenceCode = param.LicenceCode || '';
    let SignWeight = param.SignWeight || '';
    let Remark = param.Remark || '';
    let SignPhone = param.SignPhone || '';
    let imgurl = [];
    SignImageList.map(function(item){
      imgurl.push(item.url)
    })
    param.ArriveImg=imgurl.join(',');
    let ConsignmentIds = getBatchSignArr;
      let ConsignmentSignModel = {
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
    dispatch({type:'batchlist/assignBatchGo',ConsignmentIds,ConsignmentSignModel});
    dispatch({type:'batchlist/closeSignConsignModal'});
    getBatchSignArr=[];
  }
  //关闭弹框
  function closeModal(){
    dispatch({type:'batchlist/closeSignConsignModal'})
  }
  //返回
  function goBack(){
  	window.history.go(-1)
  }
  //新增托运单
  function addNewPage(){
  	dispatch({type:'batchlist/showPageModal'});
  	dispatch({type:'common/keynum'})
  	dispatch({type:'batchlist/getPageList'});
  }
  //关闭新增托运单弹框
  function onPageCancel(){
  	dispatch({type:'batchlist/closePageModal'})
  	dispatch({type:'common/keynum'})
  }
  //移除托运单
  function delOldPage(){
  	if(removeArr.length<1){
      message.destroy();
      message.error('请至少选择一条运输中的托运单!')
    }else{
    	if(getBatchInArr.length>0||getBatchSignArr.length>0||batchIds.length>0){
    		message.destroy();
      	message.error('请确认所选托运单是运输中状态!')
    	}else{
    		let options = {
	    		LoadingBatchId:totalItem.LoadingBatchId,
	    		ConsignmentIds:removeArr,
	    		ActionMode:'del'
	    	}
	      confirm({
			    title: '提示',
			    content: '确定要从本批次中移除这些托运单吗？',
			    onOk() {
			      dispatch({type:'batchlist/removeAddPage',options})
			    },
			    onCancel() {
			      onPageCancel();
			      removeArr=[];
			    },
			  });
    	}
    }
  }
  const PageHeader = [
  	{
      title:'',
      dataIndex:'chose',
      key:'chose',
      render:(item,record,index)=>{
          return (
            <div>
              <Checkbox
              	key={keyNum+''}
                defaultChecked={batchIds.indexOf(record.ConsignmentId)!=-1?true:false}
                onChange={(item)=>{
                  if(item.target.checked==true){
                    batchIds.push(record.ConsignmentId)
                    dispatch({type:'batchlist/getBatchIdsArr',batchIds});
                  }else{
                    for(let i=0;i<batchIds.length;i++){
                      if(batchIds[i]==record.ConsignmentId){
                        batchIds.splice(i,1)
                      }
                    }
                  }
                }}
              />
            </div>
          )
      }
    },
    {
      title:'托运单号',
      dataIndex:'SysCode',
      key:'SysCode'
    },
    {
      title:'托运日期',
      dataIndex:'CreateTime',
      key:'CreateTime'
    },
    {
      title:'起始地',
      dataIndex:'StartingAddress',
      key:'StartingAddress'
    },
    {
      title: '到达地',
      dataIndex: 'DestinationAddress',
      key: 'DestinationAddress'
    },
    {
      title: '收货单位',
      dataIndex: 'ReceiveCompanyName',
      key: 'ReceiveCompanyName',
      render:(t,r)=>{
      	return (<div>{r.ConsignmentReceivingModel.CompanyName}</div>)
      }
    },
    {
      title: '收货电话',
      dataIndex: 'ReceivingTel',
      key: 'ReceivingTel',
      render:(t,r)=>{
      	return (<div>{r.ConsignmentReceivingModel.ReceivingTel}</div>)
      }
    },
    {
      title: '发货单位',
      dataIndex: 'shipperCompanyName',
      key: 'shipperCompanyName',
      render:(t,r)=>{
      	return (<div>{r.ConsignmentShipperModel.CompanyName}</div>)
      }
    },
    {
      title: '发货电话',
      dataIndex: 'ShipperTel',
      key: 'ShipperTel',
      render:(t,r)=>{
      	return (<div>{r.ConsignmentShipperModel.ShipperTel}</div>)
      }
    },
  ];
  //搜索运单
  function onSearchPage(value){
  	if(value.length<1){
  		getCarPage(1)
  	}
    let carNo = value.car || '';
    dispatch({
      type:'batchlist/getCarlist',
      page:1,
      carNo
    });
  }
   function getPage(page){
    dispatch({
      type:'batchlist/getpagelist',
      page
    })
    dispatch({
    	type:'batchlist/updatePagePage',
    	page
    })
  }
   //确定新增托运单
   function sureAdd(){
   	let options = {
   		LoadingBatchId:totalItem.LoadingBatchId,
   		ConsignmentIds:batchIds,
   		ActionMode:'add'
   	}
   	dispatch({type:'batchlist/sureAddPage',options});
   	dispatch({type:'batchlist/closePageModal'})
   	dispatch({type:'common/keynum'});
   	batchIds=[];
   }
  //批量到站
  function batchIn(){
    if(getBatchInArr.length<1){
      message.destroy();
      message.error('请至少选择一条运输中的托运单!')
    }else{
      if(getBatchSignArr.length>0){
        message.destroy();
        message.error('请确认进行批量操作时托运单的状态!')
      }else{
        dispatch({ type:'batchlist/showSignModal'})
      }
    }
  }
  //批量签收
  function batchSign(){
    if(getBatchSignArr.length<1){
      message.destroy();
      message.error('请至少选择一条已到站的托运单!')
    }else{
      if(getBatchInArr.length>0){
        message.destroy();
        message.error('请确认进行批量操作时托运单的状态!')
      }else{
        dispatch({ type:'batchlist/showSignConsignModal'})
      }
    }
  }
  	return (
    	<div className={styles.normal}>
    		<Button type='primary' style={{position:'absolute',right:'25px',cursor:'pointer',zIndex:'10'}} onClick={goBack}>返回</Button>
    		<Row gutter={16} style={{paddingLeft:'20px'}}>
					<Col className={styles.gutterRow} span={6}>
		        <div className={styles.gutterBox}>
		        	<label>承运批次：</label><span>{totalItem?totalItem.LoadingBatch:''}</span>
		        </div>
				    </Col>
			    <Col className={styles.gutterRow} span={6}>
			        <div className={styles.gutterBox}>
			        	<label>车辆：</label><span>{totalItem?totalItem.LicensePlateNumber+' / '+(totalItem.CarNoEnd?totalItem.CarNoEnd:''):''}</span>
			        </div>
			    </Col>
			    <Col className={styles.gutterRow} span={6}>
			        <div className={styles.gutterBox}>
			        	<label>司机：</label><span>{totalItem?totalItem.DriverName:''}</span>
			        </div>
			    </Col>
				</Row>
				<div style={{margin:'10px 0 20px -10px'}}>
		        <Button className={styles.batch} type='primary' onClick={addNewPage}>新增运单</Button>
		        <Button className={styles.batch} type='primary' onClick={delOldPage}>移除运单</Button>
		        <Button className={styles.batch} type='primary' onClick={batchIn}>批量到站</Button>
		        <Button className={styles.batch} type='primary' onClick={batchSign}>批量签收</Button>
		    </div>
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
       		<Modal
		        visible={showPageModal}
		        title={'选择托运单'}
		        okText="确定"
		        onCancel={onPageCancel}
		        key={keyNum+''}
		        width={1050}
		        maskClosable={false}
		        footer={[
	            <Button key="back" onClick={onPageCancel}>取消</Button>,
	            <Button key="submit" type="primary" onClick={sureAdd}>确定</Button>
          	]}
		      >
	        <Table
	          header={PageHeader}
	          data={pageData}
	          pagination={true}
	          total={totalPage}
	          onChange={getPage}
	          currentPage={pagePage}
	        />
      	</Modal>
    	</div>
  	);
}

function mapStateToProps(state) {
  return {...state.batchlist,...state.login,...state.common};
}

export default connect(mapStateToProps)(BatchList);
