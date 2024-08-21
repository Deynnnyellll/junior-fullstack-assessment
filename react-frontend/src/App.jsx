import { Route, Routes } from 'react-router-dom';
import './app.css';

import HomePage from './components/HomePage'
import ItemDetailPage from './components/ItemDetailPage';
import Forms from './components/Forms';

import { Button } from '@mui/material';
import { AiFillHome } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

function App() {

  const navigate = useNavigate();

  return (
    <div className='app'>
      <AiFillHome size={30} onClick={() => navigate("")} className='home-button'/>
      <Routes>
        <Route path='' element={ <HomePage />} />
        <Route path='item/:id' element={ <ItemDetailPage /> } />
        <Route path='create-item'  element={ <Forms /> }/>
      </Routes>
    </div>
  )
}

export default App
