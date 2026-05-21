import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import NavBar from "../NavBar/NavBar";
import SideNav from "../SideNav/SideNav";
import Footer from "../Footer/Footer";
import { Outlet } from 'react-router-dom'
export default function MainLayout() {
    const [isLogin, setIsLogin] = useState(false);
    const [userData, setUserData] = useState(null);
    return (
        <Container fluid className="pt-5 px-3 px-lg-4">
            <Row>
                <Col xs={12} md={12}>
                    <NavBar isLogin={isLogin} />
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
