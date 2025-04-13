import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { Card, Row } from "react-bootstrap";

const GroupBar = observer(() => {
  const { product } = useContext(Context);

  return (
    <Row className="d-flex">
      {product.groups.map((group) => (
        <Card
          style={{ cursor: "pointer" }}
          key={group.id}
          className="p-3"
          onClick={() => product.setSelectedGroup(group)}
          border={group.id === product.selectedBrand.id ? "danger" : "light"}
        >
          {group.name}
        </Card>
      ))}
    </Row>
  );
});

export default GroupBar;
