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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { AppHeaderLayout } from "~/components/layout/app-header";
import { TitleHead } from "~/components/layout/title-head";

const formSchema = z.object({
  name: z
    .string()
    .min(
      5,
      "Team name cannot be less than 5 characters. Try providing a more descriptive team name."
    )
    .max(
      50,
      "Team name cannot be more than 50 characters. Try shortening your team name"
    ),
});

type CreateTeamFormValues = z.infer<typeof formSchema>;

export default function CreateTeamPage() {
  const mutation = api.teams.createTeam.useMutation();
  const router = useRouter();
  const form = useForm<CreateTeamFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: CreateTeamFormValues) => {
    mutation.mutate(data, {
      onSuccess: (newTeam) => router.push(`/team/${newTeam.id}`),
    });
  };

  return (
    <>
      <Head>
        <title>Create New Team | Rcmd 👍</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppHeaderLayout header="Let's kick start your new team!">
        <Form {...form}>
          <div className="flex flex-col gap-8  ">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input className="py-6 text-lg" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Your Team Name can not be changed after the team is created.
                    Also suports emoji! 🎉
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input className="py-6 text-lg" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Your description can be changed at any time and will be
                    visible to invited team members.
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end py-10">
            <Button
              size="lg"
              onClick={form.handleSubmit(onSubmit)}
              isLoading={mutation.isLoading}
            >
              Create team
            </Button>
          </div>
        </Form>
      </AppHeaderLayout>
    </>
  );
}
