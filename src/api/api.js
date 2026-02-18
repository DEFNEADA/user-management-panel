import { Config } from "./config.js";
import { Store } from "../assets/store.js";
import showToast from "../assets/toast.js";

export async function postRequest(endpoint, data) {
  const token = Store.state.token;
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${Config.baseUrl}${endpoint}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        Store.logout();
        window.location.href = "login.html";
        throw new Error("Oturum süresi doldu, lütfen tekrar giriş yapın.");
      }
      if (response.status === 403) {
        throw showToast("Bu işlem için yetkiniz bulunmamaktadır!", "error");
      }
      const errorText = await response.text();
      throw new Error(errorText || "Network response was not ok");
    }

    return response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function getRequest(endpoint) {
  const token = Store.state.token;
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${Config.baseUrl}${endpoint}`, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        Store.logout();
        window.location.href = "login.html";
        throw new Error("Oturum süresi doldu, lütfen tekrar giriş yapın.");
      }
      if (response.status === 403) {
        throw new Error("Bu veriyi görüntüleme yetkiniz yok!");
      }
      const errorText = await response.text();
      throw new Error(errorText || "Veri çekilemedi");
    }
    return response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function patchRequest(endpoint, data) {
  const token = Store.state.token;
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  try {
    const response = await fetch(`${Config.baseUrl}${endpoint}`, {
      method: "PATCH",
      headers: headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      if (response.status === 401) {
        Store.logout();
        window.location.href = "login.html";
        throw new Error("Oturum süresi doldu, lütfen tekrar giriş yapın.");
      }
      if (response.status === 403) {
        throw new Error("Bu işlem için yetkiniz bulunmamaktadır!");
      }
      const errorText = await response.text();
      throw new Error(errorText || "Veri güncellenemedi");
    }
    return response.json();
  } catch (error) {
    throw error;
  }
}

export async function deleteRequest(endpoint) {
  const token = Store.state.token;
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  try {
    const response = await fetch(`${Config.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers: headers,
    });
    if (!response.ok) {
      if (response.status === 401) {
        Store.logout();
        window.location.href = "login.html";
        throw new Error("Oturum süresi doldu, lütfen tekrar giriş yapın.");
      }
      if (response.status === 403) {
        throw new Error("Bu işlem için yetkiniz bulunmamaktadır!");
      }
      const errorText = await response.text();
      throw new Error(errorText || "Silme işlemi başarısız");
    }
    return response.json();
  } catch (error) {
    throw error;
  }
}
