import React from 'react';
import { connect } from 'dva';
import styles from './IdentiInfo.css';
import {RQHEADER} from '../../utils/config'
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete ,message} from 'antd';
import ColumnForm from '../../components/modalForm/columnform';
import Moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;

function Certification({dispatch,Area,yesStatus,Usertype,cData,Businessimage,RoadTransportimage,Facadeimage,Corporateimage,typeData,ownerManagers,Information,Status,RoleId}) {
  function  formatDate(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d;
  };
  const MemberId = sessionStorage.getItem('MemberId');
  //提交表单
  function handleSubmit(param){
    dispatch({type:'login/ShowBtn'});
    if(Area.length<3){
      message.destroy();
      message.error('请选择完整地区(到区一级)!');
      return false;
    }else{
      param.MemberId = MemberId;
      param.ProvinceID = param.region[0];
      param.CityID = param.region[1];
      param.DistrictID = param.region[2];
      param.RegDate = param.RegDate? formatDate(param.RegDate._d) : '';
      param.ApprovalDate =param.ApprovalDate ? formatDate(param.ApprovalDate._d) :'';
      param.BusinesslicensePhoto = Businessimage==""?Information.BusinesslicensePhoto:Businessimage;

      if(RoleId==4){
        param.RoadTransportPermitPhoto = RoadTransportimage==""?Information.RoadTransportPermitPhoto:RoadTransportimage;
      }
      param.FacadeCardPhoto = Facadeimage==""?Information.FacadeCardPhoto:Facadeimage;
      param.CorporateCardPhoto = Corporateimage==""?Information.CorporateCardPhoto:Corporateimage;
      param.RegisteredCapital=parseInt(param.RegisteredCapital);
      if(Information.CompanyId){
        param.CompanyId = Information.CompanyId;
        param.SubmitAuditTime =Information.SubmitAuditTime;
        param.AuditTime = Information.AuditTime;
        if(RoleId==4){
          dispatch({
            type:'certification/updateauth',
            param
          })
        }else if(RoleId==2){
          dispatch({
            type:'certification/shipperupdateauth',
            param
          })
        }
      }else{
        if(RoleId==4){
          dispatch({
            type:'certification/saveInfo',
            param
          })
        }else if(RoleId==2){
          dispatch({
            type:'certification/shippersaveInfo',
            param
          })
        }
      }
    }
  }
  //上传图片前事件
  function beforeUpload(file) {
    if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/bmp') {
      message.error('只能上传jpg,jpeg,png或bmp格式的图片!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('请不要上传大于2M的图片!');
    }
    return  isLt2M;
  }
//图片上传事件回调
  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  //上传营业执照
  function changeUploadBusiness(info) {
    if (info.file.status === 'done') {
      dispatch({
        type:'certification/saveBusinessimage',
        Businessimage:info.file.response.Message
      })
    }
  }
  //上传道路运输许可证
  function changeUploadRoadTransport(info) {
    if (info.file.status === 'done') {
      dispatch({
        type:'certification/saveRoadTransportimage',
        RoadTransportimage:info.file.response.Message
      })
    }
  }
  //上传法人身份证正面
  function changeUploadFacade(info) {
    if (info.file.status === 'done') {
      dispatch({
        type:'certification/saveFacadeimage',
        Facadeimage:info.file.response.Message
      })
    }
  }
  //上传法人身份证反面
  function changeUploadCorporate(info) {

    if (info.file.status === 'done') {
      dispatch({
        type:'certification/saveCorporateimage',
        Corporateimage:info.file.response.Message
      })
    }
  }

  //装载级联数据
  const loadData = (selectedOptions) => {
    const  id= selectedOptions[0].value;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    if(selectedOptions.length>1){
      dispatch({ type:'certification/getcdistricts',targetOption,cData,id});
    }else{
      dispatch({ type:'certification/getPcitys',targetOption,cData});
    }
  }
//所属经纪人
  let manegers = [];
  ownerManagers.map(maneger=>{
    manegers.push(maneger.Type)
  })
//判断是否可以修改
  let edtitAble = false;
  if(Status==2 || Status==3){
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
    label: '公司名称',
    type: 'input',
    name: 'CompanyName',
    disabled:edtitAble,
    options: {
      initialValue:Status==1 ? '' : Information.CompanyName,
      rules: [{
        required: true,
        message: '请填写公司名称!',
      },{
        pattern: /^([A-Za-z]|[\u4E00-\u9FA5])+$/,
        message: '只能输入大小写字母、汉字!',
      },{
        max: 20,
        message: '请不要超过20个字符!',
      },{
        min: 2,
        message: '请不要小于2个字符!',
      }
      ]
    }
  },{
    label: '公司邮箱',
    type: 'input',
    name: 'Email',
    disabled:edtitAble,
    options: {
      initialValue:Status==1 ? '' : Information.Email,
      rules: [{
        required: true,
        message: '请填写公司邮箱!',
      },{
        pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/ ,
        message:'请填写正确的邮箱!'
      }
      ]
    }
  },
    {
      label: '地区',
      type: 'cascader',
      name: 'region',
      disabled:edtitAble,
      items:cData,
      loadData:loadData,
      options: {
        initialValue:Status==1 ? '' : [Information.ProvinceID,Information.CityID,Information.DistrictID],
        rules: [{
          required: true,
          message: '请选择所在地区!',
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
      label: '公司联系电话',
      type: 'input',
      name: 'Tel',
      disabled:edtitAble,
      options: {
        initialValue:Status==1 ? '' : Information.Tel,
        rules: [{
          required: true,
          message: '请填写公司联系电话!',
        },{
          pattern:/^1[34578]\d{9}$/ ,
          message:'请填写正确格式的手机号码!'
        }
        ]
      }
    }
  ];
  const formfields2=[{
    label: '公司注册时间',
    type: 'datetime',
    name: 'RegDate',
    disabled:edtitAble,
    options: {
      initialValue:Status==1 ? '' :  Moment(Information.RegDate),
      rules: [{
        required: true,
        message: '请填写公司注册时间!',
      }]
    }
  },{
    label: '核准时间',
    type: 'datetime',
    name: 'ApprovalDate',
    disabled:edtitAble,
    options: {
      initialValue:Status==1 ? '' :  Moment(Information.ApprovalDate),
      rules: [{
        required: true,
        message: '请填写核准时间!',
      }]
    }
  },{
    label: '法人代表',
    type: 'input',
    name: 'LegalRepresentative',
    disabled:edtitAble,
    options: {
      initialValue:Status==1 ? '' : Information.LegalRepresentative,
      rules: [{
        required: true,
        message: '请填写法人代表!',
      },{
        pattern:/^([A-Za-z]|[\u4E00-\u9FA5])+$/,
        message:'只能输入大小写字母、汉字!'
      }
      ]
    }
  },{
    label: '法人联系电话',
    type: 'input',
    name: 'LegalPersonTel',
    disabled:edtitAble,
    options: {
      initialValue:Status==1 ? '' : Information.LegalPersonTel,
      rules: [{
        required: true,
        message: '请填写法人联系电话!',
      }
      ]
    }
  },
    {
      label: '固定联系人',
      type: 'input',
      name: 'FixedContact',
      disabled:edtitAble,
      options: {
        initialValue:Status==1 ? '' : Information.FixedContact,
        rules: [{
          required: true,
          message: '请填写固定联系人!',
        },{
          pattern:/^([A-Za-z]|[\u4E00-\u9FA5])+$/,
          message:'只能输入大小写字母、汉字!'
        }
        ]
      }
    },{
      label: '固定联系人手机',
      type: 'input',
      name: 'FixedContactTel',
      disabled:edtitAble,
      options: {
        initialValue:Status==1 ? '' : Information.FixedContactTel,
        rules: [{
          required: true,
          message: '请填写固定联系人手机号码!',
        },{
          pattern:/^1[34578]\d{9}$/ ,
          message:'请填写正确格式的手机号码!'
        }
        ]
      }
    },
    {
      label: '企业类型',
      type: 'select',
      name: 'CompanyType',
      items:() => typeData.map(ele => ({
        key: ele.EnumValue,
        value: ele.Desction
      })),
      disabled:edtitAble,
      options: {
        initialValue:Status==1 ? '' : Information.CompanyType,
        rules: [{
          required: true,
          message: '请选择企业类型!',
        }]
      }
    },
    {
      label: '登记机关',
      type: 'input',
      name: 'RegOrgan',
      disabled:edtitAble,
      options: {
        initialValue:Status==1 ? '' : Information.RegOrgan,
        rules: [{
          required: true,
          message: '请填写登记机关!',
        },{
          pattern:/^([A-Za-z]|[\u4E00-\u9FA5])+$/,
          message:'只能输入大小写字母、汉字!'
        }
        ]
      }
    },{
      label: '社会信用代码',
      type: 'input',
      name: 'SocialCreditCode',
      disabled:edtitAble,
      options: {
        initialValue:Status==1 ? '' : Information.SocialCreditCode,
        rules: [{
          required: true,
          message: '请填写社会信用代码!',
        }]
      }
    },{
      label: '注册资本(万元)',
      type: 'input',
      name: 'RegisteredCapital',
      disabled:edtitAble,
      options: {
        initialValue:Status==1 ? '' : Information.RegisteredCapital,
        rules: [{
          required: true,
          message: '请填写注册资本!',
        },{
          pattern:/^[1-9]\d*$/,
          message:'只能输入正整数!'
        }
        ]
      }
    },{
      label: '组织机构代码',
      type: 'input',
      name: 'OrganizationCode',
      disabled:edtitAble,
      options: {
        initialValue:Status==1 ? '' : Information.OrganizationCode,
        rules: [{
          required: true,
          message: '请填写组织机构代码!',
        },{
          pattern:/^[0-9a-zA-Z]+$/,
          message:'只能输入正整数!'
        }
        ]
      }
    },
    {
      type: 'span',
      name: 'asdasd',
    },
   {
      label: '营业执照',
      type: 'upload',
      name: 'BusinesslicensePhoto',
      disabled:edtitAble,
      uploadUrl:'',
      action:RQHEADER+'//companyauth/saveimage',
      headers:{'Authorization': 'token '+sessionStorage.access_token},
      beforeUpload:beforeUpload,
      onChange:changeUploadBusiness,
      options: {
        initialValue:Status==1 ? [] : [{ uid: -4,name:'营业执照',url:Information.BusinesslicensePhoto,thumbUrl:Information.BusinesslicensePhoto,status:'done'}],
        rules: [{
          required: true,
          message: '请上传营业执照照片!',
        }
        ]
      }
    },{
      label: '法人身份证正面',
      type: 'upload',
      name: 'FacadeCardPhoto',
      disabled:edtitAble,
      uploadUrl:'',
      action:RQHEADER+'//companyauth/saveimage',
      headers:{'Authorization': 'token '+sessionStorage.access_token},
      beforeUpload:beforeUpload,
      onChange:changeUploadFacade,
      options: {
        initialValue:Status==1 ? [] : [{ uid: -3,name:'身份证正面',url:Information.FacadeCardPhoto,thumbUrl:Information.FacadeCardPhoto,status:'done'}],
        rules: [{
          required: true,
          message: '请上传法人身份证正面照片!',
        }
        ]
      }
    },{
      label: '法人身份证反面',
      type: 'upload',
      name: 'CorporateCardPhoto',
      disabled:edtitAble,
      uploadUrl:'',
      action:RQHEADER+'//companyauth/saveimage',
      headers:{'Authorization': 'token '+sessionStorage.access_token},
      beforeUpload:beforeUpload,
      onChange:changeUploadCorporate,
      options: {
        initialValue:Status==1 ? [] : [{ uid: -1,name:'身份证反面',url:Information.CorporateCardPhoto,thumbUrl:Information.CorporateCardPhoto,status:'done'}],
        rules: [{
          required: true,
          message: '请上传法人身份证反面照片!',
        }
        ]
      }
    },{
      label: '道路运输许可证',
      type: 'upload',
      name: 'RoadTransportPermitPhoto',
      disabled:edtitAble,
      uploadUrl:'',
      action:RQHEADER+'//companyauth/saveimage',
      headers:{'Authorization': 'token '+sessionStorage.access_token},
      beforeUpload:beforeUpload,
      onChange:changeUploadRoadTransport,
      options: {
        initialValue:Status==1 ? [] : [{ uid: -2,name:'道路运输许可证',url:Information.RoadTransportPermitPhoto,thumbUrl:Information.RoadTransportPermitPhoto,status:'done'}],
        rules: [{
          required: true,
          message: '请上传道路运输许可证照片!',
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
        initialValue:Status==1 ? '' : Information.Remark,
      }
    }
  ];
  const formfields3=[{
    label: '公司注册时间',
    type: 'datetime',
    name: 'RegDate',
    disabled:edtitAble,
    options: {
      initialValue:Status==1 ? '' :  Moment(Information.RegDate),
      rules: [{
        required: true,
        message: '请填写公司注册时间!',
      }]
    }
  },{
    label: '核准时间',
    type: 'datetime',
    name: 'ApprovalDate',
    disabled:edtitAble,
    options: {
      initialValue:Status==1 ? '' :  Moment(Information.ApprovalDate),
      rules: [{
        required: true,
        message: '请填写核准时间!',
      }]
    }
  },{
    label: '法人代表',
    type: 'input',
    name: 'LegalRepresentative',
    disabled:edtitAble,
    options: {
      initialValue:Status==1 ? '' : Information.LegalRepresentative,
      rules: [{
        required: true,
        message: '请填写法人代表!',
      },{
        pattern:/^([A-Za-z]|[\u4E00-\u9FA5])+$/,
        message:'只能输入大小写字母、汉字!'
      }
      ]
    }
  },{
    label: '法人联系电话',
    type: 'input',
    name: 'LegalPersonTel',
    disabled:edtitAble,
    options: {
      initialValue:Status==1 ? '' : Information.LegalPersonTel,
      rules: [{
        required: true,
        message: '请填写法人联系电话!',
      }
      ]
    }
  },
    {
      label: '固定联系人',
      type: 'input',
      name: 'FixedContact',
      disabled:edtitAble,
      options: {
        initialValue:Status==1 ? '' : Information.FixedContact,
        rules: [{
          required: true,
          message: '请填写固定联系人!',
        },{
          pattern:/^([A-Za-z]|[\u4E00-\u9FA5])+$/,
          message:'只能输入大小写字母、汉字!'
        }
        ]
      }
    },{
      label: '固定联系人手机',
      type: 'input',
      name: 'FixedContactTel',
      disabled:edtitAble,
      options: {
        initialValue:Status==1 ? '' : Information.FixedContactTel,
        rules: [{
          required: true,
          message: '请填写固定联系人手机号码!',
        },{
          pattern:/^1[34578]\d{9}$/ ,
          message:'请填写正确格式的手机号码!'
        }
        ]
      }
    },
    {
      label: '企业类型',
      type: 'select',
      name: 'CompanyType',
      items:() => typeData.map(ele => ({
        key: ele.EnumValue,
        value: ele.Desction
      })),
      disabled:edtitAble,
      options: {
        initialValue:Status==1 ? '' : Information.CompanyType,
        rules: [{
          required: true,
          message: '请选择企业类型!',
        }]
      }
    },
    {
      label: '登记机关',
      type: 'input',
      name: 'RegOrgan',
      disabled:edtitAble,
      options: {
        initialValue:Status==1 ? '' : Information.RegOrgan,
        rules: [{
          required: true,
          message: '请填写登记机关!',
        },{
          pattern:/^([A-Za-z]|[\u4E00-\u9FA5])+$/,
          message:'只能输入大小写字母、汉字!'
        }
        ]
      }
    },{
      label: '社会信用代码',
      type: 'input',
      name: 'SocialCreditCode',
      disabled:edtitAble,
      options: {
        initialValue:Status==1 ? '' : Information.SocialCreditCode,
        rules: [{
          required: true,
          message: '请填写社会信用代码!',
        }]
      }
    },{
      label: '注册资本(万元)',
      type: 'input',
      name: 'RegisteredCapital',
      disabled:edtitAble,
      options: {
        initialValue:Status==1 ? '' : Information.RegisteredCapital,
        rules: [{
          required: true,
          message: '请填写注册资本!',
        },{
          pattern:/^[0-9]\d*$/,
          message:'只能输入正整数!'
        }
        ]
      }
    },{
      label: '组织机构代码',
      type: 'input',
      name: 'OrganizationCode',
      disabled:edtitAble,
      options: {
        initialValue:Status==1 ? '' : Information.OrganizationCode,
        rules: [{
          required: true,
          message: '请填写组织机构代码!',
        },{
          pattern:/^[0-9a-zA-Z]+$/,
          message:'只能输入正整数!'
        }
        ]
      }
    },
    {
      type: 'span',
      name: 'VIN',
    },{
      label: '营业执照',
      type: 'upload',
      name: 'BusinesslicensePhoto',
      disabled:edtitAble,
      uploadUrl:'',
      action:RQHEADER+'//shipperauth/saveimage',
      headers:{'Authorization': 'token '+sessionStorage.access_token},
      beforeUpload:beforeUpload,
      onChange:changeUploadBusiness,
      options: {
        initialValue:Status==1 ? [] : [{ uid: 1,name:'营业执照',url:Information.BusinesslicensePhoto || '',thumbUrl:Information.BusinesslicensePhoto || '',status:'done'}],
        rules: [{
          required: true,
          message: '请上传营业执照照片!',
        }
        ]
      }
    },{
      label: '法人身份证正面',
      type: 'upload',
      name: 'FacadeCardPhoto',
      disabled:edtitAble,
      uploadUrl:'',
      action:RQHEADER+'//shipperauth/saveimage',
      headers:{'Authorization': 'token '+sessionStorage.access_token},
      beforeUpload:beforeUpload,
      onChange:changeUploadFacade,
      options: {
        initialValue:Status==1 ? [] : [{ uid: -1,name:'法人身份证正面',url:Information.FacadeCardPhoto || '',thumbUrl:Information.FacadeCardPhoto || '',status:'done'}],
        rules: [{
          required: true,
          message: '请上传法人身份证正面照片!',
        }
        ]
      }
    },{
      label: '法人身份证反面',
      type: 'upload',
      name: 'CorporateCardPhoto',
      disabled:edtitAble,
      uploadUrl:'',
      action:RQHEADER+'//shipperauth/saveimage',
      headers:{'Authorization': 'token '+sessionStorage.access_token},
      beforeUpload:beforeUpload,
      onChange:changeUploadCorporate,
      options: {
        initialValue:Status==1 ? [] : [{ uid: 1,name:'法人身份证反面',url:Information.CorporateCardPhoto || '',thumbUrl:Information.CorporateCardPhoto || '',status:'done'}],
        rules: [{
          required: true,
          message: '请上传法人身份证反面照片!',
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
        initialValue:Status==1 ? '' : Information.Remark,
      }
    }
  ];
  const formitem = [{fields:formfields,ColumnText:'基本信息'},{fields:RoleId==4?formfields2:formfields3,ColumnText:'公司注册信息'}];
  function goBack(){
    window.history.go(-1)
  }
  return (
    <ColumnForm onOk={handleSubmit} onCancel={goBack} showCancel={true} formitems={formitem} okText='确定' layout='inline' Yes={yesStatus}>
    </ColumnForm>
  );
}

function mapStateToProps(state) {
  return {...state.login,...state.certification};
}

export default connect(mapStateToProps)(Certification);
