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
  const form = useForm<CreateTeamFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: CreateTeamFormValues) => {
    mutation.mutate(data);
  };

  return (
    <>
      <Head>
        <title>Create New Team</title>
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
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
                Create team
              </Button>
            </CardFooter>
          </Card>
        </Form>
      </main>
    </>
  );
}
