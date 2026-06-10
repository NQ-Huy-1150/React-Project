import { Row, Col, Container } from 'react-bootstrap'
import { Outlet, Link } from 'react-router-dom'
const pageList = [
    { name: "Tổng quan", link: '/notes' },
    { name: "Ghi chú", link: '/notes/take-note' },
    { name: "Việc cần làm", link: '/notes/todo-list' },
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
            <Row className="g-3">
                <Col xs={12} md={12}>
                    <main>
                        <Outlet />
                    </main>
                </Col>
            </Row>
        </Container>
    );
}
