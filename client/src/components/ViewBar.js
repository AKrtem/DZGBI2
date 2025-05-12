import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from '../Context';
import { Card, Row } from "react-bootstrap";

const ViewBar = observer(() => {
  const { product } = useContext(Context);

  return (
    <Row className="d-flex">
      {product.views.map((view) => (
        <Card
          style={{ cursor: "pointer" }}
          key={view.id}
          className="p-3"
          onClick={() => product.setSelectedGroup(view)}
          border={view.id === product.selectedView.id ? "danger" : "light"}
        >
          {view.name}
        </Card>
      ))}
    </Row>
  );
});

export default ViewBar;
