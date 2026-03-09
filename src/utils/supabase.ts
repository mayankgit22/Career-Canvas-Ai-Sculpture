import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables. Check your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Utility to upload an AI resume string to the 'ai_resume' bucket as a .md file
export const uploadAIResumeToStorage = async (userId: string, markdownContent: string) => {
    try {
        const fileName = `${userId}_ai_resumes_${Date.now()}.md`;
        const blob = new Blob([markdownContent], { type: 'text/markdown' });

        const { data, error } = await supabase.storage
            .from('ai_resumes')
            .upload(fileName, blob, {
                cacheControl: '3600',
                upsert: true
            });

        if (error) {
            console.error("Storage upload error:", error);
            throw error;
        }

        const { data: publicUrlData } = supabase.storage
            .from('ai_resumes')
            .getPublicUrl(fileName);

        return publicUrlData.publicUrl;
    } catch (error) {
        console.error("Error in uploadAIResumeToStorage:", error);
        throw error;
    }
};
