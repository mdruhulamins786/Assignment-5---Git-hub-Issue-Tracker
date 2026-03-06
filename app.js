// login page functionality

const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = form.username.value;
  const password = form.password.value;

  if (username === "admin" && password === "admin123") {
    window.location.href = "tracker.html";
  } else {
    alert("Invalid username or password");
  }
});
