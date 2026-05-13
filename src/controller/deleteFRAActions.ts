"use server";

import { DeleteFRAController } from "@/controller/DeleteFRAController";

export async function deleteFRAAction(
  fraId: string,
  userId: string,
) {
  const controller = new DeleteFRAController();

  return controller.deleteFRA(fraId, userId);
}