import React from 'react';
import { connect } from 'dva';
import styles from './IdentiInfo.css';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete ,message} from 'antd';
import ColumnForm from '../../components/modalForm/complicform';
import Moment from 'moment';
import {RQHEADER} from '../../utils/config'
import {formatDate} from '../../utils/fun_config'

const FormItem = Form.Item;
const Option = Select.Option;

function IdentiInfo({dispatch,Area,yesStatus,Identphone,Type,cData,Driverimage,Driveimage,Manageimage,ownerManagers,DriverInfo,Status,Usertype,Level,Typeid}) {

let Oktext = '保存' ;
  Oktext= Status==1 ? '提交':'保存修改';
  const MemberId = sessionStorage.getItem('MemberId');
  //提交表单
function handleSubmit(param){
  if(Area.length<3){
    message.destroy();
    message.error('请选择完整地区(到区一级)!');
    return false;
  }else {
    param.MemberId = MemberId;
    param.ProvinceID = param.region[0];
    param.CityID = param.region[1];
    param.DistrictID = param.region[2];
    param.DriversLicenseImage={};
    param.ExaminedTime = param.ExaminedTime? formatDate(param.ExaminedTime._d) : '';
    param.ShoppingTime =param.ShoppingTime ? formatDate(param.ShoppingTime._d) :'';
    param.SALIVdueTime = param.SALIVdueTime? formatDate(param.SALIVdueTime._d) : '';
    param.CommercialinsuranceVdueTime=param.CommercialinsuranceVdueTime? formatDate(param.CommercialinsuranceVdueTime._d) : '';
    param.DriversLicenseImage = Driverimage;
    param.DrivingLicenseImage = Driveimage;
    param.TradingCardImage = Manageimage;
    //保存
    if(Status==1){
      dispatch({
        type:'userinfo/saveInfo',
        param
      })
    }else{
      //修改
      param.ID = DriverInfo.Id;
      param.DriversLicenseImage =DriverInfo.DriversLicenseImage ||' ';
      param.DrivingLicenseImage =DriverInfo.DrivingLicenseImage || ' ';
      param.TradingCardImage =DriverInfo.TradingCardImage || ' ';
      dispatch({
        type:'userinfo/upadateDriverInfo',
        param
      })
    }
  }
  }
  //上传图片前事件
  function beforeUpload(file) {
    if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/bmp') {
      message.error('只能上传jpg,jpeg,png或bmp格式的图片!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return  isLt2M;
}
//图片上传事件回调
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
//上传驾驶证
  function changeUpload(info) {

    if (info.file.status === 'done') {
      dispatch({
          type:'userinfo/saveDriverimage',
          Driverimage:info.file.response.Message
      })
    }
  }
  //上传行驶证
  function changeUploaddrive(info) {

    if (info.file.status === 'done') {
      dispatch({
          type:'userinfo/saveDriveimage',
          Driveimage:info.file.response.Message
      })
    }
  }
  //上传运营证
  //上传驾驶证
  function changeUploadmanage(info) {

    if (info.file.status === 'done') {
      dispatch({
          type:'userinfo/saveManageimage',
          Manageimage:info.file.response.Message
      })
    }
  }

  //装载级联数据
	const loadData = (selectedOptions) => {
		const  id= selectedOptions[0].value;
        const targetOption = selectedOptions[selectedOptions.length - 1];
        if(selectedOptions.length>1){
            dispatch({ type:'userinfo/getcdistricts',targetOption,cData,id});
        }else{
            dispatch({ type:'userinfo/getPcitys',targetOption,cData});
        }
 	}

//判断是否可以修改
let edtitAble = false;
if( Status==2){
    edtitAble= true;
}
//表单数据
const formfields=[{
          label: '会员类型',
          type: 'input',
          name: 'Type',
          disabled:true,
          options: {
              initialValue: Usertype,
          }
      },{
          label: '姓名',
          type: 'input',
          name: 'Name',
          disabled:edtitAble,
          options: {
              initialValue:Status==1||(!DriverInfo.Name) ? '' : DriverInfo.Name,
              rules: [{
                  required: true,
                  message: '请填写会员姓名!',
              },{
                  pattern: /^([A-Za-z]|[\u4E00-\u9FA5])+$/,
                  message: '只能输入大小写字母、汉字!',
              },{
                  max: 10,
                  message: '请不要超过10个字符!',
              },{
                  min: 2,
                  message: '请不要小于2个字符!',
              }
              ]
          }
          },{
          label: '身份证',
          type: 'input',
          name: 'IDCard',
          disabled:edtitAble,
          options: {
              initialValue:Status==1||(!DriverInfo.IDCard) ? '' : DriverInfo.IDCard,
              rules: [{
                  required: true,
                  message: '请填写身份证信息!',
              },{
                  pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/ ,
                  message:'请填写正确格式身份证号码!'
              }
              ]
          }
      },
      {
          label: '驾驶证',
          type: 'input',
          name: 'DriversLicense',
          disabled:edtitAble,
          options: {
              initialValue:Status==1 ? '' : DriverInfo.DriversLicense,
              rules: [{
                  required: true,
                  message: '请填写驾驶证信息!',
              },
              {
                  max: 30,
                  message: '请不要超过30个字符!',
              },{
                  min: 5,
                  message: '请不要小于5个字符!',
              }
              ]
          }
      },{
          label: '手机',
          type: 'input',
          name: 'PhoneNumber',
          disabled:edtitAble,
          options: {
              initialValue:Status==1 ? '' : Identphone,
              rules: [{
                  required: true,
                  message: '请填写手机号码!',
              },{
                  pattern:/^1[34578]\d{9}$/ ,
                  message:'请填写正确格式的手机号码!'
              }
              ]
          }
      },{
          label: '地区',
          type: 'cascader',
          name: 'region',
          disabled:edtitAble,
          items:cData,
          loadData:loadData,
          options: {
              initialValue:Status==1 ? '' : [DriverInfo.ProvinceID,DriverInfo.CityID,DriverInfo.DistrictID],
              rules: [{
                  required: true,
                  message: '请选择所属地区!',
              }
              ],
            onChange:(value,obj)=>{
              if(obj.length<3){
                dispatch({type:'certification/getyesStatus'});
              }
              dispatch({type:'certification/getArea',obj})
            }
          }
      },{
          label: '驾驶证',
          type: 'upload',
          name: 'DriverImage',
          disabled:edtitAble,
          uploadUrl:'',
          action:`${RQHEADER}/personalidentification/saveimage`,
          headers:{'Authorization': 'token '+sessionStorage.access_token},
          beforeUpload:beforeUpload,
          onChange:changeUpload,
          options: {
              initialValue:Status==1 ? [] : [{ uid: -3,name:'驾驶证.png',url:DriverInfo.DriverImage || '',thumbUrl:DriverInfo.DriverImage || '',status:'done'}],
              rules: [{
                  required: true,
                  message: '请上传驾驶证!',
              }
              ]
          }
      }
      ];
const formfields2=[
    {
    label:'车牌号',
    type:'input',
    name:'PlateNumber',
    options:{
        initialValue:Status == 1 ? ' ' :DriverInfo.PlateNumber,
        rules:[
            {
                required:true
            }
        ]
    }
    },
    {
    label: '车型',
    type: 'input',
    name: 'VehicleType',
    disabled:edtitAble,
    options: {
        initialValue:Status==1 ? '' : DriverInfo.VehicleType,
        rules: [{
            required: true,
            message: '请填写车型!',
        },{
            pattern:/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/ ,
            message:'请填写正确格式的手机号码!'
        },{
            max: 20,
            message: '请不要超过20个字符!',
        },{
            min: 2,
            message: '请不要小于2个字符!',
        }
        ]
    }
},
{
label: '年审日期',
type: 'datetime',
name: 'ExaminedTime',
disabled:edtitAble,
options: {
    initialValue:Status==1 ? '' :  Moment(DriverInfo.ExaminedTime),
    rules: [{
        required: true,
        message: '请填写年审时间!',
    }]
}
},
{
label: '车辆自重(单位kg)',
type: 'inputNumber',
name: 'KerbWeight',
disabled:edtitAble,
options: {
    step:0.1,
    initialValue:Status==1 ? '' : DriverInfo.KerbWeight,
    rules: [{
        required: true,
        message: '请填写车辆自重!',
    },{
        pattern:/^[+|-]?\d*\.?\d*$/,
        message:'只能输入正整数!'
    }
    ]
}
},
{
label: '载重吨位',
type: 'inputNumber',
name: 'WeightTonnage',
disabled:edtitAble,
options: {
    step:0.1,
    initialValue:Status==1 ? '' : DriverInfo.WeightTonnage,
    rules: [{
        required: true,
        message: '请填写载重吨位!',
    },{
        pattern:/^[+|-]?\d*\.?\d*$/,
        message:'只能输入正数!'
    }
    ]
}
},
{
label: '购车日期',
type: 'datetime',
name: 'ShoppingTime',
disabled:edtitAble,
options: {
    initialValue:Status==1 ? '' : Moment(DriverInfo.ShoppingTime),
    rules: [{
        required: true,
        message: '请填写购车时间!',
    }]
}
},
{
    label: '所属单位',
    type: 'select',
    name: 'OwnerDepartment',
    disabled:edtitAble,
    items:()=>ownerManagers.map(ele=>({
        key:ele.MemberId,
        value:ele.CompanyName
    })),
    options: {
        initialValue:Status==1 ? '' : DriverInfo.OwnerDepartment,
        rules: [{
            required: true,
            message: '请填写所属单位!',
        }
        ]
    }
},
{
    label: '车长(单位m)',
    type: 'inputNumber',
    name: 'VehicleLength',
    disabled:edtitAble,
    options: {
        step:0.1,
        initialValue:Status==1 ? '' : DriverInfo.VehicleLength,
        rules: [{
            required: true,
            message: '请填写车长!',
        },{
            pattern:/^[+|-]?\d*\.?\d*$/,
            message:'只能输入正数!'
        }
        ]
    }
},{
    label: '商业险到期日期',
    type: 'datetime',
    name: 'CommercialinsuranceVdueTime',
    disabled:edtitAble,
    options: {
        initialValue:Status==1 ? '' : Moment(DriverInfo.CommercialinsuranceVdueTime),
        rules: [{
            required: true,
            message: '请填写商业险到期日期!',
        }]
    }
    },{
    label: '车宽（单位m）',
    type: 'inputNumber',
    name: 'VehicleWidth',
    disabled:edtitAble,
    options: {
        step:0.1,
        initialValue:Status==1 ? '' : DriverInfo.VehicleWidth,
        rules: [{
            required: true,
            message: '请填写车宽!',
        },{
            pattern:/^[+|-]?\d*\.?\d*$/,
            message:'只能输入正数!'
        }
        ]
    }
},{
    label: '轴数',
    type: 'inputNumber',
    name: 'AxesCount',
    disabled:edtitAble,
    options: {
        step:0.1,
        initialValue:Status==1 ? '' : DriverInfo.AxesCount,
        rules: [{
            required: true,
            message: '请填写轴数!',
        },{
            pattern:/^[+|-]?\d*\.?\d*$/,
            message:'只能输入正数!'
        }
        ]
    }
},
 {
    label: '交强险到期时间',
     type: 'datetime',
    name: 'SALIVdueTime',
    disabled:edtitAble,
    options: {
        initialValue:Status==1 ? '' : Moment(DriverInfo.SALIVdueTime),
        rules: [{
            required: true,
            message: '请填写较强险到期时间!',
        }]
    }
},
{
    label: '车架号',
    type: 'input',
    name: 'VIN',
    disabled:edtitAble,
    options: {
        initialValue:Status==1 ? '' : DriverInfo.VIN,
        rules: [{
            required: true,
            message: '请填写车架号!',
        },{
            pattern:/^[A-Za-z0-9]+$/,
             message:'只能输入英文字母和数字!'
        },{
            max: 50,
            message: '请不要超过50个字符!',
        },{
            min: 2,
            message: '请不要小于2个字符!',
        }
        ]
    }
},
{
    label: '发动机号',
    type: 'input',
    name: 'EngineNumber',
    disabled:edtitAble,
    options: {
        initialValue:Status==1 ? '' : DriverInfo.EngineNumber,
        rules: [{
            required: true,
            message: '请填写发动机!',
        },{
            pattern:/^[A-Za-z0-9]+$/,
             message:'只能输入英文字母和数字!'
        },{
            max: 50,
            message: '请不要超过50个字符!',
        },{
            min: 2,
            message: '请不要小于2个字符!',
        }
        ]
    }
},{
    label: '营运证号',
    type: 'input',
    name: 'TradingCard',
    disabled:edtitAble,
    options: {
        initialValue:Status==1 ? '' : DriverInfo.TradingCard,
        rules: [{
            required: true,
            message: '请填写营运证号!',
        }
        ]
    }
},{
    label: '行驶证',
    type: 'upload',
    name: 'DrivingLicenseImage',
    disabled:edtitAble,
    uploadUrl:'',
    action:`${RQHEADER}/personalidentification/saveimage`,
    headers:{'Authorization': 'token '+sessionStorage.access_token},
    beforeUpload:beforeUpload,
    onChange:changeUploaddrive,
    options: {
        initialValue:Status==1 ? [] : [{ uid: -1,name:'行驶证.png',url:DriverInfo.DrivingLicenseImage || '',thumbUrl:DriverInfo.DrivingLicenseImage || '',status:'done'}],
        rules: [{
            required: true,
            message: '请上传行驶证!',
        }
        ]
    }
},{
    label: '运营证',
    type: 'upload',
    name: 'TradingCardImage',
    disabled:edtitAble,
    uploadUrl:'',
    action:`${RQHEADER}/personalidentification/saveimage`,
    headers:{'Authorization': 'token '+sessionStorage.access_token},
    beforeUpload:beforeUpload,
    onChange:changeUploadmanage,
    options: {
        initialValue:Status==1 ? [] : [{ uid: -2,name:'运营证.png',url:DriverInfo.TradingCardImage || '',thumbUrl:DriverInfo.TradingCardImage || '',status:'done'}],
        rules: [{
            required: true,
            message: '请上传运营证!',
        }
        ]
    }
},
{
    label: '备注',
    type: 'textarea',
    name: 'Remark',
    disabled:edtitAble,
    options: {
        initialValue:Status==1||(!DriverInfo.Remark)? '' : DriverInfo.Remark,
    }
}

    ];
        const formitem = [{fields:formfields,ColumnText:'个人信息'},{fields:formfields2,ColumnText:'车辆信息'}];
        return (
            <ColumnForm onOk={handleSubmit} formitems={formitem} okText={Oktext} layout='three'  Yes={yesStatus}>

            </ColumnForm>
        );
}

function mapStateToProps(state) {
  return {...state.login,...state.userinfo};
}

export default connect(mapStateToProps)(IdentiInfo);
