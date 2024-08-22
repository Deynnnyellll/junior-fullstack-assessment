import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { Button } from "@mui/material";
import { AiFillEdit } from 'react-icons/ai';
import { MdCancel } from "react-icons/md";

const Forms = ({ accessToken }) => {
    const navigate = useNavigate();

    // items
    const [name, setName] = useState(null);
    const [description, setDescription] = useState(null);
    const [price, setPrice] = useState(null);

    // this function will first perform validation to check if input fields are filled up.
    // if all the fields are not null, the values will be sent to the API
    const handleSubmit = () => {
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
            fetch("/api/items", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({name: name, description: description, price: parseInt(price)})
            })
            .then(response => response.json)
            .then(data => {
                console.log(data)
                navigate(-1)
            })
            .catch(error => {
                console.log(error)
            })
        }
    }

  return (
    <div className="create-container">
        <h1> Create Item </h1>
        <form action="" className="create-form">
            <label htmlFor="name"> Name </label>
            <input 
                type="text" name="name" id="name" 
                onChange={e => setName(e.target.value)}
            />

            <label htmlFor="description"> Description </label>
            <textarea type="text"  
                name="description" id="desciption"
                onChange={e => setDescription(e.target.value)}
                rows={6}
            />

            <label htmlFor="price"> Price </label>
            <input 
                type="text"  name="price" id="price"
                onChange={e => setPrice(e.target.value)}
            />
        </form>

        <div className="edit-buttons">
            <Button onClick={() => navigate(-1)} variant="contained" startIcon={<MdCancel />}> Cancel </Button>
            <Button onClick={() => handleSubmit()} variant="contained" color="success" startIcon={<AiFillEdit />}> Submit </Button>
        </div>
    </div>
  )
}

export default Forms