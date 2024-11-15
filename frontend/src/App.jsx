import React from 'react'
import Navbar from './Components/Navbar'
import {BrowserRouter,Route,Routes} from 'react-router-dom'

//Pages
import HomePage from './Pages/HomePage'
import ViewPage from './Pages/ViewPage'

const App = () => {
  return (
  
    <BrowserRouter>
      <Navbar/>
    <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/view" element={<ViewPage/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App