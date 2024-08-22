import { Route, Routes } from 'react-router-dom';
import './app.css';

// pages
import HomePage from './components/HomePage'
import ItemDetailPage from './components/ItemDetailPage';
import Forms from './components/Forms';
import LogInForm from './components/LogInForm';

// icons and hooks
import { AiFillHome } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function App() {

  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const [isLogin, setIsLogin] = useState();

  useEffect(() => {
    if(!token) {
      setIsLogin(true)
    }
    else {
      setIsLogin(false)
    }
  },[token])


  function handleLogin(username, password) {
    fetch("/api/login", {
      method: "POST", 
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({username: username, password: parseInt(password)})
    })
    .then(response => {
      if(response.ok) {
        return response.json()
      }
      else {
        alert("unable to login")
        console.log(response.json())
      }
    })
    .then(data => {
      console.log(data)
      if(data.error) {
        alert(data.error)
      }
      else {
        setIsLogin(prevState => !prevState)
        localStorage.setItem("access_token", data.access_token)
        setToken(data.access_token)
      }

    })
    .catch(error => {
      console.log(error)
    })
  }

  function handleLogout() {
    localStorage.removeItem("access_token")
    setToken(!token)
  }


  return (
    <div className={isLogin ? 'login' :'app'}>
      <AiFillHome size={25} onClick={() => navigate("")} className={isLogin ? 'hide-element' :'home-button'}/>
      <Routes>
        <Route path='' element={isLogin ? <LogInForm handleLogin={handleLogin} sendDataToParent={handleLogin}/> 
              : <HomePage accessToken={token} logout={handleLogout}/>} 
        />
        <Route path='item/:id' element={ <ItemDetailPage accessToken={token}/> } />
        <Route path='create-item'  element={ <Forms accessToken={token}/> }/>
      </Routes>
    </div>
  )
}

export default App
