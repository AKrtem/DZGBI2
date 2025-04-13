import React, { useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TypeBar from "../components/TypeBar";
import GroupBar from "../components/GroupBar";
import ProductList from "../components/ProductList";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { fetchGroups, fetchProducts, fetchTypes } from "../http/productAPI";
import Pages from "../components/Pages";

const Shop = observer(() => {
  const { product } = useContext(Context);

  useEffect(() => {
    fetchTypes().then((data) => product.setTypes(data));
    fetchGroups().then((data) => product.setGroups(data));
    fetchProducts(null, null, 1, 2).then((data) => {
      product.setProducts(data.rows);
      product.setTotalCount(data.count);
    });
  }, [product]);

  useEffect(() => {
    fetchProducts(
      product.selectedType.id,
      product.selectedGroup.id,
      product.page,
      2
    ).then((data) => {
      product.setProducts(data.rows);
      product.setTotalCount(data.count);
    });
  }, [product, product.page, product.selectedType, product.selectedGroup]);

  return (
    <Container>
      <Row className="mt-2">
        <Col md={3}>
          <TypeBar />
        </Col>
        <Col md={9}>
          <GroupBar />
          <ProductList />
          <Pages />
        </Col>
      </Row>
    </Container>
  );
});

export default Shop;
