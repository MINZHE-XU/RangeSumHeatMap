import axios from 'axios';
let nextTodoId = 0

//actions can be dispatched to reducer
export function addSpot(payload) {
  let currentID = -1
  if (payload.id > -1) {
    currentID = payload.id
  } else {
    currentID = nextTodoId++
  }
  return {type: 'ADD_SPOT', id: currentID, lat: payload.lat, lng: payload.lng, isDynamic: payload.isDynamic}
}
export function deleteSpot(payload) {
  return {type: 'DELETE_SPOT', id: payload.id}
}
export function deleteDrone(payload) {
  return {type: 'DELETE_DRONE', id: payload.id}
}

export function deleteAllSpot(payload) {
  return {type: 'DELETE_ALL_SPOT'}
}
export function deleteAllDrone(payload) {
  return {type: 'DELETE_ALL_DRONE'}
}

export function changeInfoWindowOpen(payload) {
  return {type: 'CHANGE_INFO_WINDOW_OPEN', number: payload}
}
export function undateCandidateSpot(payload) {
  return {type: 'UPDATE_CANDIDATE_SPOT', spots: payload}
}

export function deleteCandidateSpot(payload) {
  return {type: 'DELETE_CANDIDATE_SPOT', lat: payload.lat, lng: payload.lng}
}

export function centerListSpot(payload) {

  return {type: 'CENTER_SPOT', id: payload.id, lat: payload.lat, lng: payload.lng, kind: payload.kind}
}

export function clickListSpot(payload) {
  return {type: 'CLICKED_SPOT', id: payload.id, lat: payload.lat, lng: payload.lng, kind: payload.kind}
}

export function changeSize(payload) {
  return {type: 'CHANGE_SIZE', length: payload.length, height: payload.height}
}

export function changeShowMode() {
  return {type: 'CHANGE_SHOW_MODE'}
}
export function changeAlgorithmMode() {
  return {type: 'CHANGE_ALGORITHM_MODE'}
}
export function changeDynamicType() {
  return {type: 'CHANGE_DYNAMIC_TYPE'}
}

export function updateMRs(payload) {
  return {type: 'FULLY_UPDATE_MRS', size: payload.size}
}

export function addSpotForMRs(payload) {
  return {type: 'ADD_ONE_SPOT_MRS', spots: payload.spots, size: payload.size}
}

export function deleteSpotForMRs(payload) {
  return {type: 'DELETE_ONE_SPOT_MRS', spots: payload.spots, size: payload.size}
}
export function resetMRs(payload) {
  return {type: 'RESET_MRS'}
}

export function addOnePath(payload) {
  let currentID = nextTodoId++
  return {type: 'ADD_ONE_PATH', id: currentID, path: payload.path, isDrone: payload.isDrone}
}

export function moveOneStep(payload) {
  return {type: 'MOVE_ONE_STEP', size: payload.size, stepLengthNumber: payload.stepLengthNumber}
}

export function moveBackOneStep(payload) {
  return {type: 'MOVE_BACK_ONE_STEP', size: payload.size, stepLengthNumber: payload.stepLengthNumber}
}

export function deletePath(payload) {
  //centerListSpot ({id:-1 , lat:10000, lng:10000})
  //clickListSpot ({id:-1 , lat:10000, lng:10000})
  return {type: 'DELETE_ONE_PATH', id: payload.id}
}
export function deleteAllPath(payload) {
  return {type: 'DELETE_ALL_PATH'}
}

//asynchronous action to upload file
export function uploadData(data) {
  return function(dispatch) {
    dispatch({type: "UPLOAD_DATA", status: "UPLOADING"})
    axios.post("http://45.76.115.192:8080/api/datagroups", {groupeddata: data}).then(function(response) {
      console.log(response.data)
      dispatch({type: "UPLOAD_DATA", status: response.data.status, payload: response.data.message})
    }).catch(function(err) {
      console.log(err)
      dispatch({type: "UPLOAD_DATA", status: "FAIL", payload: 'Error heppens while uploading. Please check network and try again.'})
    })
  }
}

//asynchronous action to download file
export function downloadData(data) {
  return function(dispatch) {
    dispatch({type: "DOWNLOAD_DATA", status: "DOWNLOADING"})
    console.log(data)
    axios.get("http://45.76.115.192:8080/api/datagroups/" + data).then(function(response) {
      console.log(response.data)
      dispatch({type: "DOWNLOAD_DATA", status: response.data.status, payload: response.data.message})
    }).catch(function(err) {
      console.log(err)
      dispatch({type: "DOWNLOAD_DATA", status: "FAIL", payload: 'Error heppens while uploading. Please check network and try again.'})
    })
  }
}
export function cleanUploadStatus(data) {
  return ({type: "UPLOAD_DATA", status: "CLEAN"})
}
export function cleanDownloadStatus(data) {
  return ({type: "DOWNLOAD_DATA", status: "CLEAN"})
}
