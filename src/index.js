import React, {useEffect, useState} from 'react'
import ReactDOM from 'react-dom/client'
import * as actions from './store/actions'
import {initiateStore} from './store/store'

const store = initiateStore()

const App = () => {
  const [state, setState] = useState(store.getState())

  useEffect(() => {
    store.subscribe(() => setState(store.getState()))
  }, [])

  const completeTask = taskId => store.dispatch(actions.taskCompleted(taskId))
  const changeTitle = taskId => store.dispatch(actions.titleChanged(taskId))
  const deletedTask = taskId => store.dispatch(actions.taskDeleted(taskId))

  const style = {
    marginRight: 10,
    cursor: 'pointer'
  }

  return (
    <>
      <h1> App</h1>
      <ul>
        {state.map(el => (
          <li key={el.id}>
            <p>{el.title}</p>
            <p> {`Completed: ${el.completed}`}</p>
            <button style={style} onClick={() => completeTask(el.id)}>
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
    <App/>
  )