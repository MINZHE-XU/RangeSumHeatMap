/* global google */
/* eslint-disable no-undef */
import {GoogleMap} from "react-google-maps"

const path = (state = [], action) => {
  switch (action.type) {
      //add one path into the store
    case 'ADD_ONE_PATH':
      console.log(action)
      //console.log(action.path[0].lat())
      return [
        ...state, {
          id: action.id,
          isDrone: action.isDrone,
          path: action.path,
          fullPath: action.path
        }
      ]
      return state
      break
      //all the path move forward one step
    case 'MOVE_ONE_STEP':
      console.log(action)

      let stepLength = action.size.step * Math.sqrt(action.size.length * action.size.length + action.size.height * action.size.height) * action.stepLengthNumber
      let needUpdate = state
      let temp = needUpdate.map(function(apath, index) {
        return {
          id: apath.id,
          isDrone: apath.isDrone,
          path: moveForward(apath.path, stepLength),
          fullPath: apath.fullPath
        }
        //{ moveForward(apath,stepLength) }
      })
      return temp
      break
      //all the path move backward one step
    case 'MOVE_BACK_ONE_STEP':
      console.log(action)

      let stepLength2 = action.size.step * Math.sqrt(action.size.length * action.size.length + action.size.height * action.size.height) * action.stepLengthNumber
      let needUpdate2 = state
      let temp2 = needUpdate2.map(function(apath, index) {
        return {
          id: apath.id,
          isDrone: apath.isDrone,
          path: computeBackPath(moveForward(computeBackPath(apath.path, apath.fullPath), stepLength2), apath.fullPath.map(function(point, index) {
            return apath.fullPath[apath.fullPath.length - 1 - index]
          })),
          //computeBackPath(moveForward(computeBackPath(apath.path,apath.fullPath) , stepLength2) ,apath.fullPath) ,
          fullPath: apath.fullPath
        }
        //{ moveForward(apath,stepLength) }
      })
      return temp2
      break

    case 'DELETE_ONE_PATH':
      console.log(action)
      const currentPathToDelete = state
      const indexToDelete = currentPathToDelete.findIndex(function(path) {
        return path.id === action.id;
      })
      if (indexToDelete < 0) {
        return state
      } else {
        return [
          ...currentPathToDelete.slice(0, indexToDelete),
          ...currentPathToDelete.slice(indexToDelete + 1)
        ]
      }
      break;

    case 'DELETE_ALL_PATH':
      console.log(action)
      return []
      break;

    default:
      return state
  }
}

//move forward onstep for the path
export function moveForward(path, stepLength) {
  if (path.length > 1) {
    let xdis = path[1].lat() - path[0].lat()
    let ydis = path[1].lng() - path[0].lng()

    let distance = Math.sqrt(xdis * xdis + ydis * ydis)
    if (distance >= stepLength) {
      // according to the rate
      let xValue = xdis * stepLength / distance + path[0].lat()
      let yValue = ydis * stepLength / distance + path[0].lng()
      let firstPosition = new google.maps.LatLng(xValue, yValue)
      //console.log(aaa)
      return [
        firstPosition, ...path.slice(1)
      ]
    } else if (distance === stepLength) {
      return [...path.slice(1)]

    } else {
      return moveForward([...path.slice(1)], stepLength - distance)
    }
  } else {
    return path
  }
}

//move backword onstep for the path (using moving forward function reversly)
export function computeBackPath(path, fullPath) {
  //console.log(checkSame(path[0],fullPath[fullPath.length-path.length]))
  //console.log(JSON.stringify(fullPath[fullPath.length-path.length]))
  //console.log(JSON.stringify(path[0]))
  console.log(JSON.stringify(fullPath))
  console.log(JSON.stringify(path))

  if (checkSame(path[0], fullPath[fullPath.length - path.length])) {

    let temp = fullPath.slice(0, fullPath.length - path.length + 1)
    //.map(function(point, index){ return fullPath })
    console.log(JSON.stringify(temp.map(function(point, index) {
      return temp[temp.length - 1 - index]
    })))
    return temp.map(function(point, index) {
      return temp[temp.length - 1 - index]
    })
  } else {
    let temp = fullPath.slice(0, fullPath.length - path.length + 1).concat([path[0]])
    console.log(JSON.stringify(temp.map(function(point, index) {
      return temp[temp.length - 1 - index]
    })))
    return temp.map(function(point, index) {
      return temp[temp.length - 1 - index]
    })
  }
  //fullPath.slice(0, fullPath.length-path.length+1)

}

export function checkSame(pointA, pointB) {
  if (pointA.lat() === pointB.lat() && pointA.lng() === pointB.lng()) {
    return true
  } else {
    return false
  }
}

export default path
