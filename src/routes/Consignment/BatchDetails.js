import React from 'react';
import { connect } from 'dva';
import {routerRedux} from 'dva/router';
import {FormModal} from '../../components/modalForm'
import Table from '../../components/table';
import ValiInput from '../../components/modalForm/ValidateInput';
import {Button,Tooltip,Icon,Modal,message,Row,Col,Checkbox,Tabs,Steps} from 'antd';
import {formatDate,formatDateTime} from '../../utils/fun_config';
import {RQHEADER} from '../../utils/config'
import Moment from 'moment';
import styles from './BatchDetails.less'

const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
const Step = Steps.Step;
function BatchManageDetail({dispatch,loading,pageIndex,total,item}) {
	const tData = item.ConsignmentModelList?item.ConsignmentModelList:[];
	const tableHeader =[
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
	      	return (<div>{record.ConsignmentCarrierModel.LoadingTime.split('T').join(' ')}</div>)
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
	          return (<div><span style={{color:'#3498db'}}>{t}</span></div>)
	        }else if(t==3){
	          t='已到站';
	          return (<div><span style={{color:'#3498db'}}>{t}</span></div>)
	        }else if(t==4){
	          t='已签收';
	          return (<div><span style={{color:'#2ecc71'}}>{t}</span></div>)
	        }
	      }
	    },
  	];
	//运单列表
	function getConsignListPage(page){
		
	}
	//查看运单详情
	function checkListDetail(key,ConsignmentId){
		//dispatch(routerRedux.push(`/ConsignmentDetail/${ConsignmentId}`));
	}
	//返回
	function goBack(){
		window.history.go(-1)
	}
  	return (
    	<div>
    		<Button type='primary' style={{position:'absolute',right:'25px',cursor:'pointer',zIndex:'10'}} onClick={goBack}>返回</Button>
    		<Tabs defaultActiveKey="1">
			    <TabPane tab="批次详情" key="1">
			    	<div className={styles.TabWrap}>
			    		<div className={styles.processDiv}>
			    			<Steps>
							    <Step status='finish' title="未装车" />
							    <Step status={item?(item.TruckBatchStatus==1?'process':item.TruckBatchStatus>1?'finish':'process'):''} title="运输中"  />
							    <Step status={item?(item.TruckBatchStatus==2?'process':item.TruckBatchStatus>2?'finish':'wait'):''} title="已到站" />
							    <Step status={item?(item.TruckBatchStatus==3?'finish':'wait'):'wait'} title="已签收" />
								</Steps>
			    		</div>
			    		<div className={styles.batchDetailsDiv}>
			    			<div className={styles.gutterExample}>
				    			<Row gutter={16}>
								    <Col className={styles.gutterRow} span={6}>
								        <div className={styles.gutterBox}>
								        	<label>起始地：</label><span>{item?item.StartingAddress:''}</span>
								        </div>
								    </Col>
								    <Col className={styles.gutterRow} span={6}>
								        <div className={styles.gutterBox}>
								        	<label>到达地：</label><span>{item?item.DestinationAddress:''}</span>
								        </div>
								    </Col>
								    <Col className={styles.gutterRow} span={6}>
								        <div className={styles.gutterBox}>
								        	<label>承运批次：</label><span>{item?item.LoadingBatch:''}</span>
								        </div>
								    </Col>
								    <Col className={styles.gutterRow} span={6}>
								        <div className={styles.gutterBox}>
								        	<label>状态：</label><span style={{color:'#108ee9'}}>{item?(item.TruckBatchStatus==1?'运输中':item.TruckBatchStatus==2?'已到站':item.TruckBatchStatus==3?'已签收':''):''}</span>
								        </div>
								    </Col>
								</Row>
								<Row gutter={16}>
								    <Col className={styles.gutterRow} span={6}>
								        <div className={styles.gutterBox}>
								        	<label>车牌号-车头：</label><span>{item?item.LicensePlateNumber:''}</span>
								        </div>
								    </Col>
								    <Col className={styles.gutterRow} span={6}>
								        <div className={styles.gutterBox}>
								        	<label>车牌号-车尾：</label><span>{tData?tData.CarNoEnd:''}</span>
								        </div>
								    </Col>
								    <Col className={styles.gutterRow} span={6}>
								        <div className={styles.gutterBox}>
								        	<label>驾驶员：</label><span>{item?item.DriverName:''}</span>
								        </div>
								    </Col>
								    <Col className={styles.gutterRow} span={6}>
								        <div className={styles.gutterBox}>
								        	<label>联系电话：</label><span>{item?item.DriverTel:''}</span>
								        </div>
								    </Col>
								</Row>
								<Row gutter={16}>
								    <Col className={styles.gutterRow} span={6}>
								        <div className={styles.gutterBox}>
								        	<label>批次承运费用：</label><span>{item?item.CarriageExpenses:''}</span>
								        </div>
								    </Col>
								</Row>
							</div>
			    		</div>
			    		<div>
			    			<Table
			    				onCtrlClick={ checkListDetail }
		          		pagination={ true }
		          		header={tableHeader }
		          		data={tData}
		          		defaultExpandAllRows={ true }
		          		total={total}
		          		onChange={getConsignListPage}
		          		loading={loading}
		          		currentPage={pageIndex}
		          		action={row => [{
			                key: 'check',
			                name: '查看',
			                color: 'green',
			                icon: 'eye-o'
			            }]}
				      	/>
			    		</div>
			    	</div>
			    </TabPane>
			    <TabPane tab="运输信息" key="2">
			    	<div className={styles.TabWrap}>
			    		<div className={styles.batchDetailsDiv}>
			    			<div className={styles.gutterExample}>
								<Row gutter={16}>
									<Col className={styles.gutterRow} span={6}>
								        <div className={styles.gutterBox}>
								        	<label>驾驶员：</label><span>{item?item.DriverName:''}</span>
								        </div>
								    </Col>
								    <Col className={styles.gutterRow} span={6}>
								        <div className={styles.gutterBox}>
								        	<label>联系电话：</label><span>{item?item.DriverTel:''}</span>
								        </div>
								    </Col>
								    <Col className={styles.gutterRow} span={6}>
								        <div className={styles.gutterBox}>
								        	<label>车牌号-车头：</label><span>{item?item.LicensePlateNumber:''}</span>
								        </div>
								    </Col>
								    <Col className={styles.gutterRow} span={6}>
								        <div className={styles.gutterBox}>
								        	<label>车牌号-车尾：</label><span>{tData?(tData.ConsignmentCarrierModel?ConsignmentCarrierModel.CarNoEnd:''):''}</span>
								        </div>
								    </Col>
								    <Col className={styles.gutterRow} span={6}>
								        <div className={styles.gutterBox}>
								        	<label>车辆类型：</label><span>{item?item.TruckType:''}</span>
								        </div>
								    </Col>
								</Row>
							</div>
			    		</div>
			    	</div>
			    </TabPane>
			    <TabPane tab="三方信息" key="3">
			    	<div className={styles.TabWrap}>
			    		<div className={styles.batchDetailsDiv}>
			    			<div className={styles.gutterExample}>
			    				<div className={styles.threeParts}>发货方信息</div>
				    			{
					    			tData.map((option)=>(
											<Row gutter={16}>
										    <Col className={styles.gutterRow} span={6}>
										        <div className={styles.gutterBox}>
										        	<label>发货单位：</label><span>{option.ConsignmentShipperModel.CompanyName}</span>
										        </div>
										    </Col>
										    <Col className={styles.gutterRow} span={4}>
										        <div className={styles.gutterBox}>
										        	<label>发货人：</label><span>{option.ConsignmentShipperModel.ShipperName}</span>
										        </div>
										    </Col>
										    <Col className={styles.gutterRow} span={4}>
										        <div className={styles.gutterBox}>
										        	<label>联系电话：</label><span>{option.ConsignmentShipperModel.ShipperTel}</span>
										        </div>
										    </Col>
										    <Col className={styles.gutterRow} span={5}>
										        <div className={styles.gutterBox}>
										        	<label>发货地址：</label><span>{option.ConsignmentShipperModel.ShipperAddress}</span>
										        </div>
										    </Col>
										    <Col className={styles.gutterRow} span={5}>
										        <div className={styles.gutterBox}>
										        	<label>运单编号：</label><span>{option.SysCode}</span>
										        </div>
										    </Col>
											</Row>)
										)
					    		}
								<div className={styles.threeParts}>承运方信息</div>	
								<Row gutter={16}>
							    <Col className={styles.gutterRow} span={8}>
							        <div className={styles.gutterBox}>
							        	<label>承运单位：</label><span>{item.ConsignmentModelList?item.ConsignmentModelList[0].ConsignmentCarrierModel.CompanyName:''}</span>
							        </div>
							    </Col>
							    <Col className={styles.gutterRow} span={8}>
							        <div className={styles.gutterBox}>
							        	<label>负责人：</label><span>{item.ConsignmentModelList?item.ConsignmentModelList[0].ConsignmentCarrierModel.ContactName:''}</span>
							        </div>
							    </Col>
							    <Col className={styles.gutterRow} span={8}>
							        <div className={styles.gutterBox}>
							        	<label>联系电话：</label><span>{item.ConsignmentModelList?item.ConsignmentModelList[0].ConsignmentCarrierModel.ContactTel:''}</span>
							        </div>
							    </Col>
								</Row>
								<div className={styles.threeParts}>收货方信息</div>	
								{
				    			tData.map((option)=>(
										<Row gutter={16}>
									    <Col className={styles.gutterRow} span={6}>
									        <div className={styles.gutterBox}>
									        	<label>收货单位：</label><span>{option.ConsignmentReceivingModel.CompanyName}</span>
									        </div>
									    </Col>
									    <Col className={styles.gutterRow} span={4}>
									        <div className={styles.gutterBox}>
									        	<label>收货人：</label><span>{option.ConsignmentReceivingModel.ReceivingName}</span>
									        </div>
									    </Col>
									    <Col className={styles.gutterRow} span={4}>
									        <div className={styles.gutterBox}>
									        	<label>联系电话：</label><span>{option.ConsignmentReceivingModel.ReceivingTel}</span>
									        </div>
									    </Col>
									    <Col className={styles.gutterRow} span={5}>
									        <div className={styles.gutterBox}>
									        	<label>收货地址：</label><span>{option.ConsignmentReceivingModel.ReceivingAddress}</span>
									        </div>
									    </Col>
									    <Col className={styles.gutterRow} span={5}>
									        <div className={styles.gutterBox}>
									        	<label>运单编号：</label><span>{option.SysCode}</span>
									        </div>
									    </Col>
										</Row>)
									)
				    		}
							</div>
			    		</div>
			    	</div>
			    </TabPane>
			</Tabs>
    	</div>
  	);
}

function mapStateToProps(state) {
  	return {...state.batchdetails,...state.login,...state.common};
}

export default connect(mapStateToProps)(BatchManageDetail);
