import type { PrismaClient, Team, User } from "@prisma/client";
import type { PostItem } from "~/types/post-item";

class PostDiscoveryService {
  constructor(private prisma: PrismaClient) {}

  async getLatestByUser(user: User) {
    return this.prisma.$queryRaw`
        SELECT
            Post.id AS "id",
            Post.title AS "title",
            Post.description AS "description",
            Post.href AS "href",
			Post.created_at AS "createdAt",
            Team.id AS "teamId",
            Team.name AS "teamName",
            CreatedByUser.first_name AS "createdByUserFirstName",
            CreatedByUser.last_name AS "createdByUserLastName",
			ROW_TO_JSON(PostType) AS "postType",
			JSON_AGG(Tag ORDER BY Tag.name ASC) AS "tags"
            
        FROM posts Post

        INNER JOIN team_members TeamMember
            ON Post.team_id = TeamMember.team_id

        LEFT JOIN post_tags PostTag
            ON Post.id = PostTag.post_id
        
        INNER JOIN tags Tag
            ON PostTag.tag_id = Tag.id

        INNER JOIN post_types PostType
            ON Post.post_type_id = PostType.id

        INNER JOIN teams Team
            ON Post.team_id = Team.id

        INNER JOIN users CreatedByUser
            ON Post.created_by_user_id = CreatedByUser.id

        WHERE TeamMember.user_id = ${user.id}

        GROUP BY Post.id,
            Post.title,
            Post.description,
            Post.href,
			Post.created_at,
            Team.id,
            Team.name,
            CreatedByUser.first_name,
            CreatedByUser.last_name,
			PostType.*

        ORDER BY Post.created_at DESC;
    ` as Promise<PostItem[]>;
  }

  async getLatestByTeam(team: Team) {
    return this.prisma.$queryRaw`
        SELECT
            Post.id AS "id",
            Post.title AS "title",
            Post.description AS "description",
            Post.href AS "href",
			Post.created_at AS "createdAt",
            Team.id AS "teamId",
            Team.name AS "teamName",
            CreatedByUser.first_name AS "createdByUserFirstName",
            CreatedByUser.last_name AS "createdByUserLastName",
			ROW_TO_JSON(PostType) AS "postType",
            JSON_AGG(Tag ORDER BY Tag.name ASC) AS "tags"
            
        FROM posts Post

        LEFT JOIN post_tags PostTag
            ON Post.id = PostTag.post_id
        
        INNER JOIN tags Tag
            ON PostTag.tag_id = Tag.id

        INNER JOIN post_types PostType
            ON Post.post_type_id = PostType.id

        INNER JOIN teams Team
            ON Post.team_id = Team.id

        INNER JOIN users CreatedByUser
            ON Post.created_by_user_id = CreatedByUser.id

        WHERE Post.team_id = ${team.id}

        GROUP BY Post.id,
            Post.title,
            Post.description,
            Post.href,
			Post.created_at,
            Team.id,
            Team.name,
            CreatedByUser.first_name,
            CreatedByUser.last_name,
			PostType.*

        ORDER BY Post.created_at DESC;
    ` as Promise<PostItem[]>;
  }
}

export { PostDiscoveryService };
