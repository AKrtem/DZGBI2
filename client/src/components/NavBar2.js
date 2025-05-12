import React, { useContext, useState, useEffect } from "react";
import didYouMean from "didyoumean2";
import {
  Navbar,
  Container,
  Button,
  Nav,
  NavDropdown,
  Row,
  Col,
  Modal,
  Form,
  ListGroup,
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { Context } from "../Context";
import { APPLY_ROUTE } from "../utils/consts";
import { fetchAllTypes, fetchProducts } from "../http/productAPI";

const NavBar2 = () => {
  const navigate = useNavigate();
  const { product } = useContext(Context);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeResults, setTypeResults] = useState([]);
  const [productResults, setProductResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  useEffect(() => {
    setIsNavOpen(false);
    setShowModal(false);
  }, [location]);

  // Общий поиск по типам и продуктам
  useEffect(() => {
    const loadSearchData = async () => {
      if (searchQuery.trim().length < 2) {
        setTypeResults([]);
        setProductResults([]);
        return;
      }

      try {
        const [allTypes, allProductsRaw] = await Promise.all([
          fetchAllTypes(),
          fetchProducts(null, null, 1, 6000), // Параметры по умолчанию
        ]);

        console.log("allProductsRaw", allProductsRaw);
        const allProducts = allProductsRaw?.rows || [];

        const typeNames = allTypes.map((type) => type.name.toLowerCase());
        const corrected = didYouMean(searchQuery.toLowerCase(), typeNames);

        let filteredTypes = [];
        if (corrected) {
          filteredTypes = allTypes.filter(
            (type) => type.name.toLowerCase() === corrected
          );
        } else {
          filteredTypes = allTypes.filter((type) =>
            type.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        const filteredProducts = allProducts.filter((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        console.log("filteredProducts", filteredProducts);

        setTypeResults(filteredTypes);
        setProductResults(filteredProducts);
      } catch (err) {
        console.error("Ошибка при поиске:", err);
      }
    };

    loadSearchData();
  }, [searchQuery]);
  return (
    <Navbar bg="light" className="shadow-sm">
      <Container>
        <Navbar.Brand
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <img src="/logo.png" alt="Логотип" height="40" /> ОКГБИ
        </Navbar.Brand>

        {/* Объединённое поле поиска */}
        <div
          style={{ position: "relative", width: "300px", marginRight: "20px" }}
        >
          <Form.Control
            type="text"
            placeholder="Поиск по типам и продуктам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {(typeResults.length > 0 || productResults.length > 0) && (
            <ListGroup
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 1000,
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {typeResults.length > 0 && (
                <>
                  <ListGroup.Item
                    style={{
                      fontWeight: "bold",
                      backgroundColor: "#f8f9fa",
                      cursor: "default",
                    }}
                  >
                    Типы продукции
                  </ListGroup.Item>
                  {typeResults.map((type) => (
                    <ListGroup.Item
                      key={`type-${type.id}`}
                      action
                      onClick={() => {
                        navigate(`/group/${type.groupId}?typeId=${type.id}`);
                        setSearchQuery("");
                        setTypeResults([]);
                        setProductResults([]);
                      }}
                    >
                      {type.name}
                    </ListGroup.Item>
                  ))}
                </>
              )}

              {productResults.length > 0 && (
                <>
                  <ListGroup.Item
                    style={{
                      fontWeight: "bold",
                      backgroundColor: "#f8f9fa",
                      cursor: "default",
                    }}
                  >
                    Продукты
                  </ListGroup.Item>
                  {productResults.map((product) => (
                    <ListGroup.Item
                      key={`product-${product.id}`}
                      action
                      onClick={() => {
                        navigate(
                          `/group/${product.groupId}?typeId=${product.typeId}&productId=${product.id}`
                        );
                        setSearchQuery("");
                        setTypeResults([]);
                        setProductResults([]);
                      }}
                    >
                      {product.name}
                    </ListGroup.Item>
                  ))}
                </>
              )}
            </ListGroup>
          )}
        </div>

        <Nav className={`ml-auto ${isNavOpen ? "show" : ""}`}>
          <NavDropdown
            title="Продукция"
            id="product-dropdown"
            align="end"
            onClick={handleShow}
          >
            <Modal
              show={showModal}
              onHide={handleClose}
              size="lg"
              centered
              backdrop
            >
              <Modal.Header closeButton>
                <Modal.Title>Виды продукции</Modal.Title>
              </Modal.Header>
              <Modal.Body onMouseLeave={handleClose}>
                <Row>
                  {product?.views?.length > 0 ? (
                    product.views.map((view) => {
                      const relatedGroups = product.groups?.filter(
                        (group) => group.viewId === view.id
                      );
                      if (!relatedGroups?.length) return null;

                      return (
                        <Col xs={12} md={4} key={view.id} className="mb-4">
                          <div className="p-3 bg-light border rounded">
                            <div className="d-flex align-items-center mb-2">
                              <img
                                src="/icon-communication.svg"
                                alt="Иконка"
                                width="24"
                                height="24"
                                className="me-2"
                              />
                              <strong style={{ fontSize: "1.2rem" }}>
                                {view.name}
                              </strong>
                            </div>
                            {relatedGroups.map((group) => (
                              <div key={group.id} className="ms-4">
                                <div
                                  onClick={() => {
                                    navigate(`/group/${group.id}`);
                                  }}
                                  style={{
                                    cursor: "pointer",
                                    color: "#007bff",
                                    textDecoration: "none",
                                    marginBottom: "4px",
                                  }}
                                >
                                  {group.name}
                                </div>
                              </div>
                            ))}
                          </div>
                        </Col>
                      );
                    })
                  ) : (
                    <p>Нет видов продукции</p>
                  )}
                </Row>
              </Modal.Body>
            </Modal>
          </NavDropdown>

          <Button
            variant="outline-dark"
            onClick={() => navigate(APPLY_ROUTE)}
            style={{ fontWeight: "bold", padding: "8px 16px" }}
          >
            Подать заявку
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar2;
