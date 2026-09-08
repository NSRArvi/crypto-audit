import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import usePostMutation from "@/hooks/usePostMutation";
import toast from "react-hot-toast";

export default function PriceProposal({ id }) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm({
    defaultValues: { price: "", mailBody: "" },
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const { mutate, isPending } = usePostMutation({
    endpoint: `/price/proposal/${id}`,
    isTokenRequired: true,
  });

  const handleSendMail = async (data) => {
    const formData = new FormData();
    formData.append("amount", data?.price);
    formData.append("proposal_details", data?.mailBody);

    mutate(formData, {
      onSuccess: (data) => {
        console.log(data);
        if (data?.success) {
          toast.success(data.message);
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const isEmptyHtml = (html = "") => {
    const text = html.replace(/<[^>]+>/g, "").trim();
    return text.length === 0;
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleSendMail)} className="space-y-8">
        <div>
          <Controller
            name="price"
            control={control}
            render={({ field, fieldState }) => {
              return (
                <Field>
                  <FieldLabel>Price *</FieldLabel>
                  <Input
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    type="number"
                    className="bg-white h-12"
                    placeholder="0.00"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />
        </div>
        <div>
          <Controller
            name="mailBody"
            control={control}
            rules={{
              validate: (val) => !isEmptyHtml(val) || "Email Body is required",
            }}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Email Body *</FieldLabel>
                <SunEditor
                  setContents={field.value}
                  onChange={field.onChange}
                  height="250px"
                  setOptions={{
                    buttonList: [
                      [
                        "undo",
                        "redo",
                        "formatBlock",
                        "bold",
                        "italic",
                        "underline",
                        "strike",
                      ],
                      ["fontSize", "fontColor", "hiliteColor", "removeFormat"],
                      ["align", "list", "outdent", "indent", "lineHeight"],
                      [
                        "blockquote",
                        "horizontalRule",
                        "table",
                        "link",
                        "image",
                        "video",
                      ],
                      ["fullScreen", "showBlocks", "preview"],
                    ],

                    formats: [
                      "p",
                      "div",
                      "h1",
                      "h2",
                      "h3",
                      "h4",
                      "h5",
                      "h6",
                      "blockquote",
                    ],
                    fontSize: [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36],
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div className="flex justify-end">
          <Button size="sm" className="gap-2 mt-6">
            <Send className="h-4 w-4" />
            {isPending ? "Sending..." : "Send proposal"}
          </Button>
        </div>
      </form>
    </div>
  );
}
