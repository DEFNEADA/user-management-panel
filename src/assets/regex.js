import { Store } from "./store.js";

export const patterns = {
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  passwordRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,

  usernameRegex: /^[a-zA-Z0-9_ğüşıöçĞÜŞİÖÇ]{3,20}$/,
};

export function emailRegex(input) {
  const value = input.value.trim();
  if (!value) {
    Store.setError("Lütfen tüm alanları doldurun.");
    input.classList.add("is-invalid");
    return false;
  }
  if (!patterns.emailRegex.test(value)) {
    Store.setError("Lütfen geçerli bir e-posta adresi girin.");
    input.classList.add("is-invalid");
    return false;
  } else {
    Store.clearError();
    input.classList.remove("is-invalid");
    return true;
  }
}

export function passwordRegex(input) {
  const value = input.value;
  if (!value) {
    Store.setError("Lütfen tüm alanları doldurun.");
    input.classList.add("is-invalid");
    return false;
  }
  if (!patterns.passwordRegex.test(value)) {
    Store.setError(
      "Güvenliğiniz için en az 8 karakterli büyük harf,küçük harf ve sayı içeren bir şifre giriniz",
    );
    input.classList.add("is-invalid");
    return false;
  } else {
    Store.clearError();
    input.classList.remove("is-invalid");
    return true;
  }
}

export function usernameRegex(input) {
  const value = input.value.trim();
  if (!value) {
    Store.setError("Lütfen tüm alanları doldurun.");
    input.classList.add("is-invalid");
    return false;
  }
  if (!patterns.usernameRegex.test(value)) {
    Store.setError(
      "Kullanıcı adı en az 3 karakterden oluşmalı boşluk veya nokta kullanmayınız",
    );
    input.classList.add("is-invalid");
    return false;
  } else {
    Store.clearError();
    input.classList.remove("is-invalid");
    return true;
  }
}
