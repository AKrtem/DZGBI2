import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Spinner } from "react-bootstrap";
import axios from "axios";

const Plity = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    length: [],
    width: [],
    height: [],
    weight: [],
    load: [],
  });

  const [selectedFilters, setSelectedFilters] = useState({
    length: "",
    width: "",
    height: "",
    weight: "",
    load: "",
  });

  const [loading, setLoading] = useState(false); // Стейт для загрузки
  const [error, setError] = useState(null); // Стейт для ошибок

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Включаем загрузку
      try {
        const response = await axios.get("/api/product?group=Плиты");
        const products = response.data;
        setProducts(products);
        setFilteredProducts(products);

        // Если продукты пришли, собираем уникальные значения для фильтров
        if (products.length > 0) {
          const lengths = [
            ...new Set(products.map((p) => p.length).filter(Boolean)),
          ].sort((a, b) => a - b);
          const widths = [
            ...new Set(products.map((p) => p.width).filter(Boolean)),
          ].sort((a, b) => a - b);
          const heights = [
            ...new Set(products.map((p) => p.height).filter(Boolean)),
          ].sort((a, b) => a - b);
          const weights = [
            ...new Set(products.map((p) => p.weight).filter(Boolean)),
          ].sort((a, b) => a - b);
          const loads = [
            ...new Set(products.map((p) => p.load).filter(Boolean)),
          ].sort((a, b) => a - b);

          setFilterOptions({
            length: lengths,
            width: widths,
            height: heights,
            weight: weights,
            load: loads,
          });
        }
      } catch (error) {
        setError("Ошибка при загрузке данных: " + error.message); // Обработка ошибки
      } finally {
        setLoading(false); // Завершаем загрузку
      }
    };

    fetchProducts();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...selectedFilters, [name]: value };
    setSelectedFilters(newFilters);

    let filtered = products.filter((product) => {
      const matchesLength =
        !newFilters.length || product.length === newFilters.length;
      const matchesWidth =
        !newFilters.width || product.width === newFilters.width;
      const matchesHeight =
        !newFilters.height || product.height === newFilters.height;
      const matchesWeight =
        !newFilters.weight || product.weight === newFilters.weight;
      const matchesLoad = !newFilters.load || product.load === newFilters.load;

      return (
        matchesLength &&
        matchesWidth &&
        matchesHeight &&
        matchesWeight &&
        matchesLoad
      );
    });

    setFilteredProducts(filtered);
  };

  if (loading) {
    return (
      <Container className="my-5">
        <h1>Плиты</h1>
        <Spinner animation="border" variant="primary" />{" "}
        {/* Индикация загрузки */}
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <h1>Плиты</h1>
        <p>{error}</p> {/* Ошибка при загрузке */}
      </Container>
    );
  }

  if (products.length === 0) {
    return (
      <Container className="my-5">
        <h1>Плиты</h1>
        <p>Продуктов пока нет</p> {/* Если продуктов нет */}
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h1>Плиты</h1>
      <p>Выберите параметры плит для фильтрации:</p>

      {/* Фильтры */}
      <Row className="mb-4">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Длина (см)</Form.Label>
            <Form.Select
              name="length"
              value={selectedFilters.length}
              onChange={handleFilterChange}
            >
              <option value="">Все</option>
              {filterOptions.length.map((length) => (
                <option key={length} value={length}>
                  {length}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group>
            <Form.Label>Ширина (см)</Form.Label>
            <Form.Select
              name="width"
              value={selectedFilters.width}
              onChange={handleFilterChange}
            >
              <option value="">Все</option>
              {filterOptions.width.map((width) => (
                <option key={width} value={width}>
                  {width}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group>
            <Form.Label>Высота (см)</Form.Label>
            <Form.Select
              name="height"
              value={selectedFilters.height}
              onChange={handleFilterChange}
            >
              <option value="">Все</option>
              {filterOptions.height.map((height) => (
                <option key={height} value={height}>
                  {height}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group>
            <Form.Label>Масса (кг)</Form.Label>
            <Form.Select
              name="weight"
              value={selectedFilters.weight}
              onChange={handleFilterChange}
            >
              <option value="">Все</option>
              {filterOptions.weight.map((weight) => (
                <option key={weight} value={weight}>
                  {weight}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group>
            <Form.Label>Нагрузка (кг)</Form.Label>
            <Form.Select
              name="load"
              value={selectedFilters.load}
              onChange={handleFilterChange}
            >
              <option value="">Все</option>
              {filterOptions.load.map((load) => (
                <option key={load} value={load}>
                  {load}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* Список плит */}
      <Row>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Col xs={12} md={4} key={product.id} className="mb-4">
              <div className="p-3 bg-light border rounded">
                <h5>{product.name}</h5>
                <p>Тип: {product.type}</p>
                <p>
                  Размеры: {product.length} x {product.width} x {product.height}{" "}
                  см
                </p>
                <p>Масса: {product.weight} кг</p>
              </div>
            </Col>
          ))
        ) : (
          <p>Нет плит, удовлетворяющих фильтрам.</p>
        )}
      </Row>
    </Container>
  );
};

export default Plity;
