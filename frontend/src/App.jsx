import {Route, Routes} from 'react-router-dom'
import Chatpage from './Pages/Chatpage'
import Homepage from './Pages/Homepage'

function App() {
  return<>
    <Routes>
    <Route path='/' element={<Homepage/>}/>
    
    <Route path='/chats' element={<Chatpage/>} />
    </Routes>
  </>
}

export default App

