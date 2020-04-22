import React, {useState, useEffect} from 'react'
import {
  BrowserRouter as Router,
  Switch, Route, Link, useParams, Redirect, useHistory
} from "react-router-dom"

const User = (props) => {
  const id = useParams().id
  console.log(props.users)
  const user = props.users.find(u => u.id === id)
  return (
    <div>
      {!user ? <h1> No user </h1> :

        <div>
          <h2>{user.name}</h2>


          <h3>Added blogs</h3>

          <ul>
            {user.blogs.map(blog =>
              <li>{blog.title}</li>
            )}
          </ul>
        </div>
      }
    </div>
  )
}

export default User
