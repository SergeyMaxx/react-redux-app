import {createAction, createSlice} from '@reduxjs/toolkit'
import todosService from '../services/todos.service'
import {setError} from './errors'

const initialState = {
  entities: [],
  isLoading: true
}

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    received(state, action) {
      state.entities = action.payload
      state.isLoading = false
    },
    update(state, action) {
      const elementIndex = state.entities.findIndex(el => el.id === action.payload.id)
      state.entities[elementIndex] = {
        ...state.entities[elementIndex],
        ...action.payload
      }
    },
    remove(state, action) {
      state.entities = state.entities.filter(el => {
        return el.id !== action.payload.id
      })
    },
    loadTasksRequested(state) {
      state.isLoading = true
    },
    taskRequestFailed(state) {
      state.isLoading = false
    },
    taskAdded(state, action) {
      state.entities.push(action.payload)
    }
  }
})

const {actions, reducer: taskReducer} = taskSlice
const {
  update,
  remove,
  received,
  taskRequestFailed,
  taskAdded,
  loadTasksRequested
} = actions

const taskRequested=createAction('task/taskRequested')

export const loadTasks = () => {
  return async dispatch => {
    dispatch(loadTasksRequested())
    try {
      const data = await todosService.fetch()
      dispatch(received(data))
    } catch (error) {
      dispatch(taskRequestFailed())
      dispatch(setError(error.message))
    }
  }
}

export const createTask = task => {
  return async dispatch => {
    dispatch(taskRequested())
    try {
      const data = await todosService.create(task)
      dispatch(taskAdded(data))
    } catch (error) {
      dispatch(taskRequestFailed())
      dispatch(setError(error.message))
    }
  }
}

export const completeTask = id => {
  return (dispatch) => {
    dispatch(update({id, completed: true}))
  }
}

export const titleChanged = id => update({id, title: `New title for ${id}`})
export const taskDeleted = id => remove({id})
export const getTasks = () => state => state.tasks.entities
export const getTasksLoadingStatus = () => state => state.tasks.isLoading

export default taskReducer