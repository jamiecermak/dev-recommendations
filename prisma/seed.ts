import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  await prisma.postType.deleteMany();

  await prisma.postType.createMany({
    data: [
      {
        name: "Video",
      },
      {
        name: "Article",
      },
      {
        name: "Book",
      },
      {
        name: "Website",
      },
    ],
  });

  await prisma.tag.deleteMany();

  await prisma.tag.createMany({
    data: [
      {
        name: "Backend",
      },
      {
        name: "Frontend",
      },
      {
        name: "CSS",
      },
      {
        name: "HTML",
      },
      {
        name: "React",
      },
      {
        name: "NodeJS",
      },
      {
        name: "NextJS",
      },
      {
        name: "DevOps",
      },
    ],
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
