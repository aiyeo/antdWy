import React, { PropTypes } from 'react'
import {
  Modal,
} from 'antd'

import Form from './form'
import ModalForm from './form2'

export default class FormModal extends React.Component {

  render() {
    const {
      modalKey,
      visible,
      title,
      fields,
      onCancel,
      onOk,
      Yes,
      okText,
      layout,
      width,
      noBtn,
      showCancel,
      otherFields,
      placeholder
    } = this.props;
    return (
      <Modal
        wrapClassName="form"
        key={modalKey}
        visible={visible}
        title={title}
        onCancel={onCancel}
        footer={null}
        width={width}
        maskClosable={false}
      >
        <Form
          fields={fields}
          otherFields={otherFields}
          onOk={onOk}
          Yes={Yes}
          placeholder={placeholder}
          onCancel={onCancel}
          okText={okText}
          layout={layout}
          noBtn={noBtn}
          showCancel={true}
        />
      </Modal>
    )
  }
}
export class ModalFormSpec extends React.Component{
	render(){
		const {
      modalKey,
      visible,
      title,
      fields,
      onCancel,
      onOk,
      Yes,
      okText,
      layout,
      width,
      noBtn,
      showCancel,
      otherFields,
      placeholder
      
    } = this.props;
		return(
		<Modal
        wrapClassName="form"
        key={modalKey}
        visible={visible}
        title={title}
        onCancel={onCancel}
        footer={null}
        width={width}
        maskClosable={false}
      >
        <ModalForm
          fields={fields}
          otherFields={otherFields}
          onOk={onOk}
          Yes={Yes}
          placeholder={placeholder}
          onCancel={onCancel}
          okText={okText}
          layout={layout}
          noBtn={noBtn}
          showCancel={true}
        />
      </Modal>
	)
	}
	
}

FormModal.propTypes = {
  modalKey: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(Object).isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  okText: PropTypes.string,
  layout:PropTypes.string,

}
ModalFormSpec.propTypes = {
  modalKey: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(Object).isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  okText: PropTypes.string,
  layout:PropTypes.string,

}
