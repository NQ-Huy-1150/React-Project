import { useMemo, useState } from 'react';
import { Badge, Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
import { Link, useLoaderData } from 'react-router-dom';

const ALL_CATALOGS = 'all';
const UNCATEGORIZED = 'uncategorized';

function NotePreview({ note }) {
    return (
        <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
                <Badge bg="primary" className="mb-2">Notepad</Badge>
                <Card.Title>{note.title || 'Untitled note'}</Card.Title>
                <Card.Text className="text-muted">
                    {note.content || 'No content'}
                </Card.Text>
            </Card.Body>
            <Card.Footer className="bg-white border-0">
                <Button as={Link} to="/notes/take-note" size="sm" variant="outline-primary">
                    Open notepad
                </Button>
            </Card.Footer>
        </Card>
    );
}

function TodoPreview({ todoList }) {
    return (
        <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
                <Badge bg="success" className="mb-2">Todo-list</Badge>
                <Card.Title>{todoList.title || 'Untitled todo list'}</Card.Title>
                <ListGroup variant="flush">
                    {(todoList.todos || []).slice(0, 3).map((todo) => (
                        <ListGroup.Item key={todo.id} className="px-0">
                            <input type="checkbox" className="me-2" checked={todo.checked} readOnly />
                            {!todo.checked ? todo.content : <del>{todo.content}</del>}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Card.Body>
            <Card.Footer className="bg-white border-0">
                <Button as={Link} to="/notes/todo-list" size="sm" variant="outline-success">
                    Open todo-list
                </Button>
            </Card.Footer>
        </Card>
    );
}

export default function NoteCatalog() {
    const { catalogs = [], notes = [], todoLists = [] } = useLoaderData();
    const [selectedCatalog, setSelectedCatalog] = useState(ALL_CATALOGS);

    const filteredData = useMemo(() => {
        if (selectedCatalog === ALL_CATALOGS) {
            return { notes, todoLists };
        }

        if (selectedCatalog === UNCATEGORIZED) {
            return {
                notes: notes.filter((note) => note.catalogId == null),
                todoLists: todoLists.filter((todoList) => todoList.catalogId == null),
            };
        }

        const catalogId = Number(selectedCatalog);
        return {
            notes: notes.filter((note) => note.catalogId === catalogId),
            todoLists: todoLists.filter((todoList) => todoList.catalogId === catalogId),
        };
    }, [selectedCatalog, notes, todoLists]);

    const hasRecords = filteredData.notes.length > 0 || filteredData.todoLists.length > 0;

    return (
        <>
            <Row className="align-items-center mb-3">
                <Col xs={12} md={7}>
                    <h4 className="mb-1">Notes overview</h4>
                    <p className="text-muted mb-0">Filter notepads and todo-lists by catalog.</p>
                </Col>
                <Col xs={12} md={5} className="text-md-end mt-3 mt-md-0">
                    <Button as={Link} to="/notes/take-note" className="me-2" size="sm">
                        New note
                    </Button>
                    <Button as={Link} to="/notes/todo-list" variant="outline-primary" size="sm">
                        New todo-list
                    </Button>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col xs={12}>
                    <div className="d-flex flex-wrap gap-2">
                        <Button
                            size="sm"
                            variant={selectedCatalog === ALL_CATALOGS ? 'primary' : 'outline-primary'}
                            onClick={() => setSelectedCatalog(ALL_CATALOGS)}
                        >
                            All
                        </Button>
                        <Button
                            size="sm"
                            variant={selectedCatalog === UNCATEGORIZED ? 'secondary' : 'outline-secondary'}
                            onClick={() => setSelectedCatalog(UNCATEGORIZED)}
                        >
                            No catalog
                        </Button>
                        {catalogs.map((catalog) => (
                            <Button
                                key={catalog.id}
                                size="sm"
                                variant={selectedCatalog === String(catalog.id) ? 'dark' : 'outline-dark'}
                                onClick={() => setSelectedCatalog(String(catalog.id))}
                            >
                                {catalog.title}
                            </Button>
                        ))}
                    </div>
                </Col>
            </Row>

            {!hasRecords ? (
                <Card className="border-0 bg-light">
                    <Card.Body className="text-center py-5">
                        <h5>No record yet</h5>
                        <p className="text-muted">Create a notepad or todo-list for this catalog.</p>
                    </Card.Body>
                </Card>
            ) : (
                <>
                    <Row className="g-3 mb-4">
                        {filteredData.notes.map((note) => (
                            <Col xs={12} md={6} lg={4} key={`note-${note.id}`}>
                                <NotePreview note={note} />
                            </Col>
                        ))}
                    </Row>

                    <Row className="g-3">
                        {filteredData.todoLists.map((todoList) => (
                            <Col xs={12} md={6} lg={4} key={`todo-${todoList.id}`}>
                                <TodoPreview todoList={todoList} />
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </>
    );
}
