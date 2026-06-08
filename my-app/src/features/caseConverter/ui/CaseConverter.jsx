import { useState } from 'react';

export default function AppCaseConverter() {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [copyMessage, setCopyMessage] = useState('');

    const handleUpperCase = () => {
        const result = inputText.toUpperCase();
        setOutputText(result);
        setCopyMessage('');
    };

    const handleLowerCase = () => {
        const result = inputText.toLowerCase();
        setOutputText(result);
        setCopyMessage('');
    };

    const handleToggleCase = () => {
        const result = inputText
            .split('')
            .map(char => 
                char === char.toUpperCase() 
                    ? char.toLowerCase() 
                    : char.toUpperCase()
            )
            .join('');
        setOutputText(result);
        setCopyMessage('');
    };

    const handleCopy = () => {
        if (outputText) {
            navigator.clipboard.writeText(outputText);
            setCopyMessage('Copied!');
            setTimeout(() => setCopyMessage(''), 2000);
        }
    };

    return (
        <div className="container mt-4">
            <hr />
            <h2 className="text-primary">CASE CONVERTER</h2>
            <hr />

            <div className="row">
                <div className="col-md-6">
                    <label htmlFor="inputText" className="form-label">
                        <strong>Input Text:</strong>
                    </label>
                    <textarea
                        id="inputText"
                        className="form-control"
                        rows="5"
                        placeholder="Enter text here..."
                        value={inputText}
                        onChange={(e) => {
                            setInputText(e.target.value);
                            setCopyMessage('');
                        }}
                    ></textarea>
                </div>

                <div className="col-md-6">
                    <label htmlFor="outputText" className="form-label">
                        <strong>Output Text:</strong>
                    </label>
                    <textarea
                        id="outputText"
                        className="form-control"
                        rows="5"
                        placeholder="Result will appear here..."
                        value={outputText}
                        readOnly
                    ></textarea>
                </div>
            </div>

            <div className="mt-4 d-flex gap-2 flex-wrap">
                <button
                    className="btn btn-primary"
                    onClick={handleUpperCase}
                >
                    UpperCase
                </button>
                <button
                    className="btn btn-info"
                    onClick={handleLowerCase}
                >
                    LowerCase
                </button>
                <button
                    className="btn btn-warning"
                    onClick={handleToggleCase}
                >
                    Toggle Case
                </button>
                <button
                    className="btn btn-success"
                    onClick={handleCopy}
                >
                    Copy
                </button>
            </div>

            {copyMessage && (
                <div className="alert alert-success mt-3 mb-0">
                    {copyMessage}
                </div>
            )}
        </div>
    );
}