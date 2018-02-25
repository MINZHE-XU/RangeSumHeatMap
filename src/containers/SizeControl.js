import React from 'react'
import Component from 'react'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'
import {changeSize, resetMRs, deleteAllSpot, deleteAllPath} from '../actions'

//control panel
class SizeControl extends React.Component {
  constructor() {
    super();
    this.state = {
      messageSize: ''
    }
  }
  render() {
    return (<div>
      <label>
        Set size:
      </label>
      <input type='text' placeholder={this.props.size.length} ref='lengthInput'/>
      <input type='text' placeholder={this.props.size.height} ref='heightInput'/>
      <button onClick={(e) => this.handleChangeSize(e)}>
        ChangeSize
      </button>
      {this.state.messageSize}
      <br/>
    </div>)
  }

  handleChangeSize(e) {
    const lengthValue = (this.refs.lengthInput.value.trim() === "")
      ? parseFloat(this.refs.lengthInput.placeholder)
      : parseFloat(this.refs.lengthInput.value.trim())
    const heightValue = (this.refs.heightInput.value.trim() === "")
      ? parseFloat(this.refs.heightInput.placeholder)
      : parseFloat(this.refs.heightInput.value.trim())
    if (0 < lengthValue && lengthValue <= 360 && 0 < heightValue && heightValue <= 180) {
      const r = this.props.changeSize({length: lengthValue, height: heightValue})
      this.props.deleteAllSpot()
      this.props.deleteAllPath()
      this.props.resetMRs()
      this.setState({messageSize: "changed"})
    } else {
      this.setState({messageSize: "invalid value"})
    }
  }

}
const mapStateToProps = (state) => ({size: state.size})
const mapDispatchToProps = {
  changeSize: changeSize,
  resetMRs: resetMRs,
  deleteAllSpot: deleteAllSpot,
  deleteAllPath: deleteAllPath
}
export default connect(mapStateToProps, mapDispatchToProps)(SizeControl);
