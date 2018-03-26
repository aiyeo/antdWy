import React from 'react';
import {connect} from 'dva';
import { Menu, Icon, Layout, Modal,Button ,message} from 'antd'
import {Link,routerRedux} from 'dva/router';
import styles from  './header.less';
import { hashHistory } from 'dva/router';
import {FormModal} from '../components/modalForm';

const SubMenu = Menu.SubMenu
const { Header } = Layout

function Top ({dispatch,RoleId,Account,loginsuccess,modalShowEdit,modalShowuser,Status,RegistTime,
	Type,Usertype,Level,Username,Regtime,collapsed,toggle,CompanyName,MemberRoleName,repeatCode,checkCode,yesStatus,ParentId,AuthorizeRoleName}) {
  var identText='';
    const MemberId = sessionStorage.getItem('MemberId');
    let identBtn='';
    if(Status==1){
        identText='未认证';
       identBtn= <Button type="primary" size="small" onClick={identifyInfo}>去认证</Button>;
    }
    if(Status==2){
        identText='认证成功';
    }
    if(Status==3){
        identText='审核中';
        identBtn = '查看认证资料'
        identBtn= '';
    }
    if(Status==4){
        identText='审核被驳回';
        identBtn= <Button type="primary" size="small" onClick={identifyInfo}>修改认证资料</Button>;
    }

    //修改密码框的弹框内容
   const  fields = [{
          label: '原密码',
          type: 'password',
          name: 'OldPassword',
              options: {
              rules: [{
                  required: true,
                  message: '请填写原密码!',
              }
              ]
          }
      },{
          label: '新密码',
          type: 'password',
          name: 'NewPassword1',
          options: {
              rules: [{
                  required: true,
                  message: '请填写新的密码!',
              },{
                max:20,
                message: '请输入6-20位密码!',
              },{
                min:6,
                message: '请输入6-20位密码!',
              }],
              onChange:(e)=>{
              	let repeatCode = e.target.value;
              	dispatch({type:'login/RepeatCode',repeatCode});
              }
          }
      },{
          label: '确认新密码',
          type: 'password',
          name: 'NewPassword',
          options: {
              rules: [{
                  required: true,
                  message: '请再次填写新的密码!',
              },{
                max:20,
                message: '请输入6-20位密码!',
              },{
                min:6,
                message: '请输入6-20位密码!',
              }],

              onChange:(e)=>{
              	let checkCode = e.target.value;
              	if(repeatCode!=checkCode){
              		dispatch({type:'password/getyesStatus'});
              	}
              	dispatch({type:'login/CheckCode',checkCode})
              }
          }
      }
  ];
    //头部菜单操作
    function clickMenu(item){
        //退出
        if (item.key === 'logOut') {
            dispatch({
                type: 'login/logout'
             })

            if(!loginsuccess){
                 sessionStorage.removeItem('access_token');
                 //dispatch(routerRedux.push('/'));
            }
        }
        //修改密码
        if(item.key=='editpass'){
            //显示修改密码框
             dispatch({type:'password/showEditpass'})
        }
        //显示账号信息
        if(item.key=='userinfo'){
            //显示账号信息框

            dispatch({
                type:'login/getuserinfo',
                MemberId
            })
        }
    }

   //确认修改密码
   function onOkEdit(param){
   	if(repeatCode!=checkCode){
   		message.destroy()
   		message.error('两次输入的新密码不匹配，请验证输入!');
   		dispatch({type:'password/getyesStatus'});
   		return false;
   	}else{
   		dispatch({
            type:'password/editpass',
            param
        })
   	}
   }
  //取消修改密码
  function onCancelEdit(){
    dispatch({type:'password/closeEditpass'})
  }
  //认证用户信息
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
  //取消认证
  function onCancelIdent(){
    dispatch({type:'login/Closeusermodal'})
  }
  //设置用户名显示
    if(!Account){
        Account=sessionStorage.getItem('user')
    }
    return (
      <div>
        <Header className={styles.header} style={{ background: '#fff'}}>
          {/*<span style={{float:'left',fontSize:14}}>
            <Icon
              className={styles.trigger}
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={toggle}
            />隐藏侧边栏
          </span>*/}
          <div className={styles.headerLogo}></div>
          <div className={styles.CompanyNameInfo}>
          	<span className={styles.welcomeInfo}>会员类型：<span className={styles.CompanyColor}>{Usertype}</span></span>
          	<span className={styles.welcomeInfo}>所属角色：<span className={styles.CompanyColor}>{ParentId==null?'超级管理员':AuthorizeRoleName}</span></span>
          	{RoleId!=3&&RoleId!=1?<span>公司名称：<span className={styles.CompanyColor}>{CompanyName?CompanyName:Account}</span></span>:null}

          </div>
            <Menu mode="horizontal"  onClick={clickMenu}  className={styles.headerInfo}>
                {/*<Menu.Item key="editpass"><Icon type="edit"  style={{ fontSize: 14 }}/>修改密码</Menu.Item>
                <Menu.Item key="userinfo"><Icon type="user"  style={{ fontSize: 14 }}/>账号信息</Menu.Item>*/}
                <SubMenu title={<span><Icon type="user" />{Account}</span>} >
	                <Menu.Item key="userinfo"><Icon type="user"  style={{ fontSize: 14 }}/>账号信息</Menu.Item>
	                <Menu.Item key="editpass"><Icon type="edit"  style={{ fontSize: 14 }}/>修改密码</Menu.Item>
                 	<Menu.Item key="logOut"><Icon type="logout"  style={{ fontSize: 14 }}/>退出登录</Menu.Item>
                </SubMenu>
            </Menu>
            <FormModal modalKey="edit"
            visible={modalShowEdit}
            title="修改密码"
            fields={fields}
            onOk={onOkEdit}
            onCancel={onCancelEdit}
            okText="修改"
            Yes={yesStatus}
        />
         <Modal modalKey="userinfo"
            visible={modalShowuser}
            title="账号信息"
            footer={null}
            onCancel={onCancelIdent}
        >
        <ul className={styles.userinfo}>
            <li>登录账号：<span>{Account}</span></li>
            {RoleId!=3&&RoleId!=1?<li>公司名称：<span>{CompanyName}</span></li>:null}
            {RoleId!=3&&RoleId!=1?<li>账号状态：
                <span>{identText}</span>
                {identBtn}
            </li>:null}
            <li>注册时间：<span>{Regtime.split('T').join(' ')}</span></li>
            <li>账号类型：<span>{Usertype}</span></li>
            <li>会员等级：<span>{Level}</span></li>
        </ul>
        </Modal>

        </Header>
      </div>
    );

}
function mapStateToProps(state) {
  return {...state.login,...state.userinfo,...state.password,...state.common};
}

export default connect(mapStateToProps)(Top);
