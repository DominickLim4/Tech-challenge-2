import { PostService } from "./post.service";
import { IPostRepository } from "./interfaces/IPostRepository";
import { IPost } from "./interfaces/IPost";
import { AppError } from "../utils/AppError";
import { jest } from "@jest/globals";

const mockPost: IPost = {
  id: "123",
  title: "Test Post",
  content: "Test content here",
  author: "Test Author",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockRepository: jest.Mocked<IPostRepository> = {
  getAllPosts: jest.fn(),
  getPostById: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
  searchByQuery: jest.fn(),
};

describe("PostService", () => {
  let service: PostService;

  beforeEach(() => {
    service = new PostService(mockRepository);
    jest.clearAllMocks();
  });

  describe("getAllPosts", () => {
    it("deve retornar todos os posts", async () => {
      mockRepository.getAllPosts.mockResolvedValue([mockPost]);
      const result = await service.getAllPosts();
      expect(result).toEqual([mockPost]);
    });

    it("deve lancar erro quando repositorio falha", async () => {
      mockRepository.getAllPosts.mockRejectedValue(new Error("DB error"));
      await expect(service.getAllPosts()).rejects.toThrow(AppError);
    });

    it("deve lancar erro com mensagem generica quando erro nao e Error", async () => {
      mockRepository.getAllPosts.mockRejectedValue("string error");
      await expect(service.getAllPosts()).rejects.toThrow("Erro desconhecido");
    });
  });

  describe("getPostById", () => {
    it("deve retornar post quando encontrado", async () => {
      mockRepository.getPostById.mockResolvedValue(mockPost);
      const result = await service.getPostById("123");
      expect(result).toEqual(mockPost);
    });

    it("deve lancar erro quando post nao encontrado", async () => {
      mockRepository.getPostById.mockResolvedValue(null);
      await expect(service.getPostById("123")).rejects.toThrow(AppError);
    });

    it("deve lancar erro quando id invalido", async () => {
      await expect(service.getPostById("")).rejects.toThrow(AppError);
    });

    it("deve lancar erro quando repositorio falha", async () => {
      mockRepository.getPostById.mockRejectedValue(new Error("DB error"));
      await expect(service.getPostById("123")).rejects.toThrow(AppError);
    });

    it("deve lancar erro com mensagem generica quando erro nao e Error", async () => {
      mockRepository.getPostById.mockRejectedValue("string error");
      await expect(service.getPostById("123")).rejects.toThrow("Erro desconhecido");
    });
  });

  describe("createPost", () => {
    it("deve criar post com dados validos", async () => {
      mockRepository.createPost.mockResolvedValue(mockPost);
      const result = await service.createPost({
        title: "Test Post",
        content: "Test content here",
        author: "Test Author",
      });
      expect(result).toEqual(mockPost);
    });

    it("deve lancar erro quando titulo vazio", async () => {
      await expect(
        service.createPost({ title: "", content: "Test content here", author: "Author" })
      ).rejects.toThrow(AppError);
    });

    it("deve lancar erro quando titulo nao e string", async () => {
      await expect(
        service.createPost({ title: 123 as unknown as string, content: "Test content here", author: "Author" })
      ).rejects.toThrow(AppError);
    });

    it("deve lancar erro quando titulo muito curto", async () => {
      await expect(
        service.createPost({ title: "AB", content: "Test content here", author: "Author" })
      ).rejects.toThrow(AppError);
    });

    it("deve lancar erro quando conteudo vazio", async () => {
      await expect(
        service.createPost({ title: "Test", content: "", author: "Author" })
      ).rejects.toThrow(AppError);
    });

    it("deve lancar erro quando conteudo nao e string", async () => {
      await expect(
        service.createPost({ title: "Test", content: 123 as unknown as string, author: "Author" })
      ).rejects.toThrow(AppError);
    });

    it("deve lancar erro quando conteudo muito curto", async () => {
      await expect(
        service.createPost({ title: "Test", content: "short", author: "Author" })
      ).rejects.toThrow(AppError);
    });

    it("deve lancar erro quando autor vazio", async () => {
      await expect(
        service.createPost({ title: "Test", content: "Test content here", author: "" })
      ).rejects.toThrow(AppError);
    });

    it("deve lancar erro quando autor nao e string", async () => {
      await expect(
        service.createPost({ title: "Test", content: "Test content here", author: 123 as unknown as string })
      ).rejects.toThrow(AppError);
    });

    it("deve lancar erro quando repositorio falha", async () => {
      mockRepository.createPost.mockRejectedValue(new Error("DB error"));
      await expect(
        service.createPost({ title: "Test", content: "Test content here", author: "Author" })
      ).rejects.toThrow(AppError);
    });

    it("deve lancar erro com mensagem generica quando erro nao e Error", async () => {
      mockRepository.createPost.mockRejectedValue("string error");
      await expect(
        service.createPost({ title: "Test", content: "Test content here", author: "Author" })
      ).rejects.toThrow("Erro desconhecido");
    });
  });

  describe("updatePost", () => {
    it("deve atualizar post com dados validos", async () => {
      mockRepository.updatePost.mockResolvedValue(mockPost);
      const result = await service.updatePost("123", { title: "Updated Title" });
      expect(result).toEqual(mockPost);
    });

    it("deve lancar erro quando post nao encontrado", async () => {
      mockRepository.updatePost.mockResolvedValue(null);
      await expect(service.updatePost("123", { title: "Updated" })).rejects.toThrow(AppError);
    });

    it("deve lancar erro quando id invalido", async () => {
      await expect(service.updatePost("", { title: "Updated" })).rejects.toThrow(AppError);
    });

    it("deve lancar erro quando id nao e string", async () => {
      await expect(service.updatePost(123 as unknown as string, { title: "Updated" })).rejects.toThrow(AppError);
    });

    it("deve lancar erro quando nenhum campo fornecido", async () => {
      await expect(service.updatePost("123", {})).rejects.toThrow(AppError);
    });

    it("deve lancar erro quando titulo vazio", async () => {
      await expect(service.updatePost("123", { title: "" })).rejects.toThrow(AppError);
    });

    it("deve lancar erro quando titulo nao e string", async () => {
      await expect(service.updatePost("123", { title: 123 as unknown as string })).rejects.toThrow(AppError);
    });

    it("deve lancar erro quando titulo muito curto", async () => {
      await expect(service.updatePost("123", { title: "AB" })).rejects.toThrow(AppError);
    });

    it("deve lancar erro quando conteudo vazio", async () => {
      await expect(service.updatePost("123", { content: "" })).rejects.toThrow(AppError);
    });

    it("deve lancar erro quando conteudo nao e string", async () => {
      await expect(service.updatePost("123", { content: 123 as unknown as string })).rejects.toThrow(AppError);
    });

    it("deve lancar erro quando conteudo muito curto", async () => {
      await expect(service.updatePost("123", { content: "short" })).rejects.toThrow(AppError);
    });

    it("deve lancar erro quando autor vazio", async () => {
      await expect(service.updatePost("123", { author: "" })).rejects.toThrow(AppError);
    });

    it("deve lancar erro quando autor e string com espacos apenas", async () => {
      await expect(service.updatePost("123", { author: "   " })).rejects.toThrow(AppError);
    });

    it("deve lancar erro quando autor nao e string", async () => {
      await expect(service.updatePost("123", { author: 123 as unknown as string })).rejects.toThrow(AppError);
    });

    it("deve lancar erro quando repositorio falha", async () => {
      mockRepository.updatePost.mockRejectedValue(new Error("DB error"));
      await expect(service.updatePost("123", { title: "Updated Title" })).rejects.toThrow(AppError);
    });

    it("deve lancar erro com mensagem generica quando erro nao e Error", async () => {
      mockRepository.updatePost.mockRejectedValue("string error");
      await expect(service.updatePost("123", { title: "Updated Title" })).rejects.toThrow("Erro desconhecido");
    });
  });

  describe("deletePost", () => {
    it("deve deletar post existente", async () => {
      mockRepository.deletePost.mockResolvedValue(true);
      const result = await service.deletePost("123");
      expect(result).toBe(true);
    });

    it("deve lancar erro quando post nao existe", async () => {
      mockRepository.deletePost.mockResolvedValue(false);
      await expect(service.deletePost("123")).rejects.toThrow(AppError);
    });

    it("deve lancar erro quando id invalido", async () => {
      await expect(service.deletePost("")).rejects.toThrow(AppError);
    });

    it("deve lancar erro quando repositorio falha", async () => {
      mockRepository.deletePost.mockRejectedValue(new Error("DB error"));
      await expect(service.deletePost("123")).rejects.toThrow(AppError);
    });

    it("deve lancar erro com mensagem generica quando erro nao e Error", async () => {
      mockRepository.deletePost.mockRejectedValue("string error");
      await expect(service.deletePost("123")).rejects.toThrow("Erro desconhecido");
    });
  });

  describe("searchPostsByQuery", () => {
    it("deve buscar posts por query", async () => {
      mockRepository.searchByQuery.mockResolvedValue([mockPost]);
      const result = await service.searchPostsByQuery("test");
      expect(result).toEqual([mockPost]);
    });

    it("deve lancar erro quando query vazia", async () => {
      await expect(service.searchPostsByQuery("")).rejects.toThrow(AppError);
    });

    it("deve lancar erro quando query nao e string", async () => {
      await expect(service.searchPostsByQuery(123 as unknown as string)).rejects.toThrow(AppError);
    });

    it("deve lancar erro quando query muito curta", async () => {
      await expect(service.searchPostsByQuery("a")).rejects.toThrow(AppError);
    });

    it("deve lancar erro quando repositorio falha", async () => {
      mockRepository.searchByQuery.mockRejectedValue(new Error("DB error"));
      await expect(service.searchPostsByQuery("test")).rejects.toThrow(AppError);
    });

    it("deve lancar erro com mensagem generica quando erro nao e Error", async () => {
      mockRepository.searchByQuery.mockRejectedValue("string error");
      await expect(service.searchPostsByQuery("test")).rejects.toThrow("Erro desconhecido");
    });
  });
});
