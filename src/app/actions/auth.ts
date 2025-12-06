"use server";

import { createClient } from "@supabase/supabase-js";

export async function checkUserExists(email: string) {
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );

    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
        console.error("Error fetching users:", error);
        return false;
    }

    // This is not efficient for large user bases but works for now.
    // For production with many users, we should use a separate 'users' table or an Edge Function.
    const user = data.users.find((u) => u.email === email);
    return !!user;
}
