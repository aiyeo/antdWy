import React,{Component} from 'react';
import { Table, Input, Popconfirm,Icon,Button,InputNumber,Select  } from 'antd';
import {BaseSelect} from './baseSelect'
const Option = Select.Option;
function randomId(){//随机生成id
			  var  x="0123456789qwertyuioplkjhgfdsazxcvbnm";
			  var  id="";
			  var timestamp = new Date().getTime();
			  for(var  i=0;i<13;i++)  {
			  id  +=  x.charAt(Math.ceil(Math.random()*100000000)%x.length);
			  }

			  return id;
		  };

class EditableCell extends React.Component {
  state = {
    value: this.props.value,
    editable: this.props.editable || false,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.editable !== this.state.editable) {
      this.setState({ editable: nextProps.editable });
      if (nextProps.editable) {
        this.cacheValue = this.state.value;
      }
    }
    if (nextProps.status && nextProps.status !== this.props.status) {
      if (nextProps.status === 'save') {
        this.props.onChange(this.state.value);
      } else if (nextProps.status === 'cancel') {
        this.setState({ value: this.cacheValue });
        this.props.onChange(this.cacheValue);
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.editable !== this.state.editable ||
           nextState.value !== this.state.value;
  }
  handleChange(e) {
    const value = e.target.value;
    this.setState({ value });
    if('onChange' in this.props){
      this.props.onChange(value)
    }

  }
  check(value){
    //console.log(value)
  }
  selectChange(value){
     this.setState({ value });
     if('onChange' in this.props){
      this.props.onChange(value)
    }
  }
  render() {
    const { value, editable } = this.state;
    const{type} = this.props;
    return (
      <div>
        {
          editable ?
            <div style={{width:'100%',height:'100%'}}>
              {
                type=='input'?
                <Input
                value={value}
                 onBlur={()=>this.check(value)}
                onChange={e => this.handleChange(e)}

              />
              :type=='inputNumber'?
               <InputNumber  min={1} max={999999999} value={value}  onBlur={()=>this.check(value)}  step={0.1} onChange={(value)=>this.selectChange(value)}/>
               :type=='baseSelect'?
               <Select  onBlur={()=>this.check(value)} value={value}  onChange={(value)=>this.selectChange(value)} >
                 {
                  this.props.dataSource.map((item)=>{
                      return(
                        <Option value={item.code}>{item.text}</Option>
                      )
                  })
                 }
               </Select>
               :null
              }

            </div>
            :
            type=='baseSelect'?
            <div className="editable-row-text">
              {
                this.props.dataSource.map(item=>{
                  let selectvalue ='';
                  if(item.code==value){
                    selectvalue = item.text;
                    return selectvalue;
                  }
                })
                }
            </div>
            :
            <div className="editable-row-text" style={{width:'100%',height:'100%'}} onDoubleClick={this.props.sigleEdit}>
              {(value && value.toString()) || ' '}
            </div>
        }
      </div>
    );
  }
}
var lll=null;

export default class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    const {data} = this.props
    this.state={
			data: [],
      saveAble:false
		}
    this.columns = [{
      title: '* 货物名称',
      dataIndex: 'GoodsName',
      width:'100px',
      render: (text, record, index) =>{return this.renderColumns(this.state.data, index, 'GoodsName', text,'94px')} ,
    }, {
      title: '批号',
      dataIndex: 'BatchNumber',
      width:'220px',
      render: (text, record, index) => this.renderColumns(this.state.data, index, 'BatchNumber', text,'214px'),
    },{
      title: '型号',
      dataIndex: 'TypeOfGoods',
      width:'120px',
      render: (text, record, index) =>{return this.renderColumns(this.state.data, index, 'TypeOfGoods', text,'114px')} ,
    },{
      title: '规格',
      dataIndex: 'Specifications',
      width:'120px',
      render: (text, record, index) =>{return this.renderColumns(this.state.data, index, 'Specifications', text,'114px')} ,
    }, {
      title: '材质',
      dataIndex: 'TextureOfMaterial',
      width:'80px',
      render: (text, record, index) => this.renderColumns(this.state.data, index, 'TextureOfMaterial', text,'74px'),
    }, {
      title: '件数',
      dataIndex: 'PiecesNumber',
      width:'80px',
      render: (text, record, index) => this.renderColumns(this.state.data, index, 'PiecesNumber', text,'74px'),
    },{
      title: '体积(方)',
      dataIndex: 'Volume',
      width:'80px',
      render: (text, record, index) =>{return this.renderColumns(this.state.data, index, 'Volume', text,'74px')} ,
    }, {
      title: '重量(吨)',
      dataIndex: 'Weight',
      width:'80px',
      render: (text, record, index) => this.renderColumns(this.state.data, index, 'Weight', text,'74px'),
    },{
      title: '包装',
      dataIndex: 'Package',
      width:'80px',
      render: (text, record, index) =>{return this.renderColumns(this.state.data, index, 'Package', text,'74px')} ,
    }, {
      title: '单价',
      dataIndex: 'UnitPrice',
      width:'80px',
      render: (text, record, index) => this.renderColumns(this.state.data, index, 'UnitPrice', text,'74px'),
    },
    {
      title: '计费数量',
      dataIndex: 'BillingQuantity',
      width:'90px',
      render: (text, record, index) => this.renderColumns(this.state.data, index, 'BillingQuantity', text,'84px'),
    },
    {
      title: '* 运费(元)',
      dataIndex: 'Freight',
      width:'90px',
      render: (text, record, index) =>{return this.renderColumns(this.state.data, index, 'Freight', text,'104px')} ,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width:'100px',
      render: (text, record, index) => {
        const { editable } = this.state.data[index].GoodsName;
        return (
          <div className="editable-row-operations">
            {
              editable ?
                <span>
                  <Icon title='保存' type='save' style={{color:'blue',marginRight:'10px',cursor:'pointer'}} onClick={() => this.props.editDone(index, 'save')} />
                  <Icon title='取消'  type="minus-circle-o" style={{color:'#B0E11E',cursor:'pointer',marginLeft:'10px'}} onClick={() => this.props.editDone(index, 'cancel')} />
                </span>
                :
                <div>
                <span>
                  <Icon title='修改' type='edit' style={{color:'green',marginRight:'10px',cursor:'pointer'}} onClick={() => this.props.edit(index)} />
                </span>
                <span>
                  <Popconfirm title="确定删除吗？" onConfirm={() => this.props.delet(index)}>
                  <Icon  title='删除' type='delete' style={{color:'red',cursor:'pointer',marginLeft:'10px'}}/>
                  </Popconfirm>
                </span>
                </div>
            }
          </div>
        );
      },
    }];

  }
    componentWillReceiveProps(nextProps){
  	if(nextProps.data!==this.props.data){
  		this.setState({
  			data:nextProps.data
  		})
  	}
  }
  renderColumns(data, index, key, text,width) {
    const { editable, status,type,dataSource } = data[index][key];
    if (typeof editable === 'undefined') {
      return text;
    }
    return (<EditableCell
      editable={editable}
      value={text}
      type={type}
      dataSource={dataSource}
      onChange={value => this.handleChange(data,key, index, value)}
      status={status}
      style={{width:width}}
    />);
  }
  handleChange(dat,key, index, value){
    const { data } = this.state;
    data[index][key].value = value;
    this.setState({ data });
   this.props.dataChange(data)
  }

  render() {
    const { data } = this.state;
    const dataSource = data.map((item) => {
      const obj = {};
      Object.keys(item).forEach((key) => {
        obj[key] = key === 'key' ? item[key] : item[key].value;
      });
      return obj;
    });
    const columns = this.columns;
    return <div>
      <Table style={this.props.style} pagination={false} bordered dataSource={dataSource} columns={columns} />
      </div>;
  }
}
