import { Dropdown, DropdownButton, Button, Row, Col } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import '../css/Styles.css'
import { createCatalog, deleteCatalog, updateCatalog } from "../api/CatalogApi";
function DropdownRowData({ item, setCatas, editingId, setEditingId, onSelectCatalog, catas }) {
    const inputRef = useRef(null);
    const handleInputChange = (e) => {
        setCatas((prev) =>
            prev.map((cata) =>
                cata.clientId === item.clientId ? { ...cata, title: e.target.value } : cata
            )
        );
    };
    const isEditing = editingId === item.clientId;
    const handleDelete = async (e) => {
        e.stopPropagation();
        try {
            if (item.id != null) {
                await deleteCatalog(item.id);
            }
            setCatas((prev) => prev.filter((cata) => cata.clientId !== item.clientId));
            if (editingId === item.clientId) setEditingId(null);
        } catch (err) {
            console.log(err);
        }
    };

    const handleInputBlur = async () => {
        try {
            const currentEditing = catas.find(item => item.clientId === editingId);
            if (currentEditing?.id != null && currentEditing.title.trim()) {
                await updateCatalog(currentEditing);
            }
            setEditingId(null);
        } catch (err) {
            console.log(err);
        }
    };
    const handleEdit = (e) => {
        e.stopPropagation();
        setEditingId(item.clientId);
    }

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.setSelectionRange(
                inputRef.current.value.length,
                inputRef.current.value.length
            );
        }
    }, [isEditing]);

    return (
        <Row
            className="align-items-center g-2"
            role="button"
            onClick={() => {
                if (!isEditing) onSelectCatalog?.(item.id ?? null);
            }}
        >
            <Col xs={12} md={7}>
                {!isEditing ? (
                    <span>{item.title}</span>
                ) : (
                    <input
                        className="form-control form-control-sm"
                        ref={inputRef}
                        type="text"
                        defaultValue={item.title}
                        onBlur={handleInputBlur}
                        onChange={handleInputChange}
                        onClick={(event) => event.stopPropagation()}
                    />
                )}
            </Col>
            <Col xs={12} md={5} className="text-end">
                <Button className="me-2" size="sm" type="button" onClick={handleEdit}>
                    <FontAwesomeIcon icon={faPen} />
                </Button>
                <Button size="sm" type="button" variant="danger" onClick={handleDelete}>
                    <FontAwesomeIcon icon={faTrash} />
                </Button>
            </Col>
        </Row>
    );
}

export default function CatalogDropdown({
    list = [],
    selectedCatalogId = null,
    onChangeCatalog,
}) {
    const [cata, setCata] = useState({ id: null, title: "" });
    const [catas, setCatas] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const handleAddToList = async () => {
        if (!cata.title.trim()) return;

        try {
            const clientId = crypto.randomUUID();
            const created = await createCatalog(cata);

            setCatas((prev) => [
                ...prev,
                {
                    ...cata,
                    id: created.id,
                    clientId,
                },
            ]);

            setShowCreate(false);
            setCata({ id: null, title: "" });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const newList = Array.isArray(list)
            ? list.map((item) => ({ ...item, clientId: item.clientId ?? crypto.randomUUID() }))
            : [];
        setCatas(newList);
    }, [list]);

    const selectedCatalog = catas.find((item) => item.id === selectedCatalogId);

    return (
        <DropdownButton
            className="w-auto"
            id="catalog-dropdown-button"
            title={selectedCatalog?.title ?? "Chọn catalog"}
            autoClose='outside'
        >
            <Row>
                <Col xs={12}>
                    {catas.map((item) => (
                        <Dropdown.Item as="div" id="dr-content" key={item.clientId}>
                            <DropdownRowData
                                item={item}
                                setCatas={setCatas}
                                editingId={editingId}
                                setEditingId={setEditingId}
                                onSelectCatalog={onChangeCatalog}
                                catas={catas}
                            />
                        </Dropdown.Item>
                    ))}
                </Col>
            </Row>
            <Dropdown.Divider />
            {!showCreate ? (
                <Button type="button" onClick={() => setShowCreate(true)}>
                    + Tạo catalog mới
                </Button>
            ) : (
                <Row className="g-2">
                    <Col xs={12} md={9}>
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Catalog mới..."
                            value={cata.title}
                            onChange={(e) => setCata((prev) => ({ ...prev, title: e.target.value }))}
                            required
                            maxLength={80}
                        />
                    </Col>
                    <Col xs={12} md={3}>
                        <Button size="sm" type="button" onClick={handleAddToList}>
                            Lưu
                        </Button>
                    </Col>
                </Row>
            )}
        </DropdownButton>
    );
}
