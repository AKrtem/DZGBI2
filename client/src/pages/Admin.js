import React, { useState, useEffect, useContext } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import CreateGroup from "../components/modals/CreateGroup";
import CreateProduct from "../components/modals/CreateProduct";
import CreateType from "../components/modals/CreateType";
import CreateView from "../components/modals/CreateView";
import {
  fetchViews,
  fetchGroups,
  fetchTypes,
  fetchProducts,
  deleteView,
  deleteGroup,
  deleteType,
  deleteProduct,
  toggleFavoriteGroup,
  updateGroupDescription,
} from "../http/productAPI";
import { Context } from "../Context";
import { X, Star, StarOff } from "lucide-react";
import axios from "axios";

const Admin = () => {
  const [groupVisible, setGroupVisible] = useState(false);
  const [typeVisible, setTypeVisible] = useState(false);
  const [productVisible, setProductVisible] = useState(false);
  const [viewVisible, setViewVisible] = useState(false);

  const { product } = useContext(Context);
  const [groups, setGroups] = useState([]);
  const [selectedTypeId, setSelectedTypeId] = useState(null);
  const [products, setProducts] = useState([]);

  // Состояния для редактирования описания
  const [editingDescription, setEditingDescription] = useState(null);
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    fetchViews().then((data) => {
      if (Array.isArray(data)) {
        product.setViews(
          data.sort((a, b) => a.name.localeCompare(b.name, "ru"))
        );
      } else {
        product.setViews([]);
      }
    });

    fetchGroups().then((data) => {
      if (Array.isArray(data)) {
        setGroups(data.sort((a, b) => a.name.localeCompare(b.name, "ru")));
      } else {
        setGroups([]);
      }
    });

    fetchTypes().then((data) => {
      const types = Array.isArray(data) ? data : data?.rows || [];
      if (Array.isArray(types)) {
        product.setTypes(
          types.sort((a, b) => a.name.localeCompare(b.name, "ru"))
        );
      } else {
        product.setTypes([]);
      }
    });
  }, [product]);

  const handleTypeClick = async (typeId) => {
    if (selectedTypeId === typeId) {
      setSelectedTypeId(null);
      setProducts([]);
    } else {
      try {
        const { rows } = await fetchProducts(typeId, null, 1);
        setSelectedTypeId(typeId);
        setProducts(rows);
      } catch (error) {
        console.error("Ошибка при получении продуктов:", error);
      }
    }
  };

  const handleDeleteView = async (id) => {
    if (window.confirm("Удалить этот вид?")) {
      try {
        await deleteView(id);
        product.setViews(product.views.filter((view) => view.id !== id));
      } catch (err) {
        alert("Ошибка при удалении вида");
      }
    }
  };

  const handleToggleFavorite = async (groupId, currentFavorite) => {
    try {
      await toggleFavoriteGroup(groupId, !currentFavorite);
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === groupId
            ? { ...group, isFavorite: !currentFavorite }
            : group
        )
      );
    } catch (err) {
      alert("Ошибка при изменении избранности группы");
    }
  };

  const handleDeleteGroup = async (id) => {
    if (window.confirm("Удалить эту группу?")) {
      try {
        await deleteGroup(id);
        setGroups((prev) => prev.filter((group) => group.id !== id));
        product.setTypes((prevTypes) =>
          Array.isArray(prevTypes)
            ? prevTypes.filter((type) => type.groupId !== id)
            : []
        );
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.groupId !== id)
        );
      } catch (err) {
        alert("Ошибка при удалении группы");
      }
    }
  };

  const handleDeleteType = async (id) => {
    const type = Array.isArray(product.types)
      ? product.types.find((t) => t.id === id)
      : null;
    const typeProducts = products.filter((p) => p.typeId === id);

    if (typeProducts.length > 0) {
      alert(
        `Нельзя удалить тип "${type?.name}", так как он содержит продукты.`
      );
      return;
    }

    if (!window.confirm(`Удалить тип "${type?.name}"?`)) return;

    try {
      await deleteType(id);

      const updatedTypes = Array.isArray(product.types)
        ? product.types.filter((t) => t.id !== id)
        : [];

      product.setTypes(updatedTypes);

      if (selectedTypeId === id) {
        setSelectedTypeId(null);
        setProducts([]);
      }
    } catch (err) {
      alert("Ошибка при удалении типа");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Удалить этот продукт?")) {
      try {
        await deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        alert("Ошибка при удалении продукта");
      }
    }
  };

  // Функция для обновления описания группы
  const handleUpdateDescription = async (groupId) => {
    try {
      await updateGroupDescription(groupId, newDescription);
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === groupId
            ? { ...group, description: newDescription }
            : group
        )
      );
      setEditingDescription(null);
      setNewDescription("");
    } catch (err) {
      alert("Ошибка при обновлении описания группы");
    }
  };

  return (
    <Container className="py-4">
      <Row className="mb-3">
        <Col>
          <Button
            variant="outline-secondary"
            onClick={() => setViewVisible(true)}
          >
            + Вид
          </Button>{" "}
          <Button
            variant="outline-secondary"
            onClick={() => setGroupVisible(true)}
          >
            + Группа
          </Button>{" "}
          <Button
            variant="outline-secondary"
            onClick={() => setTypeVisible(true)}
          >
            + Тип
          </Button>{" "}
          <Button
            variant="outline-secondary"
            onClick={() => setProductVisible(true)}
          >
            + Продукт
          </Button>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <h5>Виды</h5>
          <ul className="list-unstyled">
            {product.views
              ?.sort((a, b) => a.name.localeCompare(b.name, "ru"))
              .map((view) => (
                <li
                  key={view.id}
                  className="d-flex justify-content-between align-items-center border-bottom py-1"
                >
                  {view.name}
                  <X
                    size={16}
                    className="text-danger"
                    role="button"
                    onClick={() => handleDeleteView(view.id)}
                  />
                </li>
              ))}
          </ul>

          <h5 className="mt-4">Группы</h5>
          <ul className="list-unstyled">
            {groups
              ?.sort((a, b) => a.name.localeCompare(b.name, "ru"))
              .map((group) => (
                <li
                  key={group.id}
                  className="d-flex justify-content-between align-items-center border-bottom py-1"
                >
                  {group.name}
                  <div className="d-flex gap-2 align-items-center">
                    {group.isFavorite ? (
                      <Star
                        size={16}
                        className="text-warning"
                        role="button"
                        onClick={() => handleToggleFavorite(group.id, true)}
                        title="Убрать из избранного"
                      />
                    ) : (
                      <StarOff
                        size={16}
                        className="text-muted"
                        role="button"
                        onClick={() => handleToggleFavorite(group.id, false)}
                        title="Добавить в избранное"
                      />
                    )}
                    <X
                      size={16}
                      className="text-danger"
                      role="button"
                      onClick={() => handleDeleteGroup(group.id)}
                      title="Удалить группу"
                    />

                    {/* Добавление кнопки для редактирования описания */}
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setEditingDescription(group.id)}
                    >
                      Редактировать описание
                    </button>
                  </div>

                  {/* Если редактируем описание этой группы */}
                  {editingDescription === group.id && (
                    <div className="mt-2">
                      <textarea
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        rows="3"
                        className="form-control"
                        placeholder="Введите описание"
                      />
                      <button
                        className="btn btn-primary mt-2"
                        onClick={() => handleUpdateDescription(group.id)}
                      >
                        Сохранить описание
                      </button>
                      <button
                        className="btn btn-secondary mt-2 ml-2"
                        onClick={() => {
                          setEditingDescription(null);
                          setNewDescription("");
                        }}
                      >
                        Отмена
                      </button>
                    </div>
                  )}
                </li>
              ))}
          </ul>
        </Col>

        <Col md={8}>
          <h5>Типы и продукты</h5>
          <ul className="list-unstyled">
            {Array.isArray(product.types) &&
              product.types
                .sort((a, b) => a.name.localeCompare(b.name, "ru"))
                .map((type) => (
                  <li key={type.id} className="mb-2">
                    <div className="d-flex justify-content-between align-items-center border-bottom py-1">
                      <Button
                        variant="link"
                        onClick={() => handleTypeClick(type.id)}
                      >
                        {type.name}
                      </Button>
                      <X
                        size={16}
                        className="text-danger"
                        role="button"
                        onClick={() => handleDeleteType(type.id)}
                      />
                    </div>
                    {selectedTypeId === type.id && (
                      <ul className="ms-3 mt-1 list-unstyled">
                        {products.length > 0 ? (
                          products.map((p) => (
                            <li
                              key={p.id}
                              className="d-flex justify-content-between align-items-center"
                            >
                              🔹 {p.name} {p.length && `(${p.length} м)`}
                              <X
                                size={14}
                                className="text-danger"
                                role="button"
                                onClick={() => handleDeleteProduct(p.id)}
                              />
                            </li>
                          ))
                        ) : (
                          <li className="text-muted">Нет продуктов</li>
                        )}
                      </ul>
                    )}
                  </li>
                ))}
          </ul>
        </Col>
      </Row>

      {/* Модалки */}
      <CreateView
        show={viewVisible}
        onHide={() => setViewVisible(false)}
        onCreateSuccess={(newView) =>
          product.setViews((prev) =>
            Array.isArray(prev)
              ? [...prev, newView].sort((a, b) =>
                  a.name.localeCompare(b.name, "ru")
                )
              : [newView]
          )
        }
      />

      <CreateGroup
        show={groupVisible}
        onHide={() => setGroupVisible(false)}
        onCreateSuccess={(newGroup) =>
          setGroups((prev) =>
            Array.isArray(prev)
              ? [...prev, newGroup].sort((a, b) =>
                  a.name.localeCompare(b.name, "ru")
                )
              : [newGroup]
          )
        }
      />

      <CreateType
        show={typeVisible}
        onHide={() => setTypeVisible(false)}
        onCreateSuccess={(newType) =>
          product.setTypes((prev) =>
            Array.isArray(prev)
              ? [...prev, newType].sort((a, b) =>
                  a.name.localeCompare(b.name, "ru")
                )
              : [newType]
          )
        }
      />

      <CreateProduct
        show={productVisible}
        onHide={() => setProductVisible(false)}
        onCreateSuccess={(newProduct) =>
          setProducts((prev) => [...prev, newProduct])
        }
      />
    </Container>
  );
};

export default Admin;
