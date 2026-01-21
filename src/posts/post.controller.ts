import { PostService } from "./post.service.js";
import { CreatePostDTO } from "./dto/CreatePostDTO.js";
import { UpdatePostDTO } from "./dto/UpdatePostDTO.js";
import { PostMapper } from "./mappers/PostMapper.js";
import { errorMiddleware } from "../utils/AppError.js";

class PostController {
  constructor(private postService: PostService) {}

  async getAllPosts() {
    try {
      const posts = await this.postService.getAllPosts();
      return { success: true, data: PostMapper.toDTOList(posts), count: posts.length };
    } catch (error) {
      return errorMiddleware(error);
    }
  }

  async getPostById(id: string) {
    try {
      const post = await this.postService.getPostById(id);
      return { success: true, data: PostMapper.toDTO(post) };
    } catch (error) {
      return errorMiddleware(error);
    }
  }

  async createPost(createPostDTO: CreatePostDTO) {
    try {
      const post = await this.postService.createPost(createPostDTO);
      return { success: true, message: "Post criado com sucesso", data: PostMapper.toDTO(post) };
    } catch (error) {
      return errorMiddleware(error);
    }
  }

  async updatePost(id: string, updatePostDTO: UpdatePostDTO) {
    try {
      const post = await this.postService.updatePost(id, updatePostDTO);
      return { success: true, message: "Post atualizado com sucesso", data: PostMapper.toDTO(post) };
    } catch (error) {
      return errorMiddleware(error);
    }
  }

  async deletePost(id: string) {
    try {
      await this.postService.deletePost(id);
      return { success: true, message: "Post deletado com sucesso" };
    } catch (error) {
      return errorMiddleware(error);
    }
  }

  async searchPosts(query: string) {
    try {
      const posts = await this.postService.searchPostsByQuery(query);
      return { success: true, data: PostMapper.toDTOList(posts), count: posts.length };
    } catch (error) {
      return errorMiddleware(error);
    }
  }
}

export { PostController };
