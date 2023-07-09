import { type VariantProps, cva } from "class-variance-authority";

const labelVariants = cva(
  "rounded-md border bg-gradient-to-br font-medium uppercase",
  {
    variants: {
      colorScheme: {
        emerald: "from-emerald-600 to-emerald-800 text-emerald-100",
        sky: "from-sky-600 to-sky-800 text-sky-100",
        red: "from-red-600 to-red-800 text-red-100",
        green: "from-green-600 to-green-800 text-green-100",
        indigo: "from-indigo-600 to-indigo-800 text-indigo-100",
      },
      size: {
        xs: "text-xs px-3 py-1",
      },
    },
    defaultVariants: {
      colorScheme: "sky",
      size: "xs",
    },
  }
);

export interface LabelProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof labelVariants> {}

export function Label({
  className,
  colorScheme,
  children,
  ...props
}: LabelProps) {
  return (
    <span className={labelVariants({ colorScheme, className })} {...props}>
      {children}
    </span>
  );
}
