
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import {Login} from './page/Login'
import { Register } from './page/Register'
import Clientlayout from './layout/Clientlayout'
import PrivateRoute from './privateRoute'
import BoardAdd from './page/board/broadAdd'
import BoardList from './page/board/broadList'
import BoardUpdate from './page/board/broadUpdate'
import CardAdd from './page/card/cartAdd'
import CardList from './page/card/cartList'
import CardUpdate from './page/card/cartUpdate'
import ListAdd from './page/list/listAdd'
import ListDisplay from './page/list/listDisplay'
import ListUpdate from './page/list/listUpdate'
import Header from './components/header'
import Sidebar from './components/sidebar'
import Column from 'antd/es/table/Column'
import MainLayout from './layout/MainLayout'
import BoardPage from './page/board/BoardPage'
import CardItem from './components/CardItem'
import Layout from './page/Layout'




function App() {
  return (
    <BrowserRouter>
      <Routes>
    
        <Route path="/" element={ <PrivateRoute>  <Clientlayout/>  </PrivateRoute> }  />  
        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Register/>} />
        <Route path='/broadAdd' element={<BoardAdd/>} />
        <Route path='/broadList' element={<BoardList/>} />
        <Route path='/broadUpdate' element={<BoardUpdate initialData={{boardName: '', description: ''}} onUpdate={(data) => console.log(data)} />} />
        <Route path='/cardAdd' element={<CardAdd/>} />
        <Route path='/cardList' element={<CardList/>} />
        <Route path='/cardUpdate' element={<CardUpdate initialData={{cardName: '', description: '', dueDate: '', position: 0, status: ''}} onUpdate={(data) => console.log(data)} />} />
        <Route path='/listAdd' element={<ListAdd/>} />
        <Route path='/listDisplay' element={<ListDisplay/>} />
        <Route path='/listUpdate' element={<ListUpdate initialData={{listName: '', description: ''}} onUpdate={(data) => console.log(data)} />} />
        <Route path='/header' element={<Header/>} />
        <Route path='/sidebar' element={<Sidebar/>} />
        <Route path='/Column' element={<Column/>} />
        <Route path='/MainLayout' element={<MainLayout/>} />
        <Route path='/BoardPage' element={<BoardPage/>} />
        <Route path='/CardItem' element={<CardItem/>} />
        <Route path='/Layout' element={<Layout/>} />
        
       
        
        
        
        


        
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
