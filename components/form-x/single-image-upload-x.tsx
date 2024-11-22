"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type ImageUploaderProps = {
  defaultValue?: string;
  onChange: (file: File | null) => void;
  size?: number;
};

const SingleImageUploadX: React.FC<ImageUploaderProps> = ({
  defaultValue = "",
  onChange,
  size = 3,
}) => {
  const [image, setImage] = useState<string | File>(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const MAX_FILE_SIZE = size * 1024 * 1024;

  useEffect(() => {
    const fetchFileFromUrl = async () => {
      if (typeof defaultValue === "string") {
        const response = await fetch(defaultValue);
        const data = await response.blob();
        const file = new File(
          [data],
          defaultValue.split("/").pop() || "default.jpg",
          {
            type: data.type,
          }
        );
        setImage(file);
        onChange(file);
      }
    };

    if (typeof defaultValue === "string" && defaultValue) {
      fetchFileFromUrl();
    }
  }, [defaultValue, onChange]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files?.[0];
    if (newFile) {
      if (newFile.size <= MAX_FILE_SIZE) {
        setImage(newFile);
        setErrorMessage("");
        onChange(newFile);
      } else {
        setErrorMessage("The file is too large and was not added.");
      }
    }
  };

  const handleRemoveImage = () => {
    setImage("");
    // onChange(null);
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const newFile = event.dataTransfer.files?.[0];
    if (newFile) {
      if (newFile.size <= MAX_FILE_SIZE) {
        setImage(newFile);
        setErrorMessage("");
        onChange(newFile);
      } else {
        setErrorMessage("The file is too large and was not added.");
      }
    }
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    else if (size < 1048576) return `${(size / 1024).toFixed(1)} KB`;
    else return `${(size / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="bg-white">
      <div
        className={`border-2 border-dashed rounded-lg p-6 ${
          isDragging
            ? "border-primary bg-blue-100"
            : "border-gray-300 bg-gray-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center h-32">
          <span className="text-primary text-2xl md:text-3xl lg:text-4xl mb-2">
            📁
          </span>
          <p className="text-gray-500 text-center">
            Drag and drop your file here
          </p>
          <p className="text-gray-500 text-center">or</p>
          <button
            type="button"
            className="text-primary underline"
            onClick={handleButtonClick}
          >
            Browse file
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
      </div>
      <p className="text-gray-500 mt-2 text-sm">
        Supported file size: PNG, JPG, GIF (Max {size}MB)
      </p>
      {errorMessage && (
        <p className="text-red-500 mt-2 text-sm">{errorMessage}</p>
      )}
      {image && (
        <div className="mt-4">
          <div className="relative flex flex-col items-center mb-4 p-2 border rounded-lg">
            <div className="w-full min-h-[200px] relative">
              {typeof image === "string" ? (
                <Image
                  src={image}
                  alt={`Image`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              ) : (
                <Image
                  src={URL.createObjectURL(image)}
                  alt={`Image`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              )}
            </div>
            <div className="ml-4 flex-grow">
              <div>
              <p className="text-gray-700 text-xs">
                Name: {typeof image === "string"
                  ? image.split("/").pop()
                  : image.name}
              </p>
              <p className="text-gray-500 text-xs">
                Size: {typeof image === "string" ? "" : formatFileSize(image.size)}
              </p>
              </div>
              <div
              className="ml-4 bg-red-500 text-white rounded-full p-1 min-w-5 min-h-5 w-5 h-5 flex items-center justify-center cursor-pointer"
              onClick={handleRemoveImage}
            >
              <X className="w-4 h-4 stroke-white" />
            </div>
            </div>
            
          </div>
        </div>
      )}
      <div
        onClick={handleButtonClick}
        className="mt-4 py-2 rounded-lg border bg-white flex items-center justify-center text-sm"
      >
        Upload Image
      </div>
    </div>
  );
};

export default SingleImageUploadX;