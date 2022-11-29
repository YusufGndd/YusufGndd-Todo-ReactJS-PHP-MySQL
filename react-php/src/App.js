import { useEffect, useState } from 'react'
import './App.css';

function App() {

  const [todos, setTodos] = useState()
  const [todo, setTodo] = useState('')

  useEffect(() => {
    const formData = new FormData()
    formData.append('action', 'todos')
    fetch(`${process.env.REACT_APP_ENDPOINT}`, {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => setTodos(data))
  }, [])


  const addTodo = () => {
    if (!todo) {
      alert('Todo boş olamaz!')
      return
    }
    const formData = new FormData()
    formData.append('todo', todo)
    formData.append('action', "add-todo")
    fetch(`${process.env.REACT_APP_ENDPOINT}`, {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error)
        } else {
          setTodos([data, ...todos])
          setTodo('')
        }

      })
  }

  const deleteTodo = id => {
    const formData = new FormData()
    formData.append('id', id)
    formData.append('action', 'delete-todo')
    fetch(`${process.env.REACT_APP_ENDPOINT}`, {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error)
        } else {
          setTodos(todos.filter(todo => todo.id !== id))
        }
      })
  }


  const doneTodo = (id,done) => {
    const formData = new FormData()
    formData.append('id', id)
    formData.append('done', done === "1" ? "0" : "1")
    formData.append('action', 'done-todo')
    fetch(`${process.env.REACT_APP_ENDPOINT}`, {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        const newTodos = todos.map(todo => {
          if (todo.id === id) {
            todo.done = todo.done === "1" ? "0" : "1";
          }
          return todo
        })
        setTodos(newTodos)
      })
  }
  return (
    <>
      <h2>Todo Uygulaması</h2>
      <div className='input-button'>
        <input type="text" value={todo} onChange={(e) => setTodo(e.target.value)} required minLength={2} placeholder="Todo yazın" />
        <button onClick={addTodo}>EKLE</button>
      </div>

      {todos && (
        <ul className='todos'>
          {todos.map(todo => (
            <li className={todo.done === "1" ? 'done' : ''} key={todo.id}>
              <p>{todo.todo}</p>

              <button onClick={(e) => doneTodo(todo.id ,todo.done)}>
                {todo.done === "1" ? <>Kaldır</> : <>Tamamla</>}
              </button>

              <button className='delete' onClick={(e) => deleteTodo(todo.id)}>Sil</button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default App;
