
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import {Login} from './page/Login'
import { Register } from './page/Register'
import Clientlayout from './layout/Clientlayout'
import PrivateRoute from './privateRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
    
        <Route path="/" element={ <PrivateRoute>  <Clientlayout/>  </PrivateRoute> }  />  
        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Register/>} />
       
      </Routes>
    </BrowserRouter>
  )
}

export default App
