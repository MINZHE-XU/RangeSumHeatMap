import React from 'react'
import FileControler from '../components/FileControler'
import {connect} from 'react-redux'
import {addSpot, addSpotForMRs, deleteSpotForMRs, resetMRs, deleteDrone} from '../actions'
import {
  clickListSpot,
  centerListSpot,
  deleteSpot,
  deleteAllSpot,
  updateMRs,
  deletePath,
  deleteAllPath,
  undateCandidateSpot,
  deleteCandidateSpot,
  deleteAllDrone,
  addOnePath,
  changeDynamicType
} from '../actions'
import {
  Panel,
  Row,
  Col,
  ControlLabel,
  FormControl,
  Button,
  ButtonToolbar,
  ToggleButtonGroup,
  ToggleButton,
  Image
} from 'react-bootstrap';

//renders add spot panel. can add and delete data points
class AddSpotPanel extends React.Component {
  constructor() {
    super();
    this.state = {
      message: '',
      data: null
    }

  }

  render() {
    const data = this.state.data;
    return (<div>
      <FileControler/>

      <Panel id="collapsible-panel" defaultExpanded={true}>
        <Panel.Heading>
          <Panel.Title toggle={true}>
            Datapoints Panel
          </Panel.Title>
        </Panel.Heading>
        <Panel.Collapse>
          <br/>
          <Row >
            <Col componentClass={ControlLabel} xs={5} sm={5} md={5}>
              <label>&nbsp;&nbsp;Object Type</label>
            </Col>
            <Col xs={7} sm={7} md={7}>
              <ButtonToolbar >
                <ToggleButtonGroup bsSize="small" type="radio" name="path-options" defaultValue={1} onChange={(e) => this.handleChangeDynamicType(e)}>
                  <ToggleButton value={1}><Image className="data-point-image" alt="10x10" src="http://maps.google.com/mapfiles/kml/paddle/wht-diamond-lv.png" rounded={true}/>
                    Point</ToggleButton>
                  <ToggleButton value={2}><Image className="drone-image" alt="10x10" src="http://maps.google.com/mapfiles/kml/shapes/heliport.png" rounded={true}/>
                    Drone</ToggleButton>
                </ToggleButtonGroup>
              </ButtonToolbar>
            </Col>
          </Row >

          <br/>
          <Row >
            <Col componentClass={ControlLabel} xs={5} sm={5} md={5}>
              &nbsp;&nbsp;X-Coordinate
            </Col>
            <Col xs={6} sm={6} md={6}>
              <FormControl bsSize="small" type='text' placeholder={(
                  this.props.statusPoint.clicked.lat === 10000)
                  ? "type latitude here"
                  : this.props.statusPoint.clicked.lat} inputRef={(input) => this.latInput = input} onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    this.handleClick(e)
                  }
                }}/>
            </Col>
          </Row >
          <Row >
            <Col componentClass={ControlLabel} xs={5} sm={5} md={5}>
              &nbsp;&nbsp;Y-Coordinate
            </Col>
            <Col xs={6} sm={6} md={6}>
              <FormControl bsSize="small" type='text' placeholder={(
                  this.props.statusPoint.clicked.lng === 10000)
                  ? "type longtitude here"
                  : this.props.statusPoint.clicked.lng} inputRef={(input) => this.lngInput = input} onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    this.handleClick(e)
                  }
                }}/>
            </Col>
          </Row >
          <Col xs={4} sm={4} md={4}></Col>&nbsp;&nbsp;&nbsp;{this.state.message}<br/>
          <Row >
            <Col xs={2} sm={2} md={2}></Col>
            <Col xs={4} sm={4} md={4}>
              <Button bsSize="small" type="submit" onClick={(e) => this.handleClick(e)}>
                &nbsp;&nbsp;Add Selected&nbsp;&nbsp;
              </Button>
              <Button bsSize="small" type="submit" onClick={(e) => this.handleAddAll(e)}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Add All&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </Button>
            </Col>
            <Col xs={4} sm={4} md={4}>
              <Button bsSize="small" type="submit" onClick={(e) => this.handleDelete(e)}>
                Delete Selected
              </Button>
              <Button bsSize="small" type="submit" onClick={(e) => this.handleDeleteAll(e)}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Delete All&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </Button>

            </Col>

          </Row >
          <br/>
        </Panel.Collapse>
      </Panel>

    </div>)
  }

  handleClick(e) {
    const latValue = (this.latInput.value.trim() === "")
      ? parseFloat(this.latInput.placeholder)
      : parseFloat(this.latInput.value.trim())
    const lngValue = (this.lngInput.value.trim() === "")
      ? parseFloat(this.lngInput.placeholder)
      : parseFloat(this.lngInput.value.trim())
    this.handleAdd(latValue, lngValue)
    this.props.deleteCandidateSpot({lat: latValue, lng: lngValue})

  }
  handleAddAll(e) {
    this.props.statusPoint.candidateSpots.map((spot, index) => {
      this.handleAdd(spot.lat, spot.lng)
    })
    this.props.undateCandidateSpot([])
    this.setState({message: "added"})
  }

  handleAdd(latValue, lngValue) {
    if (-90 <= latValue && latValue <= 90 && -180 <= lngValue && lngValue <= 180) {
      let temp = this.props.spots;
      const r = this.props.addSpot({id: -1, lat: latValue, lng: lngValue, isDynamic: false})

      if (this.props.mode.algorithm === 'local') {
        this.props.addSpotForMRs({
          spots: {
            lat: latValue,
            lng: lngValue
          },
          size: this.props.size
        })
      } else {
        this.props.updateMRs({size: this.props.size});
      }
      //this.props.clickListSpot ({...r, kind:"point"})
      this.props.centerListSpot({
        ...r,
        kind: "point"
      })
      this.setState({message: "added"})
    } else {
      this.setState({message: "invalid value"})
    }
  }

  handleChangeDynamicType() {
    this.props.changeDynamicType()
  }

  handleChange(e) {
    this.props.changeMode();
  }

  handleDelete(e) {
    if (this.props.statusPoint.clicked.kind === "point") {
      const r = this.props.deleteSpot(this.props.statusPoint.clicked)
      this.props.deletePath(this.props.statusPoint.clicked)

      if (this.props.mode.algorithm === 'local') {
        this.props.deleteSpotForMRs({spots: this.props.statusPoint.clicked, size: this.props.size})
      } else {
        this.props.updateMRs({size: this.props.size});
      }
      this.props.clickListSpot({id: -1, lat: 10000, lng: 10000, kind: "unknown"})
      this.props.centerListSpot({id: -1, lat: 10000, lng: 10000, kind: "unknown"})
    }
    if (this.props.statusPoint.clicked.kind === "drone") {
      this.props.deleteDrone(this.props.statusPoint.clicked)
      this.props.deletePath(this.props.statusPoint.clicked)
    }
    this.setState({message: "deleted"})
  }
  handleDeleteAll(e) {
    const r = this.props.deleteAllSpot()
    this.props.deleteAllDrone()
    this.props.deleteAllPath()
    this.props.undateCandidateSpot([])
    this.props.resetMRs()
    this.props.clickListSpot({id: -1, lat: 10000, lng: 10000, kind: "unknown"})
    this.props.centerListSpot({id: -1, lat: 10000, lng: 10000, kind: "unknown"})
    this.setState({message: "deleted"})
  }
}

//bind store as props for the component
//bind actions as props to dispatch actions to reducer
const mapStateToProps = (state) => ({statusPoint: state.statusPoint, size: state.size, mode: state.mode, spots: state.spots})
const mapDispatchToProps = {
  addOnePath: addOnePath,
  addSpot: addSpot,
  deleteSpot: deleteSpot,
  resetMRs: resetMRs,
  addSpotForMRs: addSpotForMRs,
  updateMRs: updateMRs,
  deleteSpotForMRs: deleteSpotForMRs,
  deleteAllSpot: deleteAllSpot,
  clickListSpot: clickListSpot,
  centerListSpot: centerListSpot,
  deletePath: deletePath,
  deleteAllPath: deleteAllPath,
  undateCandidateSpot: undateCandidateSpot,
  deleteCandidateSpot: deleteCandidateSpot,
  deleteDrone: deleteDrone,
  deleteAllDrone: deleteAllDrone,
  changeDynamicType: changeDynamicType
}
export default connect(mapStateToProps, mapDispatchToProps)(AddSpotPanel);
