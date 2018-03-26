import React,{Component} from 'react'
import { Input, Icon, DatePicker,AutoComplete,InputNumber,message } from 'antd';
import moment from 'moment';
import Style from'./editCell.css'
import BaseSelect from './baseSelect'

export default class EditTableCell extends React.Component {
  constructor(props){
    super()
      this.state = {
      value: props.value,
      editable:props.editable
    }
  }
  componentDidMount(){
     this.state = {
      value: this.props.value,
      editable:this.props.editable
    }
  }
  handleChange = (e) => {
    let value = e.target.value;
    this.setState({ value });
    if(value && value.length>10){
      message.error('不能输入超出10个字符')
    }
  }

   componentWillReceiveProps=(nextprops)=>{
     this.setState({
       //value: nextprops.value,
      editable:nextprops.editable
    })
  }
  check = () => {
    this.setState({ editable: false });
    let props=this.props;

    props.onChange && props.onChange(this.state.value);
    props.editAfter && props.editAfter(this.state.value)
  }
  edit = () => {
    this.setState({ editable: true });
    this.props.editBefore && this.props.editBefore()
  }
  selectChange=(value,option)=>{
  	this.setState({ value });
  }
  //自动完成inputnumber事件
  autoChage=(value)=>{
    if(value && value.length>10){
      message.error('不能输入超出10个字符')
    }
    this.setState({value});
    this.props.onAutoChange && this.props.onAutoChange(value);
  }

  render() {
    const { value, editable } = this.state;
    const type=this.props.type;
    return (
     <div className={Style["editable-cell"]}>
        {
        editable ?
            <div className={Style["editable-cell-input-wrapper"]}>
            {type=='input'? <Input
                value={value}
                onChange={this.handleChange}
                onPressEnter={this.check}
                onBlur={this.check}
                />
                :type=='baseSelect'?
                <BaseSelect onBlur={this.check} onPressEnter={this.check} value={this.state.value} code={this.props.code} onChange={this.selectChange} dataSource={this.props.dataSource} />
                :type == 'autocomplete' ?
                <AutoComplete value={value} onBlur={this.check} onPressEnter={this.check} dataSource={this.props.autodata}  onSearch={this.autoChage} />
                 :type == 'inputNumber' ?
                 <InputNumber min={1} max={999999999} className={Style.editableNumb} value={value}  onBlur={this.check} onPressEnter={this.check} step={0.1} onChange={this.selectChange}/>
                :''

            }
            </div>
            :
            (<div className={Style["editable-cell-text-wrapper"]} onClick={this.edit}>
              {value || ' '}

            </div>)
        }
      </div>
    );
  }
}
EditTableCell.defaultProps = {
  editable: false
}
