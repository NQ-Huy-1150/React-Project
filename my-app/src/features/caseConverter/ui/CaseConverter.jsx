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

    // Capitalize first letter of the text
    const handleCapitalizeFirst = () => {
        const result = inputText.charAt(0).toUpperCase() + inputText.slice(1);
        setOutputText(result);
        setCopyMessage('');
    };

    // Capitalize first letter of each word (Title Case)
    const handleTitleCase = () => {
        const result = inputText
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        setOutputText(result);
        setCopyMessage('');
    };

    // Convert to camelCase
    const handleCamelCase = () => {
        const result = inputText
            .split(' ')
            .map((word, index) => {
                const lowerWord = word.toLowerCase();
                if (index === 0) {
                    return lowerWord;
                }
                return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
            })
            .join('');
        setOutputText(result);
        setCopyMessage('');
    };

    const handleCopy = () => {
        if (outputText) {
            navigator.clipboard.writeText(outputText);
            setCopyMessage('Đã sao chép!');
            setTimeout(() => setCopyMessage(''), 2000);
        }
    };

    return (
        <div className="container mt-4">
            <hr />
            <h2 className="text-primary">CHUYỂN ĐỔI CHỮ</h2>
            <hr />

            <div className="row">
                <div className="col-md-6">
                    <label htmlFor="inputText" className="form-label">
                        <strong>Văn bản đầu vào:</strong>
                    </label>
                    <textarea
                        id="inputText"
                        className="form-control"
                        rows="5"
                        placeholder="Nhập văn bản tại đây..."
                        value={inputText}
                        onChange={(e) => {
                            setInputText(e.target.value);
                            setCopyMessage('');
                        }}
                    ></textarea>
                </div>

                <div className="col-md-6">
                    <label htmlFor="outputText" className="form-label">
                        <strong>Kết quả:</strong>
                    </label>
                    <textarea
                        id="outputText"
                        className="form-control"
                        rows="5"
                        placeholder="Kết quả sẽ hiển thị tại đây..."
                        value={outputText}
                        readOnly
                    ></textarea>
                </div>
            </div>

            <div className="mt-5 mb-5 d-flex gap-2 flex-wrap">
                <button
                    className="btn btn-primary"
                    onClick={handleUpperCase}
                >
                    IN HOA
                </button>
                <button
                    className="btn btn-info"
                    onClick={handleLowerCase}
                >
                    in thường
                </button>
                <button
                    className="btn btn-warning"
                    onClick={handleToggleCase}
                >
                    Đảo hoa/thường
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={handleCapitalizeFirst}
                >
                    Viết hoa chữ đầu
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={handleTitleCase}
                >
                    Viết hoa từng từ
                </button>
                <button
                    className="btn btn-dark"
                    onClick={handleCamelCase}
                >
                    camelCase
                </button>
                <button
                    className="btn btn-success"
                    onClick={handleCopy}
                >
                    Sao chép
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
