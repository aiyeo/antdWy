import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Row,Col, Form, Input,Icon,Layout } from 'antd';
import styles from './Findpass.less'

const FormItem = Form.Item;
const { Footer } = Layout;
function Findpass({dispatch,ValiCode,login,loading,passcode,form:{getFieldDecorator, validateFieldsAndScroll,validateFields}}) {
  const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 14 },
  },
};

//获取验证码
function getCode(e){
 validateFields(['mobiles'],function(errors, values){

  if(!errors){
    const mobiles = values.mobiles;
    dispatch({
      type:'password/showdisable'
    })
    dispatch({
      type:'password/getValiCode',
      mobiles
    })

    let seconds=60;
    let dom = e.target;
    let timer = setInterval(function(){
      seconds--;
      if(seconds>0){
        dom.innerText=`${seconds}s后重试`;
      }else{
      clearInterval(timer);
      dom.innerText=`获取验证码`;
      dispatch({
      type:'password/closedisable'
    })
      }
    },1000);
  }
 });
}
//验证验证码是否正确
function checkCode(rule, value, callback){
     if (value && value !== ValiCode) {
      callback('验证码输入不正确');
    } else {
      callback();
    }
  }
//提交表单
  function handleOk () {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      console.log(values);
      dispatch({ type: 'password/setpass', values })
    })
  }
  //取消重置密码
  function onCancel(){
    //跳转到登录页面
    dispatch(routerRedux.push('/'));
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
          <p>找回密码</p>
        </div>
        <form>
          <FormItem hasFeedback style={{height:'50px',marginBottom:'6px'}}>
            {getFieldDecorator('mobiles', {
              rules: [
                {
                  required: true,
                  message: '请输入手机号码!'
                },
                {
                  pattern:/^1[34578]\d{9}$/,
                  message: '请输入正确格式的手机号码!'
                }
              ],
            })(<Input maxLength={11} prefix={<Icon type="mobile" className={styles.Icons} />} onPressEnter={handleOk} placeholder="请输入手机号码" className={styles.loginInput}/>)}
          </FormItem>
          <FormItem hasFeedback style={{height:'50px',marginBottom:'6px'}}>
             <Row gutter={8}>
              <Col span={14}>
            {getFieldDecorator('Code', {
              rules: [
                {
                  required: true,
                   message: '请输入验证码!'
                },{
                  validator: checkCode
                }

              ],
            })(<Input prefix={<Icon type="key" className={styles.Icons} />} type="text" onPressEnter={handleOk} placeholder="请输入验证码" className={styles.loginInput}/>)}
             </Col>
              <Col span={10} style={{position:'relative',zIndex:'100'}}>
                <Button size="large" className={styles.getCodenum} onClick={getCode} disabled={loading}>获取验证码</Button>
              </Col>
            </Row>
          </FormItem>
           <FormItem hasFeedback style={{height:'52px',marginBottom:'24px'}}>
            {getFieldDecorator('Password', {
              rules: [
                {
                  required: true,
                  message: '请输入新的密码!'
                },{
                  max:20,
                  message: '请输入6-20位密码!',
                },{
                  min:6,
                  message: '请输入6-20位密码!',
                }
              ],
            })(<Input prefix={<Icon type="unlock" className={styles.Icons} />} type="password" onPressEnter={handleOk} placeholder="请输入新的密码" className={styles.loginInput}/>)}
          </FormItem>
          <Row className={styles.btnRow}>
            <Col span={8} offset={4}>
              <Button type="primary" size="large" onClick={handleOk} >
                重置密码
              </Button>
            </Col>
            <Col span={4} offset={2}>
              <Button size="large" onClick={onCancel}>取消</Button>
            </Col>
          </Row>
          <p>如手机未使用，请联系平台客服</p>
        </form>
      </div>
      <div className={styles.foot}>
        <a href="#">川流天下</a>|<a href="#">四川省物流信息中心</a>|<a href="#">无车承运人</a>|<a href="#">好伙伴软件</a>
        <p>无车承运人用户登录系统&emsp;V1.0 2017</p>
      </div>
    </div>
  )
}

Findpass.propTypes = {
  form: PropTypes.object,
  login: PropTypes.object,
  dispatch: PropTypes.func,
}
function mapStateToProps(state) {
  return {...state.password,...state.login};
}
export default connect(mapStateToProps)(Form.create()(Findpass));
