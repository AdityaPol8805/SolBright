// toggle day/month inputs
document.querySelectorAll("input[name='mode']").forEach((radio) => {
  radio.addEventListener("change", () => {
    const mode = document.querySelector("input[name='mode']:checked").value;
    document.getElementById("day-inputs").style.display =
      mode === "day" ? "flex" : "none";
    document.getElementById("month-inputs").style.display =
      mode === "month" ? "flex" : "none";
  });
});

document.getElementById("predict-btn").addEventListener("click", async () => {
  const mode = document.querySelector("input[name='mode']:checked").value;

  let payload = { mode };

  if (mode === "day") {
    payload.date = document.getElementById("day-date").value;
  } else {
    payload.year = parseInt(document.getElementById("month-year").value);
    payload.month = parseInt(document.getElementById("month-month").value);
  }

  const res = await fetch("http://localhost:8000/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  document.getElementById("result").textContent = JSON.stringify(
    data,
    null,
    2
  );
});
