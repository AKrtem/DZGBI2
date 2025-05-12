import React, { useEffect, useContext } from "react";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";

const RedirectHandler = observer(() => {
  const { user } = useContext(Context);

  useEffect(() => {
    console.log("RedirectHandler: user role is:", user.role);
    // Убираем весь код, который выполнял редирект
  }, [user.isAuth, user.role]);

  return null;
});

export default RedirectHandler;
