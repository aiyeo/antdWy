import React from 'react';
import ReactDOM from 'react-dom';
import {Input,Button,Select,DatePicker,Cascader,InputNumber} from 'antd';
import * as _ from 'lodash';
import styles from './index.less';

const InputGroup = Input.Group;

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      autoComplete: {},
      disabled: {},
      warnings: {},
      loadMore:false
    };
    this.setField = this.setField.bind(this);
  }

  setField(field, value) {
    const {
     fields,
     warnings
    } = this.state;
    let newValue = value;
    if (Array.isArray(newValue) && newValue.length === 0) {
      newValue = undefined;
    }
    if (field.validator) {
      try {
        newValue = field.validator(value);
        warnings[field.key] = '';
      } catch (e) {
        warnings[field.key] = e.message;
      }
    }
    this.props.searchFileds.map(searchFiled=>{
      for (const otherField of searchFiled.fields) {
      const dependency = _.find(otherField.dependency, { key: field.key });
      if (dependency) {
        fields[otherField.key] = '';
      }
    }
    })

    if (typeof field.key !== 'string') {
      fields[field.key[0]] = newValue && newValue[0];
      fields[field.key[1]] = newValue && newValue[1];
    } else {
      fields[field.key] = newValue;
    }
    this.setState({
      fields,
      warnings
    })
  }

  componentDidMount() {
    for (const component of this.needToEmptyStyleComponents) {
      const dom = ReactDOM.findDOMNode(component);
      dom.setAttribute('style', '');
    }
    const {hasMore} = this.props;
    if(hasMore){
      this.setState({
        loadMore:false
      })
    }else{
      this.setState({
        loadMore:true
      })
    }
  }

  componentWillUpdate(props, state) {
    for (const field of (props.fields || [])) {
      if (field.dependency) {
        for (const dependency of (field.dependency || [])) {
          if (!dependency.condition(state.fields[dependency.key])) {
            state.warnings[dependency.key] = dependency.message;
            state.disabled[field.key] = true;
          } else {
            state.warnings[dependency.key] = null;
            state.disabled[field.key] = false;
          }
        }
      }
    }
  }

  generateInputs(fields) {
    const components = [];
    this.needToEmptyStyleComponents = [];
    let i = 0;
    for (const field of fields) {
      let items = [];
      if (field.items) {
        if (field.dependency) {  // 选择省份后才能选择城市
          const params = [];
          for (const dependency of field.dependency) {
            params.push(this.state.fields[dependency.key]);
          }
          items = field.items(...params);
        } else if(field.selectgroup){//是一组select的时候items要变化的
           items = field.selects;
        } else {
          items = field.items();
        }
      }

      let component = null;
      switch (field.type) {
      case 'input':
      default:
        if ('autoComplete' in field) {  // 自动补全
          component = (<Select
            combobox
            value={this.state.fields[field.key]}
            showArrow={false}
            filterOption={false}
            disabled={this.state.disabled[field.key]}
            style={{
              width: '100%',
            }}
            notFoundContent="未找到"
            onChange={(value) => {
              this.setField(field, value);
              field
                  .autoComplete(value)
                  .then((result) => {
                    const { autoComplete } = this.state;
                    autoComplete[field.key] = result;
                    this.setState({ autoComplete });
                  })
            }}
          >
            {(this.state.autoComplete[field.key] || []).map((value, key) =>
              <Select.Option key={key} value={value}>{value}</Select.Option>)}
          </Select>)
        } else {
          component = (<Input
            value={this.state.fields[field.key]}
            placeholder={field.placeholder}
            onChange={e => this.setField(field, e.target.value)}
          />)
        }
        break;
      case 'cascader':  // 级联
        component = (<Cascader
          options={items}
          placeholder="请选择"
          value={this.state.fields[field.key]}
          disabled={this.state.disabled[field.key]}
          onChange={value => this.setField(field, value)}
          showSearch
        />);
        break;
      case 'select':
        component = (<Select
          placeholder="请选择"
          value={this.state.fields[field.key] === undefined ? (field.defaultValue && field.defaultValue.toString()) : this.state.fields[field.key]}
          multiple={field.multiple}
          disabled={this.state.disabled[field.key]}
          onChange={(value) => {
            field.onChange && field.onChange(value)
            this.setField(field, value)
          }}
          style={{
            width: '100%',
          }}
        >
          {items && items.map(({ mean, value }) =>
            <Select.Option key={value.toString()} value={value.toString()}>{mean}</Select.Option>)}

        </Select>);
        break;
        case 'selectGroup':
        component=(
          <InputGroup compact>
            {
            field.selects.map(select=>(
              <span style={{display:'inline-block',width:select.width || 100}}>
              <Select
                placeholder="请选择"
                value={this.state.fields[select.key] === undefined ? (select.defaultValue && select.defaultValue.toString()) : this.state.fields[select.key]}
                multiple={select.multiple}
                disabled={this.state.disabled[select.key]}
                onChange={(value) => {
                  select.onChange && select.onChange(value)
                  this.setField(select, value)
                }}
                style={{
                  width: '90%',
                }}
              >
              {
                select.items && select.items.map(({ mean, value }) =>
                  (<Select.Option key={value.toString()} value={value.toString()}>{mean}</Select.Option>)
                )
              }
          </Select><span className={styles.colum} style={{width:'10%'}}>-</span></span>)
            )
            }
          </InputGroup>
        );
        break;
      case 'date':
        component = (<DatePicker
          value={this.state.fields[field.key]}
          disabled={this.state.disabled[field.key]}
          onChange={value => this.setField(field, value)}
          placeholder="请选择日期"
          showToday={false}
        />)
        break
      case 'rangePicker':
        component = (<DatePicker.RangePicker
          value={[this.state.fields[field.key[0]],this.state.fields[field.key[1]]]}
          onChange={(value) => {
            this.setField(field, value)
          }}

        />)
        break;
      case 'inputnumber':
      	component = (
      		<InputNumber
				    style={{ width: '100%' }}
				    min='2'
				  />
      	)
      	break;
      case 'datetime':
        component = (<DatePicker
          showTime
          format="YYYY-MM-DD HH:mm"
          value={this.state.fields[field.key]}
          disabled={this.state.disabled[field.key]}
          onChange={value => this.setField(field, value)}
          placeholder="请选择时间"
          ref={item => this.needToEmptyStyleComponents.push(item)}
          showToday={false}
        />)
        break;
      }
      components.push(<div key={i++} className={styles.field}>
        <div className={styles.input}>
          <div className={styles.title}>{field.title}:</div>
          <div style={{ width: field.width || 130 }} className={styles.input}>{component}</div>
        </div>
        <div className={styles.warning}>{this.state.warnings[field.key]}</div>
      </div>);
    }
    return components;
  }

  handleReset = () => {
    if ('onReset' in this.props) {
      this.props.onReset();
    }
    this.setState({
      fields: {},
    });
  }
  changeVisible(){
    this.setState({
      loadMore:!this.state.loadMore
    })
  }
  handleSubmit = () => {
    let { warnings } = this.state;
    warnings = {};
    this.props.searchFileds.map(searchFiled=>{
       for (const field of searchFiled.fields) {
      if (field.validator) {
        try {
          field.validator(this.state.fields[field.key])
        } catch (e) {
          warnings[field.key] = e.message;
        }
      }
    }
    })
    if (Object.keys(warnings).length) {
      this.setState({
        warnings
      })
      return
    }
    this.setState({ warnings: {} });
    if ('onSubmit' in this.props) {
      const fields = {};
      // eslint-disable-next-line
      for (const key in this.state.fields) {
        let value = this.state.fields[key];
        if (value === undefined || value === null) {
          // eslint-disable-next-line
          continue;
        }
        if (Array.isArray(value)) {
          fields[key] = value;
          // eslint-disable-next-line
          continue;
        }
        if (typeof value === 'string') {
          value = value.trim();
        }
        if (value !== '') {
          fields[key] = value;
        }
      }
      this.props.onSubmit(fields);
    }
  }

  render() {
    const {searchFileds,Buttons,hasMore,searchCls} = this.props;
    let visiblefields=[],hiddenfields=[];
     searchFileds.map((searchFiled=>{
      if(searchFiled.visible ==='hidden'){
        hiddenfields.push(searchFiled);
      }else{
        visiblefields.push(searchFiled);
      }
     }))
     
     //要隐藏的搜索组件
     const hiddenfield =(()=> hiddenfields.map((hiddenfield)=>{
       return (<div className={styles.hideBox}>{this.generateInputs(hiddenfield.fields)}</div>)
     }))();
      const {loadMore}=this.state;
     const showHidefield = loadMore ? hiddenfield : '';
     const moreBtnText = loadMore ?'收起':'更多条件';
     const moreBtn = hasMore ?
     <Button type="primary" onClick={this.changeVisible.bind(this)} className={styles.searchbtn} >{moreBtnText}</Button>:''
     //要显示的搜索组件
     const visiblefield =(()=> visiblefields.map((visiblefield)=>{
       return ( 
       <div className={`${styles.visibleBox} ${styles[searchCls]}`}>{this.generateInputs(visiblefield.fields)}{showHidefield}
          <div className={styles.buttonGroup}>
          <Button type="primary" onClick={this.handleSubmit.bind(this)} className={styles.searchbtn} icon="search">搜索</Button>
          <Button type="primary" onClick={this.handleReset.bind(this)} className={styles.searchbtn} >清空</Button>

           {
             Buttons.map(Btn=>(
              <Button onClick={Btn.fun} className={styles[Btn.cls]} icon={Btn.icon}>{Btn.text}</Button>
            ))
           }
          {moreBtn}
        </div>
       </div>)
     }))();
      
     

    return (
      <div className={`${styles.searchbar} ${styles[searchCls]} ${styles.buttonGroup}`}>

        {visiblefield}
        
        
      </div>
    );
  }
}

SearchBar.defaultProps = {
  hasReset: true,
  Buttons:[],
  hasMore:false
}
