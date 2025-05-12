import React, { useEffect, useContext } from "react";
import { Button, ListGroup, Row, Col } from "react-bootstrap";
import { Context } from "../../Context";
import {
  fetchViews,
  fetchGroups,
  fetchTypes,
  deleteView,
  deleteGroup,
  deleteType,
} from "../../http/productAPI";

const AdminPanelManageEntities = () => {
  const { product } = useContext(Context);

  const loadData = async () => {
    try {
      const views = await fetchViews();
      const groups = await fetchGroups();
      const types = await fetchTypes();
      product.setViews(views);
      product.setGroups(groups);
      product.setTypes(types);
    } catch (error) {
      console.error("Ошибка при загрузке данных", error);
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id, type) => {
    try {
      if (type === "view") await deleteView(id);
      else if (type === "group") await deleteGroup(id);
      else if (type === "type") await deleteType(id);
      loadData(); // Обновляем после удаления
    } catch (e) {
      alert("Ошибка при удалении");
    }
  };

  return (
    <div className="p-3">
      <Row>
        <Col md={4}>
          <h5>Виды продукции</h5>
          <ListGroup>
            {product.views.map((v) => (
              <ListGroup.Item
                key={v.id}
                className="d-flex justify-content-between align-items-center"
              >
                {v.name}
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(v.id, "view")}
                >
                  Удалить
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={4}>
          <h5>Группы</h5>
          <ListGroup>
            {product.groups.map((g) => (
              <ListGroup.Item
                key={g.id}
                className="d-flex justify-content-between align-items-center"
              >
                {g.name}
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(g.id, "group")}
                >
                  Удалить
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={4}>
          <h5>Типы</h5>
          <ListGroup>
            {product.types.map((t) => (
              <ListGroup.Item
                key={t.id}
                className="d-flex justify-content-between align-items-center"
              >
                {t.name}
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(t.id, "type")}
                >
                  Удалить
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </div>
  );
};

export default AdminPanelManageEntities;
