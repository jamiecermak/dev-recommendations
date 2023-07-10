import { type PostItem } from "~/types/post-item";
import { GradientCard } from "../ui/gradient-card";
import ReactTimeago from "react-timeago";
import { Link } from "lucide-react";
import { Label } from "../ui/label";
import { useMemo } from "react";

export function PostItemCard({
  post: {
    title,
    description,
    href,
    tags,
    createdByUserFirstName,
    createdByUserLastName,
    createdAt,
  },
}: {
  post: PostItem;
}) {
  const hostName = useMemo(() => {
    return new URL(href).hostname;
  }, [href]);
  return (
    <GradientCard className="group p-0 transition-all hover:border-indigo-800 hover:shadow-md">
      <div className="flex flex-col p-6 pb-4 pt-5">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <p className="text-md mb-4 text-muted-foreground">{description}</p>
        <div className="grid">
          <p className="col-[1] row-[1] mb-1 flex -translate-y-5 items-center gap-1 text-sm text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
            <Link className="h-[1rem] w-[1rem]" />
            <span>{hostName}</span>
          </p>
          <span className="col-[1] row-[1] flex translate-y-0 gap-1 text-sm text-muted-foreground opacity-100 transition-all group-hover:translate-y-5 group-hover:opacity-0">
            {createdByUserFirstName} {createdByUserLastName} posted{" "}
            <ReactTimeago date={createdAt} />
          </span>
        </div>
      </div>
      <GradientCard
        colorScheme="indigo"
        className="flex flex-wrap gap-1 rounded-t-none border-x-0 border-b-0 border-t border-t-indigo-950 bg-black px-6 py-4"
      >
        {tags.map((tag) => (
          <Label key={tag.id}>{tag.name}</Label>
        ))}
      </GradientCard>
    </GradientCard>
  );
}
