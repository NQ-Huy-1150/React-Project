import { useState, useRef, useEffect } from 'react';
import { Modal, Button, Card, Row, Col, Form } from 'react-bootstrap';
import { useLoaderData, useFetcher } from 'react-router-dom';
import '../css/Styles.css'
import GetTodoList from './TodolistForm';
import ShowCard from './CardLayout';
import CatalogDropdown from './CatalogDropdown';
import { getAllCatalog } from '../api/CatalogApi';
function Todo({ obj, setTodos }) {
    const [editing, setEditing] = useState(false);
    const onChangeChecked = () => {
        setTodos((prev) =>
            prev.map(todo => (todo.clientId === obj.clientId ? { ...todo, checked: !todo.checked } : todo)
            )
        )
    };
    const inputRef = useRef(null);
    const handleEdit = () => {
        setEditing(true);
    };
    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.setSelectionRange(
                inputRef.current.value.length,
                inputRef.current.value.length
            );
        }
    }, [editing]);
    const handleInputBlur = () => {
        setEditing(false);
    };
    const handleInputChange = (e) => {
        setTodos((prev) =>
            prev.map(todo => (todo.clientId === obj.clientId ? { ...todo, content: e.target.value } : todo)
            )
        )
    };
    const handleDelete = () => {
        setTodos((prev) => (
            prev.filter(todo => (
                todo.clientId !== obj.clientId
            ))
        ));
    }
    return (
        <>
            <Row>
                <Col xs={12} md={8}>
                    {!editing ? (
                        <>
                            <input type="checkbox" checked={obj.checked} onChange={onChangeChecked} />
                            <span className='ms-2'>{!obj.checked ? obj.content : <del>{obj.content}</del>}</span>
                        </>
                    ) : (
                        <>
                            <Form>
                                <input className='form-control'
                                    type="text" ref={inputRef}
                                    onBlur={handleInputBlur}
                                    onChange={handleInputChange}
                                    defaultValue={obj.content} />
                            </Form>
                        </>
                    )}
                </Col>
                <Col xs={12} md={4}>
                    <Button className='me-3 ms-5' size='sm' onClick={handleEdit}>Sửa</Button>
                    <Button size='sm' onClick={handleDelete}>Xóa</Button>
                </Col>
            </Row>
        </>
    );
}

