
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Login } from './page/Login'
import { Register } from './page/Register'

import PrivateRoute from './privateRoute'
import CardAdd from './page/card/cartAdd'
import CardList from './page/card/cartList'
import CardUpdate from './page/card/cartUpdate'

import Header from './components/header'

import Column from 'antd/es/table/Column'
import MainLayout from './layout/MainLayout'
import BoardPage from './page/board/BoardPage'
import CardItem from './components/CardItem'
import Layout from './page/Layout'
import BoardDetail from "./page/board/BoardDetail"




function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<PrivateRoute> <Layout /> </PrivateRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/cardAdd' element={<CardAdd />} />
        <Route path='/cardList' element={<CardList />} />
        <Route path='/cardUpdate' element={<CardUpdate initialData={{ cardName: '', description: '', dueDate: '', position: 0, status: '' }} onUpdate={(data) => console.log(data)} />} />

        <Route path='/header' element={<Header />} />

        <Route path='/Column' element={<Column />} />
        <Route path='/MainLayout' element={<MainLayout />} />
        <Route path='/BroadPage' element={<BoardPage />} />
        <Route path='/CardItem' element={<CardItem />} />
        <Route path='/Layout' element={<Layout />} />
        <Route path='/detail/:id' element={< BoardDetail />} />










      </Routes>
    </BrowserRouter>
  )
}

export default App
