import React, { useState, useEffect, useContext } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { createType, fetchGroups, fetchViews } from "../../http/productAPI";
import { Context } from "../../Context";

const CreateType = ({ show, onHide, onCreateSuccess }) => {
  const [name, setName] = useState("");
  const [selectedViewId, setSelectedViewId] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const { product } = useContext(Context);

  useEffect(() => {
    fetchViews().then((data) => product.setViews(data));
    fetchGroups().then((data) => product.setGroups(data));
  }, [product]);

  const addType = () => {
    if (!name || !selectedViewId || !selectedGroupId) {
      alert("Заполните все поля");
      return;
    }

    createType({
      name,
      viewId: Number(selectedViewId),
      groupId: Number(selectedGroupId),
    })
      .then((newType) => {
        setName("");
        setSelectedViewId("");
        setSelectedGroupId("");

        if (onCreateSuccess) {
          onCreateSuccess(newType); // <<< КЛЮЧ
        }

        onHide();
      })
      .catch((error) => {
        alert(error.response?.data?.message || "Ошибка при создании типа");
      });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавить тип</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите название типа"
            className="mb-3"
          />

          {product.views.length > 0 ? (
            <Form.Control
              as="select"
              value={selectedViewId}
              onChange={(e) => setSelectedViewId(e.target.value)}
              className="mb-3"
            >
              <option value="">Выберите вид продукции</option>
              {product.views.map((view) => (
                <option key={view.id} value={view.id}>
                  {view.name}
                </option>
              ))}
            </Form.Control>
          ) : (
            <Alert variant="warning" className="mb-3">
              Нет доступных видов продукции
            </Alert>
          )}

          {product.groups.length > 0 ? (
            <Form.Control
              as="select"
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="mb-3"
            >
              <option value="">Выберите группу</option>
              {product.groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </Form.Control>
          ) : (
            <Alert variant="warning">
              Нет доступных групп. Сначала создайте группу.
            </Alert>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="outline-success" onClick={addType}>
          Добавить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateType;
