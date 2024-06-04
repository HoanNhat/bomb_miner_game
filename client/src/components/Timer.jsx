import React, { useEffect, useState } from 'react'

const Timer = ({time}) => {
  const [ timer, setTimer ] = useState(time)

  useEffect(() => {
    const timerId = setInterval(() => {
      if (timer == 0) return
      setTimer((prevState) => prevState - 1)
    }, 1000)

    return () => clearInterval(timerId)
  }, [timer])

  return (
    <header className='p-2 text-2xl font-medium'>
      {timer}
    </header>
  )
}

export default Timer