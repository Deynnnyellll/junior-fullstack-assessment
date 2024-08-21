import { useEffect, useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { IoIosCreate } from "react-icons/io";


const HomePage = () => {
    const [items, setItems] = useState([]);

    const route = "/api/items"
    useEffect(() => {
        fetch(route, {
            method: "GET",
            headers: {
                "Content-Type" : "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            setItems(data)
        })
        .catch(error => {
            console.log(error)
        })
    },[items])


    const navigate = useNavigate();

    const handleNavigateById = (id) => {
        navigate(`/item/${id}`)
    }
    
  return (
    <div className="home-page">
        <h1 style={{fontSize:"40pt"}}> Home Page </h1>
        <Button onClick={() => navigate("/create-item")} variant="contained" 
                style={{marginBottom:"20px", fontSize:"20pt", width: "95%", height:"13%"}} 
                endIcon={ < IoIosCreate 
                size={40}/> } > Create </Button>
        <div className="card-container">
            {
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