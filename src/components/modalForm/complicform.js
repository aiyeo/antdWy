import React from 'react'
import ReactDOM from 'react-dom'
import { Button, Input, InputNumber, Select, DatePicker,Form,Radio,Switch,TreeSelect,Row,Col,Upload,Icon,Cascader,Checkbox} from 'antd'
import {loadsh} from '../../utils/fun_config'
import styles from './index.less'
import Table from '../table';
import EditTable from '../editTable/editTable'

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
    e && e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { onOk,Yes } = this.props
        onOk && onOk(values,'save');
        setTimeout(()=>{
          if(!Yes){this.props.form.resetFields()}
        },1000)
      }
    })
  }
  handledraftSubmit=(e)=>{
    e && e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { onOk } = this.props
        onOk && onOk(values,'draft')
        setTimeout(()=>{
          this.props.form.resetFields()
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

  getInputField = field => (field.disabled ? <Input disabled ={true} /> :<Input onChange={field.onChange} />)
  getPassField = field => (<Input type='password' />)

  getChangeInputField = field => {
    return (<div> <span onClick={field.onspanChange} style={{display:field.disabled ?'inline-block':'none',height:'32px',position:'absolute',border:'1px solid #D9D9D9',width:'100%',borderRadius:'5px',paddingLeft:'4px'}}>{field.options.initialValue}</span>
   <Input value={field.options.initialValue} style={{display:field.disabled ?'none':'inline-block',position:'absolute',height:'32px'}} onChange={field.onChange} /></div>)
  }

  getInputNumberField = field =>(field.disabled ?
  <InputNumber disabled={true}
    step={field.options.step}
    style={{ width: '100%' }}
    onChange={field.options.onChange}
  />:<InputNumber
    step={field.options.step}
    style={{ width: '100%' }}
    onChange={field.options.onChange}
  />)
  getInputNumberField2 = field =>{
    return(
      <div>
        <span style={{display:field.disabled ? 'inline-block':'none',height:'32px',position:'absolute',backgroundColor:'#F7F7F7',border:'1px solid #D9D9D9',width: '100%',borderRadius:'5px',paddingLeft:'4px'}}>0</span>
        <Input onChange={field.onChange}
    style={{display:field.disabled ?'none':'inline-block', width:'100%',height:'32px',position:'absolute',}}
  />
      </div>
    )
  }

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

  getRadioGroupField = field => <RadioGroup onChange={field.onChange}>
    {field.items().map(({ key, value }) =>
      <Radio key={key.toString()} value={key.toString()}>{value}</Radio>
    )}
  </RadioGroup>
   getTreeSelectField = field => (<TreeSelect
        treeData={loadsh(field.items,field.id)}
      />)

//getDateField = field => (<DatePicker
//  showToday={false}
//  placeholder="请选择日期"
///>)
	  getDateField = field => {
	  	return (
	  		<DatePicker onChange={field.onChange} showToday={false} placeholder="请选择日期" disabledDate={field.options.disabledDate}/>
	  	)
	  }

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
  getCheckBoxField = field => <Checkbox onChange={field.onChange} defaultChecked={field.checked}>{field.text}</Checkbox>
  getImage =field => <img onClick={field.options.click} src={field.url} style={{maxHeight:'300px',maxWidth:'100%'}}/>
  getbtn = field=> <Button style={field.style}  onClick ={field.click}>{field.text}</Button>
  getCascader = field => (<Cascader  options={field.items} loadData={field.loadData}  onChange={field.options.onChange}  changeOnSelect placeholder='请选择'/>)
  generateFormFields(fields) {
    const formItemLayout = this.props.formItemLayout || {
      labelCol: { span: 6},
      wrapperCol: { span:18 }
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
        case 'changeinput':
        component = this.getChangeInputField(field)
        break;
        case 'password':
        component =this.getPassField(field);
        break;
      case 'inputNumber':
        component = this.getInputNumberField(field)
        break;
        case 'inputNumber2':
        component = this.getInputNumberField2(field)
        break;
      case 'checkbox':
        component = this.getCheckBoxField(field)
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
      case 'textarea':
        component = this.getTextAreaField(field)
        break;
      case 'cascader':
        component = this.getCascader(field)
        break;
        case'btn':
        component = this.getbtn(field);
        break;
      case 'image':
      	component = this.getImage(field)
      	break;
      case 'space':
        component =(<div style={{height:'34px'}}> </div>)
        break;
      case 'ctext':
        component =(<div style={field.style}><span>{field.text}</span></div>)
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
    return <Row>{components}</Row>;
  }

  render() {
    const {formitems,okText,hasTable,dataSource,colums,tableAction,tableText,layout,tableButton,tableButtonClick,editable,tableActionBtn} = this.props;
    let beforeitems = [],afteritems = [];
    formitems.map(formitem=>{
      if(formitem.layout == 'after'){
        afteritems.push(formitem);
      }else{
        beforeitems.push(formitem);
      }
    })
    const _self = this;
    const Tablesell = hasTable=='edit' ?
      <EditTable id='myEditTable' editable={editable} dataSource={dataSource} tableColumns={colums}
        pagination={ false }
        bordered={true}
        onCtrlClick={ tableAction }
        action={tableActionBtn}
      />:hasTable=='noedit'?<Table className='detailTable' data={dataSource} header={colums} />:'';
    const buttons = (<FormItem className={styles.formrow}
      key="control-buttons"
      wrapperCol={{
        span: 14,
        offset: 6,
      }}
    >
      <div className={styles.buttons}>
        {
          this.props.moreButtons.length!=0?
          this.props.moreButtons.map(button=>(
            <Button  onClick={this.handledraftSubmit}>{button.btntext}</Button>
          ))
          :''
          }
        {this.props.showCancel && <Button onClick={this.doCancel} >取消</Button>}
        {!this.props.noBtn && <Button type="primary" htmlType="submit">{okText || '确定'}</Button>}
      </div>
    </FormItem>)
    return (
      <div className={styles.formWrapper}>
        <Form onSubmit={this.handleSubmit} ref={(c) => { this.form = c; this.props.cb && this.props.cb(this.handleSubmit) }}>
           {
             beforeitems.map(item=>
               (
                 <div>
                    <Row className={styles.formrow}>
                      <Col span={2}>
                        <div className={styles[item.leftstyle]}><div className={styles.bluesmallbox1}></div>{item.ColumnText}</div>
                      </Col>
                      <Col span={22}>
                        {item.showMore?<span className={styles.checkMoreDetail} onClick={item.MoreDetailClick}>查看货物来源</span>:''}
                        <span className={styles[item.linestyle]}></span>
                      </Col>
                    </Row>
                    {_self.generateFormFields(item.fields)}
                 </div>
               )
            )
            }
            {
              hasTable?
              <div>
                <Row className={styles.formrow}>
                  <Col span={24}>
                    <p className={styles.columtag}>
                      <span  className={styles.tagName}>{tableText}</span>
                      {
                        this.props.tableButton?
                          <Button onClick={tableButtonClick} style={{marginLeft:'40px',marginBottom:'10px'}} type="primary">{tableButton} </Button>
                          : ""
                      }

                    </p>
                  </Col>
                </Row>
                <Row><Col span={24}> {Tablesell}</Col></Row>
              </div>
            : ''
            }
             {
             afteritems.map(item=>
               (
                 <div>
                <Row className={styles.formrow}>
                       <Col span={2}>
                        <div className={styles[item.leftstyle]}><div className={styles.bluesmallbox}></div>{item.ColumnText}</div>
                      </Col>
                      <Col span={22}>
                        <span className={styles[item.linestyle]}></span>
                      </Col>


                  {/*<Col span={24}><p className={styles.columtag}><span className={styles[item.leftstyle]}>{item.ColumnText}</span><span className={styles[item.linestyle]}></span></p></Col>*/}

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
ColumnForm.defaultProps = {
  moreButtons:[],
  tableActionBtn:[]
}

export default ColumnForm
