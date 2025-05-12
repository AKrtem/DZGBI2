import React from "react";
import { Container } from "react-bootstrap";

const CompanyInfo = () => {
  const images = [
    { src: "/img/about1.jpg", alt: "Офис компании" },
    { src: "/img/about2.jpg", alt: "Склад продукции" },
    { src: "/img/about3.jpg", alt: "Команда" },
  ];

  return (
    <Container className="mt-10">
      <h2 className="text-2xl font-semibold mb-6">О нашей компании</h2>
      <p className="text-gray-700 mb-8">
        Мы — молодая и амбициозная команда, которая занимается продажей
        качественной продукции. Наша цель — предложить клиенту лучшее сочетание
        цены и качества.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="overflow-hidden rounded-2xl shadow-md transition-transform duration-300 ease-in-out hover:translate-x-2"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-64 object-cover"
            />
          </div>
        ))}
      </div>
    </Container>
  );
};

export default CompanyInfo;
