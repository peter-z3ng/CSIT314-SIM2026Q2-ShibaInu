"use server";

import { CreateFRAController } from "@/fundraiser/controller/CreateFRAController";

export async function createFRAAction(
  fundraiser_id: string,
  title: string,
  description: string,
  targetAmount: number,
  category: string,
  startDate: string,
  endDate: string,
) {
  const controller = new CreateFRAController();
  return controller.createFRA(
    fundraiser_id,
    title,
    description,
    targetAmount,
    category,
    startDate,
    endDate,
  );
}
