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
                    <h2>Letter Counter</h2>
                    <p className="text-muted">Count characters, words, sentences, and more</p>
                </Col>
            </Row>

            <Row className="g-3">
                <Col lg={8}>
                    <Card>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Enter your text</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={8}
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Paste or type your text here..."
                                    className="letter-counter-textarea"
                                />
                            </Form.Group>
                            <button
                                className="btn btn-secondary"
                                onClick={handleClear}
                            >
                                Clear
                            </button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <div className="stats-grid">
                        <Card className="stat-card">
                            <Card.Body className="text-center">
                                <div className="stat-value">{stats.characters}</div>
                                <div className="stat-label">Characters</div>
                            </Card.Body>
                        </Card>

                        <Card className="stat-card">
                            <Card.Body className="text-center">
                                <div className="stat-value">{stats.words}</div>
                                <div className="stat-label">Words</div>
                            </Card.Body>
                        </Card>

                        <Card className="stat-card">
                            <Card.Body className="text-center">
                                <div className="stat-value">{stats.charactersNoSpaces}</div>
                                <div className="stat-label">Characters (no spaces)</div>
                            </Card.Body>
                        </Card>

                        <Card className="stat-card">
                            <Card.Body className="text-center">
                                <div className="stat-value">{stats.sentences}</div>
                                <div className="stat-label">Sentences</div>
                            </Card.Body>
                        </Card>

                        <Card className="stat-card">
                            <Card.Body className="text-center">
                                <div className="stat-value">{stats.paragraphs}</div>
                                <div className="stat-label">Paragraphs</div>
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}