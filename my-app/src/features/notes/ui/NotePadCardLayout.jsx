import { Card, Button } from 'react-bootstrap';

export default function ShowNoteCard({ note, openModalWithNote, onDelete, isSaving }) {
    const handleUpdate = () => {
        openModalWithNote(note);
    }
    const handleDelete = () => {
        onDelete(note.id);
    }
    return (
        <Card className='me-3 mt-2' style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{note.title}</Card.Title>
                <p>{note.content}</p>
            </Card.Body>
            <Card.Footer>
                <div className="d-flex justify-content-center align-items-center">
                    <Button className="me-2" size='sm' variant="warning" onClick={handleUpdate} disabled={isSaving}>Sửa</Button>
                    <Button size='sm' variant="danger" onClick={handleDelete} disabled={isSaving}>Xóa</Button>
                </div>
            </Card.Footer>
        </Card>
    );
}
