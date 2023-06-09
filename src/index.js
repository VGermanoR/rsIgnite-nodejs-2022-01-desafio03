const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repo = repositories.find((repository) => repository.id === id);

  if (!repo) {
    return response.status(404).json({ error: "Repository not found" });
  }

  if (title) repo.title = title;
  if (url) repo.url = url;
  if (techs) repo.techs = techs;

  return response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex((repository) => repository.id === id);

  if (index === -1) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repo = repositories.find((repository) => repository.id === id);

  if (!repo) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repo.likes = repo.likes + 1;

  return response.json({ likes: repo.likes });
});

module.exports = app;
