import React, { useState, useEffect, useContext } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';
// eslint-disable-next-line import/no-unresolved
import { Card, CardTitle, CardText, CardImg } from 'reactstrap';
// eslint-disable-next-line import/no-unresolved
import { Link, useNavigate } from 'react-router-dom';
import ProductsContext from './ProductContext';
import Main from './Main';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const { dispatch, state, getProducts } = useContext(ProductsContext);
    // Fetching the products data from the backend so that we can list the produts

    const getAllProducts = async () => {
        await axios
            .create({
                headers: {
                    token: `Bearer ${JSON.parse(
                        localStorage.getItem('regtoken')
                    )}`,
                },
            })
            .get('/products')
            .then((response) => {
                // eslint-disable-next-line eqeqeq
                if (response.data.status == 0) {
                    alert(response.data.message);
                } else {
                    setProducts(response.data);
                }
            })
            .catch((error) => {
                alert('Token Expired');
                localStorage.removeItem('regtoken');
                localStorage.removeItem('regtoken user');
                localStorage.removeItem('loggedIn');
                navigate('/');
                console.log('An error occurred:', error.response);
            });
        dispatch({ type: 'set-products', productList: products });
    };
    useEffect(() => {
        console.log('product list');
        getAllProducts();
        getProducts();
    }, []);

    // delete the product
    const deleteProduct = async (index, id) => {
        const text = 'Do you want to delete the product';
        // eslint-disable-next-line no-restricted-globals
        // eslint-disable-next-line eqeqeq
        // eslint-disable-next-line no-restricted-globals
        if (confirm(text) === true) {
            try {
                await axios.delete(`/products/${id}`, {
                    headers: {
                        token: `Bearer ${JSON.parse(
                            localStorage.getItem('regtoken')
                        )}`,
                    },
                });
            } catch (error) {
                localStorage.removeItem('regtoken');
                localStorage.removeItem('regtoken user');
                localStorage.removeItem('loggedIn');
                navigate('/');
                console.log(error);
            }
            dispatch({ type: 'delete', index });
            getProducts();
        }
    };
    return (
        <div>
            <Main />
            {state.products.length === 0 ? (
                <div className="m-5 body">
                    <h1>Inventory Empty Now</h1>
                    <p>Clcik on Add Item! To add items</p>
                </div>
            ) : (
                <div className="row product-list mx-5 my-3">
                    {state.products.map((val, index) => (
                        <div className="mb-3 col-lg-4 col-md-5 col-sm-6 p-4 textLeft">
                            <Card body className="text-center">
                                <CardImg
                                    src={val.image}
                                    alt={val.name}
                                    top
                                    className="img-box"
                                    width="100%"
                                />
                                <hr />
                                <CardTitle tag="h5" className="m-2">
                                    {val.name}
                                </CardTitle>
                                <CardText color="success">
                                    Quantity: <b>{val.quantity}</b>
                                </CardText>
                                <CardText>
                                    <b>₹ {val.price}</b>
                                </CardText>
                                <CardText className="card-desc">
                                    {val.description}
                                </CardText>
                                <div className="d-flex flex-row">
                                    <Link
                                        className="d-flex align-items-center justify-content-center editBtn linkDec w-50 m-2"
                                        to={`/edit/${val.id}`}
                                    >
                                        Edit
                                    </Link>

                                    {/* eslint-disable-next-line react/button-has-type */}
                                    <button
                                        className="delBtn w-50"
                                        onClick={(event) => {
                                            event.preventDefault();
                                            deleteProduct(index, val.id);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
