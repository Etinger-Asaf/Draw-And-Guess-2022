export function clearGameData() {
  fetch("http://localhost:8000/api/v1/", {
    method: "DELETE",
    headers: { "Content-type": "application/json" },
  });

  const reqOptionsDelete = {
    method: "DELETE",
    headers: { "Content-type": "application/json" },
  };
  fetch("http://localhost:8000/api/v1/gameData", reqOptionsDelete);
}
