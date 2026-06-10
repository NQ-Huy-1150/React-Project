import { useEffect, useRef, useState } from 'react';
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
                        <Card.Title className="mb-1">Theo dõi chi tiêu</Card.Title>
                        <Card.Subtitle className="text-muted">{expense.month || 'Chưa có tháng'}</Card.Subtitle>
                    </div>
                    <Badge bg={remainingAmount >= 0 ? 'success' : 'danger'}>
                        {formatMoney(remainingAmount)}
                    </Badge>
                </div>

                <Row className="g-3 small">
                    <Col xs={6}>
                        <div className="text-muted">Thu nhập</div>
                        <strong>{formatMoney(expense.totalIncome)}</strong>
                    </Col>
                    <Col xs={6}>
                        <div className="text-muted">Nhà ở</div>
                        <strong>{formatMoney(expense.houseCost)}</strong>
                    </Col>
                    <Col xs={6}>
                        <div className="text-muted">Ăn uống</div>
                        <strong>{formatMoney(expense.foodCost)}</strong>
                    </Col>
                    <Col xs={6}>
                        <div className="text-muted">Di chuyển</div>
                        <strong>{formatMoney(expense.traveCost)}</strong>
                    </Col>
                    <Col xs={6}>
                        <div className="text-muted">Tiết kiệm</div>
                        <strong>{formatMoney(expense.savingAndInvestment)}</strong>
                    </Col>
                    <Col xs={6}>
                        <div className="text-muted">Khác</div>
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
                        Sửa
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => onDelete(expense.id)} disabled={isSaving}>
                        Xóa
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
    const didSubmitRef = useRef(false);

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
                    <h3 className="mb-1">Theo dõi chi tiêu</h3>
                    <p className="text-muted mb-0">
                        Theo dõi thu nhập, chi phí, tiết kiệm và số tiền còn lại mỗi tháng.
                    </p>
                </Col>
                <Col xs="auto">
                    <Button onClick={openCreateModal}>Tạo ghi nhận chi tiêu</Button>
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
                                <h5>Chưa có ghi nhận chi tiêu</h5>
                                <p className="text-muted">Tạo bản tổng hợp chi tiêu đầu tiên của bạn.</p>
                                <Button onClick={openCreateModal}>Tạo ngay</Button>
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
                        {selectedExpense ? 'Cập nhật ghi nhận chi tiêu' : 'Tạo ghi nhận chi tiêu'}
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
                                    <Form.Label>Tháng</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="month"
                                        value={form.month}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group controlId="totalIncome">
                                    <Form.Label>Tổng thu nhập</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        step="any"
                                        name="totalIncome"
                                        value={form.totalIncome}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Thu nhập hàng tháng"
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={12} md={6}>
                                <Form.Group controlId="houseCost">
                                    <Form.Label>Chi phí nhà ở</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        step="any"
                                        name="houseCost"
                                        value={form.houseCost}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Tiền thuê / chi phí nhà ở"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group controlId="foodCost">
                                    <Form.Label>Chi phí ăn uống</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        step="any"
                                        name="foodCost"
                                        value={form.foodCost}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Chi phí ăn uống"
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={12} md={6}>
                                <Form.Group controlId="traveCost">
                                    <Form.Label>Chi phí di chuyển</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        step="any"
                                        name="traveCost"
                                        value={form.traveCost}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Chi phí di chuyển"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group controlId="savingAndInvestment">
                                    <Form.Label>Tiết kiệm và đầu tư</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        step="any"
                                        name="savingAndInvestment"
                                        value={form.savingAndInvestment}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Tiết kiệm / đầu tư"
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={12} md={4}>
                                <Form.Group controlId="otherCost1">
                                    <Form.Label>Chi phí khác 1</Form.Label>
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
                                    <Form.Label>Chi phí khác 2</Form.Label>
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
                                    <Form.Label>Chi phí khác 3</Form.Label>
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
                                        <div className="text-muted small">Tổng chi phí</div>
                                        <strong>{formatMoney(totalCosts)}</strong>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <div className="text-muted small">Tiết kiệm</div>
                                        <strong>{formatMoney(form.savingAndInvestment)}</strong>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <div className="text-muted small">Số dư dự kiến</div>
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
                            Đóng
                        </Button>
                        <Button variant="primary" type="submit" disabled={isSaving}>
                            {isSaving ? 'Đang lưu...' : 'Lưu'}
                        </Button>
                    </Modal.Footer>
                </fetcher.Form>
            </Modal>
        </>
    );
}
