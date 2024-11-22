/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type ImageUploaderProps = {
  defaultValue?: string[];
  onChange: (files: File[]) => void;
  size?: number;
};

const MultiImageUploadX: React.FC<ImageUploaderProps> = ({
  defaultValue = [],
  onChange,
  size = 3,
}) => {
  const [images, setImages] = useState<(string | File)[]>(
    Array.isArray(defaultValue) ? defaultValue : []
  );
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const MAX_FILE_SIZE = size * 1024 * 1024;

  useEffect(() => {
    const fetchFilesFromUrls = async () => {
      const files = await Promise.all(
        defaultValue.map(async (url) => {
          const response = await fetch(url);
          const data = await response.blob();

          return new File([data], url?.split("/").pop() || "default.jpg", {
            type: data.type,
          });
        })
      );
      setImages(files);
      onChange(files as File[]);
    };

    if (
      Array.isArray(defaultValue) &&
      defaultValue.length &&
      typeof images[0] === "string"
    ) {
      fetchFilesFromUrls();
    }
  }, [defaultValue]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    const filteredFiles = newFiles.filter((file) => file.size <= MAX_FILE_SIZE);
    const uniqueFiles = filteredFiles.filter((newFile) => {
      return !images.some((image) => {
        if (typeof image === "string") return false;
        return image.name === newFile.name && image.size === newFile.size;
      });
    });

    if (newFiles.length !== filteredFiles.length) {
      setErrorMessage("Some files were too large and were not added.");
    } else {
      setErrorMessage("");
    }

    const updatedImages = [...images, ...uniqueFiles];
    setImages(updatedImages);
    onChange(updatedImages as File[]);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onChange(newImages as File[]);
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
    const newFiles = Array.from(event.dataTransfer.files || []);
    const filteredFiles = newFiles.filter((file) => file.size <= MAX_FILE_SIZE);
    const uniqueFiles = filteredFiles.filter((newFile) => {
      return !images.some((image) => {
        if (typeof image === "string") return false;
        return image.name === newFile.name && image.size === newFile.size;
      });
    });

    if (newFiles.length !== filteredFiles.length) {
      setErrorMessage("Some files were too large and were not added.");
    } else {
      setErrorMessage("");
    }

    const updatedImages = [...images, ...uniqueFiles];
    setImages(updatedImages);
    onChange(updatedImages as File[]);
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
            Drag and drop your files here
          </p>
          <p className="text-gray-500 text-center">or</p>
          <button
            type="button"
            className="text-primary underline"
            onClick={handleButtonClick}
          >
            Browse files
          </button>
          <input
            ref={inputRef}
            type="file"
            multiple
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
      {images.length > 0 && (
        <div className="mt-4 space-y-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center mb-4 p-2 border rounded-lg gap-4"
            >
              <div className="w-full min-h-[200px] relative">
                {typeof image === "string" ? (
                  <Image
                    src={image}
                    alt={`Image ${index + 1}`}
                    fill
                    className="rounded-md object-cover"
                  />
                ) : (
                  <Image
                    src={URL.createObjectURL(image)}
                    alt={`Image ${index + 1}`}
                    fill
                    className="rounded-md object-cover"
                  />
                )}
              </div>
              <div className="ml-4 flex items-center">
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
                  onClick={() => handleRemoveImage(index)}
                >
                  <X className="w-4 h-4 stroke-white" />
                </div>
              </div>
            </div>
          ))}
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

export default MultiImageUploadX;