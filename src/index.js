import React, {useEffect} from 'react'
import ReactDOM from 'react-dom/client'
import configureStore from './store/store'
import {Provider, useDispatch, useSelector} from 'react-redux'
import {getError} from './store/errors'
import {
  getTasks,
  getTasksLoadingStatus,
  loadTasks,
  taskAdd,
  completeTask,
  taskDeleted, titleChange
} from './store/task'

const store = configureStore()

const App = () => {
  const state = useSelector(getTasks())
  const isLoading = useSelector(getTasksLoadingStatus())
  const error = useSelector(getError())
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadTasks())
  }, [])


  const createTask = () => {
    dispatch(taskAdd({
      userId: 1,
      title: 'New Task',
      completed: false
    }))
  }

  const changeTitle = taskId => dispatch(titleChange(taskId))
  const deletedTask = taskId => dispatch(taskDeleted(taskId))

  const style = {
    marginRight: 10,
    cursor: 'pointer'
  }

  if (isLoading) return <h1>Loading...</h1>
  if (error) return <p>{error}</p>

  return (
    <>
      <button onClick={createTask}>Create Task</button>
      <h1> App</h1>
      <ul>
        {state.map(el => (
          <li key={el.id}>
            <p>{el.title}</p>
            <p> {`Completed: ${el.completed}`}</p>
            <button style={style} onClick={() => dispatch(completeTask(el.id))}>
              Complete
            </button>
            <button style={style} onClick={() => changeTitle(el.id)}>
              Change title
            </button>
            <button style={style} onClick={() => deletedTask(el.id)}>
              Delete task
            </button>
            <hr/>
          </li>
        ))}
      </ul>
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root'))
  .render(
    <Provider store={store}>
      <App/>
    </Provider>
  )