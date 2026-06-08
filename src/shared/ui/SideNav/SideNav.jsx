import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";

const navItems = [
    { label: "Case Converter", href: "#unit-converter", id: "caseConverter" },
    { label: "Letter Counter", href: "#letter-counter", id: "letterCounter" },
    { label: "Rent Calculator", href: "#rent-calculator", id: "rentCalculator" },
    { label: "Spend Tracker", href: "#spend-tracker", id: "spendTracker" },
    { label: "Notes", href: "#notes", id: "notes" },
];

export default function SideNav({ setCurrentPage }) {
    const handleNavClick = (id) => {
        if (setCurrentPage) {
            setCurrentPage(id);
        }
    };

    return (
        <>
            <div className="d-none d-lg-block bg-light border rounded p-3">
                <div className="fw-semibold mb-2">Tool Categories</div>
                <Nav className="flex-column gap-2">
                    {navItems.map((item) => (
                        <Nav.Link 
                            key={item.id} 
                            href={item.href} 
                            className="px-0"
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavClick(item.id);
                            }}
                        >
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
                                    <Nav.Link 
                                        key={item.id} 
                                        href={item.href}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleNavClick(item.id);
                                        }}
                                    >
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