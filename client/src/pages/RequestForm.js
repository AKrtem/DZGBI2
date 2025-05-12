// src/pages/RequestForm.js
import React, { useContext, useState } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { Context } from '../Context';

const RequestForm = () => {
  const { product } = useContext(Context);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("message", message);
    formData.append("file", file);
    formData.append("cart", JSON.stringify(product.cart));

    try {
      await fetch("http://localhost:5001/api/mail/send", {
        method: "POST",
        body: formData,
      });

      alert("Заявка отправлена!");
    } catch (error) {
      console.error("Ошибка при отправке:", error);
      alert("Не удалось отправить заявку.");
    }
  };

  return (
    <Container>
      <h2 className="my-4">Заявка</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Имя</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Почта</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Комментарий</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Прикрепить файл</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Отправить
        </Button>
      </Form>
    </Container>
  );
};

export default RequestForm;
