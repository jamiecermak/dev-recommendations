import { type VariantProps, cva } from "class-variance-authority";
import type { PropsWithChildren } from "react";
import { Card, CardContent } from "./card";
import { cn } from "~/utils/shad-cn";

const alertVariants = cva("rounded-sm py-5 bg-gray-900", {
  variants: {
    colorScheme: {
      yellow: "border-yellow-700 bg-gradient-to-br from-yellow-950 bg-gray-950",
      sky: "border-sky-700 bg-gradient-to-br from-sky-950",
      red: "border-red-700 bg-gradient-to-br from-red-950",
      green: "border-green-700 bg-gradient-to-br from-green-950",
    },
  },
  defaultVariants: {
    colorScheme: "sky",
  },
});

function AlertTitle({ children }: PropsWithChildren) {
  return <h2 className="text-lg font-semibold tracking-tight">{children}</h2>;
}

function AlertDescription({ children }: PropsWithChildren) {
  return <p className="text-sm text-gray-300">{children}</p>;
}

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

export function Alert({
  className,
  colorScheme,
  children,
  ...props
}: AlertProps) {
  return (
    <Card {...props} className={cn(alertVariants({ colorScheme, className }))}>
      <CardContent className="flex flex-col gap-1 py-0">{children}</CardContent>
    </Card>
  );
}

Alert.Title = AlertTitle;
Alert.Description = AlertDescription;
