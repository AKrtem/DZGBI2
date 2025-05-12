// src/pages/groupPages/kolodtsy.js

import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Kolodtsy = () => {
  return (
    <Container className="my-5">
      <h1>Колодцы</h1>
      <p>
        На этой странице представлены различные типы колодцев, используемых в
        подземных коммуникациях.
      </p>
      <Row>
        <Col xs={12} md={4}>
          <div className="p-3 bg-light border rounded">
            <h5>Колодец бетонный</h5>
            <p>Тип: стандартный</p>
            <p>Размеры: диаметр 100 см, высота 150 см</p>
            <p>Масса: 250 кг</p>
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div className="p-3 bg-light border rounded">
            <h5>Колодец чугунный</h5>
            <p>Тип: чугунный с крышкой</p>
            <p>Размеры: диаметр 80 см, высота 120 см</p>
            <p>Масса: 180 кг</p>
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div className="p-3 bg-light border rounded">
            <h5>Колодец пластиковый</h5>
            <p>Тип: лёгкий пластиковый</p>
            <p>Размеры: диаметр 90 см, высота 100 см</p>
            <p>Масса: 100 кг</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Kolodtsy;
