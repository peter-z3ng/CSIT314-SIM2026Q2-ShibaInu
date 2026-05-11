"use server";

import {
  UpdateFRAController,
  type UpdateFRAInput,
} from "@/controller/UpdateFRAController";

export async function updateFRAAction(
  input: UpdateFRAInput,
) {
  const controller = new UpdateFRAController();

  return controller.updateFRA(input);
}