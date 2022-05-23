/* eslint-disable no-empty */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-duplicates */
/* eslint-disable jsx-a11y/Label-has-associated-control */
import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import axios from 'axios';
import {
    Form,
    Button,
    Input,
    Label,
    Nav,
    Navbar,
    NavbarBrand,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
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
        const text = 'Do you want to logout';
        if (confirm(text) === true) {
            localStorage.clear();
            navigate('/');
        }
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
                    <h2>Add Product</h2>
                </ModalHeader>
                <ModalBody className="">
                    <Form onSubmit={addProduct} className="p-5 border">
                        <FormGroup>
                            <Label>
                                <b>Product Name</b>
                            </Label>
                            <Input
                                required
                                type="text"
                                name="name"
                                placeholder="Product Name"
                                className="w-100 my-2"
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>
                                <b>quantity</b>
                            </Label>
                            <Input
                                required
                                type="number"
                                name="quantity"
                                className="w-100 my-2"
                                onChange={(e) => {
                                    setQuantity(e.target.value);
                                }}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>
                                <b>Price</b>
                            </Label>
                            <Input
                                required
                                type="number"
                                name="price"
                                className="w-100 my-2"
                                onChange={(e) => {
                                    setPrice(e.target.value);
                                }}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>
                                <b>Image</b>
                            </Label>
                            <Input
                                required
                                type="file"
                                name="image"
                                className="w-100 my-2"
                                onChange={saveFile}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>
                                <b>Description</b>
                            </Label>
                            <textarea
                                required
                                name="description"
                                className="w-100 my-2"
                                placeholder="Description"
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                }}
                            />
                        </FormGroup>
                        <br />
                        <ModalFooter
                            toggle={toggle}
                            className="d-flex justify-content-center"
                        >
                            {/* eslint-disable-next-line react/button-has-type */}
                            <Button
                                onClick={() => toggle()}
                                style={{
                                    border: 'none',
                                    padding: '10px',
                                    color: 'white',
                                    width: '120px',
                                    borderRadius: '5px',
                                    backgroundColor: 'rgb(2, 107, 107)',
                                }}
                            >
                                Add
                            </Button>
                        </ModalFooter>
                    </Form>
                </ModalBody>
            </Modal>
        </div>
    );
}
