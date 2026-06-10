import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function SideNav() {
    return (
        <>
            <div className="d-none d-lg-block bg-light border rounded p-3">
                <div className="fw-semibold mb-2">Danh mục công cụ</div>
                <Nav className="flex-column gap-2">
                    <Nav.Link as={Link} to='case-converter'>Chuyển đổi chữ</Nav.Link>
                    <Nav.Link as={Link} to='rent-calculator' >Tính tiền thuê nhà</Nav.Link>
                    <Nav.Link as={Link} to='letter-counter' >Đếm ký tự</Nav.Link>
                    <Nav.Link as={Link} to='spend-tracker' >Theo dõi chi tiêu</Nav.Link>
                    <Nav.Link as={Link} to='notes' >Ghi chú</Nav.Link>
                </Nav>
            </div>

            <Navbar bg="light" expand={false} className="d-lg-none mb-3">
                <Container fluid>
                    <Navbar.Toggle aria-controls="sidebar-nav" />
                    <Navbar.Offcanvas id="sidebar-nav" placement="start">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>Danh mục công cụ</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className="flex-column gap-2">
                                <Nav.Link as={Link} to='case-converter'>Chuyển đổi chữ</Nav.Link>
                                <Nav.Link as={Link} to='rent-calculator' >Tính tiền thuê nhà</Nav.Link>
                                <Nav.Link as={Link} to='letter-counter' >Đếm ký tự</Nav.Link>
                                <Nav.Link as={Link} to='spend-tracker' >Theo dõi chi tiêu</Nav.Link>
                                <Nav.Link as={Link} to='notes' >Ghi chú</Nav.Link>
                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
        </>
    );
}
