import React from "react";

export function TitleHead({ children }: { children: React.ReactNode }) {
  return <title>{children} | Rcmd 👍</title>;
}
