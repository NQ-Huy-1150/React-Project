import { useState } from 'react';
import { Alert, Button, Col, Form, Modal, Row } from 'react-bootstrap';
import AuthService from '../../../service/auth.service';

const initialLoginForm = {
    username: '',
    password: '',
};

const initialRegisterForm = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
};

export default function AuthModal({ mode, show, onHide, onLoginSuccess, onSwitchMode }) {
    const isLogin = mode === 'login';
    const [loginForm, setLoginForm] = useState(initialLoginForm);
    const [registerForm, setRegisterForm] = useState(initialRegisterForm);
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleLoginChange = (event) => {
        const { name, value } = event.target;
        setLoginForm(prev => ({ ...prev, [name]: value }));
    };

    const handleRegisterChange = (event) => {
        const { name, value } = event.target;
        setRegisterForm(prev => ({ ...prev, [name]: value }));
    };

    const resetState = () => {
        setMessage('');
        setSubmitting(false);
    };

    const closeModal = () => {
        resetState();
        onHide();
    };

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setSubmitting(true);
        try {
            const user = await AuthService.login(loginForm.username, loginForm.password);
            setLoginForm(initialLoginForm);
            onLoginSuccess?.(user);
            closeModal();
        } catch (error) {
            setMessage(error.response?.data?.message || 'Login failed. Please check your account again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        setMessage('');

        if (registerForm.password !== registerForm.confirmPassword) {
            setMessage('Password and confirm password do not match.');
            return;
        }

        setSubmitting(true);
        try {
            await AuthService.register(
                registerForm.firstName,
                registerForm.lastName,
                registerForm.username,
                registerForm.email,
                registerForm.password,
                registerForm.phoneNumber,
                registerForm.confirmPassword
            );
            setRegisterForm(initialRegisterForm);
            setMessage('Register successfully. You can login now.');
            onSwitchMode?.('login');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Register failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={closeModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>{isLogin ? 'Login' : 'Create account'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {message && <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>{message}</Alert>}

                {isLogin ? (
                    <Form onSubmit={handleLoginSubmit}>
                        <Form.Group className="mb-3" controlId="loginUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                name="username"
                                value={loginForm.username}
                                onChange={handleLoginChange}
                                placeholder="Enter username"
                                autoComplete="username"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="loginPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={loginForm.password}
                                onChange={handleLoginChange}
                                placeholder="Enter password"
                                autoComplete="current-password"
                            />
                        </Form.Group>
                        <Button type="submit" className="w-100" disabled={submitting}>
                            {submitting ? 'Logging in...' : 'Login'}
                        </Button>
                    </Form>
                ) : (
                    <Form onSubmit={handleRegisterSubmit}>
                        <Row>
                            <Col sm={6}>
                                <Form.Group className="mb-3" controlId="registerFirstName">
                                    <Form.Label>First name</Form.Label>
                                    <Form.Control
                                        name="firstName"
                                        value={registerForm.firstName}
                                        onChange={handleRegisterChange}
                                        placeholder="First name"
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-3" controlId="registerLastName">
                                    <Form.Label>Last name</Form.Label>
                                    <Form.Control
                                        name="lastName"
                                        value={registerForm.lastName}
                                        onChange={handleRegisterChange}
                                        placeholder="Last name"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3" controlId="registerUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                name="username"
                                value={registerForm.username}
                                onChange={handleRegisterChange}
                                placeholder="Username"
                                autoComplete="username"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="registerEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={registerForm.email}
                                onChange={handleRegisterChange}
                                placeholder="name@example.com"
                                autoComplete="email"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="registerPhoneNumber">
                            <Form.Label>Phone number</Form.Label>
                            <Form.Control
                                name="phoneNumber"
                                value={registerForm.phoneNumber}
                                onChange={handleRegisterChange}
                                placeholder="Phone number"
                                autoComplete="tel"
                            />
                        </Form.Group>
                        <Row>
                            <Col sm={6}>
                                <Form.Group className="mb-3" controlId="registerPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={registerForm.password}
                                        onChange={handleRegisterChange}
                                        placeholder="Password"
                                        autoComplete="new-password"
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-3" controlId="registerConfirmPassword">
                                    <Form.Label>Confirm</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="confirmPassword"
                                        value={registerForm.confirmPassword}
                                        onChange={handleRegisterChange}
                                        placeholder="Confirm password"
                                        autoComplete="new-password"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button type="submit" className="w-100" disabled={submitting}>
                            {submitting ? 'Creating...' : 'Create account'}
                        </Button>
                    </Form>
                )}
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                {isLogin ? (
                    <Button variant="link" onClick={() => onSwitchMode?.('register')}>
                        Need an account? Sign up
                    </Button>
                ) : (
                    <Button variant="link" onClick={() => onSwitchMode?.('login')}>
                        Already have an account? Login
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
}
