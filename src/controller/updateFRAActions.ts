"use server";

import { revalidatePath } from "next/cache";
import { UpdateFRAController } from "@/fundraiser/controller/UpdateFRAController";

export async function updateFRAAction(
  fra_id: string,
  user_id: string,
  title: string,
  description: string,
  category: string,
  endDate: string,
  status: string,
) {
  const controller = new UpdateFRAController();
  const result = await controller.updateFRA(
    fra_id,
    user_id,
    title,
    description,
    category,
    endDate,
    status,
  );

  revalidatePath(`/fund-raiser/my-fras`);
  revalidatePath(`/fund-raiser/my-fras/${fra_id}`);
  revalidatePath(`/fund-raiser/completed-fras`);
  revalidatePath(`/fund-raiser/dashboard`);

  return result;
}
