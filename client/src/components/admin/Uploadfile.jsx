//npm i react-image-file-resizer

import React, { useState } from "react";
import { toast } from "react-toastify";
import Resizer from "react-image-file-resizer";
import { removeFiles, uploadFiles } from "../../api/product";
import useEcomStore from "../../store/ecom-store";
import { CircleX, LoaderCircle } from "lucide-react";

const Uploadfile = (props) => {
  const { form, setForm } = props;
  const token = useEcomStore((state) => state.token);
  const [isLoarding, setIsLoarding] = useState(false);

  const handleOnChange = (e) => {
    const files = e.target.files;
    if (!files) {
      return toast.warning("Please select a file!");
    }
    if (files) {
      setIsLoarding(true);
      let allFiles = form.images; // = []
      for (let i = 0; i < files.length; i++) {
        //Validate
        const file = files[i];
        if (!file.type.startsWith("image/")) {
          return toast.error(`File ${file.name} is not an image!`);
        }

        // Image Resize
        Resizer.imageFileResizer(
          file,
          720,
          720,
          "JPEG",
          100,
          0,
          (data) => {
            uploadFiles(token, data)
              .then((res) => {
                allFiles.push(res.data);
                setForm({
                  ...form,
                  images: allFiles,
                });
                setIsLoarding(false);
                toast.success("Upload image Success!");
              })
              .catch((error) => {
                setIsLoarding(false);
                console.log(error);
              });
          },
          "base64"
        );
      }
    }
  };

  const handleDelete = (public_id) => {
    const images = form.images;
    removeFiles(token, public_id)
      .then((res) => {
        const filterImages = images.filter((item) => {
          return item.public_id !== public_id;
        });
        setForm({
          ...form,
          images: filterImages,
        });
        toast.success(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <div className="flex flex-wrap">
        {/* Image */}
        {isLoarding && <LoaderCircle className="animate-spin w-10 h-10 mb-5" />}
        {form.images.map((item, index) => (
          <div className="relative flex flex-col flex-wrap" key={index}>
            <img
              className="w-auto h-40 mr-3 mb-3 object-contain"
              src={item.url}
              alt="Uploaded image"
            />
            <span
              onClick={() => handleDelete(item.public_id)}
              className="absolute right-3 bg-black p-2 rounded-bl-xl text-white  cursor-pointer hover:text-red-500 "
            >
              <CircleX />
            </span>
          </div>
        ))}
      </div>
      <div>
        <input
          onChange={handleOnChange}
          type="file"
          name="images"
          multiple
        ></input>
      </div>
    </div>
  );
};

export default Uploadfile;
