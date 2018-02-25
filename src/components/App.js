import React, {Component} from 'react';
import AddSpotPanel from '../containers/AddSpotPanel'
import ShowSpot from '../containers/ShowSpot'
import DemoMap from '../containers/DemoMap'
import SizeControl from '../containers/SizeControl'
import ControlPanel from '../containers/ControlPanel'
import Footer from './footer'
//import MyFancyComponent from '../containers/MapNew1'
import {withScriptjs, withGoogleMap, GoogleMap, Marker} from "react-google-maps"
import {
  Accordion,
  Panel,
  PanelGroup,
  Grid,
  Row,
  Col,
  Clearfix
} from 'react-bootstrap';

class App extends Component {
  render() {
    return (<Grid>
      <Row className="show-grid">
        <Col xs={12} md={4}>
          <AddSpotPanel/>
          <ControlPanel/>
          <ShowSpot/>
        </Col>
        <Col xs={12} md={8}>
          <DemoMap/>
        </Col>
      </Row>
      <Footer/>
    </Grid>);
  }
}

export default App;
