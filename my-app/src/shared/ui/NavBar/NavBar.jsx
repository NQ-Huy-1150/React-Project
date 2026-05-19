import { Container, Nav, Navbar, NavDropdown, Form, Button } from 'react-bootstrap'

export default function AppNavBar({ isLogin }) {
  return (
    <Navbar fixed='top' expand="lg" bg="light" data-bs-theme="light" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#homepage">Life Manager</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" />
        <Form className="d-flex justify-content-center">
          <Form.Control
            size='sm'
            type="search"
            placeholder="Search something"
            className="me-2"
            aria-label="Search"
          />
          <Button size='sm' variant="outline-success" className='me-3'>Search</Button>
        </Form>
        <Nav className="me-auto">
          {!isLogin ? (
            <>
              <Nav.Link href=''>Sign up</Nav.Link>
              <Nav.Link href="">Login</Nav.Link>
            </>
          ) : (
            <NavDropdown title="Username(email)" id="basic-nav-dropdown">
              <NavDropdown.Item href="">Profile</NavDropdown.Item>
              <NavDropdown.Item href="">Settings</NavDropdown.Item>
              <NavDropdown.Item href="">History</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="">Logout</NavDropdown.Item>
            </NavDropdown>
          )}
        </Nav>
      </Container>
    </Navbar>
  )
}
