"use client"
import { FormX, FormX__TYPE_Structure, FormX__TYPE_Field, FormX__SchemaBuilder } from "@/components/form-x/form-x";
import { z } from "zod";

const FormFields: FormX__TYPE_Field[] = [
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
  {
    id: 2,
    type: "text",
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    validation: z.string().email({
      message: "Please enter a valid email address.",
    }),
    defaultValue: "musiur.opu@gmail.com"
  },
  {
    id: 3,
    type: "password",
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    validation: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    defaultValue: "12345678"
  },

  {
    id: 4,
    type: "image",
    name: "avatar",
    label: "Avatar",
    defaultValue: "https://via.placeholder.com/150",
    validation: z.instanceof(File)
  },
  {
    id: 5,
    type: "image",
    name: "images",
    label: "Images",
    multiple: true,
    defaultValue: [],
    validation: z.array(z.instanceof(File))
  },
  {
    id: 6,
    type: "checkbox",
    name: "terms",
    label: "Accept terms and conditions",
    description: "By accepting, you agree to the terms and conditions.",
    validation: z.boolean(),
    defaultValue: false
  },
]
export const [HomeFormSchema, HomeFormDefaultValues, HomeFormZodType] = FormX__SchemaBuilder(FormFields)
const FormStructure: FormX__TYPE_Structure = {
  fields: FormFields,
  submission: {
    toast: true,
    submitHandler: (data) => { console.log(data) }
  },

}

const Home = () => {
  return (
    <div className="container section">
      <div className="bg-gray-200 p-8 rounded-lg space-y-8">
        <h1 className="text-4xl font-bold">Testing custom form</h1>
        <FormX structure={nestedFormStructure} className="max-w-[400px] p-4 shadow-xl rounded-lg border bg-white" />

        <FormX structure={FormStructure} className="max-w-[400px] p-4 shadow-xl rounded-lg border bg-white" />
      </div>
    </div>
  )
}
export default Home;

const nestedFormStructure: FormX__TYPE_Structure = {
  fields: [
    {
      id: 1,
      type: "text",
      name: "username",
      label: "Username",
      validation: z.string().min(2, "Username must be at least 2 characters"),
    },
    {
      id: 2,
      type: "group",
      name: "address",
      label: "Address",
      fields: [
        {
          id: 3,
          type: "text",
          name: "street",
          label: "Street",
          validation: z.string().min(1, "Street is required"),
        },
        {
          id: 4,
          type: "group",
          name: "contact",
          label: "Contact",
          fields: [
            {
              id: 5,
              type: "text",
              name: "email",
              label: "Email",
              validation: z.string().email("Invalid email address"),
            }
          ]
        }
      ]
    }
  ],
  submission: {
    toast: true,
    submitHandler: (data) => console.log(data)
  }
};