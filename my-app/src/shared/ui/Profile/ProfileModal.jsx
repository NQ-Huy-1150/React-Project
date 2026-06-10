import { useEffect, useState } from 'react';
import { Alert, Button, Form, Modal, Spinner } from 'react-bootstrap';
import UserService from '../../../service/user.service';

const initialProfile = {
    username: '',
    fullName: '',
    email: '',
    phoneNumber: '',
};

export default function ProfileModal({ show, onHide, onProfileUpdated }) {
    const [profile, setProfile] = useState(initialProfile);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!show) return;

        let cancelled = false;

        const loadProfile = async () => {
            setLoading(true);
            setMessage('');
            try {
                const data = await UserService.getMyProfile();
                if (!cancelled) {
                    setProfile({
                        username: data?.username || '',
                        fullName: data?.fullName || '',
                        email: data?.email || '',
                        phoneNumber: data?.phoneNumber || '',
                    });
                }
            } catch (error) {
                if (!cancelled) {
                    setMessage(error.response?.data?.message || 'Không thể tải hồ sơ.');
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadProfile();

        return () => {
            cancelled = true;
        };
    }, [show]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const closeModal = () => {
        setMessage('');
        setSubmitting(false);
        onHide();
    };

    const syncStoredUser = (updatedProfile) => {
        const currentUser = JSON.parse(localStorage.getItem('user')) || {};
        const nextUser = {
            ...currentUser,
            username: updatedProfile.username || currentUser.username,
            fullName: updatedProfile.fullName || '',
            email: updatedProfile.email || '',
        };

        localStorage.setItem('user', JSON.stringify(nextUser));
        onProfileUpdated?.(nextUser);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setSubmitting(true);

        try {
            const updatedProfile = await UserService.updateMyProfile({
                fullName: profile.fullName,
                phoneNumber: profile.phoneNumber,
            });
            syncStoredUser(updatedProfile);
            closeModal();
        } catch (error) {
            setMessage(error.response?.data?.message || 'Cập nhật hồ sơ thất bại.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={closeModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>Hồ sơ cá nhân</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {message && <Alert variant="danger">{message}</Alert>}

                {loading ? (
                    <div className="d-flex justify-content-center py-4">
                        <Spinner animation="border" role="status" />
                    </div>
                ) : (
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="profileUsername">
                            <Form.Label>Tên đăng nhập</Form.Label>
                            <Form.Control
                                name="username"
                                value={profile.username}
                                readOnly
                                className="bg-light"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="profileFullName">
                            <Form.Label>Họ và tên</Form.Label>
                            <Form.Control
                                name="fullName"
                                value={profile.fullName}
                                onChange={handleChange}
                                required
                                minLength={3}
                                placeholder="Nhập họ và tên"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="profileEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={profile.email}
                                readOnly
                                className="bg-light"
                                placeholder="name@example.com"
                                autoComplete="email"
                            />
                            <Form.Text className="text-muted">
                                Email đang được khóa để bảo vệ tài khoản.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="profilePhoneNumber">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                                name="phoneNumber"
                                value={profile.phoneNumber}
                                onChange={handleChange}
                                placeholder="Số điện thoại"
                                autoComplete="tel"
                                minLength={10}
                                pattern="[0-9+\s-]{10,15}"
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button type="button" variant="outline-secondary" onClick={closeModal}>
                                Hủy
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </Button>
                        </div>
                    </Form>
                )}
            </Modal.Body>
        </Modal>
    );
}