function ModalInput({ show, onHide, todo, todos, onTitleChange,
    onContentInput, title, onAddToList, setTodos, setError,
    error, isSaving, fetcher, currentId, catalogId, setCatalogId, cataList }) {
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
            backdrop={isSaving ? "static" : undefined}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    <h4>{title || 'Danh sách chưa đặt tên'}</h4>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col xs={12} md={12}>
                            <input type="text"
                                placeholder='Tiêu đề...'
                                className='mb-3 form-control'
                                value={title}
                                onChange={onTitleChange}
                            />
                        </Col>
                        <Row className='mb-3'>
                            <Col xs={12} md={12}>
                                <CatalogDropdown list={cataList} onChangeCatalog={(dropId) => setCatalogId(dropId)} selectedCatalogId={catalogId} />
                            </Col>
                        </Row>
                    </Row>
                    <Row>
                        <Col xs={12} md={9}>
                            <input type="text"
                                placeholder='Thêm công việc tại đây'
                                className='mb-3 form-control'
                                value={todo.content}
                                onChange={onContentInput}
                            />
                        </Col>
                        <Col xs={12} md={3}>
                            <Button type="button" onClick={onAddToList}>Thêm công việc</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={12}>
                            <ul>
                                {todos.map((obj) => (
                                    <li key={obj.clientId} className='mb-3'>
                                        <Todo obj={obj} setTodos={setTodos} />
                                    </li>
                                ))}
                            </ul>
                            {error && <p className='fw-bold text-danger'>{error}</p>}
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <GetTodoList onHide={onHide} todos={todos} title={title} fetcher={fetcher} isSaving={isSaving} currentId={currentId} catalogId={catalogId} />
            </Modal.Footer>
        </Modal>
    );
}
export default function NoteTodolist() {
    const [title, setTitle] = useState('');
    const [todo, setTodo] = useState({
        id: null,
        content: '',
        checked: false
    });
    const [todos, setTodos] = useState([]);
    const [selectedList, setSelectedList] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [error, setError] = useState('');
    const [cataList, setCataList] = useState(null);
    const [currentId, setCurrentId] = useState(0);
    const [catalogId, setCatalogId] = useState(null);
    const openModalWithList = (list) => {
        setSelectedList(list);
        setCurrentId(list?.id || null);
        setModalShow(true);
    };

    const closeModal = () => {
        setModalShow(false);
        setSelectedList(null);
        setCurrentId(null);
        setCatalogId(null);
        setTitle('');
        setTodos([]);
        setTodo({ id: null, content: '', checked: false });
        setError('');
    };

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

        if (!selectedList) {
            setTitle('');
            setCatalogId(null);
            setTodos([]);
            setTodo({ id: null, content: '', checked: false });
            return;
        }

        const newList = Array.isArray(selectedList.todos)
            ? selectedList.todos.map((td) => ({
                ...td,
                clientId: crypto.randomUUID(),
            }))
            : [];

        setTitle(selectedList.title || '');
        setCatalogId(selectedList.catalogId ?? null);
        setTodos(newList);
        setTodo({ id: null, content: '', checked: false });
    }, [modalShow, selectedList]);

    const todolists = useLoaderData();
    const fetcher = useFetcher();
    const isSaving = fetcher.state !== "idle";
    const didSubmitRef = useRef(false);

    useEffect(() => {
        if (fetcher.data?.error) {
            setError(fetcher.data.error);
        }
        if (fetcher.data?.message) {
            setError('');
        }
    }, [fetcher.data]);

    useEffect(() => {
        if (isSaving) {
            didSubmitRef.current = true;
            return;
        }

        if (!didSubmitRef.current) return;
        didSubmitRef.current = false;

        if (fetcher.data?.error) return;

        if (modalShow) {
            closeModal();
        }
    }, [isSaving, fetcher.data, modalShow]);

    const handleCreateNewTodo = () => {
        openModalWithList(null);
        setCatalogId(null);
    }

    const handleDeleteTodoList = (id) => {
        if (!id) return;
        setError('');
        fetcher.submit(
            { intent: 'delete', id },
            { method: 'post' }
        );
    };

    return (
        <>
            <Row>
                <Col xs={12} md={12}>
                    <div className='d-flex justify-content-end'>
                        <Button variant="primary" onClick={handleCreateNewTodo}>
                            Tạo danh sách việc cần làm
                        </Button>
                    </div>
                    <ModalInput
                        show={modalShow}
                        title={title}
                        onHide={closeModal}
                        onTitleChange={(e) => {
                            setTitle(e.target.value);
                        }}
                        todo={todo}
                        todos={todos}
                        onContentInput={(e) => {
                            setTodo(todo => ({
                                ...todo,
                                content: e.target.value,
                            }))
                        }}
                        onAddToList={() => {
                            if (!todo.content.trim()) return;
                            setTodos((prev) => [
                                ...prev,
                                { ...todo, clientId: crypto.randomUUID() }
                            ]);
                            setTodo({ id: null, content: '', checked: false });
                        }}
                        setTodos={setTodos}
                        setError={setError}
                        error={error}
                        isSaving={isSaving}
                        fetcher={fetcher}
                        currentId={currentId}
                        catalogId={catalogId}
                        setCatalogId={setCatalogId}
                        cataList={cataList}
                    />
                </Col>
            </Row>
            <Row className='mt-2 justify-content-center'>
                {todolists.length > 0 ? (
                    todolists.map(todo => (
                        <ShowCard
                            key={todo.id}
                            todo={todo}
                            openModalWithList={openModalWithList}
                            onDelete={handleDeleteTodoList}
                            isSaving={isSaving}
                        />
                    ))
                ) : (
                    <Col xs={12}>
                        <Card className="border-0 bg-light">
                            <Card.Body className="text-center py-5">
                                <h5>Chưa có danh sách việc cần làm</h5>
                                <p className="text-muted">Tạo danh sách đầu tiên của bạn.</p>
                                <Button onClick={handleCreateNewTodo}>Tạo ngay</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>
        </>


    );
}
