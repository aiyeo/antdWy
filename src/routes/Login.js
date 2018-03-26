import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Button, Row,notification, Icon, message , Layout,Col} from 'antd';
import styles from './Login.less';
import {platform} from '../utils/config';
import {uuid} from '../utils/fun_config';

const FormItem = Form.Item
function Login({loginsuccess,dispatch,checkLogin,code,guid,form: {getFieldDecorator,validateFieldsAndScroll,validateFields}}) {
  //验证验证码是否输入对
  function checkCode(rule, value, callback){
     if (value && value !== code) {
      callback('验证码输入不正确');
    } else {
      callback();
    }
  }
  //登录提交
  function handleOk () {
  		validateFieldsAndScroll((errors, values) => {
      	if (!errors) {
       		dispatch({type:'login/login',values,guid})
      	}
    	})

  }
  function loadingcode(){
    let guid=uuid();
    //刷新验证码
    dispatch({ type:'login/getcode',guid})
  }
  function toPassword(){
    //跳转到忘记密码
     dispatch(routerRedux.push('/password'));
  }


  return (
    <div className={styles.loginpagewrap}>
      <div className={ `${styles.header}`}>
        <div className={ `${styles.container}`}>
          <div className={ `${styles.leftLogo}`}>
            <div className={styles.blueBar}></div>
          </div>
          <div className={styles.rightLogo}></div>
        </div>
      </div>
      <div className={styles.form}>
        <div className={styles.formText}>
          <p>用户登录</p>
          <p>{platform} · 无车承运人系统</p>
        </div>
        <div className={styles.QRpic}></div>
        <form  onSubmit={handleOk}>
              <FormItem hasFeedback style={{height:'50px',marginBottom:'6px'}}>
                {getFieldDecorator('Account', {
                  rules: [
                    {
                      required: true,message: '请输入用户名'
                    },
                    {
                    	pattern:/^1[34578]\d{9}$/,
          						message:'请填写正确格式的手机号码!'
                    },
                  ],
                })(<Input maxLength={11} prefix={<Icon type="user" className={styles.Icons} />} onPressEnter={handleOk} placeholder="请输入用户名(手机号)" className={styles.loginInput}/>)}
              </FormItem>

              <FormItem hasFeedback style={{height:'50px',marginBottom:'6px'}}>
                {getFieldDecorator('Password', {
                  rules: [
                    {
                      required: true,message: '请输入密码'
                    },
                  ],
                })(<Input prefix={<Icon type="unlock" className={styles.Icons} />} type="password" onPressEnter={handleOk} placeholder="请输入密码" className={styles.loginInput}/>)}
              </FormItem>

          <Row>
            <Col span={15}>
              <FormItem hasFeedback style={{height:'52px',marginBottom:'24px'}}>
              {getFieldDecorator('Captcha', {
                rules: [
                  {
                    required: true,message: '请输入正确的验证码'
                  },{
                    validator: checkCode
                  }
                ],
              })(<Input prefix={<Icon type="key" className={styles.Icons} />} autoComplete='off' type="text" onPressEnter={handleOk} placeholder="请输入验证码" className={styles.loginInput}/>)}
            </FormItem>
            </Col>
            <Col span={9}>
              <span id='code' className={styles.checkcode} onClick={loadingcode}>{code}</span>
            </Col>
          </Row>

          <Button type="primary"  onClick={handleOk} className={styles.loginBtn}>
            登&emsp;录
          </Button>
          <div className={styles.forgetpass}><a onClick={toPassword}>忘记密码？</a></div>

        </form>
      </div>
      <div className={styles.foot}>
        <a href="#">{platform}</a>|<a href="#">四川省物流信息公司</a>|<a href="#">无车承运人</a>|<a href="#">好伙伴软件</a>
        <p>无车承运人会员管理系统&emsp;V1.0 2017</p>
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  return {...state.login};
}
export default connect(mapStateToProps)(Form.create()(Login));
