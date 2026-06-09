import { useEffect, useRef, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Modal, Row } from 'react-bootstrap';
import { useFetcher, useLoaderData } from 'react-router-dom';

const initialForm = {
    id: null,
    month: '',
    housePrice: '',
    amoutOfElectric: '',
    electricityPrice: '',
    amoutOfWater: '',
    waterPrice: '',
    serviceCosts: '',
    othercosts: '',
};

const moneyFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
});

const formatMoney = (value) => moneyFormatter.format(value || 0);

const toNumber = (value) => {
    if (value === '' || value == null) return 0;
    return Number(value);
};

const fillFormFromExpense = (expense) => ({
    id: expense.id,
    month: expense.month || '',
    housePrice: expense.housePrice ?? '',
    amoutOfElectric: expense.amoutOfElectric ?? '',
    electricityPrice: expense.electricityPrice ?? '',
    amoutOfWater: expense.amoutOfWater ?? '',
    waterPrice: expense.waterPrice ?? '',
    serviceCosts: expense.serviceCosts ?? '',
    othercosts: expense.othercosts ?? '',
});

function ExpenseCard({ expense, onEdit, onDelete, isSaving }) {
    return (
        <Card className="h-100 shadow-sm border-0">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <Card.Title className="mb-1">Rent expense</Card.Title>
                        <Card.Subtitle className="text-muted">{expense.month || 'No month'}</Card.Subtitle>
                    </div>
                    <Badge bg="primary">{formatMoney(expense.total)}</Badge>
                </div>

                <Row className="g-3 small">
                    <Col xs={6}>
                        <div className="text-muted">House</div>
                        <strong>{formatMoney(expense.housePrice)}</strong>
                    </Col>
                    <Col xs={6}>
                        <div className="text-muted">Service</div>
                        <strong>{formatMoney(expense.serviceCosts)}</strong>
                    </Col>
                    <Col xs={6}>
                        <div className="text-muted">Electricity</div>
                        <strong>{formatMoney(expense.electricityBill)}</strong>
                    </Col>
                    <Col xs={6}>
                        <div className="text-muted">Water</div>
                        <strong>{formatMoney(expense.waterBill)}</strong>
                    </Col>
                    <Col xs={12}>
                        <div className="text-muted">Other costs</div>
                        <strong>{formatMoney(expense.othercosts)}</strong>
                    </Col>
                </Row>
            </Card.Body>

            <Card.Footer className="bg-white border-0">
                <div className="d-flex justify-content-end gap-2">
                    <Button size="sm" variant="warning" onClick={() => onEdit(expense)} disabled={isSaving}>
                        Update
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => onDelete(expense.id)} disabled={isSaving}>
                        Delete
                    </Button>
                </div>
            </Card.Footer>
        </Card>
    );
}

