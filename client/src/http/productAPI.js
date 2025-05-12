import { $authHost, $host } from "./index";

export const createView = async (view) => {
  try {
    const { data } = await $authHost.post("api/view", view);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchViews = async () => {
  const { data } = await $host.get("api/view");
  return data;
};

export const deleteView = async (id) => {
  try {
    const { data } = await $authHost.delete(`api/view/${id}`);
    return data;
  } catch (error) {
    console.error("Ошибка при удалении вида:", error);
    throw error;
  }
};

// ===== Группы =====
export const fetchGroups = async () => {
  const { data } = await $host.get("api/group");
  return data;
};

export const fetchGroup = async (id) => {
  const { data } = await $host.get(`api/group/${id}`);
  return data;
};

export const fetchGroupById = async (id) => {
  try {
    const { data } = await $host.get(`api/group/${id}`);
    return data;
  } catch (error) {
    console.error("Ошибка при получении группы по ID:", error);
    throw error;
  }
};

export const fetchGroupsByView = async (viewId) => {
  const { data } = await $host.get(`api/group?viewId=${viewId}`);
  return data;
};

export const createGroup = async (group, image) => {
  try {
    const formData = new FormData();
    formData.append("name", group.name);
    formData.append("viewId", String(group.viewId));
    if (group.description) formData.append("description", group.description); // добавляем описание
    if (group.isFavorite !== undefined)
      formData.append("isFavorite", group.isFavorite); // добавляем избранность
    if (image) formData.append("image", image);

    const { data } = await $authHost.post("api/group", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    console.error("Ошибка при создании группы:", error);
    throw error;
  }
};

export const toggleFavoriteGroup = async (groupId, isFavorite) => {
  try {
    const { data } = await $authHost.put(`api/group/${groupId}`, {
      isFavorite,
    });
    return data;
  } catch (error) {
    console.error("Ошибка при изменении избранности группы:", error);
    throw error;
  }
};

export const updateGroupDescription = async (groupId, description) => {
  try {
    const { data } = await $authHost.patch(`api/group/${groupId}/description`, {
      description,
    });
    return data;
  } catch (error) {
    console.error("Ошибка при обновлении описания группы:", error);
    throw error;
  }
};

export const deleteGroup = async (id) => {
  try {
    const { data } = await $authHost.delete(`api/group/${id}`);
    return data;
  } catch (error) {
    console.error("Ошибка при удалении группы:", error);
    throw error;
  }
};

// ===== Типы =====
export const createType = async (type) => {
  const { data } = await $authHost.post("api/type", type);
  return data;
};

export const fetchTypes = async () => {
  const { data } = await $host.get("api/type");
  return data;
};

export const fetchTypesByGroupAndView = async (groupId, viewId) => {
  try {
    const { data } = await $host.get(
      `api/type?groupId=${groupId}&viewId=${viewId}`
    );
    return data;
  } catch (error) {
    console.error("Ошибка при получении типов:", error);
    throw error;
  }
};

export const fetchAllTypes = async () => {
  const { data } = await $host.get("/api/type");
  return data;
};

export const deleteType = async (id) => {
  try {
    const { data } = await $authHost.delete(`api/type/${id}`);
    return data;
  } catch (error) {
    console.error("Ошибка при удалении типа:", error);
    throw error;
  }
};

// ===== Продукты =====
export const createProduct = async (product) => {
  const { data } = await $authHost.post("api/product", product);
  return data;
};

export const fetchProducts = async (typeId, groupId, page, limit = 5) => {
  const params = {};

  if (typeId && typeof typeId === "object") typeId = typeId.id;
  if (groupId && typeof groupId === "object") groupId = groupId.id;

  console.log("Sending Params:", { typeId, groupId, page, limit });

  if (typeId != null) params.typeId = typeId;
  if (groupId != null) params.groupId = groupId;
  if (page != null) params.page = page;
  params.limit = limit;

  try {
    const { data } = await $host.get("api/product", { params });
    return data;
  } catch (error) {
    console.error("Ошибка при получении продуктов:", error);
    throw error;
  }
};

export const fetchOneProduct = async (id) => {
  const { data } = await $host.get(`api/product/${id}`);
  return data;
};

export const deleteProduct = async (id) => {
  try {
    const { data } = await $authHost.delete(`api/product/${id}`);
    return data;
  } catch (error) {
    console.error("Ошибка при удалении продукта:", error);
    throw error;
  }
};
