import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import ProductParams from './Pages/ProductParams'

const App = () => {
  return (
    <div>   

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/product/:id' element={<ProductParams/>}/>
      </Routes>

      
    </div>
  )
}

export default App