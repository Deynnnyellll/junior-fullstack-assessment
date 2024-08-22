import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography, Button } from "@mui/material";
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { MdCancel } from "react-icons/md";
import { useLocation } from "react-router-dom";

const ItemDetailPage = ({ accessToken }) => {
    const [item, setItem] = useState({});
    const [editable, setEditable] = useState(false);
    const { id } = useParams();

    // forms
    const [name, setName] = useState();
    const [description, setDescription] = useState();
    const [price, setPrice] = useState();

    const navigate = useNavigate();
    const location = useLocation();
    const [prevItem, setPrevItem] = useState(location.state);

    // this will get the value of a specific item and render it to the component
    useEffect(() => {
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
            setItem(data)
            setName(data.name)
            setDescription(data.description)
            setPrice(data.price)

        })
        .catch(error => {
            console.log(error)
        })
    },[prevItem])

    const handleToggleEditable = () => {
        setEditable(prevEditable => !prevEditable);
    }
    
    // this will submit the edited item
    const submitItem = () => {
        if(name === null) {
            alert("Please include name")
            document.getElementById("name").focus()
        }
        else if(description === null) { 
            alert("Please include description")
            document.getElementById("description").focus()
        }
        else if(price === null) {
            alert("Please include price")
            document.getElementById("price").focus()
        }
        else {
            fetch(`/api/items/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({name: name, description: description, price: parseInt(price)})
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setPrevItem(data)
                handleToggleEditable();

            })
            .catch(error => {
                console.log(error)
            })
        }    
    }

    // this function will delete the item
    const deleteItem = () => {
        fetch( `/api/items/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            navigate(-1)
        })
        .catch(error => {
            console.log(error)
        })
    }

  return (
    <div className="forms">
        <h1 style={{fontSize:"3em"}}> Item Detail </h1>
        <Card key={item.id} sx={{ minWidth: 300 }} className="specific-item">
            {
                !editable ? 
                <CardContent className="card-content" style={{marginTop: "40px"}}>
                    <Typography variant="h3">
                        Name: {item.name}
                    </Typography>

                    <Typography color="text.secondary" variant="h5">
                        Description: {item.description}
                    </Typography>

                    <Typography variant="h5">
                       Price: $ {item.price}
                    </Typography>

                    <div className="single-item-buttons">
                        <Button onClick={() => deleteItem()} variant="outlined" endIcon={<AiFillDelete />}> Delete </Button>
                        <Button onClick={() => handleToggleEditable()} variant="contained" startIcon={<AiFillEdit />}> Edit </Button>                    
                    </div>
                </CardContent> :

                <div className="form-container">
                    <form action="" className="edit-form">
                        <label htmlFor="name"> Name </label>
                        <input 
                            type="text" name="name" id="name" 
                            onChange={e => setName(e.target.value)}
                            value={name}
                        />

                        <label htmlFor="description"> Description </label>
                        <textarea type="text"  
                            name="description" id="desciption"
                            onChange={e => setDescription(e.target.value)}
                            value={description}
                            rows={3}
                        />

                        <label htmlFor="price"> Price </label>
                        <input 
                            type="text"  name="price" id="price"
                            onChange={e => setPrice(e.target.value)}
                            value={price}
                        />
                    </form>

                    <div className="edit-buttons">
                        <Button onClick={() => handleToggleEditable()} variant="contained"> <MdCancel /> </Button>
                        <Button onClick={() => submitItem()} variant="contained" color="success"> <AiFillEdit /> </Button>
                        <Button onClick={() => deleteItem()} variant="outlined"> <AiFillDelete /> </Button>
                    </div>
                </div>
            }
            
        </Card>
    </div>
  )
}

export default ItemDetailPage
