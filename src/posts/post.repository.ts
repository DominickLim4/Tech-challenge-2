import { IPost } from "./interfaces/IPost.js";
import { IPostRepository } from "./interfaces/IPostRepository.js";
import { DatabaseConfig } from "../config/database.js";
import { AppError } from "../utils/AppError.js";
import { ErrorCode } from "../utils/ErrorEnum.js";
import { v4 as uuidv4 } from "uuid";

class PostRepository implements IPostRepository {
  private pool = DatabaseConfig.getPool();

  private mapRowToPost(row: Record<string, unknown>): IPost {
    return {
      id: row.id as string,
      title: row.title as string,
      content: row.content as string,
      author: row.author as string,
      createdAt: new Date(row.createdAt as string),
      updatedAt: new Date(row.updatedAt as string),
    };
  }

  async getAllPosts(): Promise<IPost[]> {
    try {
      const result = await this.pool.query('SELECT * FROM posts ORDER BY "createdAt" DESC');
      return result.rows.map((row) => this.mapRowToPost(row));
    } catch (err) {
      throw new AppError(`Erro ao buscar posts: ${(err as Error).message}`, ErrorCode.INTERNAL_ERROR);
    }
  }

  async getPostById(id: string): Promise<IPost | null> {
    try {
      const result = await this.pool.query("SELECT * FROM posts WHERE id = $1", [id]);
      if (result.rows.length === 0) return null;
      return this.mapRowToPost(result.rows[0]);
    } catch (err) {
      throw new AppError(`Erro ao buscar post: ${(err as Error).message}`, ErrorCode.INTERNAL_ERROR);
    }
  }

  async createPost(post: IPost): Promise<IPost> {
    try {
      const id = post.id || uuidv4();
      const now = new Date();
      await this.pool.query(
        `INSERT INTO posts (id, title, content, author, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6)`,
        [id, post.title, post.content, post.author, now, now]
      );
      return { id, title: post.title, content: post.content, author: post.author, createdAt: now, updatedAt: now };
    } catch (err) {
      throw new AppError(`Erro ao criar post: ${(err as Error).message}`, ErrorCode.INTERNAL_ERROR);
    }
  }

  async updatePost(id: string, updatePost: Partial<IPost>): Promise<IPost | null> {
    const post = await this.getPostById(id);
    if (!post) return null;

    const updatedPost: IPost = {
      ...post,
      ...updatePost,
      id: post.id,
      createdAt: post.createdAt,
      updatedAt: new Date(),
    };

    try {
      await this.pool.query(
        `UPDATE posts SET title = $1, content = $2, author = $3, "updatedAt" = $4 WHERE id = $5`,
        [updatedPost.title, updatedPost.content, updatedPost.author, updatedPost.updatedAt, id]
      );
      return updatedPost;
    } catch (err) {
      throw new AppError(`Erro ao atualizar post: ${(err as Error).message}`, ErrorCode.INTERNAL_ERROR);
    }
  }

  async deletePost(id: string): Promise<boolean> {
    try {
      const result = await this.pool.query("DELETE FROM posts WHERE id = $1", [id]);
      return (result.rowCount ?? 0) > 0;
    } catch (err) {
      throw new AppError(`Erro ao deletar post: ${(err as Error).message}`, ErrorCode.INTERNAL_ERROR);
    }
  }

  async searchByQuery(query: string): Promise<IPost[]> {
    try {
      const searchQuery = `%${query}%`;
      const result = await this.pool.query(
        `SELECT * FROM posts WHERE title ILIKE $1 OR content ILIKE $1 OR author ILIKE $1 ORDER BY "createdAt" DESC`,
        [searchQuery]
      );
      return result.rows.map((row) => this.mapRowToPost(row));
    } catch (err) {
      throw new AppError(`Erro ao buscar posts: ${(err as Error).message}`, ErrorCode.INTERNAL_ERROR);
    }
  }
}

export { PostRepository };
