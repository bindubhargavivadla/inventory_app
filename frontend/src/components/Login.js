import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Nav, Navbar, NavbarBrand, NavItem } from 'reactstrap';

export default function Login() {
    const [error, setError] = useState('');
    const navigate = useNavigate();
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
                    if (message == 'Request failed with status code 500') {
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
        <div className="body  ">
            <div className="login-nav">
                <Navbar expand="md" light>
                    <NavbarBrand>
                        <h5 className="brand">Electronics Inventory</h5>
                    </NavbarBrand>
                    <Nav navbar>
                        <NavItem></NavItem>
                        <NavItem className="text-right"></NavItem>
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
                        type="text"
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
                    <p className="team1-validation-error">
                        {formik.errors.password ? formik.errors.password : null}
                    </p>
                    <p id="msg" className="text-danger"></p>
                    <button className="mt-5 mb-3">Submit</button>
                </form>
            </div>
        </div>
    );
}
