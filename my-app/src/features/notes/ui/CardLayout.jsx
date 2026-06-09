import { Card, Button, ListGroup } from 'react-bootstrap';
import { Fragment } from 'react';

export default function ShowCard({ todo, openModalWithList, onDelete, isSaving }) {
    const handleUpdate = () => {
        openModalWithList(todo);
    }
    const handleDelete = () => {
        onDelete(todo.id);
    }
    return (
        <Card className='me-3 mt-2' style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{todo.title}</Card.Title>
                {todo.todos.map(td => (
                    <Fragment key={td.id}>
                        <ListGroup.Item>
                            <input type="checkbox" defaultChecked={td.checked} />
                            <span className='ms-2'>{!td.checked ? td.content : <del>{td.content}</del>}</span>
                        </ListGroup.Item>
                    </Fragment>
                ))}
            </Card.Body>
            <Card.Footer>
                <div className="d-flex justify-content-center align-items-center">
                    <Button className="me-2" size='sm' variant="warning" onClick={handleUpdate} disabled={isSaving}>Update</Button>
                    <Button size='sm' variant="danger" onClick={handleDelete} disabled={isSaving}>Delete</Button>
                </div>
            </Card.Footer>
        </Card>
    );
}
