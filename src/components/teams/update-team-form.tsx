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
  description: z
    .string()
    .min(5, "Team description cannot be less than 5 characters.")
    .max(50, "Team description cannot be more than 50 characters."),
});

type UpdateTeamFormValues = z.infer<typeof formSchema>;

export function UpdateTeamForm({
  teamId,
  name,
  description,
}: {
  teamId: string;
  name: string;
  description: string;
}) {
  const updateTeamMutation = api.teams.updateTeam.useMutation();

  const form = useForm<UpdateTeamFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description,
    },
  });

  const onSubmit = (data: UpdateTeamFormValues) => {
    updateTeamMutation.mutate({
      id: teamId,
      description: data.description,
    });
  };

  return (
    <Form {...form}>
      <div className="flex flex-col gap-8">
        <FormItem>
          <FormLabel>Team Name</FormLabel>
          <FormControl>
            <Input className="py-5 text-sm" disabled value={name} />
          </FormControl>
          <FormMessage />
          <FormDescription>
            Your Team Name can not be changed after the team is created.
          </FormDescription>
        </FormItem>
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
                Your description will be visible to invited team members.
              </FormDescription>
            </FormItem>
          )}
        />
      </div>
      <div className="flex justify-end pt-10">
        <Button
          size="lg"
          onClick={form.handleSubmit(onSubmit)}
          isLoading={updateTeamMutation.isLoading}
        >
          Update team
        </Button>
      </div>
    </Form>
  );
}
