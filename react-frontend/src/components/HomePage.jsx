import { useEffect, useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { IoIosCreate } from "react-icons/io";
import { RiLogoutCircleFill } from "react-icons/ri";


const HomePage = ({ accessToken }) => {
    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    // this will fetch all the items to be rendered
    useEffect(() => {
        fetch("/api/items", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        })
        .then(response => {
            if(response.ok){
                return response.json()
            }
            else if(response === 401){
                // the session will expire and the website will go back to login to authorize again
                alert("Session Expired");
                location.reload();
            }
            else {
                console.log(response)
            }
        })
        .then(data => {
            setItems(data)
        })
        .catch(error => {
            console.log(error)
        })
    },[items.length])

    // this function will navigate to item page when one item is click
    const handleNavigateById = (id) => {
        fetch(`/api/items/${id}`, 
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            }
        )
        .then(response => response.json())
        .then(data => {
            navigate(`/item/${id}`, {state: {data}})

        })
        .catch(error => {
            console.log(error)
        })
    }
    
  return (
    <div className="home-page">
        <h1 style={{fontSize:"40pt"}}> Home Page </h1>
        <RiLogoutCircleFill size={25} style={{position: "absolute", top:"1.5%", left:"97%", transform:"translate(-70%, 0%)", cursor:"pointer"}} 
                    onClick={() => location.reload()}
        />
        <Button onClick={() => navigate("/create-item")} variant="contained" 
                style={{marginBottom:"20px", fontSize:"20pt", width: "95%", height:"13%"}} 
                endIcon={ < IoIosCreate 
                size={40}/> } > Create </Button>
        <div className="card-container">
            {items.length > 0 &&
                items.map(item => (
                    <Card key={item.id} sx={{ minWidth: 200 }} className="card" onClick={() => handleNavigateById(item.id)}>
                        <CardContent>
                            <Typography variant="h3">
                                {item.name}
                            </Typography>

                            <Typography color="text.secondary" variant="h5">
                                {item.description}
                            </Typography>

                            <Typography variant="h5">
                                $ {item.price}
                            </Typography>
                        </CardContent>
                    </Card>
                ))
            }
        </div>
    </div>
  )
}

export default HomePage