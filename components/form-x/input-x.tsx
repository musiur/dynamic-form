/**
 * @author: github.com/musiur
 * date: 29 May, 2024
 *
 * @description Unified & reusable INPUT component
 *
 * @params form, name, type, label, placeholder
 * form: react-hook-form
 * name: input name
 * type: input types
 * placeholder: input placeholder
 */

"use client";
import { useState } from "react";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { CalendarIcon, Eye, EyeOff } from "lucide-react";
import clsx from "clsx";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import TooltipX from "./tooltip-x";

export type InputX___Type_InputTypes =
    | "text"
    | "password"
    | "textarea"
    | "select"
    | "date"
    | "number";

export type TYPE__SelectOption = {
    label: string;
    value: string;
}

const InputX = ({
    form,
    name = "input",
    type = "text",
    label = "Input Field",
    placeholder = "",
    options = [{ label: "Test", value: "test" }],
    maxValue = 9999999999,
    minValue = 0,
    readOnly = false,
    disabled = false,
    className = "",
    tooltip = "",
    description
}: {
    form: any;
    name: string;
    type?: InputX___Type_InputTypes;
    label?: string;
    placeholder?: string;
    options?: TYPE__SelectOption[];
    maxValue?: number;
    minValue?: number;
    readOnly?: boolean;
    disabled?: boolean;
    className?: string;
    tooltip?: string;
    description?: string;
}) => {
    /**
     * State to manage showing password fields input as text or, password
     */
    const [showPass, setShowPass] = useState(false);

    /**
     * All Input fields in an Object Scaffold
     */

    const inputFields = {
        text: (field: any) => (
            <Input
                placeholder={placeholder}
                {...field}
                type={type}
                readOnly={readOnly}
                disabled={disabled || readOnly}
                className={className}
            />
        ),
        number: (field: any) => (
            <Input
                step="any"
                placeholder={placeholder}
                value={parseFloat(field.value || "0")}
                onChange={(e: any) => {
                    e.target.value && field.onChange(parseFloat(e.target.value));
                }}
                type={type}
                max={maxValue}
                min={minValue}
                readOnly={readOnly}
                disabled={disabled || readOnly}
                className={className}
            />
        ),
        textarea: (field: any) => (
            <Textarea
                placeholder={placeholder}
                {...field}
                type={type}
                rows="4"
                readOnly={readOnly}
                disabled={disabled || readOnly}
            />
        ),
        password: (field: any) => (
            <div className="relative">
                <Input
                    placeholder={placeholder}
                    {...field}
                    type={!showPass ? type : "text"}
                    readOnly={readOnly}
                    disabled={disabled || readOnly}
                    className={className}
                />
                <div
                    className="inline-flex w-8 h-8 items-center justify-center absolute top-[2px] right-2"
                    role="button"
                    onClick={() => setShowPass(!showPass)}
                >
                    <Eye
                        className={clsx(
                            "h-4 text-gray-400 dark:text-gray-500 transition-all duration-300",
                            {
                                "opacity-100 w-4": showPass,
                                "opacity-0 w-0": !showPass,
                            }
                        )}
                    />
                    <EyeOff
                        className={clsx(
                            "h-4 text-gray-400 dark:text-gray-500 transition-all duration-300",
                            {
                                "opacity-100 w-4": !showPass,
                                "opacity-0 w-0": showPass,
                            }
                        )}
                    />
                </div>
            </div>
        ),
        select: (field: any) => (
            <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={disabled || readOnly}
            >
                <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {options?.length
                        ? options?.map((option: TYPE__SelectOption) => {
                            const { value, label } = option;
                            return (
                                <SelectItem key={value} value={value}>
                                    {label}
                                </SelectItem>
                            );
                        })
                        : null}
                </SelectContent>
            </Select>
        ),
    };
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="space-y-2">
                    <FormLabel className="flex items-center justify-between gap-4">{label} {tooltip && <TooltipX content={tooltip} />}</FormLabel>
                    <FormControl>
                        {type === "date" ? (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                {disabled || readOnly ? null : (
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={(value) => {
                                                value && field.onChange(new Date(value));
                                            }}
                                            disabled={(date: any) =>
                                                date < new Date() && date > new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                )}
                            </Popover>
                        ) : (
                            // @ts-ignore
                            inputFields[type](field)
                        )}
                    </FormControl>
                    {description ? <FormDescription>{description}</FormDescription> : null}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default InputX;