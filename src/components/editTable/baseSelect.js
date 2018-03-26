import React,{Component} from 'react';
import {Select as AntdSelect} from 'antd';

const Option = AntdSelect.Option;
const OptGroup  = AntdSelect.OptGroup;

export default class BaseSelect extends Component{
	constructor(props) {
		super(props);
		this.id = this.props.id;
		this.state={
			data:props.dataSource||[],
			code:props.code||'code',
			value:props.value
		};
	}
	changeData(data){
		this.setState({
			data:data
		})
	}
	onChange(value,option){
		this.setState({value});
		this.props.onChange && this.props.onChange(value,option)
	}
	render() {
		var arr=[];
		this.state.data.forEach((item,index)=>{
			arr.push(<Option value={item[this.state.code]} key={item[this.state.code]}>{item.text}</Option>)
		})
		var style=Object.assign({},{width:'100%'},this.props.style);
		return (

		    <AntdSelect  {...this.props} value={this.state.value} onChange={this.onChange.bind(this)} style={style} >
		      {arr}
		    </AntdSelect>
		)
	}
}

