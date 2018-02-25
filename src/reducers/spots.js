//modify data points
const spots = (state = [], action) => {
  switch (action.type) {
      //add one data point into the store
    case 'ADD_SPOT':
      console.log(action)
      return [
        ...state, {
          id: action.id,
          lat: action.lat,
          lng: action.lng,
          isDynamic: action.isDynamic,
          surveillanced: false
        }
      ]
      break;
    case 'DELETE_SPOT':
      //delete one data point in the store
      console.log(action)
      const currentSpotToDelete = state
      const indexToDelete = currentSpotToDelete.findIndex(function(spot) {
        return spot.id === action.id;
      })
      if (indexToDelete < 0) {
        return state
      } else {
        return [
          ...currentSpotToDelete.slice(0, indexToDelete),
          ...currentSpotToDelete.slice(indexToDelete + 1)
        ]
      }
      break;
      //add all data point in the store
    case 'DELETE_ALL_SPOT':
      console.log(action)
      return []
      break;
    default:
      return state
  }
}

export default spots
