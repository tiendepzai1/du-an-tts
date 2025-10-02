
import { Header } from './Header'
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
