import React from 'react'
import ReactDOM from 'react-dom'
import { Input,Col,Row,InputNumber} from 'antd';
import styles from './valiinput.less'

export default class ValiInput extends  React.Component{
    constructor(props){
        super(props)
        this.state={
            inputValue:'',
            hasError:false
        }
    }
    handleChange(e){
        this.setState({
          inputValue: e.target.value
        })
        const {patter,required,max,min} = this.props;
        if(patter){
            if(!patter.test(e.target.value)){
            this.setState({
                hasError:true
            })
            }else if(max){
                if(min){
                if(e.target.value.length>max ||e.target.value.length<min){
                    this.setState({
                    hasError:true
                    })
                }else{
                    this.setState({
                    hasError:false
                    })   
                } 
                }else{
                if(e.target.value.length>max){
                    this.setState({
                        hasError:true
                        }) 
                }else{
                    this.setState({
                    hasError:false
                    })
                }
            }
        }else if(min){
            
            if(e.target.value.length<min){
              this.setState({
                hasError:true
            })  
            }else{
             this.setState({
                hasError:false
            })   
            }
        }
        }else if(required){
            if(!e.target.value){
              this.setState({
                hasError:true
            })  
            }
        }
        if(max){
            if(min){
              if(e.target.value.length>max ||e.target.value.length<min){
                this.setState({
                hasError:true
                })
              }else{
                this.setState({
                hasError:false
                })   
              } 
            }else{
               if(e.target.value.length>max){
                  this.setState({
                    hasError:true
                    }) 
               }else{
                   this.setState({
                hasError:false
                })
               }
            }
        }else if(min){
            
            if(e.target.value.length<min){
              this.setState({
                hasError:true
            })  
            }else{
             this.setState({
                hasError:false
            })   
            }
        }
        this.props.handleChange(e)
    }
    blur(e){
         this.setState({
                hasError:false
            })
    }
    onNumChange(e){
        this.props.handleChange(e)
    }
    render(){
        const {spans,labelspan,required,name,labelText,inputspan,inputValue,type} = this.props;
        const {hasError} = this.state;
      return(
          <Col span={spans}> 
          {
            labelText?
            <Col span={labelspan} style={{textAlign:'right',lineHeight:'32px'}}>                   
            {
            required?<span className={styles.required}>*</span>:null
            }                    
            <label className={styles.labelstyle}  htmlFor={name} title ={labelText} >{labelText}<span className={styles.labelafter}>:</span></label>
            </Col>
            :null
          }           
                
                <Col span={inputspan}>
                {
                    type=='inputNumber'?
                    <InputNumber
                        step={0.1}
                        style={this.props.style}
                        min={0} max={999999999}
                        onChange={e=>this.onNumChange(e)}
                        value={inputValue}
                    />
                    :<Input style={{height:'32px'}} type='text' value={this.props.inputValue} className={hasError?styles.haserror:null} onBlur={(e)=>{this.blur(e)}}   onChange={(e)=>{this.handleChange(e)}} />

                }                
                {
                    hasError?
                    <div className={styles.errormsg}>{this.props.message}</div>
                    :null
                }
                </Col>            
          </Col>
      )  
    }
}

ValiInput.defaultProps = {
  required:false,
  hasError:false
}