import { IPost } from "./interfaces/IPost.js";
import { IPostRepository } from "./interfaces/IPostRepository.js";
import { CreatePostDTO } from "./dto/CreatePostDTO.js";
import { UpdatePostDTO } from "./dto/UpdatePostDTO.js";
import { AppError } from "../utils/AppError.js";
import { ErrorCode, ErrorMessage } from "../utils/ErrorEnum.js";
import { v4 as uuidv4 } from "uuid";

class PostService {
  constructor(private postRepository: IPostRepository) {}

  async getAllPosts(): Promise<IPost[]> {
    try {
      return await this.postRepository.getAllPosts();
    } catch (error) {
      throw new AppError(
        `Erro ao buscar posts: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        ErrorCode.INTERNAL_ERROR
      );
    }
  }

  async getPostById(id: string): Promise<IPost> {
    this.validateId(id);
    try {
      const post = await this.postRepository.getPostById(id);
      if (!post) {
        throw new AppError(ErrorMessage.POST_NOT_FOUND, ErrorCode.NOT_FOUND);
      }
      return post;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Erro ao buscar post: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        ErrorCode.INTERNAL_ERROR
      );
    }
  }

  async createPost(createPostDTO: CreatePostDTO): Promise<IPost> {
    this.validateCreatePostDTO(createPostDTO);
    const newPost: IPost = {
      id: uuidv4(),
      title: createPostDTO.title.trim(),
      content: createPostDTO.content.trim(),
      author: createPostDTO.author.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    try {
      return await this.postRepository.createPost(newPost);
    } catch (error) {
      throw new AppError(
        `Erro ao criar post: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        ErrorCode.INTERNAL_ERROR
      );
    }
  }

  async updatePost(id: string, updatePostDTO: UpdatePostDTO): Promise<IPost> {
    this.validateId(id);
    this.validateUpdatePostDTO(updatePostDTO);
    try {
      const updatedPost = await this.postRepository.updatePost(id, {
        title: updatePostDTO.title?.trim(),
        content: updatePostDTO.content?.trim(),
        author: updatePostDTO.author?.trim(),
      } as Partial<IPost>);
      if (!updatedPost) {
        throw new AppError(ErrorMessage.POST_NOT_FOUND, ErrorCode.NOT_FOUND);
      }
      return updatedPost;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Erro ao atualizar post: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        ErrorCode.INTERNAL_ERROR
      );
    }
  }

  async deletePost(id: string): Promise<boolean> {
    this.validateId(id);
    try {
      const deleted = await this.postRepository.deletePost(id);
      if (!deleted) {
        throw new AppError(ErrorMessage.POST_NOT_FOUND, ErrorCode.NOT_FOUND);
      }
      return deleted;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Erro ao deletar post: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        ErrorCode.INTERNAL_ERROR
      );
    }
  }

  async searchPostsByQuery(query: string): Promise<IPost[]> {
    this.validateQuery(query);
    try {
      return await this.postRepository.searchByQuery(query.trim());
    } catch (error) {
      throw new AppError(
        `Erro ao buscar posts: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        ErrorCode.INTERNAL_ERROR
      );
    }
  }

  private validateId(id: string): void {
    if (!id || typeof id !== "string" || id.trim().length === 0) {
      throw new AppError(ErrorMessage.INVALID_ID, ErrorCode.BAD_REQUEST);
    }
  }

  private validateCreatePostDTO(dto: CreatePostDTO): void {
    if (!dto.title || typeof dto.title !== "string" || dto.title.trim().length === 0) {
      throw new AppError(ErrorMessage.TITLE_REQUIRED, ErrorCode.BAD_REQUEST);
    }
    if (!dto.content || typeof dto.content !== "string" || dto.content.trim().length === 0) {
      throw new AppError(ErrorMessage.CONTENT_REQUIRED, ErrorCode.BAD_REQUEST);
    }
    if (!dto.author || typeof dto.author !== "string" || dto.author.trim().length === 0) {
      throw new AppError(ErrorMessage.AUTHOR_REQUIRED, ErrorCode.BAD_REQUEST);
    }
    if (dto.title.trim().length < 3) {
      throw new AppError(ErrorMessage.TITLE_MIN_LENGTH, ErrorCode.BAD_REQUEST);
    }
    if (dto.content.trim().length < 10) {
      throw new AppError(ErrorMessage.CONTENT_MIN_LENGTH, ErrorCode.BAD_REQUEST);
    }
  }

  private validateUpdatePostDTO(dto: UpdatePostDTO): void {
    if (Object.keys(dto).length === 0) {
      throw new AppError(ErrorMessage.UPDATE_FIELD_REQUIRED, ErrorCode.BAD_REQUEST);
    }
    if (dto.title !== undefined) {
      if (typeof dto.title !== "string") {
        throw new AppError(ErrorMessage.TITLE_REQUIRED, ErrorCode.BAD_REQUEST);
      }
      const title = dto.title.trim();
      if (title.length === 0) {
        throw new AppError(ErrorMessage.TITLE_REQUIRED, ErrorCode.BAD_REQUEST);
      }
      if (title.length < 3) {
        throw new AppError(ErrorMessage.TITLE_MIN_LENGTH, ErrorCode.BAD_REQUEST);
      }
    }
    if (dto.content !== undefined) {
      if (typeof dto.content !== "string") {
        throw new AppError(ErrorMessage.CONTENT_REQUIRED, ErrorCode.BAD_REQUEST);
      }
      const content = dto.content.trim();
      if (content.length === 0) {
        throw new AppError(ErrorMessage.CONTENT_REQUIRED, ErrorCode.BAD_REQUEST);
      }
      if (content.length < 10) {
        throw new AppError(ErrorMessage.CONTENT_MIN_LENGTH, ErrorCode.BAD_REQUEST);
      }
    }
    if (dto.author !== undefined) {
      if (typeof dto.author !== "string") {
        throw new AppError(ErrorMessage.AUTHOR_REQUIRED, ErrorCode.BAD_REQUEST);
      }
      const author = dto.author.trim();
      if (author.length === 0) {
        throw new AppError(ErrorMessage.AUTHOR_REQUIRED, ErrorCode.BAD_REQUEST);
      }
    }
  }

  private validateQuery(query: string): void {
    if (!query || typeof query !== "string" || query.trim().length === 0) {
      throw new AppError(ErrorMessage.QUERY_REQUIRED, ErrorCode.BAD_REQUEST);
    }
    if (query.trim().length < 2) {
      throw new AppError(ErrorMessage.QUERY_MIN_LENGTH, ErrorCode.BAD_REQUEST);
    }
  }
}

export { PostService };
