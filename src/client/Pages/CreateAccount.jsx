import React, {useState} from 'react';
import {Container, Form, Button, Alert} from 'react-bootstrap';
import './Css/SignupPage.css'; // Import your custom CSS file
import axios from 'axios';
import bcrypt from 'bcryptjs';


const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (name && email && password) {
            try {
                const response = await axios.post('/register', {
                    username: name, email: email, password: password,
                });
                if (response.status === 200) {
                    window.location.href = '/';
                } else {
                    // alert registration failed
                    window.alert('Registration failed: missing / incorrect fields');
                }
            } catch (error) {
                window.alert('Registration failed');
            }
        } else {
            setShowAlert(true);
        }
    };


    return (<Container className="signup-container">
        <div className="signup-box">
            <h2>Create Account</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Create Account
                </Button>
            </Form>
            {showAlert && (<Alert variant="danger" className="mt-3">
                Please fill in all fields.
            </Alert>)}
        </div>
    </Container>);
};

export default SignupPage;
