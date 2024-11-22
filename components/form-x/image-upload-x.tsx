import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import MultiImageUploadX from "./multi-image-upload-x";
import SingleImageUploadX from "./single-image-upload-x";

const ImageUploadX = ({
    form,
    name,
    label = "Upload Images",
    defaultValues,
    size = 3,
    multiple = false,
}: {
    form: any;
    name: string;
    label?: string;
    defaultValues?: string[];
    size?: number;
        multiple?: boolean;
    description?: string;
}) => {
    const { control, setValue } = form;
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        {multiple ? (
                            <MultiImageUploadX
                                defaultValue={defaultValues}
                                onChange={(value) => {
                                    setValue(field.name, value);
                                }}
                            />
                        ) : (
                            <SingleImageUploadX
                                // @ts-ignore
                                defaultValue={defaultValues || null}
                                onChange={(value) => {
                                    setValue(field.name, value);
                                }}
                            />
                        )}
                    </FormControl>
                    <FormDescription>
                        Only images. Max size {size}MB each.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default ImageUploadX;