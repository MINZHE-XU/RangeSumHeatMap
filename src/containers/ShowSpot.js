import React from 'react'
import Component from 'react'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'
import SpotList from '../components/SpotList'
import {
  clickListSpot,
  centerListSpot,
  deleteSpot,
  deleteSpotForMRs,
  deletePath,
  updateMRs
} from '../actions'

//bind store as props for the component
//bind actions as props to dispatch actions to reducer
const mapStateToProps = (state) => ({spots: state.spots, statusPoint: state.statusPoint, size: state.size, mode: state.mode})

const mapDispatchToProps = {
  centerListSpot: centerListSpot,
  clickListSpot: clickListSpot,
  deleteSpotForMRs: deleteSpotForMRs,
  deleteSpot: deleteSpot,
  deletePath: deletePath,
  updateMRs: updateMRs
}

export default connect(mapStateToProps, mapDispatchToProps)(SpotList);
