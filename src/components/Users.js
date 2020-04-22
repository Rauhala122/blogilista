import React, {useState, useEffect} from 'react'
import {
  BrowserRouter as Router,
  Switch, Route, Link, useParams, Redirect, useHistory
} from "react-router-dom"

const Users = (props) => {
  console.log(useParams().id)
  return (
    <div>
      <h1>Users</h1>
      <table>
        <tr>
          <th>

          </th>
          <th>
            Blogs created
          </th>
        </tr>
        {props.users.map(user =>
          <tr>
            <td>
              <Link to={`/users/${user.id}`}>{user.name}</Link>
            </td>
            <td>
              {user.blogs.length}
            </td>
          </tr>
        )}
      </table>
    </div>
  )
}

export default Users
