import express from "express";
import { DatabaseConfig } from "./config/database.js";
import { PostRepository } from "./posts/post.repository.js";
import { PostService } from "./posts/post.service.js";
import { PostController } from "./posts/post.controller.js";

const app = express();
app.use(express.json());

const postRepository = new PostRepository();
const postService = new PostService(postRepository);
const postController = new PostController(postService);

app.get("/posts", async (_req, res) => {
  const result = await postController.getAllPosts();
  res.status(200).json(result);
});

app.get("/posts/search", async (req, res) => {
  const result = await postController.searchPosts(req.query.q as string);
  res.status("statusCode" in result ? result.statusCode : 200).json(result);
});

app.get("/posts/:id", async (req, res) => {
  const result = await postController.getPostById(req.params.id);
  res.status("statusCode" in result ? result.statusCode : 200).json(result);
});

app.post("/posts", async (req, res) => {
  const result = await postController.createPost(req.body);
  res.status("statusCode" in result ? result.statusCode : 201).json(result);
});

app.put("/posts/:id", async (req, res) => {
  const result = await postController.updatePost(req.params.id, req.body);
  res.status("statusCode" in result ? result.statusCode : 200).json(result);
});

app.delete("/posts/:id", async (req, res) => {
  const result = await postController.deletePost(req.params.id);
  res.status("statusCode" in result ? result.statusCode : 200).json(result);
});

const PORT = process.env.PORT || 3000;

DatabaseConfig.initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});
