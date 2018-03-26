import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'dva';
import { Button, Input, InputNumber, Select, DatePicker,Form,Radio,Switch,TreeSelect,Row,Col,Upload,Icon,Cascader,Checkbox,Modal} from 'antd'
import {loadsh} from '../../utils/fun_config'
import styles from './index.less'
import Table from '../table';
import EditableTable from '../editTable/testTable'
import ValiInput from './ValidateInput'

function randomId(){//随机生成id
    var  x="0123456789qwertyuioplkjhgfdsazxcvbnm";
    var  id="";
    var timestamp = new Date().getTime();
    for(var  i=0;i<13;i++)  {
    id  +=  x.charAt(Math.ceil(Math.random()*100000000)%x.length);
    }

    return id;
};

const FormItem = Form.Item
const RadioGroup = Radio.Group

class ModForm extends React.Component {
  constructor(props){
    super(props);
    this.data=[];//表格初始数据
    this.freight =  0;//运费
    this.state={
        data: this.data,//表格数据
        freight:this.freight,//运费
    }
  }
    componentWillReceiveProps(nextProps){
  	if(nextProps.GoodsData!==this.props.GoodsData){
  		this.setState({
  			data:nextProps.GoodsData
  		})
  	}
  }
  componentDidMount() {
   this.data=this.props.GoodsData;
    this.setState({
      data:this.data
    })
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
         //之前onOk传的参数是this.data
        onOk && onOk(values,'save',this.props.GoodsData);
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
        const { onOk } = this.props;
         //之前onOk传的参数是this.data
        onOk && onOk(values,'draft',this.props.GoodsData)
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
    min={0} max={999999999}
    onChange={field.options.onChange}
  />:<InputNumber
    step={field.options.step}
    style={{ width: '100%' }}
    min={0} max={999999999}
    onChange={field.options.onChange}
  />)
  getInputNumberField2 = field =>{
    return(

        field.disabled ?<div><span style={{fontSize:'14px',width: '15%',marginRight:'10px'}}>{field.labelText}:</span><span style={{display:field.disabled ? 'inline-block':'none',height:'32px',position:'absolute',backgroundColor:'#F7F7F7',border:'1px solid #D9D9D9',width: '90%',borderRadius:'5px',paddingLeft:'4px'}}>0</span></div>
        :<ValiInput required={true} inputValue={field.inputVlue} labelText={field.labelText}
        labelspan={field.labelspan} inputspan={field.inputspan}
       message='请输入2-20个字符' type='inputNumber'
       handleChange={(e)=>field.handleChange(e)}
        style={{display:field.disabled ?'none':'inline-block', width:'100%',height:'32px',position:'absolute',}}
      />


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
	  		<DatePicker  format={field.formate || "YYYY/MM/DD"} onChange={field.onChange} showToday={false} placeholder="请选择日期" disabledDate={field.disabledDate}/>
	  	)
	  }

