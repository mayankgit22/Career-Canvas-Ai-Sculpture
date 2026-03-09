const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

export const generateAIResume = async (profileData: any) => {
    if (!GROQ_API_KEY) {
        throw new Error("Groq API Key not found. Please add VITE_GROQ_API_KEY to your .env file.");
    }

    const prompt = `
    You are an expert career consultant and professional resume developer.
    Your goal is to generate a high-end, professional, and ATS-optimized resume.
    
    CRITICAL STRUCTURE INSTRUCTIONS:
    Generate the resume using the following structure with EXACTLY these ## Headers in this order:
    1. ## CONTACT INFORMATION: Full Name, Location, Phone, Email.
    2. ## PROFESSIONAL SUMMARY: A powerful 3-4 sentence narrative focusing on impact.
    3. ## ACADEMIC BACKGROUND: Detail your University, Degree, Graduation Year, and GPA.
    4. ## PROFESSIONAL PROJECTS: List your key projects with bullet points (-) for achievements and technical impact.
    5. ## TECHNICAL EXPERTISE: A comma-separated list of your technical skills and tools.
    6. ## ACHIEVEMENTS AND AWARDS: List any professional or academic honors.
    7. ## EXTRA-CURRICULAR ACTIVITIES: List leadership roles, volunteering, or hobbies.
    
    CRITICAL FORMATTING RULES:
    1. Use only ## for section headers.
    2. Use standard bullet points (-) for achievements.
    3. Do NOT include any filler text, preamble, or conversational filler.
    4. Focus on impact, use action verbs, and maintain a world-class executive tone.

    Profile Data:
    User: ${profileData.first_name} ${profileData.last_name}
    Bio: ${profileData.bio}
    Skills: ${profileData.skills?.join(", ")}
    Education: ${profileData.university}, ${profileData.degree}, ${profileData.graduation_year}, GPA: ${profileData.gpa}
    Projects: ${JSON.stringify(profileData.projects)}
  `;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: [
                    { role: "system", content: "You are an expert career coach. Your task is to generate professional, career-related content. Strictly avoid any non-professional topics." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.5
            })
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message);
        }
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Error generating resume with Groq:", error);
        throw error;
    }
};

export const generateAIPortfolio = async (profileData: any) => {
    if (!GROQ_API_KEY) {
        throw new Error("Groq API Key not found.");
    }

    const prompt = `
    You are a world-class senior writer and personal branding expert.
    Generate a high-impact, professional Personal Portfolio for the following person:
    
    Name: ${profileData.first_name} ${profileData.last_name}
    Bio: ${profileData.bio}
    Skills: ${profileData.skills?.join(", ")}
    Projects: ${JSON.stringify(profileData.projects)}
    
    GOAL: Generate the full narrative and content for a professional portfolio website.
    Structure the response into these sections using ## headers:
    1. ## Hero Section: Create a high-converting, premium headline and subheadline that makes a powerful first impression.
    2. ## About Me: Write a compelling, story-driven professional narrative based on their bio.
    3. ## Professional Showcase: Curate their projects. For each, write a "Challenge" and "Solution" description that highlights their impact.
    4. ## Technical Expertise: A structured list of their skills grouped by category.
    5. ## Contact Hook: A persuasive call to action for recruiters or collaborators.
    
    CRITICAL: 
    - Do NOT include any technical metadata, hex codes, or "design specs". 
    - Focus 100% on high-quality, professional writing.
    - Use a tone that is elegant, premium, and authoritative.
  `;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: [
                    { role: "system", content: "You are a senior personal branding expert. You generate high-impact professional portfolio content focused on storytelling and achievements." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.5
            })
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message);
        }
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Error generating portfolio with Groq:", error);
        throw error;
    }
};

export const generateAICoverLetter = async (profileData: any, opportunity: any) => {
    if (!GROQ_API_KEY) {
        throw new Error("Groq API Key not found.");
    }

    const prompt = `
    Write a professional, persuasive, and strictly career-oriented cover letter for the following person and opportunity:
    
    User: ${profileData.first_name} ${profileData.last_name}
    Professional Bio: ${profileData.bio}
    Key Skills: ${profileData.skills?.join(", ")}
    Relevant Projects: ${JSON.stringify(profileData.projects)}
    
    Target Opportunity: ${opportunity.title} at ${opportunity.company}
    
    INSTRUCTIONS:
    - Focus exclusively on technical skills and professional achievements.
    - Highlight specific projects that demonstrate fit for the role.
    - Keep the tone professional and enthusiastic.
    - Length: 300-400 words.
    - This content is for a formal job application.
  `;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: [
                    { role: "system", content: "You are a senior career consultant. You specialize in writing formal cover letters for corporate job applications. You strictly avoid any explicit, inappropriate, or non-professional content. You only generate text suitable for a business environment." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.5
            })
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message);
        }
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Error generating cover letter with Groq:", error);
        throw error;
    }
};
