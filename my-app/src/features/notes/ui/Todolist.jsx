import { useState, useRef, useEffect } from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import '../css/Styles.css'
import GetTodoList from './TodolistForm';

function Todo({ obj, setTodos }) {
    const [editing, setEditing] = useState(false);
    const onChangeChecked = () => {
        setTodos((prev) =>
            prev.map(todo => (todo.id === obj.id ? { ...todo, checked: !todo.checked } : todo)
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
            prev.map(todo => (todo.id === obj.id ? { ...todo, content: e.target.value } : todo)
            )
        )
    };
    const handleDelete = () => {
        setTodos((prev) => (
            prev.filter(todo => (
                todo.id !== obj.id
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
                    <Button className='me-3 ms-5' size='sm' onClick={handleEdit}>Edit</Button>
                    <Button size='sm' onClick={handleDelete}>Delete</Button>
                </Col>
            </Row>
        </>
    );
}

function ModalInput({ show, onHide, todo, todos, onTitleChange, onContentInput, title, onAddToList, setTodos, setError, error, status, setStatus }) {
    const handleResetError = () => {
        setError('');
    }
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
            backdrop={status === 'submitting' ? "static" : undefined}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    <h4>{title || 'Untitled'}</h4>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col xs={12} md={12}>
                            <input type="text"
                                placeholder='Title...'
                                className='mb-3 form-control'
                                value={title}
                                onChange={onTitleChange}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={9}>
                            <input type="text"
                                placeholder='Add your task here '
                                className='mb-3 form-control'
                                value={todo.content}
                                onChange={onContentInput}
                            />
                        </Col>
                        <Col xs={12} md={3}>
                            <Button type="button" onClick={onAddToList} onChange={handleResetError}>Create new task</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={12}>
                            <ul>
                                {todos.map((obj) => (
                                    <li key={obj.id} className='mb-3'>
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
                <GetTodoList onHide={onHide} todos={todos} title={title} setError={setError} setStatus={setStatus} />
            </Modal.Footer>
        </Modal>
    );
}
export default function NoteTodolist() {
    const [title, setTitle] = useState('');
    const [todo, setTodo] = useState({
        content: '',
        checked: false
    });
    const [todos, setTodos] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('typing');
    return (
        <>
            <div className='d-flex justify-content-end'>
                <Button variant="primary" onClick={() => setModalShow(true)}>
                    Create a new Todo-list
                </Button>
            </div>
            <ModalInput
                show={modalShow}
                title={title}
                onHide={() => {
                    setModalShow(false);
                }}
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
                        { id: crypto.randomUUID(), ...todo }
                    ]);
                    setTodo({ content: '', checked: false });
                }}
                setTodos={setTodos}
                setError={setError}
                error={error}
                status={status}
                setStatus={setStatus}
            />
        </>


    );
}
