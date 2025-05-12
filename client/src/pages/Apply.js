import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../Context";
import { Button, Container, Table, Form, Alert } from "react-bootstrap";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

const Apply = observer(() => {
  const { product } = useContext(Context);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    comment: "",
    file: null,
  });

  const [captchaToken, setCaptchaToken] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      alert("Пожалуйста, подтвердите, что вы не робот.");
      return;
    }

    // Формируем строку с товарами из корзины
    const cartItemsText = product.cart
      .map((item) => {
        let parameters = [];

        if (item.length) parameters.push(`Длина: ${item.length} мм`);
        if (item.width) parameters.push(`Ширина: ${item.width} мм`);
        if (item.height) parameters.push(`Высота: ${item.height} мм`);
        if (item.weight) parameters.push(`Масса: ${item.weight} кг`);
        if (item.load) parameters.push(`Нагрузка: ${item.load} кг`);
        if (item.frostResistance)
          parameters.push(`Морозостойкость: ${item.frostResistance}`);
        if (item.innerDiameter)
          parameters.push(`Диаметр (внутр.): ${item.innerDiameter} мм`);
        if (item.outerDiameter)
          parameters.push(`Диаметр (внешн.): ${item.outerDiameter} мм`);

        if (parameters.length === 0) {
          parameters.push("Нет параметров");
        }

        return `
            Товар: ${item.name}
            Параметры: ${parameters.join(", ")}
            Количество: ${item.quantity || 1}
        `;
      })
      .join("\n\n");

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("comment", form.comment);
    if (form.file) formData.append("file", form.file);
    formData.append("cart", cartItemsText); // Преобразуем корзину в строку и отправляем
    formData.append("captcha", captchaToken); // Добавляем токен капчи

    try {
      const res = await axios.post("http://localhost:5001/api/mail", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSubmitted(true);
    } catch (err) {
      alert("Ошибка отправки. Попробуйте позже.");
      console.error(err);
    }
  };

  const handleRemoveItem = (id) => {
    product.removeFromCart(id);
  };

  const renderParameters = (item) => {
    if (!item) return "—";

    return (
      <>
        {item.view && <p className="text-sm text-gray-500">Вид: {item.view}</p>}
        {item.group && (
          <p className="text-sm text-gray-500">Группа: {item.group}</p>
        )}
        {item.type && <p className="text-sm text-gray-500">Тип: {item.type}</p>}
        {item.width && <p>Ширина: {item.width} мм</p>}
        {item.length && <p>Длина: {item.length} мм</p>}
        {item.height && <p>Высота: {item.height} мм</p>}
        {item.diameter && <p>Диаметр: {item.diameter} мм</p>}
        {item.threadType && <p>Резьба: {item.threadType}</p>}
        {item.weight && <p>Масса: {item.weight} кг</p>}
        {item.load && <p>Нагрузка: {item.load} кг</p>}
        {item.frostResistance && <p>Морозостойкость: {item.frostResistance}</p>}
        {item.innerDiameter && <p>Диаметр (внутр.): {item.innerDiameter} мм</p>}
        {item.outerDiameter && <p>Диаметр (внешн.): {item.outerDiameter} мм</p>}
        {!item.view &&
          !item.group &&
          !item.type &&
          !item.width &&
          !item.length &&
          !item.height &&
          !item.diameter &&
          !item.threadType &&
          !item.weight &&
          !item.load &&
          !item.frostResistance &&
          !item.innerDiameter &&
          !item.outerDiameter && <p>Нет параметров</p>}
      </>
    );
  };

  return (
    <Container>
      <h2 className="my-4">Заполните заявку</h2>

      {product.cart.length > 0 && (
        <>
          <h5>Товары в заявке</h5>
          <Table bordered size="sm" className="mb-4">
            <thead>
              <tr>
                <th>Название</th>
                <th>Параметры</th>
                <th>Количество</th>
                <th>Удалить</th>
              </tr>
            </thead>
            <tbody>
              {product.cart.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{renderParameters(item)}</td> <td>{item.count || 1}</td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      ❌
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {product.cart.length === 0 && (
        <Alert variant="warning">
          Корзина пуста. Добавьте товары перед отправкой.
        </Alert>
      )}

      {submitted && <Alert variant="success">Заявка успешно отправлена!</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name" className="mb-3">
          <Form.Label>Имя</Form.Label>
          <Form.Control
            required
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            required
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="phone" className="mb-3">
          <Form.Label>Телефон</Form.Label>
          <Form.Control
            required
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="comment" className="mb-3">
          <Form.Label>Комментарий</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="comment"
            value={form.comment}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="file" className="mb-3">
          <Form.Label>Прикрепить файл (опционально)</Form.Label>
          <Form.Control type="file" name="file" onChange={handleChange} />
        </Form.Group>

        {/* Капча */}
        <ReCAPTCHA
          sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
          onChange={handleCaptchaChange}
          className="mb-3"
        />

        <Button type="submit" variant="success">
          Подать заявку
        </Button>
      </Form>
    </Container>
  );
});

export default Apply;
