import { Webhook, type WebhookRequiredHeaders } from "svix";
import { buffer } from "micro";
import type { NextApiHandler } from "next";
import { env } from "~/env.mjs";
import { type WebhookEvent } from "@clerk/clerk-sdk-node";
import { getServices } from "~/server/service-builder";
import { prisma } from "~/server/db";
import { clerkClient } from "@clerk/nextjs/server";
import { StatusCodes } from "http-status-codes";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler: NextApiHandler = async (req, res) => {
  const payload = (await buffer(req)).toString();
  const headers = req.headers;

  const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);
  let msg: WebhookEvent;

  try {
    msg = wh.verify(
      payload,
      headers as unknown as WebhookRequiredHeaders
    ) as WebhookEvent;
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({});
    return;
  }

  const services = getServices(prisma, clerkClient.users);

  try {
    switch (msg.type) {
      case "user.created":
        await services.clerkWebhook.onUserCreated(msg.data);
        break;
      case "user.deleted":
        await services.clerkWebhook.onUserDeleted(msg.data);
        break;
      case "user.updated":
        await services.clerkWebhook.onUserUpdated(msg.data);
        break;
      default:
        break;
    }
  } catch (ex) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({});
  }

  res.json({});
};

export default handler;
