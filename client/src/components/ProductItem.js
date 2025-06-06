import React from "react";
import { Card, Col } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import star from "../assets/star.png";
import { useNavigate } from "react-router-dom"; // заменили useHistory на useNavigate
import { PRODUCT_ROUTE } from "../utils/consts";

const ProductItem = ({ product }) => {
  const navigate = useNavigate(); // используем useNavigate
  return (
    <Col
      md={3}
      className={"mt-3"}
      onClick={() => navigate(PRODUCT_ROUTE + "/" + product.id)} // используем navigate
    >
      <Card style={{ width: 150, cursor: "pointer" }} border={"light"}>
        <Image
          width={150}
          height={150}
          src={process.env.REACT_APP_API_URL + product.img}
        />
        <div className="text-black-50 mt-1 d-flex justify-content-between align-items-center">
          <div>Samsung...</div>
          <div className="d-flex align-items-center">
            <div>{product.rating}</div>
            <Image width={18} height={18} src={star} />
          </div>
        </div>
        <div>{product.name}</div>
      </Card>
    </Col>
  );
};

export default ProductItem;
