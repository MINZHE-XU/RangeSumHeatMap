/* global google */
/* eslint-disable no-undef */
import React from 'react'
import {GoogleMap, Polyline} from "react-google-maps"
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import {
  addOnePath,
  addSpot,
  addSpotForMRs,
  updateMRs,
  clickListSpot,
  centerListSpot
} from '../actions'
const {DrawingManager} = require("react-google-maps/lib/components/drawing/DrawingManager");

// when user draw on the map (point or path), use this component to add data to store
class DrawingManagers extends React.Component {
  constructor() {
    super();
    this.state = {
      visible: true,
      coverlines: []
    }
  }

  render() {
    const polidraw = this.state.coverlines.map((path, index) => <Polyline path={path} key={index} visible={true} options={{
        visible: true,
        strokeWeight: 1,
        strokeColor: 'white',
        zIndex: -2
      }}/>)

    return (<div>
      <DrawingManager ref='manager' defaultOptions={{
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_LEFT,
            drawingModes: [google.maps.drawing.OverlayType.MARKER, google.maps.drawing.OverlayType.POLYLINE]
          },
          polylineOptions: {
            //this.props.mode.show==="point"
            visible: true,
            strokeWeight: 0.5,
            strokeColor: 'green',
            zIndex: -3
          },
          markerOptions: {
            //this.props.mode.show==="point"
            visible: false
          }
        }} onMarkerComplete={this.handleMarkerComplete} onPolylineComplete={this.handlePolylineComplete}/> {polidraw}
    </div>)

  }

  handlePolylineComplete = (e) => {
    console.log(e.getPath().b)
    this.props.addOnePath({
      path: e.getPath().b,
      isDrone: (this.props.mode.dynamic === "drone")
    })
    console.log(JSON.stringify({
      path: e.getPath().b,
      isDrone: (this.props.mode.dynamic === "drone")
    }))

    this.setState(function(prevState, props) {
      console.log(prevState)
      return {
        coverlines: [
          ...prevState.coverlines,
          e.getPath().b
        ]
      };
    });

  }

  handleMarkerComplete = (e) => {
    //console.log(e.position)
    if (this.props.mode.show === "point") {
      if (this.props.mode.dynamic === "drone") {
        this.props.addOnePath({
          isDrone: (this.props.mode.dynamic === "drone"),
          path: [new google.maps.LatLng(e.position.lat(), e.position.lng())]
        })

      } else {

        const payload = {
          lat: e.position.lat(),
          lng: e.position.lng(),
          isDynamic: false
        }
        const r = this.props.addSpot(payload)
        //console.log({spots:{lat:payload.lat, lng:payload.lng}, size:this.props.size})
        if (this.props.mode.algorithm === 'local') {
          this.props.addSpotForMRs({
            spots: {
              lat: payload.lat,
              lng: payload.lng
            },
            size: this.props.size
          })
        } else {
          this.props.updateMRs({size: this.props.size});
        }
        //this.props.clickListSpot ({...r,kind:this.props.mode.dynamic})
        this.props.centerListSpot({
          ...r,
          kind: this.props.mode.dynamic
        })

      }
    }
  }

}
//bind store as props for the component
//bind actions as props to dispatch actions to reducer
const mapDispatchToProps = {
  addOnePath: addOnePath,
  addSpot: addSpot,
  addSpotForMRs: addSpotForMRs,
  updateMRs: updateMRs,
  clickListSpot: clickListSpot,
  centerListSpot: centerListSpot

}

const mapStateToProps = (state) => ({size: state.size, mode: state.mode})

export default connect(mapStateToProps, mapDispatchToProps)(DrawingManagers);
