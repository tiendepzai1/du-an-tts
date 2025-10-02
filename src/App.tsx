
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import {Login} from './page/Login'
import { Register } from './page/Register'
import Clientlayout from './layout/Clientlayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Clientlayout/>} />  
        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Register/>} />
       
      </Routes>
    </BrowserRouter>
  )
}

export default App
