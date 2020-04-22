import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import usersService from './services/users'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Users from './components/Users'
import User from './components/User'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import { useSelector, useDispatch } from 'react-redux'
import {notificationChange} from './reducers/notificationReducer'
import {initializeBlogs, addNewBlog, removeBlogFromBlogs} from './reducers/blogsReducer'
import {setUser} from './reducers/userReducer'
import {
  BrowserRouter as Router,
  Switch, Route, Link, useParams, Redirect, useHistory
} from "react-router-dom"
import { Table } from 'react-bootstrap'


const App = () => {

  const dispatch = useDispatch()

  const blogs = useSelector(state => state.blogs)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const user = useSelector(state => state.user)
  const message = useSelector(state => state.notification.content)
  const messageClass = useSelector(state => state.notification.messageClass)
  const [loginVisible, setLoginVisible] = useState(false)

  const blogFormRef = React.createRef()
  const [users, setUsers] = useState([])

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const linkStyle = {
    marginRight: 10
  }

  const navStyle = {
    background: "lightgray",
    padding: 7,
    margin: 0
  }

  useEffect(() => {
    usersService.getAll().then(users => {
      setUsers(users)
    })
  }, [dispatch])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      dispatch(initializeBlogs(blogs))
    )
  }, [dispatch])

  blogs.sort((a, b) => -(a.likes - b.likes))

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [])
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
       'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      dispatch(setUser(user))
      setUsername('')
      setPassword('')

    } catch (exeption) {
      dispatch(notificationChange("wrong username or password", "error"))
      setTimeout(() => {
        dispatch(notificationChange(null, null))
      }, 5000)
    }

  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedNoteappUser')
    dispatch(setUser(null))
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleLogin={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService.create(blogObject).then(returnedBlog => {
      dispatch(addNewBlog(returnedBlog))
      dispatch(notificationChange("Blog created successfully", "success"))
      setTimeout(() => {
        dispatch(notificationChange(null, null))
      }, 5000)
    })
  }

  const likeBlog = (id, blogObject) => {
    blogService.replace(id, blogObject)
  }

  const logOutButton = () => (
    <button onClick={handleLogout}>Logout</button>
  )

  return (
    <Router>
      <div class="container">
        <div style={navStyle}>
          <Link style={linkStyle} to="/">Blogs</Link>

          <Link style={linkStyle} to="/users">Users</Link>

          {user.username} logged in {logOutButton()}
        </div>
        <h1>Blogs App</h1>
        <Notification message={message} messageClass={messageClass}/>
        {user === null ?
        loginForm() :
        <div>

          <Switch>

            <Route path="/users/:id">
              <User users={users}/>
            </Route>

            <Route path="/users">
              <Users users={users}/>
            </Route>
            <Route path="/:id">
              <Blog blogs={blogs} user={user} like={likeBlog}/>
            </Route>

            <Route path="/">
              <Togglable buttonLabel="new blog" ref={blogFormRef}>
                <BlogForm createBlog={addBlog} user={user}/>
              </Togglable>

              <Table striped>
              <tbody>
                {blogs.map(blog =>
                  <tr>
                    <td>
                      <Link to={`/${blog.id}`}>{blog.title}</Link>
                    </td>
                    <td>
                      {blog.user.name}
                    </td>
                  </tr>
                )}
              </tbody>
              </Table>
            </Route>

          </Switch>

        </div>
        }
      </div>
    </Router>
  )
}

export default App
