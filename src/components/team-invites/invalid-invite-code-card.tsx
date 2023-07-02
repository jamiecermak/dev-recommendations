import { Card, CardContent, CardHeader } from "~/components/ui/card";

export function InvalidInviteCodeCard() {
  return (
    <Card className="max-w-lg p-5">
      <CardHeader>
        <h1 className="scroll-m-20 text-center text-3xl font-bold tracking-tight">
          Invalid Invite Code
        </h1>
      </CardHeader>
      <CardContent>
        <p className="text-center">
          The invite link that you used may have expired, or is malformed.
          Contact the inviter to get a new link.
        </p>
      </CardContent>
    </Card>
  );
}
