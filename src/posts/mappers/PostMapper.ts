import { IPost } from "../interfaces/IPost.js";
import { PostResponseDTO } from "../dto/PostResponseDTO.js";

class PostMapper {
  static toDTO(post: IPost): PostResponseDTO {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      author: post.author,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  }

  static toDTOList(posts: IPost[]): PostResponseDTO[] {
    return posts.map((post) => this.toDTO(post));
  }
}

export { PostMapper };
