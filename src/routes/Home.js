import React from 'react';
import { connect } from 'dva';
import {Row,Col,Alert,Button } from 'antd';
import styles from './Home.css';
import MessagePanel from '../components/MessagePanel/messagePanel';
import Tabel from '../components/table/index';
import {Link,routerRedux} from 'dva/router';

function Home({dispatch,messagelist,loadingTable,totalList,AllCount,ArrivedCount,MovingCount,AlreadySignedCount,RejectionCount,pageIndex,Status,showBtn,RoleId,ParentId}) {
  const colums = [
    {
	    title: '发送时间',
	    dataIndex: 'AddTime',
	    key: 'AddTime',
    },
    {
	    title: '消息内容',
	    dataIndex: 'Info',
	    key: 'Info',
    },
  ];

  //分页获取列表
  function getListPage(page){
    dispatch({type:'homepage/getmessagelist',pageIndex:page})
    dispatch({type:'homepage/updatePage',page})
  }
  //关闭Alert框
  function onClose (){
  	dispatch({type:'login/ShowBtn'});
  }
  function identifyInfo(){
    dispatch({type:'login/Closeusermodal'});
     //1:司机个人  2：发货方、货主 3：收货方 4：承运方
    if(RoleId==1){
        dispatch(routerRedux.push(`/identiinfo`));
    }else if(RoleId==2){
        dispatch(routerRedux.push(`/certification/2/`+Status));
    }else if(RoleId==4){
        dispatch(routerRedux.push(`/certification/4/`+Status));
    }
  }
  const alertModal = (
  	<div style={{padding:'10px 0 20px 0'}}>
  		{(Status==1||Status==4)&&RoleId!=3&&ParentId==null?<Alert
    			message="系统提示"
    			description="您还没有进行认证，想获得更多服务，请尽快完成认证!"
    			type="warning"
    			showIcon
    			banner
    			closable
    			onClose={onClose}
  			/>:null}
  		<div style={{position:'absolute',left:'500px',top:'100px',zIndex:'100'}}>
	  		{(Status==1||Status==4)&&RoleId!=3&&ParentId==null?<Button size='large' onClick={identifyInfo} style={{background:'#fcf600',color:'#008cee',fontWeight:'bold',fontSize:'16px'}}>即刻认证</Button>:null}
	  	</div>
  	</div>
  )
  return (
    <div className={styles.normal}>
    	{showBtn?alertModal:null}
      <Row gutter={24} className={styles.messagePanel}>
        <Col span={6} className={styles.panelCol}>
          <MessagePanel textNum={AllCount} description='运单总数' textcolor='#5CB85C' icontype='switcher' />
        </Col>
        <Col span={6} className={styles.panelCol}>
          <MessagePanel textNum={MovingCount} description='运输中运单' textcolor='#5BC0DE'  icontype='car' />
        </Col>
        <Col span={6} className={styles.panelCol}>
          <MessagePanel textNum={ArrivedCount} description='已到站运单' textcolor='#D9534F'  icontype='download' />
        </Col>
        <Col span={6} className={styles.panelCol}>
          <MessagePanel textNum={AlreadySignedCount} description='已签收运单' textcolor='#F0AD4E'  icontype='heart' />
        </Col>
      </Row>
      <Row>
        <h3 className={styles.tabheader}>消息列表</h3>
      </Row>
      <Row>
        <Col span={24}>
          <Tabel
            data={messagelist} header={colums} loadinig ={loadingTable}
            total = {totalList} onChange={getListPage}
            pageSize={15}
            currentPage={pageIndex}
           />
        </Col>
      </Row>
    </div>
  );
}

function mapStateToProps(state) {
  return {...state.homepage,...state.login};
}

export default connect(mapStateToProps)(Home);
