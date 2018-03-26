import React from 'react';
import { connect } from 'dva';
import {routerRedux} from 'dva/router';
import styles from './MyConsignment.less';
import SearchBar from '../../components/searchbar';
import {ModalFormSpec} from '../../components/modalForm'
import Table from '../../components/table';
import ValiInput from '../../components/modalForm/ValidateInput';
import {Button,Tooltip,Icon,Modal,message,Row,Col,Checkbox,Form,Input,DatePicker,InputNumber} from 'antd';
import {formatDate,formatDateTime} from '../../utils/fun_config';
import {RQHEADER} from '../../utils/config'
import Moment from 'moment';

const confirm = Modal.confirm;
const FormItem = Form.Item;
function LoadingCar({dispatch,loadingModalShow,showDriverModal,driverlist,totalDriver,showCar,carList,totalCar,currentConsignmentId,keyNum,carNo,driverName,
                DriverTel,loadingDriver,loadingCar,getAllLoading,loadingIndex,yesStatus,carPage,driverPage,showLoadingEditModal, TruckType, CarId,
                      form: {getFieldDecorator},form,loadingTimes,carIdArr,singleData
}) {
  //确认装车弹框  loadingOk  loadingCancel
  function loadingOk(param){
    param.LicensePlateNumber = carNo;
    param.TruckType = TruckType?TruckType:'';
    param.DriverName = driverName;
    param.DriverTel = DriverTel;
    param.CarId = CarId;
    param.PiecesNumber = param.PiecesNumber&&param.PiecesNumber!=''?param.PiecesNumber:0;
    param.Weight = param.Weight&&param.Weight!=''?param.Weight:0;
    param.Volume = param.Volume&&param.Volume!=''?param.Volume:0;
    param.Remark = param.Remark?param.Remark:'';
    param.StartingAddress = param.StartingAddress?param.StartingAddress:'';
    param.DestinationAddress = param.DestinationAddress?param.DestinationAddress:''
    delete param.bclss;
    delete param.bclssss
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
    };
    if(!(/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/.test(carNo))){
      Modal.warning({
        title: '提示',
        content: '请填写正确的车牌号码...',
      });
      preventDefault()
    }
    dispatch({type:'loadingcar/setCarArr',carNo})
  	dispatch({type:'loadingcar/getLoadingList',param})
  	dispatch({type:'loadingcar/closeLoadingGoods'});
  }
  //取消装车
  function loadingCancel(){
    dispatch({type:'loadingcar/closeLoadingGoods'})
    dispatch({type:'common/keynum'})
  }
