import React, {Component, PropTypes} from 'react'
import {ListGroupItem, Badge} from 'react-bootstrap'

export default class SpotBullet extends React.Component {
  render() {
    return (<ListGroupItem bsStyle={(
        (this.props.spot.id === this.props.statusPoint.center.id) || (this.props.spot.id === this.props.statusPoint.clicked.id))
        ? "warning"
        : undefined} onMouseOver={this.props.onMouseOver} onMouseOut={this.props.onMouseOut} onClick={this.props.onClick} style={{
        //textDecoration: (this.props.spot.id===this.props.statusPoint.center.id) ? 'underline' : 'none',
        color: (this.props.spot.isDynamic === true)
          ? 'red'
          : 'black',
        fontSize: 12
      }}>
      <Badge pullRight={false} onClick={this.props.buttomOnClick}>X</Badge>
      {this.props.spot.lat},{this.props.spot.lng}
    </ListGroupItem>)
  }
}
