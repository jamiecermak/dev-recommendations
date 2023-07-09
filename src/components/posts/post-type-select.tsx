import { api } from "~/utils/api";
import { ReactSelect } from "../ui/select";

export function PostTypeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (newValue: string) => void;
}) {
  const allPostTypesQuery = api.postTypes.getAll.useQuery();

  return (
    <ReactSelect
      isLoading={allPostTypesQuery.isLoading}
      options={allPostTypesQuery.data}
      value={
        allPostTypesQuery.data &&
        allPostTypesQuery.data.find((postType) => postType.id === value)
      }
      onChange={(newValue) => onChange(newValue?.id ?? "")}
      getOptionLabel={(option) => option.name}
      getOptionValue={(option) => option.id}
      closeMenuOnSelect
      placeholder="Select a type..."
    />
  );
}
