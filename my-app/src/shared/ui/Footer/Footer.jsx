import { Container, Row, Col, Button } from "react-bootstrap";
export default function Footer() {
    return (
        <footer className="bg-light border-top rounded mt-3">
            <Container className="py-4">
                <Row className="align-items-center g-3">
                    <Col xs={12} md={6}>
                        <div className="fw-semibold">Quản lý cá nhân</div>
                        <div className="text-muted">Xây dựng với React</div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}
