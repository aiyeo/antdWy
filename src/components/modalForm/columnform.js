import React from 'react'
import ReactDOM from 'react-dom'
import { Button, Input, InputNumber, Select, DatePicker,Form,Radio,Switch,TreeSelect,Row,Col,Upload,Icon,Cascader,Checkbox} from 'antd'
import {loadsh} from '../../utils/fun_config'
import styles from './index.less'

const FormItem = Form.Item
const RadioGroup = Radio.Group

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
        const { onOk, Yes } = this.props;
        onOk && onOk(values)
        setTimeout(()=>{
          if(!Yes){this.props.form.resetFields()}
        },1000)
      }
    })
  }
  doCancel = () => {
    const { onCancel } = this.props
    onCancel && onCancel()
    this.props.form.resetFields()
  }

  generateFormItem = ({ formItemLayout, label, hasFeedBack, name, options, component }) => {
    const { getFieldDecorator } = this.props.form;
      const {layout}= this.props;
      let spans= layout=='inline' ? 12 :24;
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

  getInputField = field => (field.disabled ? <Input disabled ={true} /> :<Input />)
  getPassField = field => (<Input type='password' />)

  getInputNumberField = field => <InputNumber
    step={field.options.step}
    style={{ width: '100%' }}
  />

  getTextAreaField = field => (<Input type="textarea"  rows={4} />)

  getSelectField = field => (<Select
    placeholder="请选择"
    style={{
      width: '100%',
    }}
    disabled={field.disabled}
    multiple={field.multiple}
  >
    {field.items().map(({ key, value }) =>
      <Select.Option key={key} value={key}>{value}</Select.Option>)}
  </Select>)

  getRadioGroupField = field => <RadioGroup>
    {field.items().map(({ key, value }) =>
      <Radio key={key.toString()} value={key.toString()}>{value}</Radio>
    )}
  </RadioGroup>
   getTreeSelectField = field => (<TreeSelect
        treeData={loadsh(field.items,field.id)}
      />)

  getDateField = field => (<DatePicker
    showToday={false}
    placeholder="请选择日期"
  />)

  getDateTimeField = field =>
    (<DatePicker
      showTime
      format="YYYY-MM-DD"
      placeholder="请选择时间"
      showToday={false}
    />)

  getSwitchField = field => <Switch
    checkedChildren={'开'}
    unCheckedChildren={'关'}
    disabled={field.options.disabled}
    defaultChecked={field.options.initialValue}
  />

  // getUploadField = field =>
  //   <Upload
  //     name="logo"
  //     action="/"
  //     listType="picture"
  //     beforeUpload={field.options.beforeUpload}
  //     onChange={field.options.onChange}
  //     disabled={field.options.disabled}
  //   >
  //     <Button>
  //       <Icon type="upload" /> 点击上传
  //   </Button>
  //   </Upload>
  getUploadField = field =>
  <Upload
      name="logo"
      action={field.action}
      headers={field.headers}
      beforeUpload={field.beforeUpload}
      onChange={field.onChange}
      disabled={field.disabled}
      listType='picture'
      defaultFileList={field.options.initialValue}
    >
      <Button>
        <Icon type="upload" /> 点击上传
    </Button>
    </Upload>
  getCheckBoxField = field => <Checkbox ></Checkbox>
  getImage =field => <img src={field.url} width='100%'/>
  getCascader = field => (<Cascader  options={field.items} loadData={field.loadData}  onChange={field.options.onChange}  changeOnSelect />)
  generateFormFields(fields) {
    const formItemLayout = this.props.formItemLayout || {
      labelCol: { span: 6},
      wrapperCol: { span:14 }
    }
    const components = [];
    this.needToEmptyStyleComponents = [];
    // eslint-disable-next-line no-restricted-syntax
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
      case 'textarea':
        component = this.getTextAreaField(field)
        break;
      case 'cascader':
        component = this.getCascader(field)
        break;
      case 'image':
      	component = this.getImage(field)
      	break;
      default:
        component = this.getTextField(field)
        break
      }
      component = this.generateFormItem({
        formItemLayout,
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

  render() {
    const {formitems,okText} = this.props;
    const _self = this;
    const buttons = (<FormItem className={styles.formrow}
      key="control-buttons"
      wrapperCol={{
        span: 14,
        offset: 6,
      }}
    >
      <div className={styles.buttons}>
        {this.props.showCancel && <Button onClick={this.doCancel} >取消</Button>}
        {!this.props.noBtn && <Button type="primary" htmlType="submit">{okText || '确定'}</Button>}
      </div>
    </FormItem>)
    return (
      <div className={styles.formWrapper}>
        <Form onSubmit={this.handleSubmit} ref={(c) => { this.form = c; this.props.cb && this.props.cb(this.handleSubmit) }}>
           {
             formitems.map(item=>
               (
                 <div>
                    <Row className={styles.formrow}>
                      <Col span={24}><p className={styles.columtag}>{item.ColumnText}</p> </Col>
                    </Row>
                    {_self.generateFormFields(item.fields)}
                 </div>
               )
            )
            }

            {buttons}
        </Form>
      </div>
    )
  }
}

const ColumnForm = Form.create()(ModForm)

export default ColumnForm
