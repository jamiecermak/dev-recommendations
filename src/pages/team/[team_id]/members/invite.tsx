/* eslint-disable @typescript-eslint/no-misused-promises */
import Head from "next/head";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getAuth } from "@clerk/nextjs/server";
import { getServices } from "~/server/service-builder";
import { prisma } from "~/server/db";
import { clerkClient } from "@clerk/nextjs";

export const getServerSideProps: GetServerSideProps<{
  teamId: string;
}> = async (ctx: GetServerSidePropsContext) => {
  if (!ctx.params || !ctx.params.team_id || Array.isArray(ctx.params.team_id))
    return { notFound: true };

  try {
    const auth = getAuth(ctx.req);
    const { authGuard } = getServices(prisma, clerkClient.users);

    const { team } = await authGuard.authoriseByTeamMember(
      auth.userId ?? null,
      ctx.params.team_id,
      { isAdmin: true }
    );

    return { props: { teamId: team.id } };
  } catch (ex) {
    return {
      notFound: true,
    };
  }
};

const formSchema = z.object({
  emailAddress: z.string().email("Not a valid email address"),
});

type InviteMemberFormValues = z.infer<typeof formSchema>;

export default function MemberInvitePage({
  teamId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const mutation = api.teams.inviteTeamMember.useMutation();
  const form = useForm<InviteMemberFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailAddress: "",
    },
  });

  const onSubmit = (data: InviteMemberFormValues) => {
    mutation.mutate({
      teamId,
      emailAddress: data.emailAddress,
    });
  };

  return (
    <>
      <Head>
        <title>Invite Team Member</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="dark flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <Form {...form}>
          <Card className="p-5">
            <CardHeader className="pb-0">
              <h1 className="scroll-m-20 text-center text-2xl font-extrabold tracking-tight lg:text-3xl">
                Create Team
              </h1>
            </CardHeader>
            <CardContent className="py-20">
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
            </CardContent>
            <CardFooter className="flex flex-col justify-center gap-5">
              <Button
                size="lg"
                className="w-96"
                onClick={form.handleSubmit(onSubmit)}
              >
                Invite New Member
              </Button>
            </CardFooter>
          </Card>
        </Form>
      </main>
    </>
  );
}
