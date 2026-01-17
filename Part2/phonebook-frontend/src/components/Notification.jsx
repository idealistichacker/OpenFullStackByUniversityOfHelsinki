const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="prompt">
      {message}
    </div>
  )
}

export default Notification