import React, { useState } from "react";
import { Container, Form } from "react-bootstrap";
import DeliveryMap from "../components/DeliveryMap";
import CompanyInfo from "../components/CompanyInfo";

const Delivery = () => {
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <Container className="mt-4">
      <h2>Доставка и расчет маршрута</h2>
      <p>
        Здесь вы можете рассчитать примерную стоимость доставки нашего товара по
        Москве и области.
      </p>

      <Form className="mb-4">
        <Form.Group className="mb-3" controlId="weightInput">
          <Form.Label>Вес груза (в кг)</Form.Label>
          <Form.Control
            type="number"
            placeholder="например, 15000"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="dateInput">
          <Form.Label>Желаемая дата доставки (опционально)</Form.Label>
          <Form.Control
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="notesInput">
          <Form.Label>Дополнительные пожелания (опционально)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Например, разгрузка краном, время прибытия и т.д."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Form.Group>
      </Form>

      <DeliveryMap weight={weight} />
      <CompanyInfo />
    </Container>
  );
};

export default Delivery;
