const button = document.querySelector("button");

button.addEventListener("click", () => {
  fetch("http://localhost:8000/create-checkout-session", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        { id: 1, quantity: 2 },
        { id: 2, quantity: 5 },
      ],
    }),
  })
    .then((res) => {
      if (res.ok) return res.json();
      return res.json().then((json) => Promise.reject(json));
    })
    .then(({ url }) => {
      window.location = url;
    })
    .catch((e) => {
      console.log(e.error);
    });
});
