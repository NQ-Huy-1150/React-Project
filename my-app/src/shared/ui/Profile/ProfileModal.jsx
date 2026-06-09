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
                    setMessage(error.response?.data?.message || 'Cannot load profile.');
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
            setMessage(error.response?.data?.message || 'Update profile failed.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={closeModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>Profile</Modal.Title>
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
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                name="username"
                                value={profile.username}
                                readOnly
                                className="bg-light"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="profileFullName">
                            <Form.Label>Full name</Form.Label>
                            <Form.Control
                                name="fullName"
                                value={profile.fullName}
                                onChange={handleChange}
                                placeholder="Enter full name"
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
                                Email is locked for account safety.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="profilePhoneNumber">
                            <Form.Label>Phone number</Form.Label>
                            <Form.Control
                                name="phoneNumber"
                                value={profile.phoneNumber}
                                onChange={handleChange}
                                placeholder="Phone number"
                                autoComplete="tel"
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button type="button" variant="outline-secondary" onClick={closeModal}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? 'Saving...' : 'Save changes'}
                            </Button>
                        </div>
                    </Form>
                )}
            </Modal.Body>
        </Modal>
    );
}
