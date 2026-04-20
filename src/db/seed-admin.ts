import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./index";
import { user } from "./schema";
import { eq } from "drizzle-orm";
import "dotenv/config";

const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite",
    }),
    emailAndPassword: {
        enabled: true,
    },
});

async function seedAdmin() {
    console.log("Seeding or updating admin...");
    const dummyEmail = "admin@qvibe.local";

    try {
        await auth.api.signUpEmail({
            body: {
                email: dummyEmail,
                password: "PassworD123##!",
                name: "admin",
            },
        });
        console.log("Admin account created.");
    } catch {
        console.log("Admin account already exists or another error occurred. Proceeding to update role...");
    }

    // Always ensure the role is set to 'admin'
    await db.update(user)
        .set({ role: 'admin' })
        .where(eq(user.email, dummyEmail));

    console.log("Admin role set successfully!");
}

seedAdmin();
