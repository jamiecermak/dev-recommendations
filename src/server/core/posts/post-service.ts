import type { PrismaClient, Team, User } from "@prisma/client";
import type { TeamMemberService } from "../teams/team-member-service";
import type { PostItem } from "~/types/post-item";

interface CreatePostOptions {
  team: Team;
  createdByUser: User;
  title: string;
  description: string;
  href: string;
  postType: string;
  tags: string[];
}

class PostService {
  constructor(
    private prisma: PrismaClient,
    private teamMemberService: TeamMemberService
  ) {}

  async create({
    team,
    createdByUser,
    title,
    description,
    href,
    postType,
    tags,
  }: CreatePostOptions) {
    const teamMemberPolicy = await this.teamMemberService.getPolicyByTeam(team);

    teamMemberPolicy.isTeamMemberOrThrow(createdByUser);

    return this.prisma.post.create({
      data: {
        title,
        teamId: team.id,
        createdByUserId: createdByUser.id,
        updatedByUserId: createdByUser.id,
        href,
        description,
        postTypeId: postType,
        postTags: {
          createMany: {
            data: tags.map((tagId) => ({ tagId })),
          },
        },
      },
    });
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
			JSON_AGG(ROW_TO_JSON(Tag)) AS "tags"
            
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

export { PostService };
