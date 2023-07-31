import {createSlice} from '@reduxjs/toolkit'

const errorSlice = createSlice({
  name: 'error',
  initialState: {
    entities: []
  },
  reducers: {
    set(state, action) {
      state.entities.push(action.payload)
    }
  }
})

const {reducer: errorReducer} = errorSlice
const {set} = errorSlice.actions

export const setError = message => {
  return dispatch => dispatch(set(message))
}

export const getError = () => state => state.errors.entities[0]

export default errorReducer