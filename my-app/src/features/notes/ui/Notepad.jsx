import { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import GetNotePadForm from './NotePadForm';
import '../css/Styles.css'
import CatalogDropdown from './CatalogDropdown';
import { useLoaderData } from 'react-router-dom';
import ShowNoteCard from './NotePadCardLayout';
import { getAllCatalog } from '../api/CatalogApi';

function ModalInput({ show, onHide, note, onTitleChange,
    onContentInput, status, currentId, catalogId, setCatalogId, cataList }) {
    const contentRef = useRef(null);

    useEffect(() => {
        if (!show || !contentRef.current) return;

        contentRef.current.innerText = note.contentText || '';
    }, [show, note.id]);

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
                <Row>
                    <Col xs={12} md={12}>
                        <Form>
                            <input type="text"
                                placeholder='Title...'
                                className='mb-3 form-control'
                                value={note.title}
                                onChange={onTitleChange}
                                disabled={status === 'submiting'}
                            />
                        </Form>
                    </Col>
                </Row>
                <Row className='mb-3'>
                    <Col xs={12} md={12}>
                        <CatalogDropdown list={cataList} onChangeCatalog={(dropId) => setCatalogId(dropId)} selectedCatalogId={catalogId} />
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={12}>
                        <div className='form-control note-editor mb-3'
                            contentEditable
                            ref={contentRef}
                            suppressContentEditableWarning
                            data-placeholder='Content...'
                            onInput={onContentInput}
                        >
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <GetNotePadForm note={note} onHide={onHide} status={status} currentId={currentId} catalogId={catalogId} />
            </Modal.Footer>
        </Modal>
    );
}
export default function NotePad() {
    const [note, setNote] = useState({
        id: null,
        title: '',
        contentText: '',
    });
    const [modalShow, setModalShow] = useState(false);
    const [status, setStatus] = useState('typing');
    const [error, setError] = useState(null);
    const [selectedNote, setSelectedNote] = useState(null);
    const [cataList, setCataList] = useState(null);
    const [currentId, setCurrentId] = useState(0);
    const [catalogId, setCatalogId] = useState(null);
    if (status === 'success') {
        return alert('Save successfully !');
    }
    const openModalWithNote = (note) => {
        setSelectedNote(note);
        setCurrentId(note?.id || null);
        setModalShow(true);
    }
    const notes = useLoaderData();

    useEffect(() => {
        if (!modalShow) return;

        async function loadCatalogs() {
            try {
                const data = await getAllCatalog();
                setCataList(data);
            } catch (err) {
                console.error(err);
            }
        }

        loadCatalogs();
    }, [modalShow]);

    useEffect(() => {
        if (!modalShow) return;

        if (!selectedNote) {
            setNote({ id: null, title: '', contentText: '' })
            setCatalogId(null);
            return;
        }
        setNote({ id: selectedNote.id, title: selectedNote.title, contentText: selectedNote.content });
        setCatalogId(selectedNote.catalogId ?? null);
    }, [modalShow, selectedNote]);
    const handleCreateNotePad = () => {
        openModalWithNote(null);
        setCatalogId(null);
    }
    return (
        <>
            <Row>
                <Col xs={12} md={12}>
                    <div className='d-flex justify-content-end'>
                        <Button variant="primary" onClick={handleCreateNotePad}>
                            Create a notepad
                        </Button>
                    </div>
                    <ModalInput
                        status={status}
                        show={modalShow}
                        onHide={() => {
                            setModalShow(false);
                            setNote({ id: null, title: '', contentText: '' })
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
                        cataList={cataList}
                        currentId={currentId}
                        catalogId={catalogId}
                        setCatalogId={setCatalogId}

                    />
                </Col>
            </Row>

            <Row>
                {notes.map(note =>
                    <ShowNoteCard key={note.id} note={note} openModalWithNote={openModalWithNote} />
                )}
            </Row>

        </>


    );
}
