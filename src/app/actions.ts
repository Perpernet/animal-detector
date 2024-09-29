"use server";
import { File } from "buffer";
import { pipeline, RawImage, ZeroShotImageClassificationPipeline } from '@xenova/transformers';

let detector: ZeroShotImageClassificationPipeline;

type Result = {
  type: 'error';
  error: 'NO_FILE' | 'NO_RESULTS';
} | {
  type: 'ok';
  result: {
    label: string;
    score: number;
  };
} | {
  type: 'not_started';
};

export async function uploadFile(_prevState: unknown, formData: FormData): Promise<Result> {
  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return {type: 'error', error: 'NO_FILE'};
  }

  if(!detector) {
    // detector = await pipeline('zero-shot-image-classification', 'openai/clip-vit-large-patch14');
    detector = await pipeline('zero-shot-image-classification');
  }
  
  const rawFile = await RawImage.fromBlob(file as never);

  const results = await detector(rawFile,  ["cat", "dog", "lion", "tiger", "snake", "zebra", "giraffe", "bear", "hippopotamus", "scorpion"], {});

  if(results && Array.isArray(results) && results.length > 0 && typeof results[0] === "object" && "label" in results[0] && "score" in results[0]) {
    return { type: 'ok', result: results[0] };
  }

  return {type: 'error', error: 'NO_RESULTS'};
}
