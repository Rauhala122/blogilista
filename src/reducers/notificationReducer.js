const notificationReducer = (state = {content: null, messageClass: null}, action) => {
  switch (action.type) {
    case "SET_NOTIFICATION":
      console.log(action.notification)
      return {content: action.notification, messageClass: action.messageClass}
    default:
      return {state}
  }
}

export const notificationChange = (notification, messageClass) => {
  return {
    type: "SET_NOTIFICATION",
    notification,
    messageClass
  }
}


export default notificationReducer
