"use server";

import { AuthController } from "@/controller/AuthController";
import { DeleteFRAController } from "@/fundraiser/controller/DeleteFRAController";
import { RetrieveFRAController } from "@/fundraiser/controller/RetrieveFRAController";

export async function deleteFRAAction(fraId: string, userId: string) {
  const account = await new AuthController().getCurrentAccount();

  if (!account || account.userId !== userId) {
    throw new Error("Unable to delete this FRA.");
  }

  const fra = await new RetrieveFRAController().retrieveFRA(fraId);

  if (fra.userId !== userId) {
    throw new Error("Unable to delete this FRA.");
  }

  const controller = new DeleteFRAController();

  return controller.deleteFRA(fraId);
}
