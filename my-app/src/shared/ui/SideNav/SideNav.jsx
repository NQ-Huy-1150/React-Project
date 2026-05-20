import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";

const navItems = [
    { label: "Case Converter", href: "#unit-converter" },
    { label: "Letter Counter", href: "" },
    { label: "Rent Calculator", href: "#rent-calculator" },
    { label: "Spend Tracker", href: "#spend-tracker" },
    { label: "Notes", href: "#notes" },
];

export default function SideNav() {
    return (
        <>
            <div className="d-none d-lg-block bg-light border rounded p-3">
                <div className="fw-semibold mb-2">Tool Categories</div>
                <Nav className="flex-column gap-2">
                    {navItems.map((item) => (
                        <Nav.Link key={item.href} href={item.href} className="px-0">
                            {item.label}
                        </Nav.Link>
                    ))}
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
                                {navItems.map((item) => (
                                    <Nav.Link key={item.href} href={item.href}>
                                        {item.label}
                                    </Nav.Link>
                                ))}
                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
        </>
    );
}