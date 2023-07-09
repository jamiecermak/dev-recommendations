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

const formSchema = z.object({
  name: z
    .string()
    .min(
      5,
      "Team name cannot be less than 5 characters. Try providing a more descriptive team name."
    )
    .max(
      25,
      "Team name cannot be more than 25 characters. Try shortening your team name"
    ),
  description: z
    .string()
    .min(5, "Team description cannot be less than 5 characters.")
    .max(50, "Team description cannot be more than 50 characters."),
});

type CreateTeamFormValues = z.infer<typeof formSchema>;

export function CreateTeamForm({
  onTeamCreated,
}: {
  onTeamCreated: (teamId: string) => void;
}) {
  const createTeamMutation = api.teams.createTeam.useMutation();

  const form = useForm<CreateTeamFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: CreateTeamFormValues) => {
    createTeamMutation.mutate(data, {
      onSuccess: (newTeam) => onTeamCreated(newTeam.id),
    });
  };

  return (
    <Form {...form}>
      <div className="flex flex-col gap-8">
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
                Your description can be changed at any time and will be visible
                to invited team members.
              </FormDescription>
            </FormItem>
          )}
        />
      </div>
      <div className="flex justify-end py-10">
        <Button
          size="lg"
          onClick={form.handleSubmit(onSubmit)}
          isLoading={
            createTeamMutation.isLoading || createTeamMutation.isSuccess
          }
        >
          Create team
        </Button>
      </div>
    </Form>
  );
}
