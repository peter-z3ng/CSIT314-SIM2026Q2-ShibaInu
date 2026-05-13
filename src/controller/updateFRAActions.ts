"use server";

import { revalidatePath } from "next/cache";
import {
  UpdateFRAController,
  type UpdateFRAInput,
} from "@/controller/UpdateFRAController";

export async function updateFRAAction(input: UpdateFRAInput) {
  const controller = new UpdateFRAController();
  const result = await controller.updateFRA(input);

  revalidatePath(`/fund-raiser/my-fras/${input.fraId}`);
  revalidatePath(`/fund-raiser/my-fras`);
  revalidatePath(`/fund-raiser/completed-fras`);

  return result;
}