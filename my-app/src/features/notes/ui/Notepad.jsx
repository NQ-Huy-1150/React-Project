import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Form } from 'react-router-dom'
import '../css/Styles.css'

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
                <div className='form-control note-editor'
                    contentEditable
                    data-placeholder='Content...'
                    onInput={onContentInput}
                >
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Form action=''>
                    <input className='d-none' type='text' value={note.title == '' ? 'Untitled note' : note.title} readOnly />
                    <textarea className='d-none' value={note.contentText} readOnly></textarea>
                    <Button className='me-3'
                        type='submit'
                        disabled={
                            note.contentText.length === 0 || status === 'submitting'
                        }
                    >Save</Button>
                    <Button variant='secondary' onClick={onHide}>Close</Button>
                </Form>
            </Modal.Footer>
        </Modal>
    );
}
export default function NotePad() {
    const [note, setNote] = useState({
        title: '',
        contentText: '',
        contentHtml: '',
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
                        contentText: '',
                        contentHtml: '',
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
                        contentText: el.innerText,
                        contentHtml: el.innerHTML,
                    }));
                }}
            />
        </>


    );
}
