/* global google */
/* eslint-disable no-undef */

import React from 'react'

import Component from 'react'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'
import {
  addSpot,
  addSpotForMRs,
  deleteSpotForMRs,
  resetMRs,
  deleteDrone,
  downloadData
} from '../actions'
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
  changeDynamicType,
  uploadData,
  cleanUploadStatus,
  cleanDownloadStatus
} from '../actions'

import {
  Modal,
  Panel,
  Grid,
  Row,
  Col,
  Clearfix,
  ListGroup,
  ListGroupItem,
  Table,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
  Navbar,
  MenuItem,
  NavDropdown,
  Nav,
  NavItem,
  ButtonToolbar,
  ToggleButtonGroup,
  ToggleButton,
  Image
} from 'react-bootstrap';
import {CopyToClipboard} from 'react-copy-to-clipboard';

class FlieControler extends React.Component {
  constructor() {
    super();
    this.state = {
      //showReadModal ,showExportModal,  showUploadModal,  showDownloadModal, Tip Modal
      showModal: [
        false, false, false, false, false
      ],
      loadFileStatus: {
        status: "NONE",
        groupeddata: {},
        show: ""
      },
      copied: false
    }
    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
  }

  close() {

    this.setState({
      showModal: [
        false, false, false, false, false
      ],
      loadFileStatus: {
        status: "NONE",
        groupeddata: {},
        show: ""
      },
      copied: false
    })
    this.props.cleanUploadStatus()
    this.props.cleanDownloadStatus()
  }

  open(eventKey) {

    this.setState(function(prevState, props) {
      let tempModel = [...prevState.showModal]
      tempModel[eventKey - 1] = true
      console.log(tempModel)
      return {showModal: tempModel};
    });
    //this.setState(showModal: [false,false,false,false]);
  }

