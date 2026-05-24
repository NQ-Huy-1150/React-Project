import { useState } from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import '../css/Styles.css'

function Todo({ obj, todos, setTodos }) {
    let newChecked;
    if (obj.checked) {
        newChecked = false;
    }
    else newChecked = true;
    const onChangeChecked = () => {
        setTodos(() =>
            todos.map(todo => (todo.id === obj.id ? { ...todo, checked: newChecked } : todo)
            )
        )
    };
    return (
        <>
            <Row>
                <Col xs={12} md={8}>
                    <input type="checkbox" checked={obj.checked} onChange={onChangeChecked} />
                    <span className='ms-2'>{!obj.checked ? obj.content : <del>{obj.content}</del>}</span>
                </Col>
                <Col xs={12} md={4}>
                    <Button className='me-3 ms-5' size='sm'>Edit</Button>
                    <Button size='sm'>Delete</Button>
                </Col>
            </Row>
        </>
    );
}

function ModalInput({ show, onHide, todo, todos, onTitleChange, onContentInput, title, onAddToList, setTodos }) {
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
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
                            <Button type="button" onClick={onAddToList} >Create new task</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={12}>
                            <ul>
                                {todos.map((obj) => (
                                    <li key={obj.id} className='mb-3'>
                                        <Todo obj={obj} setTodos={setTodos} todos={todos} />
                                    </li>
                                ))}
                            </ul>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button className='me-3' type='submit'>Save</Button>
                <Button variant='secondary' onClick={onHide}>Close</Button>
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
    const [error, setError] = useState(null);
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
                    setTodos([
                        ...todos,
                        { id: crypto.randomUUID(), ...todo }
                    ]);
                    setTodo({ content: '', checked: false });
                }}
                setTodos={setTodos}
            />
        </>


    );
}
