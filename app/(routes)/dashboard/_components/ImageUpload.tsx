"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CloudUploadIcon, Loader2Icon, WandSparkles, X } from "lucide-react";
import Image from "next/image";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/configs/firebaseConfig";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useAuthContext } from "@/app/provider";
import { useRouter } from "next/navigation";
import { AiModelList } from "@/data/Constants";
import { toast } from "@/hooks/use-toast";

function ImageUpload() {
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const [aiModel, setAiModel] = React.useState<string | null>(null);
  const [description, setDescription] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const { user } = useAuthContext();
  const router = useRouter();

  // Select image method
  const OnImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;

    if (file) {
      // create image url
      const imageUrl = URL.createObjectURL(file[0]);
      setImagePreview(imageUrl);
      setFile(file[0]);
    }
  };

  // Wireframe to code converter method
  const OnConvertToCodeButtonClick = async () => {
    if (!file || !aiModel || !description) {
      console.error("Please fill all the fields");
      return;
    }

    setLoading(true);

    // // Save image to firebase storage
    // const fileName = Date.now() + ".png";
    // const imageRef = ref(storage, "wireframes_to_code/" + fileName); // Syntax: ref(storage, path)
    // await uploadBytes(imageRef, file).then((snapshot) => {
    //   console.log("Image Uploaded Successfully");
    // });

    // // Download image url from firebase storage
    // const imageUrl = await getDownloadURL(imageRef);
    // console.log("Image URL: ", imageUrl);

    // Save data to database
    const uid4 = uuidv4();
    // console.log("UID: ", uid4);
    const result = await axios.post("/api/wireframe-to-code", {
      imageUrl:
        "https://balsamiq.com/assets/learn/articles/wireframe-example.png", // Todo: handle it later using firebase storage/Cloudinary storage
      aiModel: aiModel,
      description: description,
      uid: uid4,
      email: user?.email,
    });
    console.log("Saved Wireframe Information Except Code in 1st Step: ", result.data);

    if (result?.data?.error) {
      toast({
        title: "Buy more credits",
        description: "You have no credits",
        variant: "destructive",
      });
      setLoading(false);
      return; // add this because not going to generate code
    }

    setLoading(false);
    router.push(`/view-code/${uid4}`);
  };

  return (
    <div className="mt-10">
      {/* Image Upload & User Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image Upload & Preview */}
        {!imagePreview ? (
          // Image Upload
          <div className="p-7 border border-dashed rounded-md shadow-md flex flex-col items-center justify-center">
            <CloudUploadIcon className="w-10 h-10 text-primary" />
            <h2 className="font-bold text-lg">Upload Image</h2>
            <p className="text-gray-400 mt-3">
              Click Button Select Wireframe Image
            </p>
            <div className="p-5 border border-dashed rounded-md mt-7 w-full flex justify-center">
              <label
                htmlFor="imageSelect"
                className="cursor-pointer font-medium text-primary bg-blue-100 px-5 py-2 rounded-md"
              >
                Select Image
              </label>
            </div>
            <input
              type="file"
              id="imageSelect"
              className="hidden"
              multiple={false}
              onChange={OnImageSelect}
            />
          </div>
        ) : (
          // Image Preview
          <div className="border border-dashed rounded-md shadow-md p-5">
            <Image
              src={imagePreview}
              alt="Preview"
              width={500}
              height={500}
              className="w-full h-[300px] object-contain"
            />
            <X
              className="cursor-pointer flex justify-center w-5 h-5 mx-auto mt-5"
              onClick={() => setImagePreview(null)}
            />
          </div>
        )}

        {/* User Input TextArea */}
        <div className="p-7 border border-dashed rounded-md shadow-md">
          {/* Select AI Model */}
          <h2 className="font-bold text-lg">Select AI Model</h2>
          <Select onValueChange={(value) => setAiModel(value)}>
            <SelectTrigger className="w-full mt-5">
              <SelectValue placeholder="Select AI Model" />
            </SelectTrigger>
            <SelectContent>
              {AiModelList.map((model, index) => (
                <SelectItem key={index} value={model.name}>
                  <div className="flex items-center">
                    <Image
                      src={model.icon}
                      alt={model.name}
                      width={30}
                      height={30}
                      className="w-8 h-8 object-contain mr-3"
                    />
                    <span>{model.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Description */}
          <h2 className="font-bold text-lg mt-7">
            Enter Description About Your Webpage
          </h2>
          <Textarea
            className="mt-5 h-[200px]"
            placeholder="Write about your webpage"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      {/* Submit Button */}
      <div className="mt-10 flex justify-center items-center">
        <Button onClick={OnConvertToCodeButtonClick} disabled={loading}>
          {loading ? (
            <>
              <Loader2Icon className="w-5 h-5 mr-2 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <WandSparkles className="w-5 h-5 mr-2" />
              <span>Convert to Code</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default ImageUpload;
