const blogsReducer = (state = [], action) => {
  switch (action.type) {
    case "INIT_BLOGS":
      return action.data
    case "ADD_BLOG":
      return [...state, action.blog]
    case "ADD_LIKE":
      const id = action.data.id
      return state.map(blog => blog.id !== id ? blog : action.data)
    case "REMOVE_BLOG":
      const removedId = action.data.id
      return state.filter(blog => blog.id !== removedId)
    default:
      return state
  }
}

export const addNewBlog = (blog) => {
  return {
    type: "ADD_BLOG",
    blog
  }
}

export const initializeBlogs = (blogs) => {
  return {
    type: "INIT_BLOGS",
    data: blogs
  }
}

export const addBlogLike = (blog) => {
  return {
    type: "ADD_LIKE",
    data: blog
  }
}

export const removeBlogFromBlogs = (blog) => {
  return {
    type: "REMOVE_BLOG",
    data: blog
  }
}

export default blogsReducer
