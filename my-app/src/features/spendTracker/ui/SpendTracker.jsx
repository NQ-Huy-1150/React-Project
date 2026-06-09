import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Modal, Row } from 'react-bootstrap';
import { useFetcher, useLoaderData } from 'react-router-dom';

const initialForm = {
    id: null,
    month: '',
    totalIncome: '',
    houseCost: '',
    foodCost: '',
    traveCost: '',
    otherCost1: '',
    otherCost2: '',
    otherCost3: '',
    savingAndInvestment: '',
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
    totalIncome: expense.totalIncome ?? '',
    houseCost: expense.houseCost ?? '',
    foodCost: expense.foodCost ?? '',
    traveCost: expense.traveCost ?? '',
    otherCost1: expense.otherCost1 ?? '',
    otherCost2: expense.otherCost2 ?? '',
    otherCost3: expense.otherCost3 ?? '',
    savingAndInvestment: expense.savingAndInvestment ?? '',
});

function ExpenseCard({ expense, onEdit, onDelete, isSaving }) {
    const remainingAmount = expense.RemaningAmount ?? expense.remaningAmount ?? 0;

    return (
        <Card className="h-100 shadow-sm border-0">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <Card.Title className="mb-1">Spend tracker</Card.Title>
                        <Card.Subtitle className="text-muted">{expense.month || 'No month'}</Card.Subtitle>
                    </div>
                    <Badge bg={remainingAmount >= 0 ? 'success' : 'danger'}>
                        {formatMoney(remainingAmount)}
                    </Badge>
                </div>

                <Row className="g-3 small">
                    <Col xs={6}>
                        <div className="text-muted">Income</div>
                        <strong>{formatMoney(expense.totalIncome)}</strong>
                    </Col>
                    <Col xs={6}>
                        <div className="text-muted">House</div>
                        <strong>{formatMoney(expense.houseCost)}</strong>
                    </Col>
                    <Col xs={6}>
                        <div className="text-muted">Food</div>
                        <strong>{formatMoney(expense.foodCost)}</strong>
                    </Col>
                    <Col xs={6}>
                        <div className="text-muted">Travel</div>
                        <strong>{formatMoney(expense.traveCost)}</strong>
                    </Col>
                    <Col xs={6}>
                        <div className="text-muted">Saving</div>
                        <strong>{formatMoney(expense.savingAndInvestment)}</strong>
                    </Col>
                    <Col xs={6}>
                        <div className="text-muted">Other</div>
                        <strong>{formatMoney(
                            toNumber(expense.otherCost1)
                            + toNumber(expense.otherCost2)
                            + toNumber(expense.otherCost3)
                        )}</strong>
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

export default function AppSpendTracker() {
    const expenses = useLoaderData();
    const fetcher = useFetcher();
    const isSaving = fetcher.state !== 'idle';

    const [form, setForm] = useState(initialForm);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [error, setError] = useState('');

    const totalCosts = toNumber(form.houseCost)
        + toNumber(form.foodCost)
        + toNumber(form.traveCost)
        + toNumber(form.otherCost1)
        + toNumber(form.otherCost2)
        + toNumber(form.otherCost3)
        + toNumber(form.savingAndInvestment);
    const previewRemaining = toNumber(form.totalIncome) - totalCosts;

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
        if (fetcher.state !== 'idle' || !fetcher.formData) return;
        if (fetcher.data?.error) return;

        if (modalShow) {
            closeModal();
        }
    }, [fetcher.state, fetcher.formData, fetcher.data, modalShow]);

    return (
        <>
            <Row className="align-items-center mb-3">
                <Col>
                    <h3 className="mb-1">Spend Tracker</h3>
                    <p className="text-muted mb-0">
                        Track monthly income, daily costs, savings and remaining amount.
                    </p>
                </Col>
                <Col xs="auto">
                    <Button onClick={openCreateModal}>Create spend record</Button>
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
                                <h5>No spend record yet</h5>
                                <p className="text-muted">Create your first monthly spending summary.</p>
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
                        {selectedExpense ? 'Update spend record' : 'Create spend record'}
                    </Modal.Title>
                </Modal.Header>

                <fetcher.Form method="post">
                    <Modal.Body>
                        {error && <Alert variant="danger">{error}</Alert>}

                        <input type="hidden" name="intent" value="save" />
                        <input type="hidden" name="id" value={form.id || ''} />

                        <Row className="g-3">
                            <Col xs={12} md={6}>
                                <Form.Group controlId="spendMonth">
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
                                <Form.Group controlId="totalIncome">
                                    <Form.Label>Total income</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        step="any"
                                        name="totalIncome"
                                        value={form.totalIncome}
                                        onChange={handleInputChange}
                                        placeholder="Monthly income"
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={12} md={6}>
                                <Form.Group controlId="houseCost">
                                    <Form.Label>House cost</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        step="any"
                                        name="houseCost"
                                        value={form.houseCost}
                                        onChange={handleInputChange}
                                        placeholder="Rent / house cost"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group controlId="foodCost">
                                    <Form.Label>Food cost</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        step="any"
                                        name="foodCost"
                                        value={form.foodCost}
                                        onChange={handleInputChange}
                                        placeholder="Food cost"
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={12} md={6}>
                                <Form.Group controlId="traveCost">
                                    <Form.Label>Travel cost</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        step="any"
                                        name="traveCost"
                                        value={form.traveCost}
                                        onChange={handleInputChange}
                                        placeholder="Travel cost"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group controlId="savingAndInvestment">
                                    <Form.Label>Saving and investment</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        step="any"
                                        name="savingAndInvestment"
                                        value={form.savingAndInvestment}
                                        onChange={handleInputChange}
                                        placeholder="Saving / investment"
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={12} md={4}>
                                <Form.Group controlId="otherCost1">
                                    <Form.Label>Other cost 1</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        step="any"
                                        name="otherCost1"
                                        value={form.otherCost1}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={4}>
                                <Form.Group controlId="otherCost2">
                                    <Form.Label>Other cost 2</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        step="any"
                                        name="otherCost2"
                                        value={form.otherCost2}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={4}>
                                <Form.Group controlId="otherCost3">
                                    <Form.Label>Other cost 3</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        step="any"
                                        name="otherCost3"
                                        value={form.otherCost3}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Card className="bg-light border-0 mt-4">
                            <Card.Body>
                                <Row className="text-center g-3">
                                    <Col xs={12} md={4}>
                                        <div className="text-muted small">Total costs</div>
                                        <strong>{formatMoney(totalCosts)}</strong>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <div className="text-muted small">Saving</div>
                                        <strong>{formatMoney(form.savingAndInvestment)}</strong>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <div className="text-muted small">Estimated remaining</div>
                                        <strong className={previewRemaining >= 0 ? 'text-success' : 'text-danger'}>
                                            {formatMoney(previewRemaining)}
                                        </strong>
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
