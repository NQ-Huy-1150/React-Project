import { useState } from 'react'
import { Container, Nav, Navbar, NavDropdown, Form, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import AuthModal from '../Auth/AuthModal'
import ProfileModal from '../Profile/ProfileModal'
import reactLogo from '../../../assets/react.svg'

export default function AppNavBar({ isLogin, userData, onLoginSuccess, onLogout, onProfileUpdated }) {
  const [authModalShow, setAuthModalShow] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [profileModalShow, setProfileModalShow] = useState(false)

  const openAuthModal = (mode) => {
    setAuthMode(mode)
    setAuthModalShow(true)
  }

  const usernameLabel = userData?.username || userData?.email || 'Người dùng'

  return (
    <>
      <Navbar fixed='top' expand="lg" bg="light" data-bs-theme="light" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
            <img src={reactLogo} alt="React" width="28" height="28" />
            <span>Quản lý cá nhân</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" />
          <Form className="d-flex justify-content-center">
            <Form.Control
              size='sm'
              type="search"
              placeholder="Tìm kiếm..."
              className="me-2"
              aria-label="Tìm kiếm"
            />
            <Button size='sm' variant="outline-success" className='me-3'>Tìm</Button>
          </Form>
          <Nav className="me-auto">
            {!isLogin ? (
              <>
                <Nav.Link as="button" className="btn btn-link" onClick={() => openAuthModal('register')}>Đăng ký</Nav.Link>
                <Nav.Link as="button" className="btn btn-link" onClick={() => openAuthModal('login')}>Đăng nhập</Nav.Link>
              </>
            ) : (
              <NavDropdown title={usernameLabel} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => setProfileModalShow(true)}>Hồ sơ</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={onLogout}>Đăng xuất</NavDropdown.Item>
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
      <ProfileModal
        show={profileModalShow}
        onHide={() => setProfileModalShow(false)}
        onProfileUpdated={onProfileUpdated}
      />
    </>
  )
}