  getDateTimeField = field =>
    (
      <DatePicker showTime format={field.formate || "YYYY/MM/DD"} onChange={field.onChange} showToday={false} placeholder="请选择日期" disabledDate={field.disabledDate}/>
    )

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
  getImage =field => <img src={field.url} style={{maxHeight:'300px',width:'100%'}}/>
  getbtn = field=> <Button style={field.style}  onClick ={field.click}>{field.text}</Button>
  getCascader = field => (<Cascader  options={field.items} loadData={field.loadData}  onChange={field.options.onChange}  changeOnSelect placeholder='请选择'/>)
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
  //表格组件数据和事件
  //添加一行数据以及判断
	  addData=()=>{
    this.data = this.props.GoodsData;
    let data = this.data
		if(data.length==0){
			this.data=[{
        key: randomId(),
        GoodsName: {
          editable: true,
          type:'input',
        },
        BatchNumber: {
          editable: true,
          type:'input',
        },
        TypeOfGoods: {
          editable: true,
          type:'input',
        },
        TextureOfMaterial: {
          editable: true,
          type:'input',
        },
        Specifications: {
          editable: true,
          type:'input',
        },
        PiecesNumber: {
          editable: true,
          type:'inputNumber',
        },
        Volume: {
          editable: true,
          type:'inputNumber',
        },
        Weight: {
          editable: true,
          type:'inputNumber',
        },
        BillingQuantity: {
          editable: true,
          type:'inputNumber',
        },
        Package: {
          editable: true,
          type:'input',
        },
        UnitPrice: {
          editable: true,
          type:'inputNumber',
        },
        Freight: {
          editable: true,
          type:'inputNumber',
        },
      MeasurementUnit: {
			editable: true,
      type:'baseSelect',
      dataSource:this.props.Measuret
        },
      }];
	    this.setState({
		data:this.data
		})
	}else{
		let add = true;
		data.forEach(item=>{
			if(item.GoodsName.editable){
				add = false
			}
		})
		if(add){
			this.data=[...this.props.GoodsData,{
        key: randomId(),
        GoodsName: {
          editable: true,
          type:'input',
        },
        BatchNumber: {
          editable: true,
          type:'input',
        },
        TypeOfGoods: {
          editable: true,
          type:'input',
        },
        TextureOfMaterial: {
          editable: true,
          type:'input',
        },
        Specifications: {
          editable: true,
          type:'input',
        },
        PiecesNumber: {
          editable: true,
          type:'inputNumber',
        },
        Volume: {
          editable: true,
          type:'inputNumber',
        },
        Weight: {
          editable: true,
          type:'inputNumber',
        },
        BillingQuantity: {
          editable: true,
          type:'inputNumber',
        },
        Package: {
          editable: true,
          type:'input',
        },
        UnitPrice: {
          editable: true,
          type:'inputNumber',
        },
        Freight: {
          editable: true,
          type:'inputNumber',
        },
      MeasurementUnit: {
			editable: true,
      type:'baseSelect',
      dataSource:this.props.Measuret
        },
      }];
			this.setState({
		data:this.data
		})
		}else{
            Modal.warning({
                title: '提示',
                content: '请先完成保存...',
            });
		}
		}
	}
    //获取整个表格数据
    getData=()=>{
    console.log(this.data)
}
//单元格变化事件
    dataChange=(data)=>{
    this.data=data
}
//表格行修改事件
    edit=(index)=> {

        this.data=this.props.GoodsData;
        const  data  = this.data;
            let editAble = true;
            data.forEach(item=>{
                if(item.GoodsName.editable){
                    editAble = false
                }
            })
            if(editAble){
                Object.keys(data[index]).forEach((item) => {
            if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
            data[index][item].editable = true;
            }
        });
            this.setState({
                data:[...this.data]
            })
            }else{
                Modal.warning({
                title: '提示',
                content: '请先完成保存...',
            });
            }

    }
    //表格行删除数据
  delet=(index)=>{
     this.data=this.props.GoodsData;
      if(this.state.data.length!=0){
        this.setState({
            freight:this.state.freight-this.data[index].Freight.value
        })
      }
    this.data.splice(index,1);
    let freight = 0;
            this.data.map(item=>{
            freight +=item.Freight.value
              })
            this.freight = freight;
            this.setState({
                    data:[...this.data],
                    freight:this.freight
                });
		this.setState({
		data:[...this.data],
    freight:this.freight
  })
  //将当前表格数据保存为货物信息
  this.props.dispatch({
    type:'addconsignment/setFreight',
    TotalFreight:this.freight,
    GoodsData:this.data
  })
  }
  //表格行保存事件
    editDone=(index, type)=> {
        if(type=='save'){
            var data=this.data;
            if(data[index].GoodsName.value && data[index].Freight.value&&(data[index].PiecesNumber.value || data[index].Volume.value||data[index].Weight.value)){
            Object.keys(data[index]).forEach((item) => {
                        if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
                            data[index][item].editable = false;
                            data[index][item].status = type;
                      }
                    });
            let freight = 0;
            this.data.map(item=>{
            freight +=item.Freight.value
              })
            this.freight = freight;
            this.setState({
                    data:[...this.data],
                    freight:this.freight
                });
                //将当前表格数据保存为货物信息
                this.props.dispatch({
                  type:'addconsignment/setFreight',
                  TotalFreight:this.freight,
                  GoodsData:this.data
                })

            }else if(!data[index].GoodsName.value || !data[index].Freight.value){
                Modal.warning({
                title: '提示',
                content: '货名和运费必填...',
                });
                this.setState({
                    addAble:false
                })
            }else if(!data[index].PiecesNumber.value || !data[index].Volume.value||!data[index].Weight.value){
              Modal.warning({
                title: '提示',
                content: '请至少填写重量,件数或体积中的一项...',
              });
              this.setState({
                addAble:false
              })
            }
    }else{
        this.data.splice(index,1);
        let freight = 0;
        this.data.map(item=>{
            freight +=item.Freight.value
              })
              this.freight = freight;
            this.setState({
            data:[...this.data],
             freight:this.freight
            })
            //将当前表格数据保存为货物信息
                this.props.dispatch({
                  type:'addconsignment/setFreight',
                  TotalFreight:this.freight,
                  GoodsData:this.data
                })
    }
    }

  render() {
    const {formitems,okText,hasTable,dataSource,colums,tableText,layout,tableButton,shipper,receiver} = this.props;
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
      <EditableTable style={{marginBottom:'20px'}}  id='myEditTable'  delet={this.delet}
       edit={this.edit}
       editDone={this.editDone}
       data={this.state.data}
       dataChange={this.dataChange}
        />:hasTable=='noedit'?<Table className='detailTable' data={dataSource} header={colums} />:'';
    const buttons = (<FormItem className={styles.formrow}
      key="control-buttons"
      wrapperCol={{
        span: 14,
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
                        <span className={styles[item.linestyle]}></span>
                      </Col>
                    </Row>
                    {_self.generateFormFields(item.fields)}
                 </div>
               )
            )
            }
            <div>{shipper}</div>
            <div>
              <Row className={styles.formrow}>
                <Col span={2}>
                  <div className={styles.leftarque}><div className={styles.bluesmallbox1}></div>收货信息</div>
                </Col>
                <Col span={22}>
                  <span className={styles.smallline}></span>
                </Col>
              </Row>
              {receiver}
            </div>

            {
              hasTable?
              <div>
                <Row className={styles.formrow}>
                  <Col span={24}>
                    <p className={styles.columtag} style={{marginBottom:0}}>
                      <span  className={styles.tagName}>{tableText}</span>
                      {
                        this.props.tableButton?
                          <Button onClick={this.addData} style={{marginLeft:'40px',marginBottom:'10px'}} type="primary">{tableButton} </Button>
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
}
function mapStateToProps(state) {
  return {...state.addconsignment};
}

export default connect(mapStateToProps)(ColumnForm);

//export default ColumnForm
