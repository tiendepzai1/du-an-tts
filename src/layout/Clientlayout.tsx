import React from 'react'
import {Header} from './header'
import { Outlet } from 'react-router-dom'

const Clientlayout = () => {
  return (
   <>
   <Header/>
   <Outlet/>
   </>
  )
}

export default Clientlayout
