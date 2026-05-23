import { Row, Col, Container, Nav } from 'react-bootstrap'
import { Outlet, Link } from 'react-router-dom'
const pageList = [
    { name: "Notepad", link: 'take-note' },
    { name: "Todo-list", link: 'todo-list' },
    { name: "Catalog", link: 'catalog' },
    { name: "Archive", link: 'archive' }
]
export default function AppNotes() {
    return (
        <Container fluid className="pt-4 px-3 px-lg-4 bg-light mb-2 rounded">
            <Row>
                <Col xs={12} md={12}>
                    {pageList.map((item) => (
                        <Link className='border p-1 me-2 rounded text-decoration-none' key={item.link} to={item.link}>{item.name}</Link>
                    ))}
                    <hr />
                </Col>
            </Row>
            <Row className="g-3 mt-1">
                <Col xs={12} md={12}>
                    <main>
                        <Outlet />
                    </main>
                </Col>
            </Row>
        </Container>
    );
}