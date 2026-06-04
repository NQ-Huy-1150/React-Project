import { Modal, Button, Form } from 'react-bootstrap';
import { useState } from 'react';
function ModalInput({ show, onHide, note, onTitleChange, onContentInput, status }) {
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    <h4>{note.title || 'Untitled note'}</h4>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <input type="text"
                        placeholder='Title...'
                        className='mb-3 form-control'
                        value={note.title}
                        onChange={onTitleChange}
                        disabled={status === 'submiting'}
                    />
                </Form>
                <div className='form-control note-editor mb-3'
                    contentEditable
                    data-placeholder='Content...'
                    onInput={onContentInput}
                >
                </div>
                <Form.Group controlId="formFileMultiple" className="mb-3">
                    <Form.Control type="file" multiple />
                </Form.Group>

            </Modal.Body>
            <Modal.Footer>
                <Button>save</Button>
            </Modal.Footer>
        </Modal>
    );
}
export default function NoteCatalog() {
    const [note, setNote] = useState({
        title: '',
        contentText: ''
    });
    const [modalShow, setModalShow] = useState(false);
    const [status, setStatus] = useState('typing');
    const [error, setError] = useState(null);
    if (status === 'success') {
        return alert('Save successfully !');
    }
    return (
        <>
            <div className='d-flex justify-content-end'>
                <Button variant="primary" onClick={() => setModalShow(true)}>
                    Create a notepad
                </Button>
            </div>
            <ModalInput
                status={status}
                show={modalShow}
                onHide={() => {
                    setModalShow(false);
                    setNote({
                        title: '',
                        contentText: ''
                    })
                }}
                note={note}
                onTitleChange={(e) => {
                    setNote((note) => ({ ...note, title: e.target.value }));
                }}
                onContentInput={(e) => {
                    const el = e.currentTarget;
                    if (!el.textContent?.trim()) {
                        el.innerHTML = '';
                    }
                    setNote((note) => ({
                        ...note,
                        contentText: el.innerText
                    }));
                }}
            />
        </>


    ); s
}