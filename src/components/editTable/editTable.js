
import React,{Component} from 'react';
import { Table as AntdTable,Icon,Checkbox,Tooltip,Modal } from 'antd';
import ComponentMap from './ComponentMap'
import EditTableCell from './editTableCell';
import styles from './editCell.css'
//import HK_WEB_EDITGRID from './editGrid'

const Column=AntdTable.Column;
const confirm = Modal.confirm;

class EditTable extends Component{
	constructor(props){
	 		super();
	 		this.url=props.dataSourceDynamic;
	 		this.id=props.id;

	    //	pagination	=props.type=='edit'?props.pagination:pagination
	 		//selectedRowKeys 选中的默认值
	 		this.state=Object.assign({},{selectedRows:[]},props)
	 	}

	 	componentDidMount(){
	 		ComponentMap.put(this.id,this);
			if (super.componentDidMount) {
				super.componentDidMount();
			}
			const {dataSource,type} =this.props;
			// this.setState({
			// 	dataSource:dataSource,
			// 	selectedRows:[],
			// 	selectedRowKeys:[],
			// 	editable:this.props.editable
			// })

	 	}
		 componentWillReceiveProps(nextprops){
			this.setState({
				dataSource:nextprops.dataSource,
				editable:nextprops.editable,
				selectedRows:[],
				selectedRowKeys:[]
			})
		 }

	   onCellChange = (index, key) => {
		    return (value) => {
		      index=index+(this.currentIndex||0);
		      const dataSource = [...this.state.dataSource];
		      dataSource[index][key] = value;
		      this.saveModify(key,value, dataSource,index,);
		      this.setState({ dataSource });
			  this.props.onAutoChange && this.props.onAutoChange(value);
		    };
  		}
	   saveModify(key,value,data,index){//保存修改信息
		   	if(value===undefined){return}
	   	   	this.rowIndex=index;
			let values=Object.assign({},data[index]);
			this.cellDataIndex=key;
			this.cellModify=values;
			this.rowModify=this.rowModify||[];//保存所有修改行信息
			this.indexs=this.indexs||[]//保存所有的行号
			if(this.rowModify.length!==0){
				for(let i=0;i<this.rowModify.length;i++){
						if(this.rowModify[i].id===values.id){
							this.rowModify[i]=values;
							this.indexs[i]=index;
							return;
						}
					}
	   	  }
	   	  this.indexs.push(index)
	   	  this.rowModify.push(values)

	   }
	   //删除一行数据
	   deleteRowdata(index){
		let DelDataSource = this.state.dataSource;
		DelDataSource.splice(index, 1);
			this.setState({
			dataSource: DelDataSource,
			});
			}

	   selectRowChange(selectedRowKeys, selectedRows){//选择行变化

	   		this.setState({selectedRows,selectedRowKeys})
	   		//this.selectedRowKeys=selectedRowKeys
	   }
	 	render(){
	 		var json={},props=this.props;
	 		const title=props.tableTitle;
	 		const footer=props.tableFooter;
	 		title && (json.title=()=>(<p className={props.tableTitleClass}>{title}</p>))
	 		footer && (json.footer=()=>(<p >{footer}</p>))
	 		if(props.type==='detail'){
	 			json.expandedRowRender=(record) =>( <p>{record[props.detailField]}</p>)

	 		}
	 		let headType=this.props.headType;
			 const {editable} = this.state;
	 		let flag=false;let type='checkbox';
	 		if(headType==='checkSelect' || headType==='radioSelect'){
	 			flag=true;
	 			headType==='radioSelect' && (type='radio');
	 		}
	 		let cloumns=[];var _this=this;
	 		this.props.tableColumns.forEach((item,indexs)=>{
	 			switch(item.type){
	 			  case 'input':
					cloumns.push(
					<Column  {...item} key={indexs}
					render= {(text, record, index) => (
					<EditTableCell {...item} value={text}  editable={editable}
						editBefore={()=>{item.editBefore&&item.editBefore.apply(this,[record,index])}}
						editAfter={(data)=>{item.editAfter&&item.editAfter.apply(this,[record,index,data])}}
						onChange={this.onCellChange(index, item.dataIndex)} />)}/>
			 				);
				  break;
				  case 'baseSelect':
					cloumns.push(
					<Column {...item}  key={indexs}
					render= {(text, record, index) => (
					<EditTableCell code='text'   {...item} value={text} editable={editable}
						editBefore={()=>{item.editBefore&&item.editBefore.apply(this,[record,index])}}
						editAfter={(data)=>{item.editAfter&&item.editAfter.apply(this,[record,index,data])}}
						onChange={this.onCellChange(index, item.dataIndex)} />
						)}
						/>
					);
					break;
				  case 'autocomplete' :
				  cloumns.push(
					<Column {...item} key={indexs}
					render={(text,record,index)=>(
					<EditTableCell  {...item} value={text}  editable={editable}
					editBefore={()=>{item.editBefore&&item.editBefore.apply(this,[record,index])}}
					editAfter={(data)=>{item.editAfter&&item.editAfter.apply(this,[record,index,data])}}
						onChange={this.onCellChange(index, item.dataIndex)} />
					  )}
					  />
				  )
				  break;
				  case 'inputNumber':
				  cloumns.push(
					<Column  {...item} key={indexs}

					render= {(text, record, index) => (
					<EditTableCell {...item} value={text}  editable={editable}
						editBefore={()=>{item.editBefore&&item.editBefore.apply(this,[record,index])}}
						editAfter={(data)=>{item.editAfter&&item.editAfter.apply(this,[record,index,data])}}
						onChange={this.onCellChange(index, item.dataIndex)} />)}/>
			 				);
				  break;
				  case 'autorender':
				  cloumns.push(
					  <Column {...item} key={indexs} width='50px'
					  render={(record,text,index)=>(<span>{index+1}</span>)}

					  />
				  )
				  break;
	 			}
	 		})
			 const {action} = this.props;
			if (action&&action.length>0){
      			cloumns.push(
					<Column key='x' title='操作'
					width='100px'
					render={(row,text,index)=>{
					const actions = action;
					if (!actions) {
						return <div />;
					}
					const buttons = actions.map(({ color, name, key, icon, hidden, children }) => {
					return (<Tooltip title={ name }><a
					key={key}
					onClick={(e) => {
						e.preventDefault();
						if(key=='delete'){
							 confirm({
								title: '提示',
								content: '确定删除当前信息吗',
								onOk: () => {
									this.deleteRowdata(index);
									if ('onCtrlClick' in this.props) {
									this.props.onCtrlClick(key, row,index);
									}
								},
								onCancel() {}
           					})

						}else{
							if ('onCtrlClick' in this.props) {
							this.props.onCtrlClick(key, row,index);
							}
						}

					}}
					style={{
						color,
						marginRight: 12,
						display: hidden ? 'none' : 'inline-block',
						fontSize: 14,
					}}
					><Icon type={ icon } /></a></Tooltip>)
					});
					return (
						<div>
						{buttons}
						</div>);
					}
						}
						/>
				);
    		}
	 		return (
             <AntdTable  className={styles.headerstyle} size='middle' {...this.state} type='edit' rowSelection={flag?
             {onChange:this.selectRowChange.bind(this),type:type,selectedRowKeys:this.state.selectedRowKeys}:null}  {...json} >
	 					{cloumns}
	 			</AntdTable>
	 		)
	 	}

}

export default EditTable
