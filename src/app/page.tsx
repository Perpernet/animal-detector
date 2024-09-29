"use client";
import { useFormState, useFormStatus } from "react-dom";
import {uploadFile} from "./actions";
import { useState } from "react";

export default function Home() {
  const [state, formAction] = useFormState(uploadFile, {type: 'not_started'});
  const [image, setImage] = useState<string | null>(null);

  return (
    <main className="flex flex-1 flex-col justify-center items-center h-[100vh]">
      <div className="flex h-1/3 items-center">
        <h1 className="text-8xl">Animal Classifier</h1>
      </div>
      <form action={formAction} className="flex  h-1/3 flex-col gap-4">
        <label htmlFor="upload-image" className="w-96 h-64 bg-neutral-700/25 flex justify-center items-center rounded-xl">
          {
            image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="Selected image" className="w-full h-full object-contain" />
            ) : null
          }
          <h1 className="absolute bg-neutral-700/85 p-2 rounded-xl">Click to upload image</h1>
        </label>
        <input
          id="upload-image"
          type="file"
          name="file"
          className="hidden"
          onChange={(event) => {
            if(!event?.target?.files?.[0]) {
              return;
            }

            const reader = new FileReader();
            reader.onload = (e) => setImage(e.target?.result as string ?? null);
            reader.readAsDataURL(event.target.files[0]);
          }}
        />
        <SumbitButton />
      </form>

      <div className="flex h-1/3 items-center">
        {
          state?.type !== 'ok' ? null : (
            <div>
              <div className="text-4xl text-center">It&apos;s a {state.result.label}</div>
              <div>(Score: {state.result.score})</div>
            </div>
          )
        }
      </div>
    </main>
  );
}

function SumbitButton() {
  const { pending } = useFormStatus()
 
  return (
    <button disabled={pending} className="bg-slate-700 w-fit self-center px-4 py-2 rounded-xl text-xl" type="submit">Classify</button>
  )
}
