import {combineReducers} from 'redux'
import spots from './spots'
import statusPoint from './statusPoint'
import mode from './mode'
import size from './size'
import mrs from './mrs'
import mrsFull from './mrsFull'
import path from './path'
import drones from './drones'

const combinedReducer = combineReducers({
  spots,
  statusPoint,
  size,
  mode,
  mrs,
  path,
  drones
})

function crossSliceReducer(state, action) {
  let crossStorage = {
    //special case needs  spots information
    mrs: state.mrs,
    spots: state.spots,
    statusPoint: state.statusPoint,
    size: state.size,
    mode: state.mode,
    path: state.path,
    drones: state.drones
  }

  //cases needs to update spots and drones
  if (action.type === 'ADD_ONE_PATH' || action.type === "MOVE_ONE_STEP" || action.type === "MOVE_BACK_ONE_STEP") {

    const currentSpotToSearch = state.spots
    crossStorage.drones = []
    state.path.map(function(apath, index) {

      if (apath.isDrone === false) {
        let indexToDelete = currentSpotToSearch.findIndex(function(spot) {
          return spot.id === apath.id;
        })

        if (indexToDelete >= 0) {
          //find thing to update
          //console.log("currentSpotToSearch[indexToDelete]")
          //console.log(currentSpotToSearch[indexToDelete])
          //console.log("nextProps.path[index]")
          //console.log(nextProps.path[index])

          //if in the last point, we donnot need to update.
          if (currentSpotToSearch[indexToDelete].lat !== state.path[index].path[0].lat() && currentSpotToSearch[indexToDelete].lng !== state.path[index].path[0].lng()) {
            crossStorage.spots = spots(crossStorage.spots, {
              type: 'DELETE_SPOT',
              id: currentSpotToSearch[indexToDelete].id
            })
            if (state.mode.algorithm === 'local') {
              crossStorage.mrs = mrs(crossStorage.mrs, {
                type: 'DELETE_ONE_SPOT_MRS',
                spots: currentSpotToSearch[indexToDelete],
                size: state.size
              })
            }
            crossStorage.spots = spots(crossStorage.spots, {
              type: 'ADD_SPOT',
              id: apath.id,
              lat: apath.path[0].lat(),
              lng: apath.path[0].lng(),
              isDynamic: true
            })

            if (state.mode.algorithm === 'local') {
              crossStorage.mrs = mrs(crossStorage.mrs, {
                type: 'ADD_ONE_SPOT_MRS',
                spots: {
                  id: apath.id,
                  lat: apath.path[0].lat(),
                  lng: apath.path[0].lng(),
                  isDynamic: true
                },
                size: state.size
              })
            }
          } else {
            //console.log("the same!!!!!!!!!!!!!!")
          }
        } else {
          crossStorage.spots = spots(crossStorage.spots, {
            type: 'ADD_SPOT',
            id: apath.id,
            lat: apath.path[0].lat(),
            lng: apath.path[0].lng(),
            isDynamic: true
          })
          crossStorage.statusPoint = statusPoint(crossStorage.statusPoint, {
            type: 'CENTER_SPOT',
            id: apath.id,
            lat: apath.path[0].lat(),
            lng: apath.path[0].lng()
          })
          //crossStorage.statusPoint=statusPoint(crossStorage.statusPoint, { type:'CLICKED_SPOT' , id:apath.id, lat:apath.path[0].lat() ,lng:apath.path[0].lng()})
          if (state.mode.algorithm === 'local') {
            crossStorage.mrs = mrs(crossStorage.mrs, {
              type: 'ADD_ONE_SPOT_MRS',
              spots: {
                id: apath.id,
                lat: apath.path[0].lat(),
                lng: apath.path[0].lng(),
                isDynamic: true
              },
              size: state.size
            })
          }
        }
      } else {
        //updating drones
        crossStorage.drones = drones(crossStorage.drones, {
          type: 'ADD_DRONE',
          id: apath.id,
          lat: apath.path[0].lat(),
          lng: apath.path[0].lng(),
          isDynamic: true
        })
      }

      //console.log(apath)
    })

    //console.log(crossStorage.mrs)
    if (state.mode.algorithm === 'full') {
      crossStorage.mrs = mrsFull(state.mrs, {
        type: "FULLY_UPDATE_MRS",
        size: crossStorage.size
      }, crossStorage.spots)
    }

  }

  // cases need to update surveillanced relationships
  if (action.type === 'ADD_SPOT' || 'ADD_ONE_PATH' || "MOVE_ONE_STEP" || "DELETE_DRONE" || "MOVE_BACK_ONE_STEP") {

    // to compute the new
    crossStorage.spots = crossStorage.spots.map(function(spot) {
      return {
        ...spot,
        surveillanced: false
      }
    })
    let tempSpots = crossStorage.spots
    crossStorage.drones.map(function(drone, index) {
      crossStorage.spots = tempSpots
      tempSpots = []
      tempSpots = crossStorage.spots.map(function(spot, index) {
        let isHeightIn = -crossStorage.size.height / 2 <= (spot.lat - drone.lat) && (spot.lat - drone.lat) <= crossStorage.size.height / 2
        let minL = Math.min(Math.abs(spot.lng - drone.lng), Math.abs(spot.lng - drone.lng + 360), Math.abs(spot.lng - drone.lng - 360))
        let isLengthIn = -crossStorage.size.length / 2 <= minL && minL <= crossStorage.size.length / 2

        //console.log(isHeightIn&&isLengthIn)
        return {
          ...spot,
          surveillanced: (spot.surveillanced || (isHeightIn && isLengthIn))
        }
      })
    })
    crossStorage.spots = tempSpots
  }

  if (action.type === "FULLY_UPDATE_MRS") {
    crossStorage.mrs = mrsFull(state.mrs, {
      type: "FULLY_UPDATE_MRS",
      size: crossStorage.size
    }, crossStorage.spots)
  }
  return crossStorage;

}

export default function rootReducer(state, action) {
  const intermediateState = combinedReducer(state, action);
  const finalState = crossSliceReducer(intermediateState, action);
  return finalState;
}
