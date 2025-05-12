// src/pages/groupPages/kollektory.js

import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Kollektory = () => {
  return (
    <Container className="my-5">
      <h1>Коллекторы</h1>
      <p>
        На этой странице представлены различные типы коллекторов, которые
        используются для инженерных сетей.
      </p>
      <Row>
        <Col xs={12} md={4}>
          <div className="p-3 bg-light border rounded">
            <h5>Коллектор пластиковый</h5>
            <p>Тип: ПВХ</p>
            <p>Диаметр: 150 мм</p>
            <p>Длина: 6 м</p>
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div className="p-3 bg-light border rounded">
            <h5>Коллектор бетонный</h5>
            <p>Тип: армированный бетон</p>
            <p>Диаметр: 200 мм</p>
            <p>Длина: 8 м</p>
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div className="p-3 bg-light border rounded">
            <h5>Коллектор стальной</h5>
            <p>Тип: сталь</p>
            <p>Диаметр: 250 мм</p>
            <p>Длина: 10 м</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Kollektory;
