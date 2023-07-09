import Link from "next/link";
import { cn } from "~/utils/shad-cn";
import { buttonVariants } from "../ui/button";
import { usePathname } from "next/navigation";
import React from "react";

interface SidebarNavItemProps {
  title: string;
  href: string;
  icon?: React.ReactNode;
}

function SidebarNavItem({ title, href, icon }: SidebarNavItemProps) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        pathname === href
          ? "bg-muted hover:bg-muted"
          : "hover:bg-transparent hover:underline",
        "-mx-2 justify-start"
      )}
    >
      {icon}
      {title}
    </Link>
  );
}

function SidebarNavGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <span className="mb-3 text-xs font-medium uppercase text-gray-500">
        {title}
      </span>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

export function SidebarNav({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn(
        "flex gap-5 space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {children}
    </nav>
  );
}

SidebarNav.Group = SidebarNavGroup;
SidebarNav.Item = SidebarNavItem;
