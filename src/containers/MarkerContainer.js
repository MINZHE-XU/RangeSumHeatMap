/* global google */
/* eslint-disable no-undef */
import React from 'react'
import {GoogleMap, Marker} from "react-google-maps"
import {clickListSpot, centerListSpot} from '../actions'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types'

const white_point_marker = 'http://maps.google.com/mapfiles/kml/paddle/ylw-blank.png'
//marker layer on the map
class Markers extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (this.props.spots.map((spot) => <Marker position={{
        lat: spot.lat,
        lng: spot.lng
      }} key={spot.id} visible={this.props.mode.show === "point"} zIndex={2}
      //http://kml4earth.appspot.com/icons.html
      
      //is center
      icon={(
        spot.lat === this.props.statusPoint.clicked.lat && spot.lng === this.props.statusPoint.clicked.lng)
        ? {
          url: white_point_marker,
          scaledSize: new google.maps.Size(38, 38)
        }
        : (spot.lat === this.props.statusPoint.center.lat && spot.lng === this.props.statusPoint.center.lng)
          ? {
            url: white_point_marker,
            scaledSize: new google.maps.Size(18, 18)
          }
          : (spot.surveillanced === true)
            ? (spot.isDynamic === true)
              ? {
                url: 'http://maps.google.com/mapfiles/kml/paddle/blu-diamond-lv.png',
                scaledSize: new google.maps.Size(8, 8),
                anchor: new google.maps.Point(4, 4)
              }
              : {
                url: 'http://maps.google.com/mapfiles/kml/paddle/blu-blank-lv.png',
                scaledSize: new google.maps.Size(8, 8),
                anchor: new google.maps.Point(4, 4)
              }
            : (spot.isDynamic === true)
              ? {
                url: 'http://maps.google.com/mapfiles/kml/paddle/wht-diamond-lv.png',
                scaledSize: new google.maps.Size(8, 8),
                anchor: new google.maps.Point(4, 4)
              }
              : {
                url: 'http://maps.google.com/mapfiles/kml/paddle/wht-blank-lv.png',
                scaledSize: new google.maps.Size(8, 8),
                anchor: new google.maps.Point(4, 4)
              }}
      //icon={(spot.lat===this.props.center.lat && spot.lng===this.props.center.lng)? '' : {url: 'http://maps.google.com/mapfiles/kml/paddle/wht-blank-lv.png'}}
      onMouseOver={() => this.handleOnMouseOver(spot)} onClick={() => this.handleOnClick(spot)}/>))
  }

  handleOnMouseOver = (spot, e) => {
    this.props.centerListSpot({
      ...spot,
      kind: "point"
    })
  }

  handleOnClick = (spot, e) => {
    this.props.clickListSpot({
      ...spot,
      kind: "point"
    })
  }
}

//bind store as props for the component
//bind actions as props to dispatch actions to reducer
const mapStateToProps = (state) => ({spots: state.spots, statusPoint: state.statusPoint, mode: state.mode})

const mapDispatchToProps = {
  centerListSpot: centerListSpot,
  clickListSpot: clickListSpot

}

export default connect(mapStateToProps, mapDispatchToProps)(Markers);
