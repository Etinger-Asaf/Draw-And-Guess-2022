export function clearGameData() {
  let fetchURLDelete = "http://localhost:8000/api/v1/";
  let fetchURLDeleteGameData = "http://localhost:8000/api/v1/gameData";

  if (process.env.REACT_APP_ENVIRONMENT === "production") {
    fetchURLDelete = "/api/v1/";
    fetchURLDeleteGameData = "/api/v1/gameData";
  }

  fetch(fetchURLDelete, {
    method: "DELETE",
    headers: { "Content-type": "application/json" },
  });

  const reqOptionsDelete = {
    method: "DELETE",
    headers: { "Content-type": "application/json" },
  };
  fetch(fetchURLDeleteGameData, reqOptionsDelete);
}