  render() {
    return (<div>
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">RSHM</a>
          </Navbar.Brand>
        </Navbar.Header>

        <Nav onSelect={this.open}>
          <NavDropdown title="File" id="basic-nav-dropdown">
            <MenuItem eventKey={1}>Read Local File</MenuItem>
            <MenuItem eventKey={2}>Export Data</MenuItem>
            <MenuItem divider={true}/>
            <MenuItem eventKey={3}>Upload To Server</MenuItem>
            <MenuItem eventKey={4}>Download From Server</MenuItem>
          </NavDropdown>
          <NavItem eventKey={5} href="#">Tips</NavItem>
        </Nav>
      </Navbar>

      <Modal show={this.state.showModal[0]} onHide={() => this.close(1)}>
        <Modal.Header closeButton={true}>
          <Modal.Title>Read Local File</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Please select the file</p>
          <label className="file-load-label">
            <input type="file" className="file-load" placeholder="Customized your placeholder" onChange={this.handleFileSelect}/>
            &nbsp;&nbsp;&nbsp;&nbsp;Load File&nbsp;&nbsp;&nbsp;&nbsp;
          </label>
          <br/>
          <p>&nbsp;</p>
          <p>{this.state.loadFileStatus.show}</p>
          <Button bsSize="small" type="submit" bsStyle="success" className={(
              this.state.loadFileStatus.status === "SUCCESS")
              ? "none"
              : "hide"} onClick={(e) => this.startFileAdding(this.state.loadFileStatus)}>
            Confirm to add
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.close(1)}>Cancel</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={this.state.showModal[1]} bsSize="large" onHide={() => this.close(2)}>
        <Modal.Header closeButton={true}>
          <Modal.Title>Export Data</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <h4>Please save following data to a file ending with .json</h4>
          <p>{
              JSON.stringify({
                datapoints: this.props.spots.filter((spot) => spot.isDynamic === false),
                paths: this.props.path.map(function(onePath) {
                  return {
                    ...onePath,
                    path: onePath.fullPath,
                    fullPath: []
                  }
                })
              })
            }</p>
          <CopyToClipboard className="btn btn-sm btn-default" text={JSON.stringify({
              datapoints: this.props.spots.filter((spot) => spot.isDynamic === false),
              paths: this.props.path.map(function(onePath) {
                return {
                  ...onePath,
                  path: onePath.fullPath,
                  fullPath: []
                }
              })
            })} onCopy={() => this.setState({copied: true})}>
            <button>Copy to clipboard</button>
          </CopyToClipboard>
          <p>&nbsp;{
              (this.state.copied === true)
                ? "Copied"
                : ""
            }&nbsp;</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.close(2)}>Cancel</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={this.state.showModal[2]} onHide={() => this.close(3)}>
        <Modal.Header closeButton={true}>
          <Modal.Title>Upload To Server</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Do you want to upload local data to the server?</p>
          <Button bsSize="small" type="submit" disabled={(
              this.props.statusPoint.uploadStatus.status === "SUCCESS" || this.props.statusPoint.uploadStatus.status === "UPLOADING")
              ? true
              : false} onClick={(e) => this.handleUploadData(e)}>
            Confirm to Upload Data
          </Button>
          <br/>
          <p>&nbsp;</p>
          <p>{this.props.statusPoint.uploadStatus.show}</p>
          <p style={{
              color: 'red'
            }}>{this.props.statusPoint.uploadStatus.data_id}</p>
          <CopyToClipboard className={(
              this.props.statusPoint.uploadStatus.status === "SUCCESS")
              ? "btn btn-sm btn-default"
              : "btn btn-sm btn-default hide"} text={this.props.statusPoint.uploadStatus.data_id} onCopy={() => this.setState({copied: true})}>
            <button>Copy Token to clipboard</button>
          </CopyToClipboard>
          <p>&nbsp;{
              (this.state.copied === true)
                ? "Copied"
                : ""
            }&nbsp;</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.close(3)}>Cancel</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={this.state.showModal[3]} onHide={() => this.close(4)}>
        <Modal.Header closeButton={true}>
          <Modal.Title>Download From Server</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Please enter your data token
          </p>
          <Row >
            <Col xsHidden={true} sm={2} md={2}></Col>
            <Col xs={8} sm={8} md={8}>
              <FormControl bsSize="small" type='text' placeholder="type token here" inputRef={(input) => this.tokenInput = input} onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    this.handleClickToken(e)
                  }
                }}/>
            </Col>
            <Col xsHidden={true} sm={2} md={2}></Col>
          </Row >
          <br/>
          <Button bsSize="small" type="submit" onClick={(e) => this.handleClickToken(e)} disabled={(
              this.props.statusPoint.downloadStatus.status === "SUCCESS" || this.props.statusPoint.downloadStatus.status === "UPLOADING")
              ? true
              : false}>
            Download Data
          </Button>
          <br/>
          <p>&nbsp;</p>
          <p>{this.props.statusPoint.downloadStatus.show}</p>
          <Button bsSize="small" type="submit" bsStyle="success" className={(
              this.props.statusPoint.downloadStatus.status === "SUCCESS")
              ? "none"
              : "hide"} onClick={(e) => this.startFileAdding(this.dataLoader(this.props.statusPoint.downloadStatus.groupeddata))}>
            Confirm to add
          </Button>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.close(4)}>Cancel</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={this.state.showModal[4]} onHide={() => this.close(5)}>
        <Modal.Header closeButton={true}>
          <Modal.Title>Continuously Maintained Range Sum Heat Maps</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <p>Choose adding static or dynamic point using the tool on the left-top of the map.</p>
          <p>Choose adding point or drone using the tool in the Datapoints panel.</p>
          <p>Use the data points panel to configure points or drones on the map</p>
          <p>Use the search box to search for candidates and use 'add' button to add them</p>
          <p>Use range size panel to change range size</p>
          <p>Use algorithm panel to choose algorithm</p>
          <p>Click 'run simulation' button to let the dynamic points move forward or backward</p>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.close(4)}>Cancel</Button>
        </Modal.Footer>
      </Modal>

    </div>)
  }

  handleUploadData() {
    console.log(JSON.stringify({
      datapoints: this.props.spots.filter((spot) => spot.isDynamic === false),
      paths: this.props.path.map(function(onePath) {
        return {
          ...onePath,
          path: onePath.fullPath,
          fullPath: []
        }
      })
    }))
    this.props.uploadData(JSON.stringify({
      datapoints: this.props.spots.filter((spot) => spot.isDynamic === false),
      paths: this.props.path.map(function(onePath) {
        return {
          ...onePath,
          path: onePath.fullPath,
          fullPath: []
        }
      })
    }));
  }

  handleClickToken() {
    const tokenValue = this.tokenInput.value.trim()
    if (tokenValue !== "") {
      this.props.downloadData(tokenValue)
    }
  }

  //add the source to map
  startFileAdding(source) {
    console.log(source)
    if (source.status === "SUCCESS") {
      this.handleDeleteAll()
      source.groupeddata.datapoints.map((spot) => {
        this.handleAdd(spot.lat, spot.lng)
      })
      source.groupeddata.paths.map((path) => {
        this.props.addOnePath({path: path.path, isDrone: path.isDrone})
      })
    }
    this.close()
  }

  //load the file and change into store's format
  dataLoader(content) {
    try {
      //this.setState({data: content});
      const loadedJson = JSON.parse(content);
      //console.log(JSON.stringify(loadedJson))
      //console.log("????????????")
      console.log(loadedJson)

      let spots = []
      spots = loadedJson.datapoints.map((datapoint, index) => {
        if (-90 <= datapoint.lat && datapoint.lat <= 90 && -180 <= datapoint.lng && datapoint.lng <= 180) {
          return datapoint
        } else {
          throw "Please check latitude and longitude value"
        }
      })

      let paths = []
      paths = loadedJson.paths.map((singlePath, index) => {
        let route = []
        route = singlePath.path.map((position, index) => {
          if (-90 <= position.lat && position.lat <= 90 && -180 <= position.lng && position.lng <= 180) {
            return new google.maps.LatLng(position.lat, position.lng)
          } else {
            throw "Please check latitude and longitude value"
          }
        })
        return {
          isDrone: singlePath.isDrone === true,
          path: route
        }
      })

      this.setState({
        loadFileStatus: {
          status: "SUCCESS",
          groupeddata: {
            datapoints: spots,
            paths: paths
          },
          show: "Successfully loaded the file. Please click confirm to clean up add data to map"
        }
      })
      return {
        status: "SUCCESS",
        groupeddata: {
          datapoints: spots,
          paths: paths
        },
        show: "Successfully loaded the file. Please click confirm to clean up add data to map"
      }
    } catch (err) {
      let txt = "Error While loading the data file.\n\n";
      txt += err + "\n\n";
      txt += "Click OK to continue.\n\n";
      alert(txt);
    }
  }

  //find with file was chosen
  handleFileSelect(evt) {
    let files = evt.target.files;
    if (!files.length) {
      //alert('No file select');
      return;
    }
    let file = files[0];
    let that = this;
    let reader = new FileReader();
    reader.onload = function(e) {
      that.dataLoader(e.target.result);
    };
    reader.readAsText(file);

  }

  // add a data point
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

  //delete a selected data point
  handleDelete() {
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

  //delete all data Datapoints
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
const mapStateToProps = (state) => ({statusPoint: state.statusPoint, size: state.size, mode: state.mode, spots: state.spots, path: state.path})
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
  changeDynamicType: changeDynamicType,
  uploadData: uploadData,
  downloadData: downloadData,
  cleanUploadStatus: cleanUploadStatus,
  cleanDownloadStatus: cleanDownloadStatus
}
export default connect(mapStateToProps, mapDispatchToProps)(FlieControler);
