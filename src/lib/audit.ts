import { createClient } from '@/lib/supabase/server';

export async function logAction(
    userId: string,
    action: 'view' | 'create' | 'update' | 'delete',
    entityTable: string,
    entityId?: string,
    metadata?: any
) {
    const supabase = createClient();

    try {
        await supabase.from('audit_logs').insert({
            actor_user_id: userId,
            action,
            entity_table: entityTable,
            entity_id: entityId,
            metadata
        });
    } catch (error) {
        console.error('Audit log failed:', error);
        // Fail silently to avoid blocking main business logic
    }
}
