import { cn } from "~/utils/shad-cn";
import { SidebarNav } from "./sidebar-nav";
import { UserCog, Users, Terminal } from "lucide-react";

export interface SidebarLayoutProps extends React.HTMLAttributes<HTMLElement> {
  teamId: string;
}

export function SidebarLayout({
  teamId,
  className,
  children,
}: SidebarLayoutProps) {
  return (
    <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-10 lg:space-y-0">
      <aside className="lg:w-1/5">
        <SidebarNav>
          <SidebarNav.Group title="General">
            <SidebarNav.Item
              title="Team Info"
              href={`/team/${teamId}/settings`}
              icon={<Terminal className="mr-2 h-5 w-5" />}
            />
          </SidebarNav.Group>
          <SidebarNav.Group title="Team Management">
            <SidebarNav.Item
              title="Team Members"
              href={`/team/${teamId}/settings/members`}
              icon={<Users className="mr-2 h-5 w-5" />}
            />
            <SidebarNav.Item
              title="Invitations"
              href={`/team/${teamId}/settings/members/invite`}
              icon={<UserCog className="mr-2 h-5 w-5" />}
            />
          </SidebarNav.Group>
        </SidebarNav>
      </aside>
      <div className={cn("flex-1", className)}>{children}</div>
    </div>
  );
}
