import { parseISO } from "date-fns";
import { Card, CardContent } from "../ui/card";
import TimeAgo from "react-timeago";
import { ArrowRight } from "lucide-react";
import { Label } from "../ui/label";

export interface TeamCardProps {
  teamName: string;
  description: string;
  joinedAt: string;
  createdAt: string;
  isAdmin: boolean;
}

export function TeamCard({
  teamName,
  description,
  joinedAt,
  isAdmin,
}: TeamCardProps) {
  return (
    <Card className=" group/team bg-gray-950py-0 rounded-sm shadow-md transition-all  hover:translate-x-1">
      <CardContent className="flex flex-col px-0 py-0">
        <div className="grid">
          <div className="col-[1] row-[1] flex h-64 items-center justify-center rounded-sm rounded-bl-none rounded-br-none bg-gray-950">
            <div className="h-24 w-24 rounded-full bg-gray-700 ring-2 ring-sky-600" />
          </div>
          <div className="col-[1] row-[1] flex h-64 items-end justify-start gap-2 rounded-sm rounded-bl-none rounded-br-none px-5">
            {isAdmin && <Label className="translate-y-3">Admin</Label>}
          </div>
        </div>
        <div className="flex border-t border-t-gray-800 bg-gray-950 bg-gradient-to-br from-sky-950/60 px-5 py-5 pt-6">
          <div className="flex flex-grow flex-col">
            <h2 className="mb-1 text-lg font-semibold tracking-tight">
              {teamName}
            </h2>
            <p className="text-md mb-1 flex-grow text-gray-200">
              {description}
            </p>
            <p className="text-sm text-gray-400">
              Joined <TimeAgo date={parseISO(joinedAt)} />
            </p>
          </div>
          <div>
            <ArrowRight className="text-sky-200 opacity-0 transition-all group-hover/team:translate-x-1 group-hover/team:opacity-40" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
