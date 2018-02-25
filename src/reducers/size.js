//change range size
const size = (state = {
  length: 0.04,
  height: 0.02,
  step: 0.01
}, action) => {
  switch (action.type) {
      //change range size
    case 'CHANGE_SIZE':
      console.log(action)
      return {length: action.length, height: action.height, step: state.step}

      //change the step length for simulation according to the size
    case 'CHANGE_STEP':
      console.log(action)
      return {length: state.length, height: state.height, step: action.step}

    default:
      return state
  }
}

export default size
