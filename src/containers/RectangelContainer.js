/* global google */
/* eslint-disable no-undef */
import React from 'react'
import {GoogleMap, Rectangle} from "react-google-maps"
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types'

//rectangle layer on the map
class RectangelContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      coloredID: -1
    }
  }

  render() {
    let maxMR = 10
    this.props.mrs.map((mr, index) => {
      if (mr.rs > maxMR) {
        maxMR = mr.rs
      }
    })

    return (this.props.mrs.map((mr, index) => <Rectangle key={index} visible={true} bounds={{
        north: mr.north,
        south: mr.south,
        east: mr.east,
        west: mr.west
      }} options={{
        strokeWeight: (mr.rs === 0)
          ? 0
          : (this.state.coloredID === mr.id)
            ? 1
            : 0.1,
        fillOpacity: mr.rs / maxMR,
        draggable: false,
        editable: false,
        clickable: this.props.mode.show === "rectangle",
        fillColor: (this.state.coloredID === index)
          ? "red"
          : "black",
        strokeColor: (this.state.coloredID === index)
          ? "red"
          : "black"
      }} onMouseOut={() => this.handleOnMouseOut(index)} onMouseOver={() => this.handleOnMouseOver(index)}/>))
  }
  handleOnMouseOver = (id, e) => {
    this.setState({coloredID: id})
  }

  handleOnMouseOut = (id, e) => {
    this.setState({coloredID: -1})
  }

}

//bind store as props for the component
//bind actions as props to dispatch actions to reducer
const mapStateToProps = (state) => ({mrs: state.mrs, size: state.size, mode: state.mode})

export default connect(mapStateToProps)(RectangelContainer);
