/* eslint-disable no-undef */
/* global google */
import React from 'react'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'
import {
  addSpot,
  addSpotForMRs,
  deleteSpotForMRs,
  clickListSpot,
  centerListSpot,
  updateMRs,
  undateCandidateSpot
} from '../actions'
import {GroundOverlay, Rectangle, DrawingManager} from "react-google-maps"
import Markers from './MarkerContainer'
import CandidateMarkers from './CandidateMarkerContainer'
import PolylineContainer from './PolylineContainer'
import RectangelContainer from './RectangelContainer'
import DrawingManagers from './DrawingManagers'
import DroneContainer from './DroneContainer'

const _ = require("lodash");
const {compose, withProps, lifecycle} = require("recompose");
const {withScriptjs, withGoogleMap, GoogleMap, Marker} = require("react-google-maps");
const {SearchBox} = require("react-google-maps/lib/components/places/SearchBox");
// to show map on the page
const DemoMap = compose(withProps({
  googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyA1AZfv7mJ0-GTkCeYuQDL34-OaqSCQWmo&v=3.exp&libraries=geometry,drawing,places", loadingElement: <div style={{
      height: `100%`
    }}/>,
  containerElement: <div style={{
      height: "80vmin"
    }}/>,
  mapElement: <div style={{
        height: `100%`
      }}/>
}), lifecycle({
  componentWillMount() {

    const refs = {}

    this.setState({
      bounds: null,
      center: {
        lat: -37.80123932755578,
        lng: 144.96047973632812
      },
      markers: [],
      onMapMounted: ref => {
        refs.map = ref;
        const customMapType = new google.maps.StyledMapType([
          {
            elementType: 'labels',
            stylers: [
              {
                visibility: 'off'
              }
            ]
          }
        ], {name: 'Custom Style'});
        const customMapTypeId = 'custom_style';

      },
      onBoundsChanged: () => {
        //console.log(refs.map.getCenter())
        this.setState({bounds: refs.map.getBounds(), center: refs.map.getCenter()})
      },
      onSearchBoxMounted: ref => {
        refs.searchBox = ref;
      },
      onPlacesChanged: () => {

        const places = refs.searchBox.getPlaces();
        const bounds = new google.maps.LatLngBounds();
        console.log(refs.searchBox.getPlaces())
        places.forEach(place => {
          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport)
          } else {
            bounds.extend(place.geometry.location)
          }
        });
        console.log(places)

        const nextMarkers = places.map(place => ({position: place.geometry.location, information: place}));
        const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

        this.setState({center: nextCenter, markers: nextMarkers});

        this.props.undateCandidateSpot(this.state.markers.map((spot, index) => {
          return {
            id: -1,
            number: index,
            lat: spot.position.lat(),
            lng: spot.position.lng(),
            information: spot.information,
            isOpen: (index === 0)
          }
        })) // refs.map.fitBounds(bounds);
      },

      onMouseOut: (e) => {
        const payload = {
          id: -1,
          lat: 1000,
          lng: 1000,
          type: "unknown"
        }
        this.props.centerListSpot(payload)
      },
      onMouseOver: (e) => {
        this.setState({bounds: refs.map.getBounds(), center: refs.map.getCenter()})
        console.log("ssadas")
      }

    })
  }
}), withScriptjs, withGoogleMap)(props => <GoogleMap ref={props.onMapMounted} defaultZoom={13} clickableIcons={false} defaultExtraMapTypes={[
    [
      'custom_style',
      new google.maps.StyledMapType(mapStyle, {name: 'Custom Style'})
    ]
  ]} defaultMapTypeId={'custom_style'} options={{
    mapTypeControl: false,
    streetViewControl: false,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_TOP
    }
  }} center={props.center} onDragEnd={props.onBoundsChanged} onClick={props.onClick} onMouseOut={props.onMouseOut} onMouseOver={props.onMouseOver}>
  <SearchBox ref={props.onSearchBoxMounted} bounds={props.bounds} controlPosition={google.maps.ControlPosition.TOP_CENTER} onPlacesChanged={props.onPlacesChanged}>
    <input type="text" placeholder="Search place here" style={boxStyle}/>
  </SearchBox>
  <Markers/>
  <CandidateMarkers/>
  <DroneContainer/>
  <DrawingManagers/>
  <RectangelContainer/>
  <PolylineContainer/>
</GoogleMap>);

const mapStateToProps = (state) => ({spots: state.spots, center: state.center, mode: state.mode, size: state.size, statusPoint: state.statusPoint})

const mapDispatchToProps = {
  addSpot: addSpot,
  updateMRs: updateMRs,
  addSpotForMRs: addSpotForMRs,
  clickListSpot: clickListSpot,
  centerListSpot: centerListSpot,
  undateCandidateSpot: undateCandidateSpot
}

export default connect(mapStateToProps, mapDispatchToProps)(DemoMap);

const boxStyle = {
  boxSizing: `border-box`,
  border: `1px solid transparent`,
  width: `240px`,
  height: `32px`,
  marginTop: `27px`,
  padding: `0 12px`,
  borderRadius: `3px`,
  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
  fontSize: `14px`,
  outline: `none`,
  textOverflow: `ellipses`
}

const mapStyle = [
  {
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  }, {
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#76868e"
      }, {
        "weight": 1
      }
    ]
  }, {
    "featureType": "administrative.country",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  }, {
    "featureType": "administrative.province",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#a9b8bf"
      }, {
        "weight": 1
      }
    ]
  }, {
    "featureType": "administrative.province",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  }, {
    "featureType": "administrative.locality",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  }, {
    "featureType": "administrative.neighborhood",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  }, {
    "featureType": "administrative.land_parcel",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  }, {
    "featureType": "landscape.man_made",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  }, {
    "featureType": "landscape.natural.terrain",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#cfe6d4"
      }
    ]
  }, {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#a7bfc9"
      }
    ]
  }, {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#76868e"
      }, {
        "lightness": 75
      }
    ]
  }, {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  }, {
    "featureType": "road.highway",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }, {
    "featureType": "road.local",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#76868e"
      }, {
        "lightness": 60
      }
    ]
  }, {
    "featureType": "road.arterial",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#76868e"
      }, {
        "lightness": 55
      }
    ]
  }, {
    "featureType": "landscape.natural",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  }, {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "lightness": 30
      }
    ]
  }, {
    "featureType": "administrative.province",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#7c93a3"
      }, {
        "gamma": 1
      }
    ]
  }, {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6e7e8a"
      }, {
        "lightness": 25
      }
    ]
  }, {
    "featureType": "administrative.neighborhood",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#93a1ac"
      }, {
        "lightness": 30
      }
    ]
  }, {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#93a1ac"
      }, {
        "lightness": -10
      }
    ]
  }, {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#93a1ac"
      }, {
        "lightness": -30
      }
    ]
  }, {
    "featureType": "poi.attraction",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }, {
    "featureType": "poi.attraction",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "lightness": 35
      }
    ]
  }, {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "lightness": 30
      }
    ]
  }, {
    "featureType": "administrative.country",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }

]
