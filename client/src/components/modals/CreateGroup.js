import React, { useState, useEffect, useContext } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { createGroup, fetchViews } from "../../http/productAPI";
import { Context } from "../../Context";

const CreateGroup = ({ show, onHide, onCreateSuccess }) => {
  const [name, setName] = useState("");
  const [selectedViewId, setSelectedViewId] = useState(""); // Это строка
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState(""); // Для описания группы
  const [isFavorite, setIsFavorite] = useState(false); // Для избранности
  const { product } = useContext(Context);

  useEffect(() => {
    fetchViews().then((data) => product.setViews(data));
  }, [product]);

  const addGroup = () => {
    if (!name || !selectedViewId) {
      alert("Введите название группы и выберите вид продукции");
      return;
    }

    const viewIdNum = Number(selectedViewId);
    if (isNaN(viewIdNum)) {
      alert("Ошибка: неверный формат ID для вида");
      return;
    }

    if (!image) {
      alert("Пожалуйста, выберите изображение для группы");
      return;
    }

    // Отправляем данные, включая описание и избранность
    createGroup({ name, viewId: viewIdNum, description, isFavorite }, image)
      .then((newGroup) => {
        setName("");
        setSelectedViewId("");
        setImage(null);
        setDescription(""); // Сбрасываем описание после успешного добавления
        setIsFavorite(false); // Сбрасываем состояние избранности
        product.setSelectedView(null);

        if (onCreateSuccess) {
          onCreateSuccess(newGroup); // <--- КЛЮЧЕВОЙ момент
        }

        onHide();
      })
      .catch((error) => {
        alert(error.response?.data?.message || "Ошибка при создании группы");
      });
  };

  const handleViewChange = (e) => {
    const viewId = e.target.value;
    setSelectedViewId(viewId);

    const selected = product.views.find((view) => view.id === Number(viewId));
    product.setSelectedView(selected || null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавить группу</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите название группы (например, Колодцы)"
            className="mb-3"
          />

          {product.views.length > 0 ? (
            <Form.Control
              as="select"
              value={selectedViewId}
              onChange={handleViewChange}
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
              Нет доступных видов продукции. Добавьте хотя бы один.
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Описание группы</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Введите описание группы"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Добавить в избранное"
              checked={isFavorite}
              onChange={() => setIsFavorite(!isFavorite)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Выберите изображение</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="outline-success" onClick={addGroup}>
          Добавить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateGroup;
