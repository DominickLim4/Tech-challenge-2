import { IPost } from "./IPost.js";

interface IPostRepository {
  getAllPosts(): Promise<IPost[]>;
  getPostById(id: string): Promise<IPost | null>;
  createPost(post: IPost): Promise<IPost>;
  updatePost(id: string, updatePost: Partial<IPost>): Promise<IPost | null>;
  deletePost(id: string): Promise<boolean>;
  searchByQuery(query: string): Promise<IPost[]>;
}

export { IPostRepository };
