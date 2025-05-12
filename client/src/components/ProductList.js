import React, { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Context } from '../Context';
import { Row, Spinner } from "react-bootstrap";
import ProductItem from "./ProductItem";

const ProductList = observer(() => {
  const context = useContext(Context);
  const productStore = context?.product;

  // Проверка на случай, если контекст или store не прогрузился
  if (!context) return <div>No context available</div>;
  if (!productStore) return <div>No product store available</div>;

  // Если нет продуктов, показываем спиннер (или можно показывать сообщение о пустом списке)
  if (!productStore.products || productStore.products.length === 0) {
    return <Spinner animation="border" />;
  }

  return (
    <Row className="d-flex">
      {productStore.products?.length ? (
        productStore.products.map((product) =>
          product && product.id ? (
            <ProductItem key={product.id} product={product} />
          ) : (
            <div key="invalid">Ошибка с продуктом</div> // или null
          )
        )
      ) : (
        <div>Нет доступных продуктов</div> // или спиннер
      )}
    </Row>
  );
});

export default ProductList;
