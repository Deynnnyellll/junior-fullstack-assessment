import { Button } from "@mui/material";
import { useState } from "react";

const LogInForm = ({ sendDataToParent}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        sendDataToParent(username, password);
    }

  return (
    <form action="" className="login-form">
      <div className="inner-form">
        <h1> Login </h1>
        <label htmlFor="usernmae"> Username </label>
        <input type="text" id="username" onChange={e => setUsername(e.target.value)} value={username}/>
        <label htmlFor="password"> Password </label>
        <input type="password" id="password" onChange={e => setPassword(e.target.value)} value={password}/>
      </div>
      <Button variant="contained" onClick={handleSubmit} className="login-button"> Login </Button>
    </form>
  )
}

export default LogInForm
