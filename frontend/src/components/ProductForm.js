import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProductForm() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState([]);
    const [image, setImage] = useState();
    const [file, setFile] = useState();
    const [fileName, setFileName] = useState('');
    // converting image file as an object
    const saveFile = (e) => {
        setFile(e.target.files[0]);
        // setFileName(e.target.files[0].name);
    };
    let addProduct = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('quantity', quantity);
        formData.append('price', price);
        formData.append('image', file);
        formData.append('createdBy', 1);
        formData.append('updatedBy', 1);
        console.log('formData' + formData);

        // Posting the product data to the backend
        try {
            const res = await axios.post(
                'http://localhost:3000/products/',
                formData,
                {
                    headers: {
                        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiYmhhcmdhdmlAZ21haWwuY29tIiwicGFzc3dvcmQiOiIxMjM0NTYifSwiaWF0IjoxNjUyNDM2MDEwLCJleHAiOjE2NTI0Mzk2MTB9.g29exIILS0moirQfHduNX0y5qKMdrEPqXFF37XJllCE',
                    },
                }
            );
            alert('Product added successfully');
        } catch (ex) {
            console.log(ex);
        }
    };
    return (
        <div>
            <form onSubmit={addProduct}>
                <label>Product Name</label>
                <br />
                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    className="w-100"
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                />
                <br />
                <label>quantity</label>
                <br />
                <input
                    type="number"
                    name="quantity"
                    className="w-100"
                    onChange={(e) => {
                        setQuantity(e.target.value);
                    }}
                />
                <br />
                <label>Price</label>
                <br />
                <input
                    type="number"
                    name="price"
                    className="w-100"
                    onChange={(e) => {
                        setPrice(e.target.value);
                    }}
                />
                <br />
                <label>Image</label>
                <br />
                <input
                    type="file"
                    name="image"
                    className="w-100"
                    onChange={saveFile}
                />
                <br />
                <label>Description</label>
                <br />
                <textarea
                    name="description"
                    className="w-100"
                    placeholder="Description"
                    onChange={(e) => {
                        setDescription(e.target.value);
                    }}
                ></textarea>
                <br />
                <button>Add</button>
            </form>
        </div>
    );
}
