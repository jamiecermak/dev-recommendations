import type { DeletedObjectJSON, UserJSON } from "@clerk/clerk-sdk-node";
import type { ClerkUserService } from "../users/clerk-user-service";

class ClerkWebhookService {
  constructor(private clerkUserService: ClerkUserService) {}

  async onUserCreated(event: UserJSON) {
    if (
      event.email_addresses.length === 0 ||
      !event.email_addresses[0]?.email_address
    )
      return;

    await this.clerkUserService.getOrCreateUser(
      event.id,
      event.first_name,
      event.last_name,
      event.email_addresses[0]?.email_address
    );
  }

  async onUserUpdated(event: UserJSON) {
    if (
      event.email_addresses.length === 0 ||
      !event.email_addresses[0]?.email_address
    )
      return;

    await this.clerkUserService.updateUser(
      event.id,
      event.first_name,
      event.last_name,
      event.email_addresses[0].email_address
    );
  }

  async onUserDeleted(event: DeletedObjectJSON) {
    if (!event.id) return;

    await this.clerkUserService.deactivateUser(event.id);
  }
}

export class NoClerkWebhookUserIDError extends Error {
  constructor() {
    super("Attempted to ingest Clerk User Webhook, but had no User ID");
    this.name = "NoClerkWebhookUserIDError";
  }
}

export { ClerkWebhookService };
