import { cn } from "~/utils/shad-cn";
import { Button } from "../ui/button";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { SignInButton, SignOutButton } from "@clerk/nextjs";

export interface AppHeaderLayoutProps
  extends React.HTMLAttributes<HTMLElement> {
  aside?: React.ReactNode;
  header?: React.ReactNode;
  hideAppHeader?: boolean;
}

export function AppHeaderLayout({
  className,
  aside,
  header,
  children,
  hideAppHeader = false,
  ...props
}: AppHeaderLayoutProps) {
  return (
    <main className="dark flex min-h-screen flex-col bg-gray-900 text-white">
      <nav className="flex h-18 w-full justify-center bg-black">
        <div className="flex w-full max-w-4xl items-center justify-between px-5 xl:max-w-5xl xl:px-0">
          <div className="flex items-center gap-4">
            <Link href="/teams">
              <h1 className="select-none text-2xl font-bold">Rcmd 👍 </h1>
            </Link>
            {!hideAppHeader && (
              <div className="flex items-center gap-2">
                <Link href="/teams">
                  <Button
                    variant="ghost"
                    className="h-10 px-3 font-semibold text-white"
                  >
                    Teams
                  </Button>
                </Link>
              </div>
            )}
          </div>
          {!hideAppHeader && (
            <div className="flex gap-2">
              <SignOutButton>
                <Button variant="outline" className="h-10 p-3 text-white">
                  <LogOut className="h-4 w-4" />
                </Button>
              </SignOutButton>
            </div>
          )}
          {hideAppHeader && (
            <div className="flex gap-2">
              <SignInButton>
                <Button variant="outline" className="h-10 text-white">
                  Sign in
                </Button>
              </SignInButton>
            </div>
          )}
        </div>
      </nav>
      {header && (
        <div className="flex h-32 w-full justify-center bg-gray-950">
          <div
            className={cn(
              "flex w-full max-w-4xl items-end justify-between px-5 py-6 xl:max-w-5xl xl:px-0"
            )}
          >
            <h1 className="text-center text-3xl font-bold tracking-tight">
              {header}
            </h1>
            <div>{aside}</div>
          </div>
        </div>
      )}
      <div className="flex w-full flex-grow justify-center">
        <div
          className={cn(
            "flex w-full max-w-4xl flex-col px-5  py-8 xl:max-w-5xl xl:px-0",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    </main>
  );
}
