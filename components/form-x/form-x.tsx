"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Form,
} from "@/components/ui/form"
import { toast } from "sonner"
import SubmitX from "./submit-x"
import InputX, { InputX___Type_InputTypes } from "./input-x"
import CheckboxX from "./checkbox-x"
import ImageUploadX from "./image-upload-x"
import React, { Fragment } from "react"
import { cn } from "@/lib/utils"

export type FormX__TYPE_Field = {
  id: number;
  type: InputX___Type_InputTypes | "checkbox" | "image" | "group";
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  validation?: z.ZodType<any, z.ZodTypeDef, any>;
  defaultValue?: object | string | boolean | Date | undefined | null;
  multiple?: boolean;
  fields?: FormX__TYPE_Field[];
}
export type FormX__TYPE_Structure = {
  fields: FormX__TYPE_Field[],
  className?: string;
  submission: {
    toast: boolean;
    submitHandler: (data: any) => void;
  }
}

// should be called from the parent component
export const FormXStructure_DEMO: FormX__TYPE_Structure = {
  fields: [
    {
      id: 1,
      type: "text",
      name: "username",
      label: "Username",
      placeholder: "Enter your username",
      description: "This is your public display name.",
      validation: z.string().min(2, {
        message: "Username must be at least 2 characters.",
      }),
      defaultValue: "John Doe"
    },
  ],
  submission: {
    toast: true,
    submitHandler: (data) => { console.log(data) }
  }
}
export const FormX__SchemaBuilder = (fields: FormX__TYPE_Field[]): [z.ZodType<any, z.ZodTypeDef, any>, Record<string, any>, any] => {
  const buildSchemaAndDefaults = (fields: FormX__TYPE_Field[]): [Record<string, any>, Record<string, any>] => {
    const schemaObject: Record<string, any> = {};
    const defaultValues: Record<string, any> = {};

    fields.forEach((field) => {
      if (field.type === "group" && field.fields) {
        const [nestedSchema, nestedDefaults] = buildSchemaAndDefaults(field.fields);
        
        schemaObject[field.name] = z.object(nestedSchema);
        
        defaultValues[field.name] = nestedDefaults;
      } else {
        schemaObject[field.name] = field.validation || z.string().min(1, "Required");
        defaultValues[field.name] = field.defaultValue ?? "";
      }
    });

    return [schemaObject, defaultValues];
  };

  const [schemaObject, defaultValues] = buildSchemaAndDefaults(fields);
  const schema = z.object(schemaObject);
  
  return [schema, defaultValues, schema];
}

export function FormX({ structure = FormXStructure_DEMO, className = "" }: { structure?: FormX__TYPE_Structure, className?: string }) {
  const [FormSchema, defaultValues] = FormX__SchemaBuilder(structure.fields);
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    structure?.submission?.submitHandler(data);
    structure?.submission?.toast && toast.success("Form submitted successfully!", {
      description: (
        <pre className="mt-2 w-[280px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  React.useEffect(() => {
    console.log("Form errors:", form.formState.errors);
    console.log("Form values:", form.getValues());
  }, [form.formState]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn(className, "w-full space-y-6")}>
        {renderFields(structure?.fields, form)}
        <SubmitX pending={form.formState.isSubmitting} text="Submit" />
      </form>
    </Form>
  )
}

function renderFields(fields: FormX__TYPE_Field[], form: any, parentName?: string) {
  return fields.map((fieldDetails) => {
    const { id, name, label, placeholder, description, type, multiple, fields: nestedFields } = fieldDetails;
    const fullName = parentName ? `${parentName}.${name}` : name;

    return (
      <Fragment key={id}>
        {type === "group" && nestedFields ? (
          <div className="space-y-4">
            {label && <h3 className="font-medium">{label}</h3>}
            {description && <p className="text-sm text-gray-500">{description}</p>}
            <div className="pl-4 border-l space-y-6">
              {renderFields(nestedFields, form, fullName)}
            </div>
          </div>
        ) : (
          ["text", "password", "textarea", "select", "date", "number"].includes(type) ? (
            <InputX 
              form={form} 
              name={fullName} 
              label={label} 
              placeholder={placeholder} 
              description={description} 
              type={type as InputX___Type_InputTypes} 
            />
          ) : type === "checkbox" ? (
            <CheckboxX 
              form={form} 
              name={fullName} 
              label={label} 
              description={description} 
            />
          ) : type === "image" ? (
            <ImageUploadX 
              form={form} 
              name={fullName} 
              label={label} 
              description={description} 
              multiple={multiple} 
            />
          ) : null
        )}
      </Fragment>
    );
  });
}



