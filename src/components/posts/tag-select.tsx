import { api } from "~/utils/api";
import { ReactSelect } from "../ui/select";

export function TagSelect({
  value,
  onChange,
}: {
  value: string[];
  onChange: (newValues: string[]) => void;
}) {
  const allTagsQuery = api.tags.getAll.useQuery();

  return (
    <ReactSelect
      isMulti
      isLoading={allTagsQuery.isLoading}
      options={allTagsQuery.data}
      isSearchable
      value={
        allTagsQuery.data &&
        allTagsQuery.data.filter((tag) => value.includes(tag.id))
      }
      onChange={(newValue) => onChange(newValue.map((tag) => tag.id))}
      getOptionLabel={(option) => option.name}
      getOptionValue={(option) => option.id}
      placeholder="Select one or more tags..."
    />
  );
}
