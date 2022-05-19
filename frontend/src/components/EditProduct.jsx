/* eslint-disable react/self-closing-comp */
/* eslint-disable jsx-a11y/label-has-associated-control */
// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';
import React, { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import { Link, useParams, useNavigate } from 'react-router-dom';
// eslint-disable-next-line import/no-unresolved
import { Button } from 'reactstrap';
import Main from './Main';

export default function EditProduct() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState([]);
    const [image, setImage] = useState();
    const [createdBy, setCreatedBy] = useState();
    const [file, setFile] = useState();
    const urlParams = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        // get a product and set all details
        axios
            .create({
                headers: {
                    token: `Bearer ${JSON.parse(
                        localStorage.getItem('regtoken')
                    )}`,
                },
            })
            .get(`/products/${urlParams.id}`)
            .then((response) => {
                console.log('output', response.data);
                setName(response.data.name);
                setPrice(response.data.price);
                setDescription(response.data.description);
                setQuantity(response.data.quantity);
                setImage(response.data.image);
                if (response.data.image === null) {
                    setFile('');
                } else {
                    setFile(response.data.image.slice(9));
                }
                setCreatedBy(response.data.createdBy);
            })
            .catch((error) => {
                console.log(error);
                localStorage.removeItem('regtoken');
                localStorage.removeItem('regtoken user');
                localStorage.removeItem('loggedIn');
                navigate('/');
            });
    }, []);

    // converting image file as an object
    const saveFile = (e) => {
        setFile(e.target.files[0]);
        // setFileName(e.target.files[0].name);
    };
    // update the product
    function updateDetails(e) {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('regtoken user'));
        const updatedBy = user.id;
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('quantity', quantity);
        formData.append('price', price);
        formData.append('image', file);
        formData.append('createdBy', createdBy);
        formData.append('updatedBy', updatedBy);
        console.log(`formData${formData}`);
        // updating the product
        axios
            .create({
                headers: {
                    token: `Bearer ${JSON.parse(
                        localStorage.getItem('regtoken')
                    )}`,
                },
            })
            .put(`/products/${urlParams.id}`, formData)
            .then((response) => {
                console.log(response);
                alert('updated successfully');
            })
            .catch((error) => {
                console.log('An error occurred:', error.response);
                localStorage.removeItem('regtoken');
                localStorage.removeItem('regtoken user');
                localStorage.removeItem('loggedIn');
                navigate('/');
            });
        // navigate to editproduct list page
        navigate('/list');
    }
    return (
        // eslint-disable-next-line react/jsx-filename-extension
        <div>
            <Main />
            <div className="p-5">
                <h4 className="mb-5">Update the details of Product</h4>
                <form
                    onSubmit={updateDetails}
                    className="text-left form formMargin p-3"
                >
                    {/*  eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                    <img
                        src={image}
                        alt="Image is temporary unavaialable"
                        className="imgEdit"
                    />

                    <div className="align-left">
                        {/*  eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                        <label>
                            <b>Title</b>
                        </label>
                        <input
                            type="text"
                            className="form-control mb-2"
                            value={name || ''}
                            onInput={(e) => setName(e.target.value)}
                        />
                        <label>
                            <b>Quantity</b>
                        </label>
                        <input
                            type="number"
                            className="form-control mb-2"
                            min={1}
                            value={quantity || ''}
                            onInput={(e) => setQuantity(e.target.value)}
                        />
                        <label>
                            <b>Price</b>
                        </label>
                        <input
                            type="number"
                            className="form-control mb-2"
                            min={1}
                            value={price || ''}
                            onInput={(e) => setPrice(e.target.value)}
                        />
                        <label>
                            <b>Image</b>
                        </label>
                        <input
                            type="file"
                            className="form-control mb-2"
                            min={1}
                            onChange={saveFile}
                        />
                        <label>
                            <b>About Product</b>
                        </label>
                        <textarea
                            type="text"
                            className="form-control mb-2"
                            value={description || ''}
                            onInput={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="d-flex justify-content-center">
                        <Button className="m-2" color="success">
                            Save
                        </Button>
                        <Link to="/list">
                            <Button className="m-2" color="warning">
                                Go back
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
