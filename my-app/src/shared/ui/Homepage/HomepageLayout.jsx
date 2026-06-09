import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import NavBar from "../NavBar/NavBar";
import SideNav from "../SideNav/SideNav";
import Footer from "../Footer/Footer";
import { Outlet, useNavigate, useRevalidator } from 'react-router-dom'
import AuthService from "../../../service/auth.service";
export default function MainLayout() {
    const [userData, setUserData] = useState(() => AuthService.getCurrentUser());
    const navigate = useNavigate();
    const revalidator = useRevalidator();
    const isLogin = Boolean(userData);

    const handleLoginSuccess = (user) => {
        setUserData(user);
        revalidator.revalidate();
    };

    const handleLogout = () => {
        AuthService.logout();
        setUserData(null);
        navigate('/', { replace: true });
        revalidator.revalidate();
    };

    const handleProfileUpdated = (user) => {
        setUserData(user);
        revalidator.revalidate();
    };

    useEffect(() => {
        const syncLogout = () => {
            setUserData(null);
            navigate('/', { replace: true });
            revalidator.revalidate();
        };

        window.addEventListener('auth:logout', syncLogout);
        return () => window.removeEventListener('auth:logout', syncLogout);
    }, [navigate, revalidator]);

    return (
        <Container fluid className="pt-5 px-3 px-lg-4">
            <Row>
                <Col xs={12} md={12}>
                    <NavBar
                        isLogin={isLogin}
                        userData={userData}
                        onLoginSuccess={handleLoginSuccess}
                        onLogout={handleLogout}
                        onProfileUpdated={handleProfileUpdated}
                    />
                </Col>
            </Row>
            <Row className="g-3 mt-1">
                <Col xs={6} md={3}>
                    <SideNav />
                </Col>
                <Col xs={12} md={9}>
                    <main>
                        <Outlet />
                    </main>
                    <Footer />
                </Col>
            </Row>
        </Container>
    )
}
