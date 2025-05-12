import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../Context";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

const CartPage = observer(() => {
  const { product } = useContext(Context);
  const navigate = useNavigate();

  const cart = product.cart;

  // Локальное состояние для отслеживания текущих значений ввода
  const [quantities, setQuantities] = useState(() =>
    Object.fromEntries(cart.map((item) => [item.id, item.quantity]))
  );

  const handleQuantityChange = (id, value) => {
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const handleQuantityBlur = (id, value) => {
    const qty = parseInt(value, 10);
    if (!isNaN(qty) && qty > 0) {
      product.updateQuantity(id, qty);
    } else {
      // Возврат к текущему значению в store, если ввод невалидный
      setQuantities((prev) => ({
        ...prev,
        [id]: product.cart.find((i) => i.id === id)?.quantity || 1,
      }));
    }
  };

  const handleRemove = (id) => {
    product.removeFromCart(id);
  };

  const handleClearCart = () => {
    cart.forEach((item) => product.removeFromCart(item.id));
  };

  const handleToApplication = () => {
    sessionStorage.setItem("cartItems", JSON.stringify(cart));
    navigate("/apply");
  };

  const renderParameters = (item) => {
    if (!item) return "—";

    return (
      <>
        {item.length && <p>Длина: {item.length} мм</p>}
        {item.width && <p>Ширина: {item.width} мм</p>}
        {item.height && <p>Высота: {item.height} мм</p>}
        {item.weight && <p>Масса: {item.weight} кг</p>}
        {item.load && <p>Нагрузка: {item.load} кг</p>}
        {item.frostResistance && <p>Морозостойкость: {item.frostResistance}</p>}
        {item.innerDiameter && <p>Диаметр (внутр.): {item.innerDiameter} мм</p>}
        {item.outerDiameter && <p>Диаметр (внешн.): {item.outerDiameter} мм</p>}
        {!item.length &&
          !item.width &&
          !item.height &&
          !item.weight &&
          !item.load &&
          !item.frostResistance &&
          !item.innerDiameter &&
          !item.outerDiameter && <p>Нет параметров</p>}
      </>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🛒 Ваша корзина</h1>

      {cart.length === 0 ? (
        <div className="text-gray-500 text-lg">Корзина пуста.</div>
      ) : (
        <>
          <div className="flex justify-end mb-4 gap-4">
            <Button variant="outline" onClick={handleClearCart}>
              Очистить корзину
            </Button>
            <Button onClick={handleToApplication}>Добавить в заявку</Button>
          </div>

          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white shadow rounded-2xl p-4 flex justify-between items-center"
              >
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  {renderParameters(item)}

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-gray-500">Кол-во:</span>
                    <input
                      type="number"
                      min="1"
                      className="border rounded px-2 py-1 w-20 text-sm"
                      value={quantities[item.id] ?? item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, e.target.value)
                      }
                      onBlur={(e) =>
                        handleQuantityBlur(item.id, e.target.value)
                      }
                    />
                  </div>
                </div>

                <Button
                  variant="destructive"
                  onClick={() => handleRemove(item.id)}
                >
                  Удалить
                </Button>
              </div>
            ))}
          </div>

          <div className="text-right text-sm text-gray-600 mt-6">
            Всего позиций:{" "}
            {cart.reduce((total, item) => total + item.quantity, 0)}
          </div>
        </>
      )}
    </div>
  );
});

export default CartPage;
