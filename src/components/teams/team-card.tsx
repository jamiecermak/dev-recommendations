import { parseISO } from "date-fns";
import { Card, CardContent } from "../ui/card";
import TimeAgo from "react-timeago";
import { ArrowRight } from "lucide-react";
import { Label } from "../ui/label";
import { cn } from "~/utils/shad-cn";
import type { HTMLAttributes } from "react";

export interface TeamCardProps extends HTMLAttributes<HTMLDivElement> {
  teamName: string;
  description: string;
  joinedAt: string;
  showCreatedAt?: boolean;
  createdAt: string;
  isAdmin?: boolean;
  isNewPosts?: boolean;
  isClickable?: boolean;
  memberCount?: number;
}

export function TeamCard({
  teamName,
  description,
  joinedAt,
  createdAt,
  isClickable = true,
  isAdmin = false,
  showCreatedAt = false,
  isNewPosts = false,
  memberCount = 0,
  className,
  ...props
}: TeamCardProps) {
  return (
    <Card
      className={cn(
        `group rounded-sm bg-gray-950 py-0 shadow-md transition-all`,
        isClickable && `hover:border-indigo-800`,
        className
      )}
      {...props}
    >
      <CardContent className="flex flex-col px-0 py-0">
        <div className="grid">
          <div className="col-[1] row-[1] flex h-64 items-center justify-center rounded-sm rounded-bl-none rounded-br-none bg-gray-950">
            <div className="h-24 w-24 rounded-full bg-gray-700 ring-2 ring-sky-600" />
          </div>
          <div className="col-[1] row-[1] flex h-64 items-end justify-start gap-2 rounded-sm rounded-bl-none rounded-br-none px-5">
            {isAdmin && <Label className="translate-y-3">Admin</Label>}
            {isNewPosts && (
              <Label className="translate-y-3" colorScheme="orange">
                New Posts
              </Label>
            )}
            {memberCount > 0 && (
              <Label className="translate-y-3" colorScheme="emerald">
                {memberCount} members
              </Label>
            )}
          </div>
        </div>
        <div className="flex rounded-b-sm border-t border-t-gray-800 bg-gray-950 bg-gradient-to-br from-indigo-950/60 px-5 py-5 pt-6">
          <div className="flex flex-grow flex-col">
            <h2 className="mb-1 text-lg font-semibold tracking-tight">
              {teamName}
            </h2>
            <p className="text-md mb-1 flex-grow text-gray-200">
              {description}
            </p>
            {!showCreatedAt && (
              <p className="text-sm text-gray-400">
                Joined <TimeAgo date={parseISO(joinedAt)} />
              </p>
            )}
            {showCreatedAt && (
              <p className="text-sm text-gray-400">
                Created <TimeAgo date={parseISO(createdAt)} />
              </p>
            )}
          </div>
          <div>
            {isClickable && (
              <ArrowRight className="text-sky-200 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-40" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
