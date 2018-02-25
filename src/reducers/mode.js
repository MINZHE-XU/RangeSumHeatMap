// change store's mode information
const mode = (state = {
  show: 'point',
  algorithm: 'local',
  dynamic: "point"
}, action) => {
  switch (action.type) {
      //to change show mode (show rectangle or points )in thte store
    case 'CHANGE_SHOW_MODE':
      return (state.show === 'point')
        ? {
          ...state,
          show: 'rectangle'
        }
        : {
          ...state,
          show: 'point'
        }
        //to change algorithm (local or full )in thte store
      case 'CHANGE_ALGORITHM_MODE':
        return (state.algorithm === 'local')
          ? {
            ...state,
            algorithm: 'full'
          }
          : {
            ...state,
            algorithm: 'local'
          }
          //to change which type to add (drone or data point)
        case 'CHANGE_DYNAMIC_TYPE':
          return (state.dynamic === "point")
            ? {
              ...state,
              dynamic: 'drone'
            }
            : {
              ...state,
              dynamic: "point"
            }

          default:
            return state
  }
}

export default mode
