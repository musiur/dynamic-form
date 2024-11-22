import { Checkbox } from "@radix-ui/react-checkbox";

import { FormControl, FormLabel } from "../ui/form";

import { UseFormReturn } from "react-hook-form";
import { FormItem } from "../ui/form";

import { FormField } from "../ui/form";
import { Check } from "lucide-react";
import clsx from "clsx";

const CheckboxX = ({
  form,
  name,
  label = "Check this box",
}:
  {
    form: UseFormReturn<any>;
    name: string;
    label?: string;
    description?: string
  }) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md">
          <FormControl>
            <div className="relative">
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                className={clsx(
                  "min-w-4 min-h-4 border rounded transition ease-in-out duration-300",
                  {
                    "bg-primary [&>svg]:text-white border-primary": field.value,
                  }
                )}
                id={name}
              />
              <Check
                className={clsx(
                  "w-3 h-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 stroke-white",
                  {
                    block: field.value,
                    hidden: !field.value,
                  }
                )}
              />
            </div>
          </FormControl>
          <FormLabel htmlFor={name}>{label}</FormLabel>
        </FormItem>
      )}
    />
  );
};

export default CheckboxX;