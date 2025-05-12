import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  fetchGroup,
  fetchTypesByGroupAndView,
  fetchProducts,
} from "../http/productAPI";
import { Row, Col, Card, Alert, Spinner, Table } from "react-bootstrap";
import { Context } from "../Context";
import Button from "../components/ui/Button";
import { ShoppingCart } from "lucide-react";
import { observer } from "mobx-react-lite";
const GroupPage = () => {
  const { product: productStore } = useContext(Context);
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const groupId = parseInt(id, 10);
  const autoTypeId = parseInt(searchParams.get("typeId"), 10);
  const autoProductId = parseInt(searchParams.get("productId"), 10);

  const [group, setGroup] = useState(null);
  const [types, setTypes] = useState([]);
  const [selectedTypeId, setSelectedTypeId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingGroup, setLoadingGroup] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const productRefs = useRef({});

  useEffect(() => {
    const loadGroupData = async () => {
      try {
        setLoadingGroup(true);
        setProducts([]);
        setSelectedTypeId(null);

        const groupData = await fetchGroup(groupId);
        const loadedGroup = Array.isArray(groupData) ? groupData[0] : groupData;
        setGroup(loadedGroup);

        if (loadedGroup?.viewId) {
          const typesData = await fetchTypesByGroupAndView(
            groupId,
            loadedGroup.viewId
          );
          setTypes(typesData || []);

          // !!! Вызов handleTypeClick отдельно после setTypes
          if (autoTypeId && typesData.some((t) => t.id === autoTypeId)) {
            setTimeout(() => {
              handleTypeClick(autoTypeId, true);
            }, 0); // или requestAnimationFrame(() => ...)
          }
        } else {
          setTypes([]);
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных группы:", error);
      } finally {
        setLoadingGroup(false);
      }
    };

    if (!isNaN(groupId)) {
      loadGroupData();
    }
  }, [groupId]);

  useEffect(() => {
    if (types.length > 0 && autoTypeId) {
      handleTypeClick(autoTypeId, true);
    }
  }, [types, autoTypeId]);

  useEffect(() => {
    if (!autoProductId) return;
    const el = productRefs.current[autoProductId];

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      el.style.transition = "background-color 0.5s";
      el.style.backgroundColor = "#d4fcd4";
      setTimeout(() => {
        el.style.backgroundColor = "";
      }, 3000);
    }
  }, [products.find((p) => p.id === autoProductId)]);

  const handleTypeClick = async (typeId, isAuto = false) => {
    if (!isAuto && selectedTypeId === typeId) {
      setSelectedTypeId(null);
      setProducts([]);
      return;
    }

    setSelectedTypeId(typeId);
    setLoadingProducts(true);

    try {
      const data = await fetchProducts(typeId, groupId);
      const loadedProducts = data?.rows || [];
      setProducts(loadedProducts);
    } catch (error) {
      console.error("Ошибка при загрузке продуктов:", error);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  if (loadingGroup) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" />
        <p>Загрузка информации о группе...</p>
      </div>
    );
  }

  if (!group) {
    return <Alert variant="danger">Группа не найдена.</Alert>;
  }

  return (
    <div>
      <h1>{group.name}</h1>
      {group.image && (
        <img
          src={`${process.env.REACT_APP_API_URL}static/${group.image}`}
          alt={group.name}
          width="200"
          className="rounded-lg shadow-md w-full max-w-md"
        />
      )}

      <div>
        <h3>Типы продукции</h3>
        <Row className="flex-nowrap overflow-auto mb-4">
          {types.length > 0 ? (
            types.map((type) => (
              <Col
                key={type.id}
                xs="auto"
                className="mb-2"
                style={{ minWidth: "200px" }}
              >
                <Card
                  onClick={() => handleTypeClick(type.id)}
                  className={`h-100 ${
                    selectedTypeId === type.id ? "border-primary" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  <Card.Body>
                    <Card.Title>{type.name}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Alert variant="warning">
              Типы продукции не найдены для этой группы.
            </Alert>
          )}
        </Row>
      </div>

      {loadingProducts && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}

      {selectedTypeId && !loadingProducts && (
        <div>
          <h3>Продукты</h3>
          {products.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Параметры</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const inCart = productStore.cart.find(
                    (item) => item.id === product.id
                  );

                  return (
                    <tr
                      key={product.id}
                      ref={(el) => (productRefs.current[product.id] = el)}
                    >
                      <td className="align-middle">
                        <div className="d-flex align-items-center justify-content-between gap-2">
                          <span>{product.name}</span>
                          {inCart ? (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() =>
                                productStore.removeFromCart(product.id)
                              }
                              title="Убрать из корзины"
                            >
                              ✅
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                productStore.addToCart({
                                  ...product,
                                  quantity: 1,
                                })
                              }
                              title="Добавить в корзину"
                            >
                              <ShoppingCart size={16} />
                            </Button>
                          )}
                        </div>
                      </td>
                      <td>
                        <ul className="mb-0">
                          {product.length && (
                            <li>
                              <strong>Длина:</strong> {product.length} мм
                            </li>
                          )}
                          {product.width && (
                            <li>
                              <strong>Ширина:</strong> {product.width} мм
                            </li>
                          )}
                          {product.height && (
                            <li>
                              <strong>Высота:</strong> {product.height} мм
                            </li>
                          )}
                          {product.weight && (
                            <li>
                              <strong>Масса:</strong> {product.weight} кг
                            </li>
                          )}
                          {product.load && (
                            <li>
                              <strong>Нагрузка:</strong> {product.load} кг
                            </li>
                          )}
                          {product.frostResistance && (
                            <li>
                              <strong>Морозостойкость:</strong>{" "}
                              {product.frostResistance}
                            </li>
                          )}
                          {product.innerDiameter && (
                            <li>
                              <strong>Диаметр (внутр.):</strong>{" "}
                              {product.innerDiameter} мм
                            </li>
                          )}
                          {product.outerDiameter && (
                            <li>
                              <strong>Диаметр (внешн.):</strong>{" "}
                              {product.outerDiameter} мм
                            </li>
                          )}
                          {!product.length &&
                            !product.width &&
                            !product.height &&
                            !product.weight &&
                            !product.load &&
                            !product.frostResistance &&
                            !product.innerDiameter &&
                            !product.outerDiameter && <li>Нет параметров</li>}
                        </ul>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <Alert variant="warning">Нет продуктов для этого типа.</Alert>
          )}
        </div>
      )}
    </div>
  );
};

export default observer(GroupPage);
