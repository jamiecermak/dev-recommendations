import { type VariantProps, cva } from "class-variance-authority";
import { Card } from "./card";

const gradientCardVariants = cva("rounded-sm bg-gray-950 p-6", {
  variants: {
    colorScheme: {
      yellow: "border-yellow-700 bg-gradient-to-br from-yellow-950",
      sky: "bg-gradient-to-br from-sky-950/40",
      red: "bg-gradient-to-br from-red-950/40",
      green: "border-green-700 bg-gradient-to-br from-green-950",
    },
  },
  defaultVariants: {
    colorScheme: "sky",
  },
});

export interface GradientCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gradientCardVariants> {}

export function GradientCard({
  colorScheme,
  className,
  children,
  ...props
}: GradientCardProps) {
  return (
    <Card
      className={gradientCardVariants({ colorScheme, className })}
      {...props}
    >
      {children}
    </Card>
  );
}
