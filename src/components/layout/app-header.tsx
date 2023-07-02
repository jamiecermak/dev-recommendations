import { cn } from "~/utils/shad-cn";
import { Button } from "../ui/button";
import { GearIcon } from "@radix-ui/react-icons";

export function AppHeaderLayout({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <main className="dark flex min-h-screen flex-col bg-gray-900 text-white">
      <nav className="flex h-18 w-full justify-center bg-black">
        <div className="flex w-full max-w-5xl items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Rcmd 👍 </h1>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="h-10 px-3 font-semibold text-white"
              >
                New & Noteworthy
              </Button>
              <Button
                variant="ghost"
                className="h-10 px-3 font-semibold text-white"
              >
                Teams
              </Button>
              <Button
                variant="ghost"
                className="h-10 px-3 font-semibold text-white"
              >
                Create
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" className="h-10 p-3 text-white">
              <GearIcon className="h-5 w-5" />
            </Button>
            <Button variant="outline" className="h-10 text-white">
              Sign out
            </Button>
          </div>
        </div>
      </nav>
      <div className="flex h-32 w-full justify-center bg-gray-950">
        <div
          className={cn("flex w-full max-w-5xl items-end justify-between py-7")}
        >
          <h1 className="scroll-m-20  text-center text-3xl font-bold tracking-tight">
            Your Teams
          </h1>
          <div>
            <Button>Create New Team</Button>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-grow justify-center">
        <div
          className={cn("flex w-full max-w-5xl flex-col", className)}
          {...props}
        ></div>
      </div>
    </main>
  );
}
