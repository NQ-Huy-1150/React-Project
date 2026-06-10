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
                        <Card.Title className="mb-1">Chi phí thuê nhà</Card.Title>
                        <Card.Subtitle className="text-muted">{expense.month || 'Chưa có tháng'}</Card.Subtitle>
                    </div>
                    <Badge bg="primary">{formatMoney(expense.total)}</Badge>
                </div>

                <Row className="g-3 small">
                    <Col xs={6}>
                        <div className="text-muted">Tiền nhà</div>
                        <strong>{formatMoney(expense.housePrice)}</strong>
                    </Col>
                    <Col xs={6}>
                        <div className="text-muted">Dịch vụ</div>
                        <strong>{formatMoney(expense.serviceCosts)}</strong>
                    </Col>
                    <Col xs={6}>
                        <div className="text-muted">Điện</div>
                        <strong>{formatMoney(expense.electricityBill)}</strong>
                    </Col>
                    <Col xs={6}>
                        <div className="text-muted">Nước</div>
                        <strong>{formatMoney(expense.waterBill)}</strong>
                    </Col>
                    <Col xs={12}>
                        <div className="text-muted">Chi phí khác</div>
                        <strong>{formatMoney(expense.othercosts)}</strong>
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
                    <h3 className="mb-1">Tính tiền thuê nhà</h3>
                    <p className="text-muted mb-0">
                        Theo dõi tiền nhà, điện nước, phí dịch vụ và tổng chi phí hàng tháng.
                    </p>
                </Col>
                <Col xs="auto">
                    <Button onClick={openCreateModal}>Tạo khoản thuê nhà</Button>
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
                                <h5>Chưa có chi phí thuê nhà</h5>
                                <p className="text-muted">Tạo bản tính tiền thuê nhà đầu tiên của bạn.</p>
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
                        {selectedExpense ? 'Cập nhật chi phí thuê nhà' : 'Tạo chi phí thuê nhà'}
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
                                    <Form.Label>Tháng</Form.Label>
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
                                    <Form.Label>Tiền nhà</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        step="any"
                                        name="housePrice"
                                        value={form.housePrice}
                                        onChange={handleInputChange}
                                        placeholder="Tiền thuê nhà"
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={12} md={6}>
                                <Form.Group controlId="amoutOfElectric">
                                    <Form.Label>Số điện tiêu thụ</Form.Label>
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
                                    <Form.Label>Đơn giá điện</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        step="any"
                                        name="electricityPrice"
                                        value={form.electricityPrice}
                                        onChange={handleInputChange}
                                        placeholder="Giá mỗi kWh"
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={12} md={6}>
                                <Form.Group controlId="amoutOfWater">
                                    <Form.Label>Số nước tiêu thụ</Form.Label>
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
                                    <Form.Label>Đơn giá nước</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        step="any"
                                        name="waterPrice"
                                        value={form.waterPrice}
                                        onChange={handleInputChange}
                                        placeholder="Giá mỗi m3"
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={12} md={6}>
                                <Form.Group controlId="serviceCosts">
                                    <Form.Label>Phí dịch vụ</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        step="any"
                                        name="serviceCosts"
                                        value={form.serviceCosts}
                                        onChange={handleInputChange}
                                        placeholder="Phí dịch vụ"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group controlId="othercosts">
                                    <Form.Label>Chi phí khác</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        step="any"
                                        name="othercosts"
                                        value={form.othercosts}
                                        onChange={handleInputChange}
                                        placeholder="Chi phí khác"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Card className="bg-light border-0 mt-4">
                            <Card.Body>
                                <Row className="text-center g-3">
                                    <Col xs={12} md={4}>
                                        <div className="text-muted small">Tiền điện</div>
                                        <strong>{formatMoney(electricityBill)}</strong>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <div className="text-muted small">Tiền nước</div>
                                        <strong>{formatMoney(waterBill)}</strong>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <div className="text-muted small">Tổng dự kiến</div>
                                        <strong className="text-primary">{formatMoney(previewTotal)}</strong>
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