export default function AppRentCalculator() {
    const expenses = useLoaderData();
    const fetcher = useFetcher();
    const isSaving = fetcher.state !== 'idle';

    const [form, setForm] = useState(initialForm);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [error, setError] = useState('');
    const didSubmitRef = useRef(false);

    const electricityBill = toNumber(form.amoutOfElectric) * toNumber(form.electricityPrice);
    const waterBill = toNumber(form.amoutOfWater) * toNumber(form.waterPrice);
    const previewTotal = toNumber(form.housePrice)
        + electricityBill
        + waterBill
        + toNumber(form.serviceCosts)
        + toNumber(form.othercosts);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const openCreateModal = () => {
        setSelectedExpense(null);
        setForm(initialForm);
        setError('');
        setModalShow(true);
    };

    const openUpdateModal = (expense) => {
        setSelectedExpense(expense);
        setForm(fillFormFromExpense(expense));
        setError('');
        setModalShow(true);
    };

    const closeModal = () => {
        setModalShow(false);
        setSelectedExpense(null);
        setForm(initialForm);
    };

    const handleDelete = (id) => {
        if (!id) return;
        setError('');
        fetcher.submit(
            { intent: 'delete', id },
            { method: 'post' }
        );
    };

    useEffect(() => {
        if (fetcher.data?.error) {
            setError(fetcher.data.error);
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

    return (
        <>
            <Row className="align-items-center mb-3">
                <Col>
                    <h3 className="mb-1">Rent Calculator</h3>
                    <p className="text-muted mb-0">
                        Track house rent, utility usage, service costs and monthly total.
                    </p>
                </Col>
                <Col xs="auto">
                    <Button onClick={openCreateModal}>Create rent expense</Button>
                </Col>
            </Row>

            {error && !modalShow && <Alert variant="danger">{error}</Alert>}

            <Row className="g-3">
                {expenses.length > 0 ? (
                    expenses.map((expense) => (
                        <Col xs={12} md={6} xl={4} key={expense.id}>
                            <ExpenseCard
                                expense={expense}
                                onEdit={openUpdateModal}
                                onDelete={handleDelete}
                                isSaving={isSaving}
                            />
                        </Col>
                    ))
                ) : (
                    <Col xs={12}>
                        <Card className="border-0 bg-light">
                            <Card.Body className="text-center py-5">
                                <h5>No rent expense yet</h5>
                                <p className="text-muted">Create your first monthly rent calculation.</p>
                                <Button onClick={openCreateModal}>Create now</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>

            <Modal
                show={modalShow}
                onHide={closeModal}
                size="lg"
                centered
                backdrop={isSaving ? 'static' : undefined}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {selectedExpense ? 'Update rent expense' : 'Create rent expense'}
                    </Modal.Title>
                </Modal.Header>

                <fetcher.Form method="post">
                    <Modal.Body>
                        {error && <Alert variant="danger">{error}</Alert>}

                        <input type="hidden" name="intent" value="save" />
                        <input type="hidden" name="id" value={form.id || ''} />

                        <Row className="g-3">
                            <Col xs={12} md={6}>
                                <Form.Group controlId="rentMonth">
                                    <Form.Label>Month</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="month"
                                        value={form.month}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group controlId="housePrice">
                                    <Form.Label>House price</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        step="any"
                                        name="housePrice"
                                        value={form.housePrice}
                                        onChange={handleInputChange}
                                        placeholder="Rent price"
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={12} md={6}>
                                <Form.Group controlId="amoutOfElectric">
                                    <Form.Label>Amount of electric</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        step="any"
                                        name="amoutOfElectric"
                                        value={form.amoutOfElectric}
                                        onChange={handleInputChange}
                                        placeholder="kWh"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group controlId="electricityPrice">
                                    <Form.Label>Electricity price</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        step="any"
                                        name="electricityPrice"
                                        value={form.electricityPrice}
                                        onChange={handleInputChange}
                                        placeholder="Price per kWh"
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={12} md={6}>
                                <Form.Group controlId="amoutOfWater">
                                    <Form.Label>Amount of water</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        step="any"
                                        name="amoutOfWater"
                                        value={form.amoutOfWater}
                                        onChange={handleInputChange}
                                        placeholder="m3"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group controlId="waterPrice">
                                    <Form.Label>Water price</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        step="any"
                                        name="waterPrice"
                                        value={form.waterPrice}
                                        onChange={handleInputChange}
                                        placeholder="Price per m3"
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={12} md={6}>
                                <Form.Group controlId="serviceCosts">
                                    <Form.Label>Service costs</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        step="any"
                                        name="serviceCosts"
                                        value={form.serviceCosts}
                                        onChange={handleInputChange}
                                        placeholder="Service fee"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group controlId="othercosts">
                                    <Form.Label>Other costs</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        step="any"
                                        name="othercosts"
                                        value={form.othercosts}
                                        onChange={handleInputChange}
                                        placeholder="Other costs"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Card className="bg-light border-0 mt-4">
                            <Card.Body>
                                <Row className="text-center g-3">
                                    <Col xs={12} md={4}>
                                        <div className="text-muted small">Electricity bill</div>
                                        <strong>{formatMoney(electricityBill)}</strong>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <div className="text-muted small">Water bill</div>
                                        <strong>{formatMoney(waterBill)}</strong>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <div className="text-muted small">Estimated total</div>
                                        <strong className="text-primary">{formatMoney(previewTotal)}</strong>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" type="button" onClick={closeModal} disabled={isSaving}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit" disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                    </Modal.Footer>
                </fetcher.Form>
            </Modal>
        </>
    );
}
