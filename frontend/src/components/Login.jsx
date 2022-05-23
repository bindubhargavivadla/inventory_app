/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { useFormik } from 'formik';
// eslint-disable-next-line import/no-unresolved
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// eslint-disable-next-line import/no-unresolved
import {
    Form,
    Input,
    Button,
    Nav,
    Navbar,
    NavbarBrand,
    NavItem,
} from 'reactstrap';

export default function Login() {
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const inputStyle = {
        padding: '10px',
        width: '400px',
        border: 'none',
        borderBottom: '2px solid rgba(101, 104, 101, 0.733)',
        margin: 'auto',
    };
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        async onSubmit(values) {
            console.log('form submit');
            let message = 'Server denied';
            await axios
                .post('/users/login', {
                    email: values.email,
                    password: values.password,
                })
                .then((response) => {
                    console.log(response.data);
                    localStorage.setItem(
                        'regtoken',
                        JSON.stringify(response.data.jwt)
                    );
                    localStorage.setItem(
                        'regtoken user',
                        JSON.stringify(response.data.user)
                    );
                    localStorage.setItem('loggedIn', '1');
                    navigate('/list');
                })
                .catch((errors) => {
                    console.log(errors);
                    message = errors.message;
                    if (message === 'Request failed with status code 500') {
                        alert('Server is not started');
                    } else {
                        document.querySelector('#msg').innerHTML =
                            '<p>Incorrect Credentials</p>';
                    }

                    setError(errors);
                });
        },
        validate() {
            const errors = {};
            if (formik.values.password.length < 0) {
                errors.password = "Can't be less than 6 characters";
            }
            if (formik.values.email.length < 3) {
                errors.email = "Can't be less than 3 characters";
            }
            return errors;
        },
    });

    return (
        // eslint-disable-next-line react/jsx-filename-extension
        <div className="body  ">
            <div className="login-nav">
                <Navbar expand="md" light>
                    <NavbarBrand>
                        <h5 className="brand">Electronics Inventory</h5>
                    </NavbarBrand>
                    <Nav navbar>
                        <NavItem />
                        <NavItem className="text-right" />
                    </Nav>
                </Navbar>
            </div>

            <Form
                onSubmit={formik.handleSubmit}
                noValidate
                className="form mt-5"
            >
                <h1 className="heading mb-4">Sign in</h1>
                <Input
                    style={inputStyle}
                    type="email"
                    name="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    placeholder="Email"
                    required
                />
                <p>{formik.errors.email ? formik.errors.email : null}</p>
                <Input
                    style={inputStyle}
                    type="password"
                    name="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    placeholder="password"
                    required
                />
                <p>{formik.errors.password ? formik.errors.password : null}</p>
                <div id="msg" className="text-danger"></div>
                {/* eslint-disable-next-line react/button-has-type */}
                <Button
                    style={{
                        border: 'none',
                        padding: '10px',
                        color: 'white',
                        width: '120px',
                        borderRadius: '5px',
                        backgroundColor: 'rgb(2, 107, 107)',
                    }}
                    className="mt-5 mb-3"
                    type="submit"
                >
                    Submit
                </Button>
            </Form>
        </div>
    );
}
