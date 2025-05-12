import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from '../Context';
import { Card, Row } from "react-bootstrap";

const GroupBar = observer(() => {
  const { product } = useContext(Context);

  // Проверяем, что данные загружены
  if (!product.groups || product.groups.length === 0) {
    return <div>Загрузка групп...</div>; // Здесь можно добавить спиннер или другой индикатор загрузки
  }

  return (
    <Row className="d-flex">
      {product.groups.map((group) =>
        group && group.id ? ( // Проверяем, что у группы есть id
          <Card
            style={{ cursor: "pointer" }}
            key={group.id}
            className="p-3"
            onClick={() => product.setSelectedGroup(group)}
            border={group.id === product.selectedGroup?.id ? "danger" : "light"} // Используем optional chaining для выбранной группы
          >
            {group.name}
          </Card>
        ) : (
          <div key="invalid">Ошибка с группой</div>
        )
      )}
    </Row>
  );
});

export default GroupBar;
