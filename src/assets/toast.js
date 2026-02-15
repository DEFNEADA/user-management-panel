const showToast = (message, type = "success") => {
  Toastify({
    text: message,
    duration: 3000,
    gravity: "bottom",
    position: "right",
    stopOnFocus: true,
    className: `bg-${type}`,
    style: {
      background: type === "success" ? "#28a745" : "#dc3545",
    },
  }).showToast();
};

export default showToast;
