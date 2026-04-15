import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { X } from "lucide-react";

export default function ImageUpload({ productImages, setProductData }) {
  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setProductData((pre) => ({
        ...pre,
        productImage: [...productImages, ...files],
      }));
    }
  };
  const removeImage = (indx) => {
    setProductData((pre) => {
      const updateImage = productImages?.filter((_, index) => index !== indx);
      return { ...pre, productImage: updateImage };
    });
  };
  return (
    <div className="grid gap-3 mt-4">
      <Label>Product Images</Label>

      <Input
        type="file"
        id="file-upload"
        className="hidden"
        multiple
        onChange={handleFiles}
      />

      <Button variant="outline" type="button" className="w-full sm:w-fit ">
        <label htmlFor="file-upload" className="cursor-pointer w-full">
          Upload Images
        </label>
      </Button>

      {productImages?.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 m-5">
          {productImages?.map((file, indx) => {
            let preview;

            if (file instanceof File) preview = URL.createObjectURL(file);
            else if (typeof file === "string") preview = file;
            else if (file?.url) preview = file.url;
            else return null;

            return (
              <Card key={indx} className="relative group ">
                <CardContent className="p-2">
                  <img
                    src={preview}
                    className="w-full h-28 sm:h-32 object-cover rounded"
                  />

                  <Button
                    type="button"
                    onClick={() => removeImage(indx)}
                    className="absolute top-1 right-1 bg-black/60 text-white w-8 h-8 p-0 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <X size={16} />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
