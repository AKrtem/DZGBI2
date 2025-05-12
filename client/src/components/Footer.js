import React, { useState, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

const Footer = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    question: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const recaptchaRef = useRef(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = await recaptchaRef.current.executeAsync();
    recaptchaRef.current.reset();

    if (
      !formData.name ||
      !formData.question ||
      (!formData.email && !formData.phone)
    ) {
      setError(
        "Пожалуйста, заполните имя, вопрос и хотя бы одно из полей: email или телефон."
      );
      return;
    }

    if (!token) {
      setError("Подтвердите, что вы не робот.");
      return;
    }

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("email", formData.email);
    payload.append("phone", formData.phone);
    payload.append("comment", formData.question);
    payload.append("cart", "Вопрос с сайта (футер)");
    payload.append("captchaToken", token);

    try {
      await axios.post("http://localhost:5001/api/mail", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", question: "" });
      setTimeout(() => {
        setShowModal(false);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Ошибка отправки. Попробуйте позже.");
    }
  };

  return (
    <>
      <footer className="bg-light text-dark pt-5 pb-4 border-top mt-5">
        <Container>
          <Row className="mb-4">
            <Col md={8}>
              <h5>Нужна консультация?</h5>
              <p>
                Подробно расскажем о наших услугах, рассчитаем стоимость и
                подготовим индивидуальное предложение!
              </p>
            </Col>
            <Col
              md={4}
              className="d-flex align-items-center justify-content-md-end"
            >
              <Button
                variant="dark"
                size="lg"
                onClick={() => setShowModal(true)}
              >
                Задать вопрос
              </Button>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col>
              <p className="mb-0">
                © {new Date().getFullYear()} ООО "Промышленная Компания
                "Очаковский Комбинат ЖБИ"
                <br />
                ИНН 6722028140 | КПП 772901001 | ОГРН 1126722001141
                <br />
                Директор: Дворецкий Илья Борисович
              </p>
            </Col>
          </Row>
        </Container>
      </footer>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Задать вопрос</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">Вопрос отправлен!</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Имя *</Form.Label>
              <Form.Control
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Телефон</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ваш вопрос *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="question"
                value={formData.question}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <ReCAPTCHA
              ref={recaptchaRef}
              size="invisible"
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
            />

            <Button type="submit" variant="dark">
              Отправить
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Footer;
