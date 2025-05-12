import React, { useState, useEffect } from "react";
import { YMaps, Map, RoutePanel } from "@pbe/react-yandex-maps";

const DeliveryMap = ({ weight }) => {
  const [distanceKm, setDistanceKm] = useState(0);
  const [price, setPrice] = useState(null);
  const [error, setError] = useState("");

  const calculateDeliveryPrice = (distanceKm, weightKg) => {
    if (weightKg > 21000) {
      setError("Вес превышает 21 тонну. Свяжитесь с менеджером для расчета.");
      return null;
    }

    const baseKm = 20;
    const basePrice = 21500;

    if (distanceKm <= baseKm) {
      return basePrice;
    }

    const extraKm = distanceKm - baseKm;
    return basePrice + extraKm * 200;
  };

  const handleRouteChange = (event) => {
    setError("");
    const route = event.get("route");
    if (!route) return;

    const distanceMeters = route.getLength();
    const km = Math.round(distanceMeters / 1000);
    setDistanceKm(km);

    const weightKg = parseFloat(weight);
    if (!isNaN(weightKg)) {
      const cost = calculateDeliveryPrice(km, weightKg);
      if (cost !== null) setPrice(cost);
      else setPrice(null);
    } else {
      setError("Укажите корректный вес груза.");
      setPrice(null);
    }
  };

  return (
    <YMaps query={{ apikey: "d4b826bd-3d0d-403f-b2cc-dee8229dae4c" }}>
      <Map
        defaultState={{ center: [55.751244, 37.618423], zoom: 10 }}
        width="100%"
        height="500px"
      >
        <RoutePanel
          options={{ float: "right", maxWidth: 220 }}
          instanceRef={(ref) => {
            if (ref) {
              ref.routePanel.state.set({
                fromEnabled: true,
                toEnabled: true,
              });

              ref.routePanel.options.set({
                types: { auto: true },
              });

              ref.routePanel.events.add("routechange", handleRouteChange);
            }
          }}
        />
      </Map>

      <div style={{ marginTop: "1rem", fontSize: "1.1rem" }}>
        {error && <div style={{ color: "red" }}>{error}</div>}

        {price && !error && (
          <>
            <div>
              Расстояние: <strong>{distanceKm} км</strong>
            </div>
            <div>
              Примерная стоимость доставки:{" "}
              <strong>{price.toLocaleString()} ₽</strong>
            </div>
          </>
        )}
      </div>
    </YMaps>
  );
};

export default DeliveryMap;
