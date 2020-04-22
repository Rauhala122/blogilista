import React, {useState} from 'react'
import blogService from '../services/blogs'
import { useSelector, useDispatch } from 'react-redux'
import {initializeBlogs, addNewBlog, addBlogLike, removeBlogFromBlogs} from '../reducers/blogsReducer'
import {
  BrowserRouter as Router,
  Switch, Route, Link, useParams, Redirect, useHistory
} from "react-router-dom"
import blogsService from '../services/blogs'

const Blog = ({ blogs, user, removeBlog, like }) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const id = useParams().id
  const blog = blogs.find(blog => blog.id === id)

  const [comment, setComment] = useState(null)

  if (!blog) {
    return null
  }
  const likes = blog.likes

  let username

  if (blog.user) {
    username = blog.user.username
  }

  const removeBlogButton = () => {
    if (blog.user) {
      if (blog.user.username === user.username) {
        return (
          <div>
            <button className="removeButton" onClick={remove}>Remove</button>
          </div>
        )
      }
    }
  }

 const addLike = () => {
   const newBlog = {likes: blog.likes += 1}
   console.log(newBlog)
   dispatch(addBlogLike(newBlog))
   console.log(blog.id)
   like(blog.id, newBlog)
 }

 const remove = () => {
   const confirmDelete = window.confirm(`Remove blog ${blog.title}`)
   if (confirmDelete) {
     blogService.deleteBlog(blog.id).then(returnedBlog => {
       dispatch(removeBlogFromBlogs(blog))
     })
     history.push("/")
   }
 }

 const commentOnChange = (e) => {
   setComment(e.target.value)
 }

 const addComment = (e) => {
   e.preventDefault()
   console.log(comment)
   blogsService.addComment(blog.id, {content: comment})
   setComment("")
 }

 const commentForm = () => {
   return (
     <form onSubmit={addComment}>
      <input value={comment} onChange={commentOnChange}/>
      <button>add comment</button>
     </form>
   )
 }

  return (
    <div className="blog">
      <h2>{blog.title} by {blog.author}</h2>

      <a href={blog.url}>{blog.url}</a>
      <br/>
      likes: <span className="likes">{likes}</span> <button className="likeButton" onClick={addLike}>like</button>
      <br/>
      <p> added by {username} </p>
      {removeBlogButton()}

      <h3>Comments</h3>
      {commentForm()}
      <ul>
        {blog.comments.map(comment =>
          <li>{comment.content}</li>
        )}
      </ul>
    </div>
  )
}

export default Blog
