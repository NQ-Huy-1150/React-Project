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
            setMessage(error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        setMessage('');

        if (registerForm.password !== registerForm.confirmPassword) {
            setMessage('Mật khẩu xác nhận không khớp.');
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
            setMessage('Đăng ký thành công. Bạn có thể đăng nhập ngay.');
            onSwitchMode?.('login');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={closeModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>{isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {message && <Alert variant={message.includes('thành công') ? 'success' : 'danger'}>{message}</Alert>}

                {isLogin ? (
                    <Form onSubmit={handleLoginSubmit}>
                        <Form.Group className="mb-3" controlId="loginUsername">
                            <Form.Label>Tên đăng nhập</Form.Label>
                            <Form.Control
                                name="username"
                                value={loginForm.username}
                                onChange={handleLoginChange}
                                placeholder="Nhập tên đăng nhập"
                                autoComplete="username"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="loginPassword">
                            <Form.Label>Mật khẩu</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={loginForm.password}
                                onChange={handleLoginChange}
                                placeholder="Nhập mật khẩu"
                                autoComplete="current-password"
                            />
                        </Form.Group>
                        <Button type="submit" className="w-100" disabled={submitting}>
                            {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </Button>
                    </Form>
                ) : (
                    <Form onSubmit={handleRegisterSubmit}>
                        <Row>
                            <Col sm={6}>
                                <Form.Group className="mb-3" controlId="registerFirstName">
                                    <Form.Label>Tên</Form.Label>
                                    <Form.Control
                                        name="firstName"
                                        value={registerForm.firstName}
                                        onChange={handleRegisterChange}
                                        placeholder="Tên"
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-3" controlId="registerLastName">
                                    <Form.Label>Họ</Form.Label>
                                    <Form.Control
                                        name="lastName"
                                        value={registerForm.lastName}
                                        onChange={handleRegisterChange}
                                        placeholder="Họ"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3" controlId="registerUsername">
                            <Form.Label>Tên đăng nhập</Form.Label>
                            <Form.Control
                                name="username"
                                value={registerForm.username}
                                onChange={handleRegisterChange}
                                placeholder="Tên đăng nhập"
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
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                                name="phoneNumber"
                                value={registerForm.phoneNumber}
                                onChange={handleRegisterChange}
                                placeholder="Số điện thoại"
                                autoComplete="tel"
                            />
                        </Form.Group>
                        <Row>
                            <Col sm={6}>
                                <Form.Group className="mb-3" controlId="registerPassword">
                                    <Form.Label>Mật khẩu</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={registerForm.password}
                                        onChange={handleRegisterChange}
                                        placeholder="Mật khẩu"
                                        autoComplete="new-password"
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-3" controlId="registerConfirmPassword">
                                    <Form.Label>Xác nhận</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="confirmPassword"
                                        value={registerForm.confirmPassword}
                                        onChange={handleRegisterChange}
                                        placeholder="Xác nhận mật khẩu"
                                        autoComplete="new-password"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button type="submit" className="w-100" disabled={submitting}>
                            {submitting ? 'Đang tạo...' : 'Tạo tài khoản'}
                        </Button>
                    </Form>
                )}
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                {isLogin ? (
                    <Button variant="link" onClick={() => onSwitchMode?.('register')}>
                        Chưa có tài khoản? Đăng ký
                    </Button>
                ) : (
                    <Button variant="link" onClick={() => onSwitchMode?.('login')}>
                        Đã có tài khoản? Đăng nhập
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
}
