import { Card, CardContent, CardHeader } from "~/components/ui/card";

export function InvalidInviteCodeCard() {
  return (
    <Card className="p-5">
      <CardHeader className="pb-0">
        <h1 className="scroll-m-20 text-center text-2xl font-extrabold tracking-tight lg:text-3xl">
          Invalid Invite Code
        </h1>
      </CardHeader>
      <CardContent className="py-20"></CardContent>
    </Card>
  );
}
