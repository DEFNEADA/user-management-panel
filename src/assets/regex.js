export const patterns = {
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  passwordRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,

  usernameRegex: /^[a-zA-Z0-9_ğüşıöçĞÜŞİÖÇ]{3,20}$/,
};

export function emailRegex(email) {
  if (!patterns.emailRegex.test(email)) {
    alert("Lütfen geçerli bir e-posta adresi girin.");
    return false;
  } else {
    return true;
  }
}

export function passwordRegex(password) {
  if (!patterns.passwordRegex.test(password)) {
    alert(
      "Güvenliğiniz için en az 8 karakterli büyük harf,küçük harf ve sayı içeren bir şifre giriniz",
    );
    return false;
  } else {
    return true;
  }
}

export function usernameRegex(username) {
  if (!patterns.usernameRegex.test(username)) {
    alert(
      "Kullanıcı adı en az 3 karakterden oluşmalı boşluk veya nokta kullanmayınız",
    );

    return false;
  } else {
    return true;
  }
}
