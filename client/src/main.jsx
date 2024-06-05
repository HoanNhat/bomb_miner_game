import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './assets/index.css'
import Game from './pages/Game.jsx'
import JoinRoom from './pages/JoinRoom.jsx'
import { RoomProvider } from './context/RoomContext.jsx'

const router = createBrowserRouter([
  {
    path: "",
    // element: <JoinRoom />,
    // errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <JoinRoom />
      },
      {
        path: "battle",
        element: <Game />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RoomProvider>
      <RouterProvider router={router} />
    </RoomProvider>
  </React.StrictMode>,
)
