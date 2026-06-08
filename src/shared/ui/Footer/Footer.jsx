import { Container, Row, Col, Button } from "react-bootstrap";
export default function Footer() {
    return (
        <footer className="bg-light border-top rounded">
            <Container className="py-4">
                <Row className="align-items-center g-3">
                    <Col xs={12} md={6}>
                        <div className="fw-semibold">Life Manager</div>
                        <div className="text-muted">Built with React</div>
                    </Col>
                    <Col xs={12} md={6} className="text-md-end">
                        <div className="d-flex flex-column flex-md-row gap-2 justify-content-md-end align-items-md-center">
                            <span>Register for free</span>
                            <Button size="sm" variant="primary">Sign Up</Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}