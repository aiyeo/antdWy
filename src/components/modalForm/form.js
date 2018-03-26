import React from 'react'
import ReactDOM from 'react-dom'
import { Button, Input, InputNumber, Select, DatePicker,Upload,Icon,Form,Radio,Switch,TreeSelect,Cascader,Row,Col,Checkbox} from 'antd'
import {loadsh} from '../../utils/fun_config'
import ValiInput from '../../components/modalForm/ValidateInput';
import { connect } from 'dva';
import styles from './index.less'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const InputGroup = Input.Group
const Option = Select.Option
const CheckboxGroup = Checkbox.Group;

class ModForm extends React.Component {
  constructor(props){
    super(props);
  }

  componentDidMount() {
    // eslint-disable-next-line no-restricted-syntax
    for (const component of this.needToEmptyStyleComponents) {
      // eslint-disable-next-line react/no-find-dom-node
      const dom = ReactDOM.findDOMNode(component);
      dom.setAttribute('style', '');
    }
  }

  handleSubmit = (e) => {
    e && e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { onOk , Yes } = this.props
        onOk && onOk(values)
        setTimeout(()=>{
          if(!Yes){
          	this.props.form.resetFields()
          	}
        },1000)
      }
    })
  }
  doCancel = () => {
    const { onCancel } = this.props
    onCancel && onCancel()
    this.props.form.resetFields()
  }

  generateFormItem = ({ formItemLayout, label, hasFeedBack, name, options, component,span }) => {
    const { getFieldDecorator } = this.props.form;
      const {layout}= this.props;
      let spans;
      if(layout =='inline'){
        spans=12
      }else if(layout=='three'){
        spans=8
      }else if(layout=='fourth'){
        spans=6
      }else{
        spans=24
      }
      if(span!=null){
        spans=span;
      }
    return (<Col span={spans} key={name} ><FormItem className={styles.formrow}
      {...formItemLayout}
      key={name}
      label={label}
      hasFeedBack={hasFeedBack}
    >
      {getFieldDecorator(name, options)(component)}
    </FormItem></Col>)
  }

  getTextField = field => <span className="ant-form-text">{field.options && field.options.initialValue}</span>
  getbtn = field=> <Button style={field.style}  onClick ={field.click}>{field.text}</Button>
	getInputGroupField = field =>(
		<InputGroup style={{lineHeight:'1'}}>
			{this.generateFormFields(field.selects)}
    </InputGroup>
	)
  //   (<Input style={field.styles}/>)
  getInputField = field =>(field.disabled ? <Input disabled ={true} style={field.styles}/> :<Input style={field.styles} />)
  getPassField = field => (<Input type='password' />)
	getSelectMut = field=> (<Select
    mode="multiple"
    style={{ width: '100%' }}
    placeholder="请选择"
    onChange={field.options.onChange}
    onBlur={field.options.onBlur}
  >
    {field.items().map(({ key, value }) =>
      <Select.Option key={key.toString()} value={key.toString()}>{value}</Select.Option>)}
  </Select>)
  getInputNumberField = field => <InputNumber
    step={field.options.step}
    placeholder={field.placeholder}
    formatter={field.options.formatter}
    style={{ width: '100%' }}
    max={field.options.max}
    min={field.options.min}
  />

  getTextAreaField = field => (<Input type="textarea" rows={field.options.rows || 4} disabled={field.options.disabled} />)

  getSelectField = field => (<Select
    placeholder="请选择"
    style={field.styles}
    disabled={field.disabled}
    multiple={field.multiple}
  >
    {field.items().map(({ key, value }) =>
      <Select.Option key={key.toString()} value={key.toString()}>{value}</Select.Option>)}
  </Select>)

  getRadioGroupField = field => <RadioGroup>
    {field.items().map(({ key, value }) =>
      <Radio key={key.toString()} value={key.toString()}>{value}</Radio>
    )}
  </RadioGroup>
  getCheckBoxGroupField = field =><CheckboxGroup>
  	{field.items().map(({ key, value }) =>
      <Checkbox key={key.toString()} value={key.toString()}>{value}</Checkbox>
    )}
  </CheckboxGroup>
   getTreeSelectField = field => (<TreeSelect
        treeData={loadsh(field.items,field.id)}
      />)
  getDateField = field => {
	  	return (
	  		<DatePicker  format={field.formate || "YYYY/MM/DD"} onChange={field.onChange} showToday={false} placeholder="请选择日期" disabledDate={field.disabledDate}/>
	  	)
	  }

  getDateTimeField = field =>
    (
      <DatePicker showTime format={field.formate || "YYYY/MM/DD"}
      onChange={field.onChange} showToday={false} placeholder="请选择日期"
      disabledDate={field.disabledDate}
       ref={item => this.needToEmptyStyleComponents.push(item)}
      />
    )

  getSwitchField = field => <Switch
    checkedChildren={field.options.checkedChildren}
    unCheckedChildren={field.options.unCheckedChildren}
    defaultChecked={field.options.initialValue}
  />
  getimg = field =><img onClick={field.options.click} src={field.options.url} style={{maxWidth:'100%',maxHeight:'250px'}} />
  getCascader = field => (<Cascader  options={field.items} loadData={field.loadData}  onChange={field.options.onChange}  changeOnSelect placeholder='请选择'
  />)
  getUploadField = field =>{
   return( <Upload
      name="logo"
      action={field.action}
      headers={field.headers}
      beforeUpload={field.beforeUpload}
      onChange={field.onChange}
      disabled={field.disabled}
      listType='picture'
      defaultFileList={field.options && field.options.initialValue}
      accept='jpg'
    >
      <Button>
        <Icon type="upload" /> 点击上传
      </Button>
   </Upload>)}
   getUploadNumImageField = field =>{
    const uploadButton = (
      <Button>
        <Icon type="upload" />点击上传
      </Button>
    );
    return (
        <Upload
      name="logo"
      action={field.action}
      headers={field.headers}
      beforeUpload={field.beforeUpload}
      onChange={field.onChange}
      disabled={field.disabled}
      listType='picture'
      defaultFileList ={field.fileList}
    >
      {field.fileList.length >=field.imgNum ? null : uploadButton}

   </Upload>
    );
    }
  generateFormFields(fields) {
    const formItemLayout = this.props.formItemLayout || {
      labelCol: { span: 6},
      wrapperCol: { span:15 }
    }
    const components = [];
    this.needToEmptyStyleComponents = [];
    for (const field of fields) {
      let component = null;
      switch (field.type) {
      case 'input':
        component = this.getInputField(field)
        break;
        case 'password':
        component =this.getPassField(field);
        break;
      case 'inputNumber':
        component = this.getInputNumberField(field)
        break;
      case 'select':
        component = this.getSelectField(field)
        break;
      case 'treeSelect':
        component = this.getTreeSelectField(field)
        break;
      case 'radioGroup':
        component = this.getRadioGroupField(field)
        break;
      case 'date':
        component = this.getDateField(field)
        break;
      case 'datetime':
        component = this.getDateTimeField(field)
        break;
      case 'switch':
        component = this.getSwitchField(field)
        break;
      case 'upload':
        component = this.getUploadField(field)
        break;
      case 'uploadNumImage':
        component = this.getUploadNumImageField(field)
        break;
      case 'cascader':
        component = this.getCascader(field)
        break;
      case 'textarea':
        component = this.getTextAreaField(field)
        break;
	    case 'inputgroup':
	    	component = this.getInputGroupField(field)
        break;
      case 'checkboxgroup':
        component = this.getCheckBoxGroupField(field)
        break;
      case 'selectmut':
        component = this.getSelectMut(field)
        break;
      case'btn':
        component = this.getbtn(field);
        break;
        case'image':
          component = this.getimg(field);
          break;
      default:
        component = this.getTextField(field)
        break
      }
      component = this.generateFormItem({
        span:field.span,
        formItemLayout:field.formItemLayout ||formItemLayout,
        component,
        label: field.label,
        name: field.name,
        options: field.options,
        hasFeedBack: field.type === 'input',
      })
      components.push(component);
    }

    return components;
  }
  changeInput(e,setvalue){
     let url = setvalue == 'carNo'?'setSelectCarNo':setvalue=='driverName'?'setSelectDrivername':'setSelectDriPhone';
     this.props.dispatch({
      type:`consignmentCarrier/${url}`,
      [setvalue]:e.target.value
    })
  }
    showCarlist(){
       //打开选择车辆弹框，获取数据
       this.props.dispatch({type:'consignmentCarrier/showCarModal'});
       if(this.props.carList.length==0){//有数据的时候不用再请求
       this.props.dispatch({
        type:'consignmentCarrier/getCarlist',
        page:1,
        carNo:''
      });
    }else{
      return
    }
   }
       //显示选择驾驶人弹框
   showDriverList(){
    this.props.dispatch({type:'consignmentCarrier/showDriverModal'});
    if(this.props.driverlist.length==0){//有数据的时候不用再请求
        this.props.dispatch({
        type:'consignmentCarrier/getDriverlist',
        page:1,
        word:''
      });
    }else{
      return
    }
}
  render() {
    const {
      fields,showCancel,noBtn,otherFields
    } = this.props;
    const buttons = (<FormItem className={styles.formrow}
      key="control-buttons"
      wrapperCol={{
        span: 18,
        offset: 3,
      }}
    >
      <div className={styles.buttons}>
        {this.props.showCancel && <Button onClick={this.doCancel} >取消</Button>}
        {!this.props.noBtn && <Button type="primary" htmlType="submit">{this.props.okText || '确定'}</Button>}
      </div>

    </FormItem>)
    return (
      <div className={styles.formWrapper}>
        <Form onSubmit={this.handleSubmit} ref={(c) => { this.form = c; this.props.cb && this.props.cb(this.handleSubmit) }}>
          {
            otherFields=='loading'?
            <div>
        <Row style={{marginBottom:'20px'}}>
          <Col span={16}>
          <ValiInput
          spans={24}  max={7} min={7} required={true} patter={/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/} message='请输入正确的车牌号'
          labelspan={9} inputspan={14} handleChange={(e)=>this.changeInput(e,'carNo')}
          labelText='车牌号' inputValue={this.props.carNo}  />
          </Col>
          <Col span={2}>
            <Button size='large' style={{marginLeft:'12px'}} onClick={()=>this.showCarlist()}>选择车辆</Button>
          </Col>
        </Row>
        <Row style={{marginBottom:'20px'}}>
            <Col span={16}>
            <ValiInput
            spans={24} required={true} labelspan={9} inputspan={14} handleChange={(e)=>this.changeInput(e,'driverName')}
            labelText='驾驶员' inputValue={this.props.driverName}  />
            </Col>
            <Col span={2}>
              <Button size='large' style={{marginLeft:'12px'}} onClick={()=>this.showDriverList()}>选择司机</Button>
            </Col>
        </Row>
        <Row style={{marginBottom:'20px'}}>
            <Col span={24}>
            <ValiInput patter={/^1[34578]\d{9}$/} max={11} min={11}  message='请填写正确格式的手机号码'
            spans={24} required={true} labelspan={6} inputspan={15} handleChange={(e)=>this.changeInput(e,'Phone')}
            labelText='司机电话' inputValue={this.props.DriverTel}  />
            </Col>
        </Row>
        </div>
          :null
            }
            {this.generateFormFields(fields)}
            {buttons}
        </Form>
      </div>
    )
  }
}

const ModalForm = Form.create()(ModForm)
function mapStateToProps(state) {
  return {...state.consignmentCarrier};
}
export default connect(mapStateToProps)(ModalForm);
//export default ModalForm
