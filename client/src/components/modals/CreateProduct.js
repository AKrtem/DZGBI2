import React, { useContext, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Button, Dropdown, Form, Row, Col } from "react-bootstrap";
import { Context } from "../../Context";
import {
  createProduct,
  fetchGroups,
  fetchTypes,
  fetchViews,
} from "../../http/productAPI";
import { observer } from "mobx-react-lite";

const CreateProduct = observer(({ show, onHide, onCreateSuccess }) => {
  const { product } = useContext(Context);

  const [name, setName] = useState("");
  const [allGroups, setAllGroups] = useState([]);
  const [allTypes, setAllTypes] = useState([]);

  // Параметры продукта (все необязательные)
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [load, setLoad] = useState("");
  const [weight, setWeight] = useState("");
  const [frostResistance, setFrostResistance] = useState("");
  const [innerDiameter, setInnerDiameter] = useState("");
  const [outerDiameter, setOuterDiameter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const viewsData = await fetchViews();
      const groupsData = await fetchGroups();
      const typesData = await fetchTypes();

      product.setViews(viewsData);
      setAllGroups(groupsData);
      setAllTypes(typesData);
    };

    fetchData();
  }, []);

  const filteredGroups = product.selectedView
    ? allGroups.filter((g) => g.viewId === product.selectedView.id)
    : [];

  const filteredTypes = product.selectedGroup
    ? allTypes.filter((type) => type.groupId === product.selectedGroup.id)
    : [];

  const resetForm = () => {
    setName("");
    setLength("");
    setWidth("");
    setHeight("");
    setLoad("");
    setWeight("");
    setFrostResistance("");
    setInnerDiameter("");
    setOuterDiameter("");
    product.setSelectedView(null);
    product.setSelectedGroup(null);
    product.setSelectedType(null);
  };

  const handleClose = () => {
    resetForm();
    onHide();
  };

  const addProduct = () => {
    if (
      !product.selectedView ||
      !product.selectedGroup ||
      !product.selectedType ||
      !name
    ) {
      alert("Заполните обязательные поля: имя, вид, группа, тип");
      return;
    }

    const info = [
      { title: "Длина", description: length },
      { title: "Ширина", description: width },
      { title: "Высота", description: height },
      { title: "Нагрузка", description: load },
      { title: "Масса", description: weight },
      { title: "Морозостойкость", description: frostResistance },
      { title: "Внутренний диаметр", description: innerDiameter },
      { title: "Внешний диаметр", description: outerDiameter },
    ].filter((i) => i.description); // Убираем пустые

    const payload = {
      name,
      viewId: product.selectedView.id,
      groupId: product.selectedGroup.id,
      typeId: product.selectedType.id,
      length: length || null,
      width: width || null,
      height: height || null,
      load: load || null,
      weight: weight || null,
      frostResistance: frostResistance || null,
      innerDiameter: innerDiameter || null,
      outerDiameter: outerDiameter || null,
      info, // <-- передаём массив параметров
    };

    createProduct(payload)
      .then(() => {
        if (onCreateSuccess) onCreateSuccess();
        handleClose();
      })
      .catch((err) => {
        console.error("Ошибка при создании продукта", err);
        alert("Ошибка при создании продукта");
      });
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Добавить продукт</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Dropdown className="mb-2">
            <Dropdown.Toggle>
              {product.selectedView?.name || "Выберите вид"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {product.views.map((view) => (
                <Dropdown.Item
                  key={view.id}
                  onClick={() => {
                    product.setSelectedView(view);
                    product.setSelectedGroup(null);
                    product.setSelectedType(null);
                  }}
                >
                  {view.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown className="mb-2">
            <Dropdown.Toggle>
              {product.selectedGroup?.name || "Выберите группу"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {filteredGroups.map((group) => (
                <Dropdown.Item
                  key={group.id}
                  onClick={() => {
                    product.setSelectedGroup(group);
                    product.setSelectedType(null);
                  }}
                >
                  {group.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown className="mb-3">
            <Dropdown.Toggle>
              {product.selectedType?.name || "Выберите тип"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {filteredTypes.map((type) => (
                <Dropdown.Item
                  key={type.id}
                  onClick={() => product.setSelectedType(type)}
                >
                  {type.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Form.Control
            className="mb-3"
            placeholder="Введите название продукта"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Row>
            <Col md={6}>
              <Form.Control
                className="mb-2"
                placeholder="Длина (мм)"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                type="number"
              />
              <Form.Control
                className="mb-2"
                placeholder="Ширина (мм)"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                type="number"
              />
              <Form.Control
                className="mb-2"
                placeholder="Высота (мм)"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                type="number"
              />
              <Form.Control
                className="mb-2"
                placeholder="Нагрузка (кг)"
                value={load}
                onChange={(e) => setLoad(e.target.value)}
                type="number"
              />
            </Col>
            <Col md={6}>
              <Form.Control
                className="mb-2"
                placeholder="Масса (кг)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                type="number"
              />
              <Form.Control
                className="mb-2"
                placeholder="Морозостойкость"
                value={frostResistance}
                onChange={(e) => setFrostResistance(e.target.value)}
              />
              <Form.Control
                className="mb-2"
                placeholder="Внутренний диаметр (мм)"
                value={innerDiameter}
                onChange={(e) => setInnerDiameter(e.target.value)}
                type="number"
              />
              <Form.Control
                className="mb-2"
                placeholder="Внешний диаметр (мм)"
                value={outerDiameter}
                onChange={(e) => setOuterDiameter(e.target.value)}
                type="number"
              />
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={handleClose}>
          Закрыть
        </Button>
        <Button
          variant="outline-success"
          onClick={addProduct}
          disabled={!name || !product.selectedType}
        >
          Добавить
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default CreateProduct;
