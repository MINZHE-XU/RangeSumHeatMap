const origin = {
  center: {
    id: -1,
    lat: 10000,
    lng: 10000,
    kind: "unknown"
  },
  clicked: {
    id: -1,
    lat: 10000,
    lng: 10000,
    kind: "unknown"
  },
  candidateSpots: [],
  uploadStatus: {
    status: "NONE",
    data_id: "",
    show: ""
  },
  downloadStatus: {
    status: "NONE",
    groupeddata: "",
    show: ""
  }
}
//modify status ppoint. if they are empty, use origin parameter
const statusPoint = (state = origin, action) => {
  switch (action.type) {
      // which data point the mouse is over
    case 'CENTER_SPOT':
      return {
        ...state,
        center: {
          id: action.id,
          lat: action.lat,
          lng: action.lng,
          kind: action.kind
        }
      }
      break;
      //which data point the mouse clicked
    case 'CLICKED_SPOT':
      if (state.clicked.id === action.id && state.clicked.lat === action.lat && state.clicked.lng === action.lng) {
        return {
          ...state,
          clicked: origin.clicked
        }
      } else {
        return {
          ...state,
          clicked: {
            id: action.id,
            lat: action.lat,
            lng: action.lng,
            kind: action.kind
          }
        }
      }
      break;
      //when use search function, show the candidate points
    case 'UPDATE_CANDIDATE_SPOT':
      console.log(action)
      if (action.spots.length > 0) {
        return {
          ...state,
          center: {
            id: -1,
            lat: action.spots[0].lat,
            lng: action.spots[0].lng,
            kind: "unknown"
          },
          clicked: {
            id: -1,
            lat: action.spots[0].lat,
            lng: action.spots[0].lng,
            kind: "unknown"
          },
          candidateSpots: action.spots
        }

      } else {
        return {
          ...state,
          center: origin.center,
          clicked: origin.clicked,
          candidateSpots: []
        }
      }
      break;
      //delete all the candidate points
    case 'DELETE_CANDIDATE_SPOT':
      console.log(action)
      const currentSpotToDelete = state.candidateSpots
      const indexToDelete = currentSpotToDelete.findIndex(function(spot) {
        return spot.lat === action.lat && spot.lng === action.lng;
      })
      if (indexToDelete < 0) {
        return state
      } else {
        return {
          ...state,
          candidateSpots: [
            ...currentSpotToDelete.slice(0, indexToDelete),
            ...currentSpotToDelete.slice(indexToDelete + 1)
          ]
        }
      }
      break;

    case 'CHANGE_INFO_WINDOW_OPEN':
      console.log(action)
      const changedSpots = state.candidateSpots.map(function(spot, index) {
        return {
          ...spot,
          isOpen: false
        }
      })
      const currentSpotToUpdate = state.candidateSpots
      const indexToUpdate = currentSpotToUpdate.findIndex(function(spot) {
        return spot.number === action.number;
      })

      if (indexToUpdate < 0) {
        return state
      } else {
        const newSpotToUpdate = {
          ...currentSpotToUpdate[indexToUpdate],
          isOpen: !currentSpotToUpdate[indexToUpdate].isOpen
        }
        return {
          ...state,
          candidateSpots: [
            ...changedSpots.slice(0, indexToUpdate),
            newSpotToUpdate,
            ...changedSpots.slice(indexToUpdate + 1)
          ]
        }
      }
      break;
      //when uploading data to the server, following status can be triggered
    case 'UPLOAD_DATA':
      console.log(action)
      switch (action.status) {
        case 'UPLOADING':
          return {
            ...state,
            uploadStatus: {
              status: "UPLOADING",
              data_id: "",
              show: "uploading your data"
            }
          }
          break;
        case 'SUCCESS':
          return {
            ...state,
            uploadStatus: {
              status: "SUCCESS",
              data_id: action.payload._id,
              show: "Successfully uploaded, you can use the following token to fetch data from server :"
            }
          }
          break;
        case 'FAIL':
          return {
            ...state,
            uploadStatus: {
              status: "FAIL",
              data_id: "",
              show: action.payload
            }
          }
          break;
        case 'CLEAN':
          return {
            ...state,
            uploadStatus: {
              status: "NONE",
              data_id: "",
              show: ""
            }
          }
          break;
      }

      //when downloading data to the server, following status can be triggered
    case 'DOWNLOAD_DATA':
      console.log(action)
      switch (action.status) {
        case 'DOWNLOADING':
          return {
            ...state,
            downloadStatus: {
              status: "DOWNLOADING",
              groupeddata: "",
              show: "downloading your data"
            }
          }
          break;
        case 'SUCCESS':
          return {
            ...state,
            downloadStatus: {
              status: "SUCCESS",
              groupeddata: action.payload.groupeddata,
              show: "Successfully downloaded the file. Please click confirm to clean up and add data to map"
            }
          }
          break;
        case 'FAIL':
          return {
            ...state,
            downloadStatus: {
              status: "FAIL",
              show: action.payload
            }
          }
          break;
        case 'CLEAN':
          return {
            ...state,
            downloadStatus: {
              status: "NONE",
              groupeddata: "",
              show: ""
            }
          }
          break;
      }

    default:
      return state
  }
}

export default statusPoint
