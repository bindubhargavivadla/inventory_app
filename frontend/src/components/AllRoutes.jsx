/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';
import React, { useEffect, useState, useReducer } from 'react';
// eslint-disable-next-line import/no-unresolved
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import EditProduct from './EditProduct';
import Login from './Login';
import Main from './Main';
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
            const response = await axios
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
            if (error.message === 'Invalid JWT Token') {
                localStorage.clear();
                alert('Session Expired');
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
                        <Route path="/list" element={<ProductList />} />
                    </Routes>
                </BrowserRouter>
            </ProductsContext.Provider>
        </div>
    );
}
