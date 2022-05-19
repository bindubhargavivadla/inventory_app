import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useReducer } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import EditProduct from './EditProduct';
import Login from './Login';
import Main from './Main';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import ProductsReducer from './ProductReducer';
import ProductsContext from './ProductContext';

export default function AllRoutes() {
    const [stateStatus, setStateStatus] = useState(false);
    const [products, setProducts] = useState([]);
    const initialState = {
        products: [],
        tokenExpire: false,
        token: JSON.parse(localStorage.getItem('regtoken')),
        loggedIn: JSON.parse(localStorage.getItem('loggedin')),
    };
    const [state, dispatch] = useReducer(ProductsReducer, initialState);
    const getProducts = async () => {
        try {
            let response = await axios
                .create({
                    headers: {
                        token: `Bearer ${JSON.parse(
                            localStorage.getItem('regtoken')
                        )}`,
                    },
                })
                .get('/products');
            console.log(response.data);
            setProducts(response.data);

            dispatch({ type: 'set-products', productList: response.data });
            setStateStatus(true);
        } catch (error) {
            if (error.message == 'Invalid JWT Token') {
                localStorage.clear();
                alert('Session Expired');
                navigate('/');
            }
            console.log(error);
        }
    };
    useEffect(() => {
        if (state.loggedIn) {
            getProducts();
        } else {
            console.log('You are not logged in');
        }
    }, []);
    return (
        <div>
            <ProductsContext.Provider
                value={{ state, dispatch, stateStatus, getProducts }}
            >
                <BrowserRouter>
                    <Routes>
                        <Route path="/main" element={<Main />} />
                        <Route path="/" element={<Login />} />
                        <Route path="/edit/:id" element={<EditProduct />} />
                        <Route path="/add" element={<ProductForm />} />
                        <Route path="/list" element={<ProductList />} />
                    </Routes>
                </BrowserRouter>
            </ProductsContext.Provider>
        </div>
    );
}
