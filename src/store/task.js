import {createSlice} from '@reduxjs/toolkit'
import todosService from '../services/todos.service'
import {setError} from './errors'

const taskSlice = createSlice({
  name: 'task',
  initialState: {
    entities: [],
    isLoading: true
  },
  reducers: {
    received(state, action) {
      state.entities = action.payload
      state.isLoading = false
    },
    update(state, action) {
      const index = state.entities.findIndex(el => el.id === action.payload.id)
      state.entities[index] = {
        ...state.entities[index],
        ...action.payload
      }
    },
    remove(state, action) {
      state.entities = state.entities.filter(el => el.id !== action.payload.id)
    },
    add(state, action) {
      state.entities.push(action.payload)
    },
    taskRequested(state) {
      state.isLoading = true
    },
    taskRequestFailed(state) {
      state.isLoading = false
    }
  }
})

const {reducer: taskReducer} = taskSlice
const {
  update,
  remove,
  received,
  taskRequested,
  taskRequestFailed,
  add
} = taskSlice.actions

export const loadTasks = () => {
  return async dispatch => {
    dispatch(taskRequested())
    try {
      const data = await todosService.fetch()
      dispatch(received(data))

    } catch (error) {
      dispatch(taskRequestFailed())
      dispatch(setError(error.message))
    }
  }
}

export const taskAdd = task => {
  return async dispatch => {
    try {
      const data = await todosService.create(task)
      dispatch(add(data))

    } catch (error) {
      dispatch(taskRequestFailed())
      dispatch(setError(error.message))
    }
  }
}

export const completeTask = id => {
  return dispatch => dispatch(update({id, completed: true}))
}

export const taskCreate = task => add(task)
export const titleChange = id => update({id, title: `New title for ${id}`})
export const taskDeleted = id => remove({id})
export const getTasks = () => state => state.tasks.entities
export const getTasksLoadingStatus = () => state => state.tasks.isLoading

export default taskReducer