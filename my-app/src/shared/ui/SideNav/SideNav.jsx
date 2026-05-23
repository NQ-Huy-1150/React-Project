import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function SideNav() {
    return (
        <>
            <div className="d-none d-lg-block bg-light border rounded p-3">
                <div className="fw-semibold mb-2">Tool Categories</div>
                <Nav className="flex-column gap-2">
                    <Nav.Link as={Link} to='case-converter'>Case Converter</Nav.Link>
                    <Nav.Link as={Link} to='rent-calculator' >Rent Calculator</Nav.Link>
                    <Nav.Link as={Link} to='letter-counter' >Letter Counter</Nav.Link>
                    <Nav.Link as={Link} to='spend-tracker' >Spend Tracker</Nav.Link>
                    <Nav.Link as={Link} to='notes' >Notes</Nav.Link>
                </Nav>
            </div>

            <Navbar bg="light" expand={false} className="d-lg-none mb-3">
                <Container fluid>
                    <Navbar.Toggle aria-controls="sidebar-nav" />
                    <Navbar.Offcanvas id="sidebar-nav" placement="start">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>Tool Categories</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className="flex-column gap-2">
                                <Nav.Link as={Link} to='case-converter'>Case Converter</Nav.Link>
                                <Nav.Link as={Link} to='rent-calculator' >Rent Calculator</Nav.Link>
                                <Nav.Link as={Link} to='letter-counter' >Letter Counter</Nav.Link>
                                <Nav.Link as={Link} to='spend-tracker' >Spend Tracker</Nav.Link>
                                <Nav.Link as={Link} to='notes' >Notes</Nav.Link>
                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
        </>
    );
}
