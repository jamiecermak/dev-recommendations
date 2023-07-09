import { ChevronDown, X } from "lucide-react";
import Select, {
  type ClearIndicatorProps,
  components,
  type MultiValueRemoveProps,
  type DropdownIndicatorProps,
  type GroupBase,
  type Props,
} from "react-select";
import { cn } from "~/utils/shad-cn";

const controlStyles = {
  base: "border border-gray-800 rounded-lg bg-slate-950 hover:cursor-pointer pl-2 min-h-12 py-1",
  focus: "ring-1 ring-gray-800",
  nonFocus: "border-gray-300",
};
const placeholderStyles = "text-gray-500 pl-1";
const selectInputStyles = " pl-1 py-0.5";
const valueContainerStyles = "p-1 gap-1";
const singleValueStyles = "leading-7 ml-1";
const multiValueStyles =
  "flex rounded-md border bg-gradient-to-br font-medium uppercase text-xs from-sky-600 to-sky-800 text-sky-100 items-center px-2 py-1 gap-1";
const multiValueLabelStyles = "";
const multiValueRemoveStyles = "text-sky-100 hover:border-red-300 rounded-md";
const indicatorsContainerStyles = "p-1 gap-1";
const clearIndicatorStyles =
  "p-1 hover:bg-gray-800 text-gray-500 rounded-md hover:text-white";
const indicatorSeparatorStyles = "bg-gray-800";
const dropdownIndicatorStyles =
  "p-1 hover:bg-gray-800 text-gray-500 rounded-md hover:text-white";
const menuStyles = "p-1 mt-2 border border-gray-800 bg-gray-950 rounded-lg";
const groupHeadingStyles = "ml-3 mt-2 mb-1 text-gray-500 text-sm";
const optionStyles = {
  base: "hover:cursor-pointer px-3 py-2 rounded text-xs",
  focus: "bg-gray-700",
  selected: "text-sky-500 font-semibold",
};
const noOptionsMessageStyles = "text-gray-500 py-3";

function ReactSelect<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: Props<Option, IsMulti, Group>) {
  return (
    <Select<Option, IsMulti, Group>
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      unstyled
      styles={{
        input: (base) => ({
          ...base,
          "input:focus": {
            boxShadow: "none",
          },
        }),
        // On mobile, the label will truncate automatically, so we want to
        // override that behaviour.
        multiValueLabel: (base) => ({
          ...base,
          whiteSpace: "normal",
          overflow: "visible",
        }),
        control: (base) => ({
          ...base,
          minHeight: undefined,
          transition: "none",
        }),
      }}
      components={{
        DropdownIndicator: (
          props: DropdownIndicatorProps<Option, IsMulti, Group>
        ) => {
          return (
            <components.DropdownIndicator {...props}>
              <ChevronDown className="h-5 w-5" />
            </components.DropdownIndicator>
          );
        },
        ClearIndicator: (
          props: ClearIndicatorProps<Option, IsMulti, Group>
        ) => {
          return (
            <components.ClearIndicator {...props}>
              <X className="h-5 w-5" />
            </components.ClearIndicator>
          );
        },
        MultiValueRemove: (
          props: MultiValueRemoveProps<Option, IsMulti, Group>
        ) => {
          return (
            <components.MultiValueRemove {...props}>
              <X className="h-3 w-3" />
            </components.MultiValueRemove>
          );
        },
      }}
      classNames={{
        control: ({ isFocused }) =>
          cn(
            isFocused ? controlStyles.focus : controlStyles.nonFocus,
            controlStyles.base
          ),
        placeholder: () => placeholderStyles,
        input: () => selectInputStyles,
        valueContainer: () => valueContainerStyles,
        singleValue: () => singleValueStyles,
        multiValue: () => multiValueStyles,
        multiValueLabel: () => multiValueLabelStyles,
        multiValueRemove: () => multiValueRemoveStyles,
        indicatorsContainer: () => indicatorsContainerStyles,
        clearIndicator: () => clearIndicatorStyles,
        indicatorSeparator: () => indicatorSeparatorStyles,
        dropdownIndicator: () => dropdownIndicatorStyles,
        menu: () => menuStyles,
        groupHeading: () => groupHeadingStyles,
        option: ({ isFocused, isSelected }) =>
          cn(
            isFocused && optionStyles.focus,
            isSelected && optionStyles.selected,
            optionStyles.base
          ),
        noOptionsMessage: () => noOptionsMessageStyles,
      }}
      {...props}
    />
  );
}

export { ReactSelect };
