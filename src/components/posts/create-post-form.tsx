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
import { TagSelect } from "./tag-select";
import { PostTypeSelect } from "./post-type-select";

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Title cannot be less than 5 characters.")
    .max(25, "Title cannot be more than 25 characters."),
  description: z
    .string()
    .min(5, "Description cannot be less than 5 characters.")
    .max(50, "Description cannot be more than 50 characters."),
  href: z
    .string()
    .url("Must be a URL")
    .min(5, "URL cannot be less than 5 characters.")
    .max(250, "URL cannot be more than 250 characters."),
  tags: z
    .array(z.string())
    .min(1, "Must select at least one tag")
    .max(15, "Must not have more than 15 tags")
    .default([]),
  postType: z.string().min(1, "Must select a post type"),
});

type CreatePostFormValues = z.infer<typeof formSchema>;

export function CreatePostForm({
  teamId,
  onPostCreated,
}: {
  teamId: string;
  onPostCreated: (postId: string) => void;
}) {
  const createPostMutation = api.posts.create.useMutation();

  const form = useForm<CreatePostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
      postType: "",
    },
  });

  const onSubmit = (data: CreatePostFormValues) => {
    console.log(data);
    createPostMutation.mutate(
      {
        ...data,
        teamId,
      },
      {
        onSuccess: (newPost) => onPostCreated(newPost.id),
      }
    );
  };

  return (
    <Form {...form}>
      <div className="flex flex-col gap-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Your description can be changed at any time and will be visible
                to invited team members.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="href"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Your description can be changed at any time and will be visible
                to invited team members.
              </FormDescription>
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-7">
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <TagSelect value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Your description can be changed at any time and will be
                  visible to invited team members.
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <PostTypeSelect
                    value={field.value}
                    onChange={field.onChange}
                  />
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
      </div>
      <div className="flex justify-end pt-10">
        <Button
          size="lg"
          onClick={form.handleSubmit(onSubmit)}
          isLoading={
            createPostMutation.isLoading || createPostMutation.isSuccess
          }
        >
          Create post
        </Button>
      </div>
    </Form>
  );
}
