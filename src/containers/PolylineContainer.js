/* global google */
/* eslint-disable no-undef */
import React from 'react'
import {GoogleMap, Polyline} from "react-google-maps"
import {
  clickListSpot,
  centerListSpot,
  addSpot,
  deleteSpot,
  addSpotForMRs,
  deleteSpotForMRs
} from '../actions'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types'

const white_point_marker = 'http://maps.google.com/mapfiles/kml/paddle/wht-blank.png'
//polyline layer on the map
class PolylineContainer extends React.Component {
  constructor() {
    super();

  }

  render() {
    return (this.props.path.map((apath) => <Polyline path={apath.path} key={apath.id} visible={true} options={{
        visible: this.props.mode.show === "point",
        strokeWeight: 0.5,
        strokeColor: 'pink',
        zIndex: -1
      }}/>))
  }

}

const mapStateToProps = (state) => ({spots: state.spots, statusPoint: state.statusPoint, mode: state.mode, path: state.path, size: state.size})

//bind store as props for the component
//bind actions as props to dispatch actions to reducer
const mapDispatchToProps = {
  centerListSpot: centerListSpot,
  clickListSpot: clickListSpot,
  addSpot: addSpot,
  deleteSpot: deleteSpot,
  addSpotForMRs: addSpotForMRs,
  deleteSpotForMRs: deleteSpotForMRs
}

export default connect(mapStateToProps, mapDispatchToProps)(PolylineContainer);
