import type { PrismaClient, Team, User } from "@prisma/client";
import type { TeamMemberService } from "../teams/team-member-service";

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
}

export { PostService };
