import { useState } from 'react'
import { Container, Row, Col, Form, Card } from 'react-bootstrap'
import { countLetters, countWords, countChars, countSentences, countParagraphs } from '../domain/letterCounterModel'
import '../css/LetterCounterPage.css'

export default function LetterCounterPage() {
    const [text, setText] = useState('')

    const stats = {
        characters: countLetters(text),
        words: countWords(text),
        charactersNoSpaces: countChars(text),
        sentences: countSentences(text),
        paragraphs: countParagraphs(text),
    }

    const handleClear = () => setText('')

    return (
        <Container className="letter-counter-container py-4">
            <Row className="mb-4">
                <Col>
                    <h2>Đếm ký tự</h2>
                    <p className="text-muted">Đếm ký tự, từ, câu, đoạn văn và nhiều thông tin khác</p>
                </Col>
            </Row>

            <Row className="g-3">
                <Col lg={8}>
                    <Card>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Nhập văn bản</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={8}
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Dán hoặc nhập văn bản tại đây..."
                                    className="letter-counter-textarea"
                                />
                            </Form.Group>
                            <button
                                className="btn btn-secondary"
                                onClick={handleClear}
                            >
                                Xóa nội dung
                            </button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <div className="stats-grid">
                        <Card className="stat-card">
                            <Card.Body className="text-center">
                                <div className="stat-value">{stats.characters}</div>
                                <div className="stat-label">Ký tự</div>
                            </Card.Body>
                        </Card>

                        <Card className="stat-card">
                            <Card.Body className="text-center">
                                <div className="stat-value">{stats.words}</div>
                                <div className="stat-label">Từ</div>
                            </Card.Body>
                        </Card>

                        <Card className="stat-card">
                            <Card.Body className="text-center">
                                <div className="stat-value">{stats.charactersNoSpaces}</div>
                                <div className="stat-label">Ký tự không tính khoảng trắng</div>
                            </Card.Body>
                        </Card>

                        <Card className="stat-card">
                            <Card.Body className="text-center">
                                <div className="stat-value">{stats.sentences}</div>
                                <div className="stat-label">Câu</div>
                            </Card.Body>
                        </Card>

                        <Card className="stat-card">
                            <Card.Body className="text-center">
                                <div className="stat-value">{stats.paragraphs}</div>
                                <div className="stat-label">Đoạn văn</div>
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}
