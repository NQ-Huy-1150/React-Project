import { Card, Button, ListGroup } from 'react-bootstrap';
import { Fragment, useState } from 'react';
import { GetDeleteById } from '../api/NotePadApi';
export default function ShowNoteCard({ note, openModalWithNote }) {
    const handleUpdate = () => {
        openModalWithNote(note);
    }
    const handleDelete = () => {
        GetDeleteById(note.id);
    }
    return (
        <Card className='me-3 mt-2' style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{note.title}</Card.Title>
                <p>{note.content}</p>
            </Card.Body>
            <Card.Footer>
                <div className="d-flex justify-content-center align-items-center">
                    <Button className="me-2" size='sm' variant="warning" onClick={handleUpdate}>Update</Button>
                    <Button size='sm' variant="danger" onClick={handleDelete}>Delete</Button>
                </div>
            </Card.Footer>
        </Card>
    );
}
