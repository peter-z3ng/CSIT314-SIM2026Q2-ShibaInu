"use server";

import { CreateFRAController, type CreateFRAInput } from "@/controller/CreateFRAController";

export async function createFRAAction(input: CreateFRAInput) {
  const controller = new CreateFRAController();
  return controller.createFRA(input);
}
