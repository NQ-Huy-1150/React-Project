import { Container, Row, Col } from "react-bootstrap";
import NavBar from "../NavBar/NavBar";
import SideNav from "../SideNav/SideNav";
import Footer from "../Footer/Footer";
export default function MainLayout({ isLogin = false, children }) {
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
                    {children}
                    <Footer />
                </Col>
            </Row>
        </Container>
    )
}
