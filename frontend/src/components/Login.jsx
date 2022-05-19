/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { useFormik } from 'formik';
// eslint-disable-next-line import/no-unresolved
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// eslint-disable-next-line import/no-unresolved
import { Nav, Navbar, NavbarBrand, NavItem } from 'reactstrap';

export default function Login() {
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        async onSubmit() {
            console.log('form submit');
            let message = 'Server denied';
            await axios
                .post('/users/login', {
                    email: 'mani@gmail.com',
                    password: '654321',
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
                            '<p>incorrect Credentials</p>';
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

            <div className=" login-form mt-5 d-flex align-items-center">
                <form
                    onSubmit={formik.handleSubmit}
                    noValidate
                    className="form"
                >
                    <h1 className="heading">Sign in</h1>
                    <input
                        type="email"
                        name="email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        placeholder="Email"
                    />
                    <p className="team1-validation-error">
                        {formik.errors.email ? formik.errors.email : null}
                    </p>
                    <input
                        type="password"
                        name="password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        placeholder="password"
                    />
                    <p className="">
                        {formik.errors.password ? formik.errors.password : null}
                    </p>
                    <p id="msg" className="text-danger" />
                    {/* eslint-disable-next-line react/button-has-type */}
                    <button className="mt-5 mb-3">Submit</button>
                </form>
            </div>
        </div>
    );
}
