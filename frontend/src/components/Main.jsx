/* eslint-disable no-empty */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-duplicates */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import axios from 'axios';
import {
    Button,
    Nav,
    Navbar,
    NavbarBrand,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import ProductsContext from './ProductContext';

export default function Main() {
    const [modal, setModal] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState([]);
    const [file, setFile] = useState();
    // eslint-disable-next-line no-unused-vars
    const { getProducts } = useContext(ProductsContext);

    const navigate = useNavigate();

    // converting image file into an object
    const saveFile = (e) => {
        setFile(e.target.files[0]);
    };
    const addProduct = async (event) => {
        event.preventDefault();
        const user = JSON.parse(localStorage.getItem('regtoken user'));
        const createdBy = user.id;
        console.log(`createdby${createdBy}`);
        console.log('file image', file);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('quantity', quantity);
        formData.append('price', price);
        formData.append('image', file);
        formData.append('createdBy', createdBy);
        formData.append('updatedBy', createdBy);
        console.log(`formData${formData}`);

        // Posting the product data to the backend
        try {
            const res = await axios.post(
                'http://localhost:3000/products/',
                formData,
                {
                    headers: {
                        token: `Bearer ${JSON.parse(
                            localStorage.getItem('regtoken')
                        )}`,
                    },
                }
            );
            if (res.status === 0) {
                alert(`Product ${name} already existed`);
            } else {
                alert('Product added successfully');
            }
            getProducts();
        } catch (error) {
            console.log(error);
            if (error.response.status === 400) {
                alert(`Product with ${name} name already existed`);
            }
            console.log(error);
        }
        getProducts();
    };
    // modal
    const toggle = () => {
        setModal(!modal);
    };
    // logout
    const logout = () => {
        localStorage.clear();
        navigate('/');
    };
    return (
        <div>
            <div className="login-nav">
                <Navbar expand="md" light>
                    <NavbarBrand>
                        <h5 className="brand">Electronics Inventory</h5>
                    </NavbarBrand>
                    <Nav className="">
                        <Button
                            id="add-btn"
                            color="primary"
                            className="addItem mx-5"
                            onClick={() => toggle()}
                        >
                            Add Item
                        </Button>

                        <Button id="logout-btn" color="light" onClick={logout}>
                            Log out
                        </Button>
                    </Nav>
                </Navbar>
            </div>
            {/* Modal */}
            <Modal fade isOpen={modal} toggle={toggle} className="w-75">
                <ModalHeader
                    className="d-flex flex-column justify-content-center "
                    toggle={toggle}
                >
                    Add Product
                </ModalHeader>
                <ModalBody className="">
                    <div>
                        <form onSubmit={addProduct} className="p-5 border">
                            <label>
                                <b>Product Name</b>
                            </label>
                            <br />
                            <input
                                type="text"
                                name="name"
                                placeholder="Product Name"
                                className="w-100 mb-2"
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                            />
                            <br />
                            <label>
                                <b>quantity</b>
                            </label>
                            <br />
                            <input
                                type="number"
                                name="quantity"
                                className="w-100 mb-2"
                                onChange={(e) => {
                                    setQuantity(e.target.value);
                                }}
                            />
                            <br />
                            <label>
                                <b>Price</b>
                            </label>
                            <br />
                            <input
                                type="number"
                                name="price"
                                className="w-100 mb-2"
                                onChange={(e) => {
                                    setPrice(e.target.value);
                                }}
                            />
                            <br />
                            <label>
                                <b>Image</b>
                            </label>
                            <br />
                            <input
                                type="file"
                                name="image"
                                className="w-100 mb-2"
                                onChange={saveFile}
                            />
                            <br />
                            <label>
                                <b>Description</b>
                            </label>
                            <br />
                            <textarea
                                name="description"
                                className="w-100 mb-2"
                                placeholder="Description"
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                }}
                            />
                            <br />
                            <ModalFooter
                                toggle={toggle}
                                className="d-flex justify-content-center"
                            >
                                {/* eslint-disable-next-line react/button-has-type */}
                                <button onClick={() => toggle()}>Add</button>
                            </ModalFooter>
                        </form>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
}