//关闭驾驶选选择弹框
  function onDriverCancel(){
    dispatch({type:'loadingcar/closeDriverModal'});
  }
  //搜索驾驶员
  function onSearchDriver(value){
  	if(value.length<1){
  		getDriverPage(1)
  	}
    let name = value.driver || '';
    dispatch({
      type:'loadingcar/getDriverlist',
      page:1,
      name
    })
  }
  //点击驾驶员信息，选择
  function onDriveronOk(record, index, event){
    let {DriverId,Name,Phone} = record;
    dispatch({
      type:'loadingcar/setSelectDriver',
      DriverId,
      driverName:Name,
      Phone
    })
    dispatch({type:'loadingcar/closeDriverModal'});
  }
  //驾驶员列表分页
  function getDriverPage(page){
    dispatch({
      type:'loadingcar/getDriverlist',
      page,
      name:''
    })
    dispatch({
    	type:'loadingcar/updateDriverPage',
    	page
    })
  }
  //关闭车辆选择弹框
  function onCarCancel(){
    dispatch({type:'loadingcar/closeCarModal'});
  }
  //搜索车辆
  function onSearchCar(value){
  	if(value.length<1){
  		getCarPage(1)
  	}
    let carNo = value.car || '';
    dispatch({
      type:'loadingcar/getCarlist',
      page:1,
      carNo
    });

  }
  //点击车辆信息，选择
  function onCaronOk(record, index, event){
    let {CarNo,Id,CarModelName} = record;
    if(carIdArr.indexOf(CarNo)!=-1){
    	message.destroy();
    	message.error('多车时不能选择同一车辆')
    	return;
    }
    dispatch({
      type:'loadingcar/setSelectCarNo',
      carNo:CarNo,
      CarModelName,
      Id
    })
    dispatch({type:'loadingcar/closeCarModal'});
  }
  //车辆列表分页
  function getCarPage(page){
    dispatch({
      type:'loadingcar/getCarlist',
      page,
      carNo
    });
    dispatch({
    	type:'loadingcar/updateCarPage',
    	page
    })
  }

  //确认装车表单数据
  const loadingfields=[
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
      label:'货物名称',
      type:'input',
      name:'GoodsSummary',
      options:{
      	rules:[{
          required:true,
          message:'请填写货物名称'
        },{
        	max:20,
        	message:'请不要超过20个字符'
        }]
      }
    },
    {
      label:'起始地',
      type:'input',
      name:'StartingAddress',
      options:{
      	initialValue:singleData?singleData.StartingAddress:'',
      	rules:[{
          required:true,
          message:'请填写起始地'
        }]
      }
    },
    {
      label:'到达地',
      type:'input',
      name:'DestinationAddress',
      options:{
      	initialValue:singleData?singleData.DestinationAddress:'',
      	rules:[{
          required:true,
          message:'请填写到达地'
        }]
      }
    },
    {
      label:'件数(件)',
      type:'inputNumber',
      name:'PiecesNumber',
      options:{
      	min:0
      }
    },
    {
      label:'重量(吨)',
      type:'inputNumber',
      name:'Weight',
      options:{
        rules:[{
          pattern:/^[1-9]\d*(\.\d+)?$/,
          message:'只能输入大于0的数!'
        }],
        min:0
      }
    },
		{
      label:'体积(方)',
      type:'inputNumber',
      name:'Volume',
      options:{
        rules:[{
          pattern:/^[1-9]\d*(\.\d+)?$/,
          message:'只能输入大于0的数!'
        }],
        min:0
      }
    },
    {
      label:'备注',
      type:'input',
      name:'Remark',
    },
  ];
  //确认装车表单数据
  const loadingfieldsEdit=[
    {
      label: '承运费用(元)',
      type: 'input',
      name: 'CarriageExpenses',
      options:{
      	initialValue:getAllLoading.length>0?(getAllLoading[loadingIndex]?getAllLoading[loadingIndex].CarriageExpenses:''):'',
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
      label:'货物名称',
      type:'input',
      name:'GoodsSummary',
      options:{
      	initialValue:getAllLoading.length>0?(getAllLoading[loadingIndex]?getAllLoading[loadingIndex].GoodsSummary:''):'',
      	rules:[{
          required:true,
          message:'请填写货物名称'
        },{
        	max:20,
        	message:'请不要超过20个字符'
        }]
      }
    },
    {
      label:'起始地',
      type:'input',
      name:'StartingAddress',
      options:{
      	initialValue:singleData?singleData.StartingAddress:'',
      	rules:[{
          required:true,
          message:'请填写起始地'
        }]
      }
    },
    {
      label:'到达地',
      type:'input',
      name:'DestinationAddress',
      options:{
      	initialValue:singleData?singleData.DestinationAddress:'',
      	rules:[{
          required:true,
          message:'请填写到达地'
        }]
      }
    },
    {
      label:'件数(件)',
      type:'inputNumber',
      name:'PiecesNumber',
      options:{
      	min:0,
      	initialValue:getAllLoading.length>0&&getAllLoading[loadingIndex]?(getAllLoading[loadingIndex].PiecesNumber!=0?getAllLoading[loadingIndex].PiecesNumber:''):'',
      }
    },
    {
      label:'重量(吨)',
      type:'inputNumber',
      name:'Weight',
      options:{
      	initialValue:getAllLoading.length>0&&getAllLoading[loadingIndex]?(getAllLoading[loadingIndex].Weight!=0?getAllLoading[loadingIndex].Weight:''):'',
        rules:[{
          pattern:/^[0-9]\d*(\.\d+)?$/,
          message:'只能输入数字!'
        }],
        min:0
      }
    },
		{
      label:'体积(方)',
      type:'inputNumber',
      name:'Volume',
      options:{
      	initialValue:getAllLoading.length>0&&getAllLoading[loadingIndex]?(getAllLoading[loadingIndex].Volume!=0?getAllLoading[loadingIndex].Volume:''):'',
        rules:[{
          pattern:/^[0-9]\d*(\.\d+)?$/,
          message:'只能输入数字!'
        }],
        min:0
      }
    },
    {
      label:'备注',
      type:'input',
      name:'Remark',
      options:{
      	initialValue:getAllLoading.length>0?(getAllLoading[loadingIndex]?getAllLoading[loadingIndex].Remark:''):'',
      }
    },
  ];
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
  //确认弹框
  function onOkSubmit(e){
  	e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        if(getAllLoading.length<1){
	      	message.destroy();
	      	message.error('请至少添加一条装车信息!')
	      }else{
	      	values.LoadingBatch = values.LoadingBatch?values.LoadingBatch:'';
	      	values.LoadingTime = values.LoadingTime?formatDateTime(values.LoadingTime._d)+':00':'';
	      	values.LoadingAddress = values.LoadingAddress?values.LoadingAddress:'';
	      	values.EstimatedTimeOfArrival = values.EstimatedTimeOfArrival?formatDateTime(values.EstimatedTimeOfArrival._d)+':00':'';
	      	values.BatchRemark = values.BatchRemark?values.BatchRemark:'';
	      	values.StartingAddress = values.StartingAddress?values.StartingAddress:'';
	      	values.DestinationAddress = values.DestinationAddress?values.DestinationAddress:'';
	      	let param = {
	      		'ConsignmentId':currentConsignmentId,
	      		'LoadingTruckBatchModel':{
	      			'LoadingBatch':values.LoadingBatch,
	      			'StartingAddress':values.StartingAddress,
	      			'DestinationAddress':values.DestinationAddress,
	      			'LoadingTime':values.LoadingTime,
	      			'LoadingAddress':values.LoadingAddress,
	      			'EstimatedTimeOfArrival':values.EstimatedTimeOfArrival,
	      			'BatchRemark':values.BatchRemark
	      		},
	      		'ConsignTruckSaveModelList':getAllLoading
	      	}
	      	dispatch({type:'loadingcar/sureLoading',param});
	      	dispatch({type:'loadingcar/getLoadingList',getAllLoading});
	      	carIdArr = [];
	      	loadingTimes = '';
	      	dispatch({type:'loadingcar/delCarArr'})
	      }
      }
    });
  }
  //添加装车信息
  function addCars(){
  	dispatch({type:'loadingcar/showLoadingGoods'})
  }
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
 	};
 	//修改装车
 	function updateLoad(index){
 		let carInfo = getAllLoading[index];
 		let {CarId,LicensePlateNumber,DriverName,DriverTel,TruckType} = carInfo
   		dispatch({
   			type:'loadingcar/setSelectCarNo',
   			carNo:LicensePlateNumber,
   			CarModelName:TruckType,
   			Id:CarId
   		}
   			)
   		dispatch({
   			type:'loadingcar/setSelectDriver',
   			driverName:DriverName,
   			Phone:DriverTel,
   		})
   	dispatch({type:'loadingcar/getloadingIndex',index})
 		dispatch({type:'loadingcar/showLoadingEdit'})
 	}
 	//确认修改装车
 	function loadingOkEdit(param){
 		param.LicensePlateNumber = carNo;
    param.TruckType = TruckType?TruckType:'';
    param.DriverName = driverName;
    param.DriverTel = DriverTel;
    param.CarId = CarId;
    param.PiecesNumber = param.PiecesNumber&&param.PiecesNumber!=''?param.PiecesNumber:0;
    param.Weight = param.Weight&&param.Weight!=''?param.Weight:0;
    param.Volume = param.Volume&&param.Volume!=''?param.Volume:0;
    param.Remark = param.Remark?param.Remark:'';
    param.StartingAddress = param.StartingAddress?param.StartingAddress:'';
    param.DestinationAddress = param.DestinationAddress?param.DestinationAddress:''
    delete param.bclss;
    delete param.bclssss
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
    if(!(/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/.test(carNo))){
      Modal.warning({
        title: '提示',
        content: '请填写正确的车牌号码...',
      });
      preventDefault()
    }
    carIdArr.splice(loadingIndex,1,carNo)
    dispatch({type:'loadingcar/removeCarArr',carNo})
    getAllLoading.splice(loadingIndex,1,param)
    dispatch({type:'loadingcar/setLoadingList',getAllLoading});
    dispatch({type:'loadingcar/closeLoadingEdit'})
 	}
 	//取消修改装车
 	function loadingCancelEdit(){
 		dispatch({type:'loadingcar/closeLoadingEdit'})
 	}
 	//删除装车
 	function delLoad(index){
 		confirm({
        title: '提示',
        content: '确定删除这条装车信息吗？',
        onOk: () => {
        	getAllLoading.splice(index,1);
        	carIdArr.splice(index,1);
        	dispatch({type:'loadingcar/getloadingIndex',index})
        	dispatch({type:'loadingcar/delLoadingList'});
        	dispatch({type:'loadingcar/delCarArr'})
        },
        onCancel() {}
      })
 	}
 	//不可选时间
 	function loadTime(c){
 		let loadingTimes = c._d;
 		dispatch({type:'loadingcar/setLoadingTimes',loadingTimes})
 	}
 	function disTime(c){
 		return c && c.valueOf() <= loadingTimes;
 	}
 	//返回
 	function goback(){
 		window.history.go(-1);
 		getAllLoading = [];
 		dispatch({type:'loadingcar/clearLoadingList'})
 		loadingTimes = '';
 		dispatch({type:'loadingcar/delCarArr'})
 	}
  return (
    <div className={styles.normal}>
    <Form onSubmit={onOkSubmit} style={{overflow:'hidden'}}>
    		<div className={styles.loadingTitle}>
    			<p className={styles.loadingTitleP1}>确认装车</p>
    			<Row gutter={16} style={{padding:'20px 20px 0 20px'}}>
						<Col className={styles.gutterRow} span={6} style={{height:'58px'}}>
							<FormItem
								{...formItemLayout}
			          label={(
			            <span>承运批次</span>
			          )}
			        >
			          {getFieldDecorator('LoadingBatch', {
			            rules: [{ required: true, message: '请输入承运批次!' }],
			          })(
			            <Input />
			          )}
			        </FormItem>
				    </Col>
				    <Col className={styles.gutterRow} span={6} style={{height:'58px'}}>
				    	<FormItem
								{...formItemLayout}
			          label={(
			            <span>装车时间</span>
			          )}
			        >
			          {getFieldDecorator('LoadingTime',{
			          	rules: [{ required: true, message: '请选择装车时间!' }],
			          })(
			            <DatePicker showTime format={"YYYY/MM/DD HH:mm:ss"} showToday={false} placeholder="请选择装车日期" onChange={loadTime}/>
			          )}
			        </FormItem>
				    </Col>
				    <Col className={styles.gutterRow} span={6}>
				      <FormItem
								{...formItemLayout}
			          label={(
			            <span>装车地址</span>
			          )}
			        >
			          {getFieldDecorator('LoadingAddress')(
			            <Input />
			          )}
			        </FormItem>
				    </Col>
				    <Col className={styles.gutterRow} span={6}>
				      <FormItem
								{...formItemLayout}
			          label={(
			            <span>预计到货时间</span>
			          )}
			        >
			          {getFieldDecorator('EstimatedTimeOfArrival')(
			            <DatePicker showTime format={"YYYY/MM/DD HH:mm:ss"} showToday={false} placeholder="请选择预计到货日期" disabledDate={disTime}/>
			          )}
			        </FormItem>
				    </Col>
				    <Col className={styles.gutterRow} span={6}>
				      <FormItem
								{...formItemLayout}
			          label={(
			            <span>备注</span>
			          )}
			        >
			          {getFieldDecorator('BatchRemark')(
			            <Input />
			          )}
			        </FormItem>
				    </Col>
					</Row>
					{
						getAllLoading.length>0?getAllLoading.map((item,index)=>(
							<div>
								<p className={styles.loadingTitleP2}>装车信息 {index+1} <Button type='default' onClick={()=>{updateLoad(index)}}>修改</Button><Button type='danger' onClick={()=>{delLoad(index)}}>删除</Button></p>
									<Row gutter={16} style={{padding:'20px'}}>
										<Col className={styles.gutterRow} span={6}>
							        <p className={styles.paddingBottom}><span>车牌号：</span><span>{item.LicensePlateNumber}</span></p>
								    </Col>
								    <Col className={styles.gutterRow} span={6}>
					            <p className={styles.paddingBottom}><span>驾驶员：</span><span>{item.DriverName}</span></p>
								    </Col>
								    <Col className={styles.gutterRow} span={6}>
					            <p className={styles.paddingBottom}><span>联系电话：</span><span>{item.DriverTel}</span></p>
								    </Col>
								    <Col className={styles.gutterRow} span={6}>
					            <p className={styles.paddingBottom}><span>承运费用：</span><span>{item.CarriageExpenses}</span></p>
								    </Col>
								    <Col className={styles.gutterRow} span={6}>
					            <p className={styles.paddingBottom}><span>货物名称：</span><span>{item.GoodsSummary}</span></p>
								    </Col>
								    <Col className={styles.gutterRow} span={6}>
					            <p className={styles.paddingBottom}><span>起始地：</span><span>{item.StartingAddress}</span></p>
								    </Col>
								    <Col className={styles.gutterRow} span={6}>
					            <p className={styles.paddingBottom}><span>到达地：</span><span>{item.DestinationAddress}</span></p>
								    </Col>
								    <Col className={styles.gutterRow} span={6}>
					            <p className={styles.paddingBottom}><span>件数(件)：</span><span>{item.PiecesNumber&&item.PiecesNumber!=0?item.PiecesNumber:''}</span></p>
								    </Col>
								    <Col className={styles.gutterRow} span={6}>
					            <p className={styles.paddingBottom}><span>重量(吨)：</span><span>{item.Weight&&item.Weight!=0?item.Weight:''}</span></p>
								    </Col>
								    <Col className={styles.gutterRow} span={6}>
					            <p className={styles.paddingBottom}><span>体积(方)：</span><span>{item.Volume&&item.Volume!=0?item.Volume:''}</span></p>
								    </Col>
								    <Col className={styles.gutterRow} span={12}>
					            <p className={styles.paddingBottom}><span>备注：</span><span>{item.Remark}</span></p>
								    </Col>
									</Row>
							</div>
						)):null
					}
					<Button type='primary' onClick={addCars}>添加装车信息</Button>
    		</div>
    		<div className={styles.subBtnDiv}>
    			<Button type="primary" htmlType="submit">确定</Button>
    			<Button type="default" onClick={goback}>取消</Button>
    		</div>
    	</Form>
      <ModalFormSpec
        modalKey={keyNum+''}
        visible={loadingModalShow}
        title="确认装车"
        fields={loadingfields}
        otherFields='loading'
        onOk={loadingOk}
        onCancel={loadingCancel}
        Yes={yesStatus}
        okText="确定"
      />
      <ModalFormSpec
        modalKey={keyNum+''}
        visible={showLoadingEditModal}
        title="修改装车"
        fields={loadingfieldsEdit}
        otherFields='loading'
        onOk={loadingOkEdit}
        onCancel={loadingCancelEdit}
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
        zIndex={99999999}
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
        zIndex={99999999}
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
    </div>
  );
}

function mapStateToProps(state) {
  return {...state.loadingcar,...state.login,...state.common};
}

export default connect(mapStateToProps)(Form.create()(LoadingCar));
