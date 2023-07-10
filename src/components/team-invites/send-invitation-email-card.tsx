import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { MailCheck } from "lucide-react";
import { api } from "~/utils/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GradientCard } from "../ui/gradient-card";

const formSchema = z.object({
  emailAddress: z.string().email("Not a valid email address"),
});

type InviteMemberFormValues = z.infer<typeof formSchema>;

export function SendInvitationEmailCard({
  teamName,
  teamId,
}: {
  teamName: string;
  teamId: string;
}) {
  const inviteTeamMemberMutation =
    api.teamInvites.inviteTeamMember.useMutation();

  const form = useForm<InviteMemberFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailAddress: "",
    },
  });

  const onSubmit = (data: InviteMemberFormValues) => {
    inviteTeamMemberMutation.mutate(
      {
        teamId,
        emailAddress: data.emailAddress,
      },
      {
        onSuccess: () => {
          form.reset();
        },
      }
    );
  };

  return (
    <GradientCard className="flex flex-col gap-6">
      <Form {...form}>
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold tracking-tight">
            Send an invitation email
          </h2>
          <p className="text-sm text-muted-foreground">
            We will send your new team member an email inviting them to join{" "}
            <span className="font-semibold">{teamName}</span>.
          </p>
        </div>
        <FormField
          control={form.control}
          name="emailAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button
            size="lg"
            className="px-5"
            onClick={form.handleSubmit(onSubmit)}
            isLoading={inviteTeamMemberMutation.isLoading}
          >
            <MailCheck size="20" className="mr-2" />
            Invite New Member
          </Button>
        </div>
      </Form>
    </GradientCard>
  );
}
