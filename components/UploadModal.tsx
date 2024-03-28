"use client";

import uniqid from "uniqid";
import React, { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { z, ZodError } from "zod";
import useUploadModal from "@/hooks/useUploadModal";
import { useUser } from "@/hooks/useUser";

import Modal from "./Modal";
import SInput from "./Input";
import SButton from "./Button";

const schema = z.object({
  author: z
    .string()
    .nonempty("Author is required")
    .min(3, "Author must be at least 3 characters")
    .max(10, "Author cannot exceed 10 characters"),
  title: z
    .string()
    .nonempty("Author is required")
    .min(3, "Title must be at least 3 characters")
    .max(15, "Title cannot exceed 15 characters"),
  song: z.string().refine((value) => value.endsWith(".mp3"), {
    message: "Invalid song file format",
    path: ["song"],
  }),
  image: z
    .string()
    .refine(
      (value) =>
        value.endsWith(".jpg") ||
        value.endsWith(".png") ||
        value.endsWith(".jpeg"),
      {
        message: "Invalid image file format",
        path: ["image"],
      }
    ),
});

const UploadModal = () => {
  const [validationErrors, setValidationErrors] = useState<ZodError | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const uploadModal = useUploadModal();
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();
  const router = useRouter();

  const { register, handleSubmit, getValues, reset, setFocus } =
    useForm<FieldValues>({
      defaultValues: {
        author: "",
        title: "",
        song: null,
        image: null,
      },
    });

  // focus set
  useEffect(() => {
    setFocus("title");
  }, [setFocus]);

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      uploadModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);
      var validationResult = schema.safeParse(values);

      if (!validationResult.success) {
        setValidationErrors(validationResult.error.errors);
        toast.error("Validation error occurred");
        setIsLoading(false);
        return;
      }

      const imageFile = values.image?.[0];
      const songFile = values.song?.[0];

      if (!imageFile || !songFile || !user) {
        toast.error("Missing fields");
        return;
      }

      const uniqueID = uniqid();

      // Upload song
      const { data: songData, error: songError } = await supabaseClient.storage
        .from("songs")
        .upload(`song-${values.title}-${uniqueID}`, songFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (songError) {
        setIsLoading(false);
        return toast.error("Failed song upload");
      }

      // Upload image
      const { data: imageData, error: imageError } =
        await supabaseClient.storage
          .from("images")
          .upload(`image-${values.title}-${uniqueID}`, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });

      if (imageError) {
        setIsLoading(false);
        return toast.error("Failed image upload");
      }

      // Create record
      const { error: supabaseError } = await supabaseClient
        .from("songs")
        .insert({
          user_id: user.id,
          title: values.title,
          author: values.author,
          image_path: imageData.path,
          song_path: songData.path,
        });

      if (supabaseError) {
        return toast.error(supabaseError.message);
      }

      router.refresh();
      setIsLoading(false);
      toast.success("Song created!");
      reset();
      uploadModal.onClose();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Add a song"
      descriptiont="Upload an mp3 file"
      isOpen={uploadModal.isOpen}
      onchange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <div className="flex flex-col">
          <label htmlFor="title" className="pb-1 text-neutral-300">
            Song Title
          </label>
          <SInput
            id="title"
            disabled={isLoading}
            {...register("title", { required: true })}
            placeholder="Song title"
          />
          {validationErrors &&
            validationErrors.find((error) => error.path[0] === "title") && (
              <span className="text-red-500 text-xs mt-1">
                {
                  validationErrors.find((error) => error.path[0] === "title")
                    .message
                }
              </span>
            )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="title" className="pb-1 text-neutral-300">
            Song Author
          </label>
          <SInput
            id="author"
            disabled={isLoading}
            {...register("author", { required: true })}
            placeholder="Song author"
          />
          {validationErrors &&
            validationErrors.find((error) => error.path[0] === "author") && (
              <span className="text-red-500 text-xs mt-1">
                {
                  validationErrors.find((error) => error.path[0] === "author")
                    ?.message
                }
              </span>
            )}
        </div>
        <div>
          <div className="pb-1 text-neutral-300">Select a song file</div>
          <SInput
            placeholder="test"
            disabled={isLoading}
            type="file"
            accept=".mp3"
            id="song"
            {...register("song", { required: true })}
          />
          {validationErrors &&
            validationErrors.find((error) => error.path[0] === "song") && (
              <span className="text-red-500 text-xs mt-1">
                {
                  validationErrors.find((error) => error.path[0] === "song")
                    .message
                }
              </span>
            )}
        </div>
        <div>
          <div className="pb-1 text-neutral-300">Select an image</div>
          <SInput
            placeholder="test"
            disabled={isLoading}
            type="file"
            accept="image/*"
            id="image"
            {...register("image", { required: true })}
          />
          {validationErrors &&
            validationErrors.find((error) => error.path[0] === "image") && (
              <span className="text-red-500 text-xs mt-1">
                {
                  validationErrors.find((error) => error.path[0] === "image")
                    .message
                }
              </span>
            )}
        </div>
        <SButton disabled={isLoading} type="submit">
          Create
        </SButton>
      </form>
    </Modal>
  );
};

export default UploadModal;
