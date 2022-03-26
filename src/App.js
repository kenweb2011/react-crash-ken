import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import About from './components/About';
import Header from "./components/Header";
import Footer from './components/Footer';
import Tasks from "./components/Tasks";
import AddTask from './components/AddTask';

function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    getTasks()
  }, [])

  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()
    return data
  }

  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()
    return data
  }

  const addTask = async (task) => {
    console.log(task)

    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    })
    const data = await res.json()
    setTasks([...tasks, data])

    // const id = Math.floor(Math.random() * 10000) + 1
    // const newTask = { id, ...task }
    // setTasks([...tasks, newTask])
  }

  const deleteTask = async (id) => {
    console.log('delete', id)

    await fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE' })

    setTasks(
      tasks.filter((task) => task.id !== id)
    )
  }

  const toggleReminder = async (id) => {
    console.log('toggle', id)

    const taskToToggle = await fetchTask(id)
    const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder }
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updTask)
    })
    const data = await res.json()

    setTasks(
      tasks.map((task) => task.id === id
        //? { ...task, reminder: !task.reminder }
        ? { ...task, reminder: data.reminder }
        : task
      )
    )
  }

  return (
    <Router>
      <div className='container'>
        <Header
          title='Task Tracker'
          onAdd={() => setShowAddTask(!showAddTask)}
          showAdd={showAddTask}
        />
        <Routes>
          <Route path='/' element={
            <>
              {showAddTask && <AddTask onAdd={addTask}></AddTask>}
              {tasks.length > 0 ? (
                <Tasks
                  tasks={tasks}
                  onDelete={deleteTask}
                  onToggle={toggleReminder}>
                </Tasks>
              ) : (
                'No Tasks to Show'
              )}
            </>
          }
          />
          <Route path='/about' element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
