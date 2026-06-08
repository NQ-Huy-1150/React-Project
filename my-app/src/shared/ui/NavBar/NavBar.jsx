import { useState } from 'react'
import { Container, Nav, Navbar, NavDropdown, Form, Button } from 'react-bootstrap'
import AuthModal from '../Auth/AuthModal'

export default function AppNavBar({ isLogin, userData, onLoginSuccess, onLogout }) {
  const [authModalShow, setAuthModalShow] = useState(false)
  const [authMode, setAuthMode] = useState('login')

  const openAuthModal = (mode) => {
    setAuthMode(mode)
    setAuthModalShow(true)
  }

  const usernameLabel = userData?.username || userData?.email || 'User'

  return (
    <>
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
                <Nav.Link as="button" className="btn btn-link" onClick={() => openAuthModal('register')}>Sign up</Nav.Link>
                <Nav.Link as="button" className="btn btn-link" onClick={() => openAuthModal('login')}>Login</Nav.Link>
              </>
            ) : (
              <NavDropdown title={usernameLabel} id="basic-nav-dropdown">
                <NavDropdown.Item href="">Profile</NavDropdown.Item>
                <NavDropdown.Item href="">Settings</NavDropdown.Item>
                <NavDropdown.Item href="">History</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Container>
      </Navbar>
      <AuthModal
        mode={authMode}
        show={authModalShow}
        onHide={() => setAuthModalShow(false)}
        onLoginSuccess={onLoginSuccess}
        onSwitchMode={setAuthMode}
      />
    </>
  )
}
