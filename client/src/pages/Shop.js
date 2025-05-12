import React, { useContext, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import TypeBar from "../components/TypeBar";
import ViewBar from "../components/ViewBar";
import GroupBar from "../components/GroupBar";
import CompanyInfo from "../components/CompanyInfo";
import ProductList from "../components/ProductList";
import { observer } from "mobx-react-lite";
import { Context } from "../Context";
import {
  fetchGroups,
  fetchProducts,
  fetchTypes,
  fetchViews,
} from "../http/productAPI";
import Pages from "../components/Pages";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const Shop = observer(() => {
  const { product } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTypes().then((data) => product.setTypes(data));
    fetchGroups().then((data) => product.setGroups(data));
    fetchViews().then((data) => product.setViews(data));

    fetchProducts(null, null, null, 1, 2).then((data) => {
      const validProducts = Array.isArray(data?.rows)
        ? data.rows.filter((item) => item && item.id)
        : [];
      product.setProducts(validProducts);
      product.setTotalCount(data?.count || 0);
    });
  }, []);

  useEffect(() => {
    const typeId = product.selectedType?.id || null;
    const groupId = product.selectedGroup?.id || null;
    const viewId = product.selectedView?.id || null;
    const page = product.page;

    fetchProducts(typeId, groupId, viewId, page, 2).then((data) => {
      const validProducts = Array.isArray(data?.rows)
        ? data.rows.filter((item) => item && item.id)
        : [];
      product.setProducts(validProducts);
      product.setTotalCount(data?.count || 0);
    });
  }, [
    product.page,
    product.selectedType?.id,
    product.selectedGroup?.id,
    product.selectedView?.id,
  ]);

  return (
    <>
      <Container className="my-5">
        {/* <h2 className="mb-4">Продукция</h2> */}

        {/* Скролл для избранных групп товаров */}
        {/* <h3 className="mb-4">Избранные группы товаров</h3> */}
        <Row className="overflow-auto" style={{ flexWrap: "nowrap" }}>
          {product.groups
            .filter((group) => group.isFavorite)
            .map((group) => (
              <Col key={group.id} xs="auto" className="me-4">
                <Card
                  className="text-white shadow-sm border-0"
                  style={{
                    width: "200px",
                    height: "250px",
                    backgroundImage: `url(${process.env.REACT_APP_API_URL}static/${group.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                  }}
                >
                  <Card.Body
                    className="d-flex flex-column justify-content-end"
                    style={{
                      background: "rgba(0, 0, 0, 0.5)",
                      padding: "1rem",
                      height: "100%",
                      borderRadius: "0.5rem",
                    }}
                  >
                    <Card.Title className="mb-2">{group.name}</Card.Title>
                    {group.description && (
                      <Card.Text
                        className="mb-2"
                        style={{ fontSize: "0.85rem", lineHeight: "1.2" }}
                      >
                        {group.description}
                      </Card.Text>
                    )}
                    <Button
                      variant="light"
                      size="sm"
                      onClick={() => navigate(`/group/${group.id}`)}
                    >
                      Подробнее
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>

        <hr className="my-5" />

        {/* Блок с видами */}
        <h3 className="mb-4">Каталог продукции</h3>
        <Row>
          {product.views.map((view) => {
            const relatedGroups = product.groups.filter(
              (group) => group.viewId === view.id
            );
            if (!relatedGroups.length) return null;

            return (
              <Col key={view.id} xs={12} md={6} lg={4} className="mb-4">
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src="/icon-communication.svg"
                        alt="Иконка"
                        width="24"
                        height="24"
                        className="me-2"
                      />
                      <Card.Title className="mb-0">{view.name}</Card.Title>
                    </div>
                    <ul className="list-unstyled ps-3">
                      {relatedGroups.map((group) => (
                        <li
                          key={group.id}
                          onClick={() => navigate(`/group/${group.id}`)}
                          style={{
                            cursor: "pointer",
                            color: "#007bff",
                            marginBottom: "6px",
                          }}
                        >
                          {group.name}
                        </li>
                      ))}
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>

        <hr className="my-5" />
      </Container>
      <CompanyInfo />
    </>
  );
});

export default Shop;
