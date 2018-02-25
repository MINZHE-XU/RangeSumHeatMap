/* global google */
/* eslint-disable no-undef */
import React from 'react'
import {GoogleMap, Marker} from "react-google-maps"
import {clickListSpot, centerListSpot} from '../actions'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import PropTypes from 'prop-types'

const heliport_marker = 'http://maps.google.com/mapfiles/kml/shapes/heliport.png'
//drone layer on the map
class DroneContainer extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (this.props.drones.map((spot) => <Marker position={{
        lat: spot.lat,
        lng: spot.lng
      }} key={spot.id} visible={this.props.mode.show === "point"} zIndex={2}
      //http://kml4earth.appspot.com/icons.html
      
      //is center
      icon={(
        spot.lat === this.props.statusPoint.clicked.lat && spot.lng === this.props.statusPoint.clicked.lng)
        ? {
          url: heliport_marker,
          scaledSize: new google.maps.Size(50, 50),
          anchor: new google.maps.Point(25, 25)
        }
        : (spot.lat === this.props.statusPoint.center.lat && spot.lng === this.props.statusPoint.center.lng)
          ? {
            url: heliport_marker,
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 20)
          }
          : {
            url: heliport_marker,
            scaledSize: new google.maps.Size(30, 30),
            anchor: new google.maps.Point(15, 15)
          }} onMouseOver={() => this.handleOnMouseOver(spot)} onClick={() => this.handleOnClick(spot)}/>))
  }

  handleOnMouseOver = (spot, e) => {
    this.props.centerListSpot({
      ...spot,
      kind: "drone"
    })
  }

  handleOnClick = (spot, e) => {
    this.props.clickListSpot({
      ...spot,
      kind: "drone"
    })
  }
}

//bind store as props for the component
//bind actions as props to dispatch actions to reducer
const mapStateToProps = (state) => ({drones: state.drones, statusPoint: state.statusPoint, mode: state.mode})

const mapDispatchToProps = {
  centerListSpot: centerListSpot,
  clickListSpot: clickListSpot

}

export default connect(mapStateToProps, mapDispatchToProps)(DroneContainer);
