import React, { useState, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import { Form, Button } from "react-bootstrap";
import { createView } from "../../http/productAPI";
import { Context } from "../../Context";

const CreateView = ({ show, onHide }) => {
  const [value, setValue] = useState("");
  const { product } = useContext(Context);

  const addView = () => {
    createView({ name: value }).then((newView) => {
      // Проверяем, что product.views - это массив
      const updatedViews = Array.isArray(product.views)
        ? [...product.views, newView]
        : [newView];

      // Сортируем только если это массив
      product.setViews(
        updatedViews.sort((a, b) => a.name.localeCompare(b.name, "ru"))
      );

      setValue("");
      onHide();
    });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавить вид продукции</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Введите название вида"
            className="mb-3"
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="outline-success" onClick={addView}>
          Добавить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateView;
