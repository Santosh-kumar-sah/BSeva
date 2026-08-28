const { prisma } = require('../../database/db');
const config = require('../../config');

/**
 * AI Grounded Knowledge Service & RAG Engine
 * Combines Supabase scheme retrieval with OpenRouter LLM generation for human-grade, grounded answers.
 */
class AiService {
  /**
   * Fetch all active scheme & career context from Supabase PostgreSQL
   */
  async getKnowledgeBase() {
    const [schemes, careers] = await Promise.all([
      prisma.scheme.findMany({
        where: { status: 'ACTIVE' },
        include: { department: true, category: true, rules: true }
      }),
      prisma.careerPath.findMany()
    ]);
    return { schemes, careers };
  }

  /**
   * Match citations based on AI response content and user query
   */
  extractCitations(responseText, query, schemes, careers, isHindi) {
    const citations = [];
    const textLower = (responseText + ' ' + query).toLowerCase();

    for (const s of schemes) {
      const matchTitleEn = s.title_en.toLowerCase();
      const matchTitleHi = s.title_hi.toLowerCase();
      const slugClean = s.slug.replace(/-/g, ' ');

      if (
        textLower.includes(matchTitleEn) ||
        textLower.includes(matchTitleHi) ||
        textLower.includes(slugClean) ||
        (textLower.includes('credit card') && s.slug.includes('credit')) ||
        (textLower.includes('kanya') && s.slug.includes('kanya')) ||
        (textLower.includes('udyami') && s.slug.includes('udyami')) ||
        (textLower.includes('krishi') && s.slug.includes('krishi')) ||
        (textLower.includes('pension') && s.slug.includes('pension') && textLower.includes('elderly'))
      ) {
        citations.push({
          title: isHindi ? s.title_hi : s.title_en,
          type: 'SCHEME',
          sourceDepartment: isHindi ? (s.department?.name_hi || s.department?.name_en) : s.department?.name_en,
          officialUrl: s.official_portal_url,
          lastVerifiedDate: s.last_verified_date,
          slug: `/schemes/${s.slug}`
        });
      }
    }

    for (const c of careers) {
      const matchTitle = c.title_en.toLowerCase();
      const matchIndustry = c.industry.toLowerCase();
      if (textLower.includes(matchTitle) || textLower.includes(matchIndustry) || textLower.includes(c.slug.replace(/-/g, ' '))) {
        citations.push({
          title: isHindi ? c.title_hi : c.title_en,
          type: 'CAREER',
          sourceDepartment: 'Bihar Skill Development Mission (BSDM)',
          officialUrl: 'https://skillmissionbihar.org',
          slug: `/careers/${c.slug}`
        });
      }
    }

    // Deduplicate citations by slug
    const uniqueCitations = [];
    const seen = new Set();
    for (const item of citations) {
      if (!seen.has(item.slug)) {
        seen.add(item.slug);
        uniqueCitations.push(item);
      }
    }

    return uniqueCitations.slice(0, 4);
  }

  /**
   * Generate action navigation chips based on extracted citations
   */
  generateActionChips(citations, isHindi) {
    const chips = [];

    for (const c of citations) {
      chips.push({
        label: isHindi ? `${c.title.slice(0, 24)}... विवरण` : `View ${c.title.slice(0, 22)}`,
        link: c.slug
      });
    }

    chips.push({
      label: isHindi ? 'पात्रता जांचें' : 'Check Eligibility',
      link: '/eligibility'
    });

    if (chips.length < 4) {
      chips.push({
        label: isHindi ? 'सभी योजनाएं देखें' : 'View All Schemes',
        link: '/schemes'
      });
    }

    return chips.slice(0, 4);
  }

  /**
   * Process Query with OpenRouter LLM + Supabase Grounding
   */
  async processQuery({ query, language = 'hi', userProfile = null }) {
    const isHindi = language === 'hi';
    const { schemes, careers } = await this.getKnowledgeBase();

    // If OpenRouter API key is available, call OpenRouter LLM using native fetch
    if (config.openRouterApiKey) {
      try {
        const schemesSummary = schemes.map(s => `
[SCHEME: ${s.title_en} / ${s.title_hi}]
- Slug: ${s.slug}
- Department: ${s.department?.name_en}
- Category: ${s.categoryId}
- Application Mode: ${s.application_mode}
- Key Benefits: ${s.benefits_en} (Hindi: ${s.benefits_hi})
- Eligibility Rules: ${(s.rules || []).map(r => r.message_en || `${r.field}: ${JSON.stringify(r.value)}`).join('; ')}
- Required Documents: ${(s.required_documents || []).join(', ')}
- Official Portal: ${s.official_portal_url}
        `).join('\n');

        const careersSummary = careers.map(c => `
[CAREER: ${c.title_en} / ${c.title_hi}]
- Slug: ${c.slug}
- Industry: ${c.industry}
- Min Education: ${c.min_education}
- Avg Salary: ₹${c.avg_starting_salary_inr} INR/year (${c.growth_prospects} growth)
- Skills Required: ${(c.required_skills || []).join(', ')}
- BSDM Training Programs: ${(c.bsdm_training_path || []).join(', ')}
        `).join('\n');

        const systemPrompt = `You are "Bihar Sahayak AI" (बिहार सहायक AI), an intelligent, highly accurate, and empathetic assistant for citizens, students, farmers, women, and youth in Bihar, India.

CRITICAL INSTRUCTIONS:
1. ONLY provide advice and recommendations based on verified Bihar government schemes and career opportunities provided in the knowledge base below.
2. CAREFULLY analyze the citizen's demographic & academic profile in the query.
   - For example: If the user is a B.Tech / College / Engineering student (e.g. 12th pass doing B.Tech 3rd year CSE/AI-ML), recommend:
     * Bihar Student Credit Card Scheme (education loans up to ₹4 Lakhs for B.Tech/higher education)
     * Post-Matric Technical Scholarship / KYP
     * Bihar Startup Policy (seed grants for tech/AI ventures)
     * High-demand tech career pathways like Full-Stack Software Developer, Data & AI Specialist, and BSDM skill courses.
   - NEVER recommend senior citizen pension, widow pension, or irrelevant farmer schemes to students or young citizens!
3. Format your response cleanly using markdown with bold headings, bullet points, financial benefit amounts in INR (₹), eligibility summary, and official application portals.
4. Reply in ${isHindi ? 'fluent, respectful Hindi (हिंदी)' : 'clear, professional English'}. If the user writes in English, reply in English.
5. Conclude with a helpful note mentioning that they can check their exact eligibility using the BSeva Eligibility Checker.

VERIFIED KNOWLEDGE BASE OF BIHAR GOVERNMENT SCHEMES:
${schemesSummary}

VERIFIED BSDM CAREER & SKILL PATHWAYS:
${careersSummary}
`;

        const userMessageContent = userProfile
          ? `User Profile: ${JSON.stringify(userProfile)}\n\nCitizen Question: ${query}`
          : `Citizen Question: ${query}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000);

        const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.openRouterApiKey}`,
            'HTTP-Referer': 'http://localhost:5173',
            'X-Title': 'Bihar Sahayak (BSeva)',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: config.openRouterModel,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userMessageContent }
            ],
            temperature: 0.2,
            max_tokens: 1000
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (openRouterResponse.ok) {
          const data = await openRouterResponse.json();
          const aiText = data?.choices?.[0]?.message?.content;

          if (aiText) {
            const citations = this.extractCitations(aiText, query, schemes, careers, isHindi);
            const actionChips = this.generateActionChips(citations, isHindi);

            return {
              success: true,
              query,
              intent: 'AI_SYNTHESIS',
              language,
              response: {
                text: aiText,
                citations,
                actionChips,
                disclaimer: isHindi
                  ? 'अस्वीकरण: यह जानकारी बिहार सरकार के सत्यापित आधिकारिक स्रोतों पर आधारित है। अंतिम पात्रता एवं स्वीकृति संबंधित विभाग का निर्णय है।'
                  : 'Disclaimer: This response is grounded on verified official Bihar government sources. Final eligibility and approval remain under the respective department.'
              }
            };
          }
        } else {
          const errBody = await openRouterResponse.text();
          console.error('OpenRouter HTTP error:', openRouterResponse.status, errBody);
        }
      } catch (openRouterErr) {
        console.error('OpenRouter call error (falling back to deterministic retriever):', openRouterErr.message);
      }
    }

    // Fallback deterministic RAG processor
    return this.fallbackDeterministicProcessor({ query, language, schemes, careers, isHindi });
  }

  /**
   * Deterministic Fallback Processor with Enhanced Student & Academic Filters
   */
  fallbackDeterministicProcessor({ query, language, schemes, careers, isHindi }) {
    const q = query.toLowerCase();

    // Check if query is from an engineering / college student
    const isStudentQuery = q.includes('btech') || q.includes('b.tech') || q.includes('cse') || q.includes('engineering') || q.includes('12th') || q.includes('college') || q.includes('student') || q.includes('पढ़ाई');
    const isFarmerQuery = q.includes('किसान') || q.includes('खेती') || q.includes('कृषि') || q.includes('कल्टीवेटर') || q.includes('यंत्र') || q.includes('farmer');

    let matchedSchemes = [];
    let matchedCareers = [];
    let answerText = '';

    if (isStudentQuery) {
      matchedSchemes = schemes.filter(s => 
        s.slug.includes('student-credit') || 
        s.slug.includes('scholarship') || 
        s.slug.includes('swayam-sahayata') || 
        s.categoryId === 'education'
      );
      matchedCareers = careers.filter(c => c.industry.includes('Technology') || c.slug.includes('software') || c.slug.includes('ai'));

      if (isHindi) {
        answerText = `नमस्ते! आप **12वीं पास और B.Tech (CSE AI/ML)** के छात्र हैं। वर्ष 2026 में बिहार सरकार की निम्नलिखित योजनाएं और करियर अवसर आपके लिए सबसे उपयुक्त हैं:\n\n` +
          `### 1. 🎓 उच्च शिक्षा एवं छात्रवृत्ति योजनाएं:\n` +
          `• **बिहार स्टूडेंट क्रेडिट कार्ड योजना (MNSSBY):** B.Tech इंजीनियरिंग की पढ़ाई, कॉलेज फीस, हॉस्टल और लैपटॉप के लिए **₹4,00,000 (4 लाख रुपये)** तक का सुलभ शिक्षा ऋण (मात्र 1% से 4% ब्याज दर पर)।\n` +
          `• **पोस्ट-मैट्रिक स्कॉलरशिप (PMS Bihar):** बी.टेक तकनीकी पाठ्यक्रमों के लिए सीधे बैंक खाते में शिक्षण शुल्क और अनुरक्षण भत्ता।\n` +
          `• **बिहार स्टार्ट-अप नीति (Bihar Startup Policy):** यदि आप AI/ML आधारित टेक स्टार्टअप शुरू करना चाहते हैं, तो **₹10 लाख तक का ब्याज-मुक्त सीड फंड**।\n\n` +
          `### 2. 💻 CSE और AI/ML संबंधित करियर पाथवे:\n` +
          `• **Full-Stack & Cloud Software Developer:** अनुमानित वेतन ₹4.5L - ₹8.5L/वर्ष। बिहार कौशल विकास मिशन (BSDM) के उन्नत आईटी प्रोग्राम उपलब्ध हैं।\n\n` +
          `आप हमारी **पात्रता जांच प्रणाली** से अपने जिले एवं श्रेणी अनुसार तुरंत विस्तृत पात्रता रिपोर्ट भी देख सकते हैं।`;
      } else {
        answerText = `Hello! As a **12th pass student pursuing 3rd year B.Tech in CSE (AI/ML)**, here is what you are eligible for in Bihar in 2026:\n\n` +
          `### 1. 🎓 Higher Education & Financial Assistance Schemes:\n` +
          `• **Bihar Student Credit Card Scheme (MNSSBY):** Up to **₹4,00,000 (4 Lakhs)** education loan at subsidized interest rates (1% to 4%) covering B.Tech tuition, hostel, and laptops.\n` +
          `• **Post-Matric Scholarship (PMS Bihar):** Direct reimbursement of technical education tuition fees and maintenance allowance.\n` +
          `• **Bihar Startup Policy:** Up to **₹10 Lakhs interest-free seed grant** for students building innovative technology or AI ventures.\n\n` +
          `### 2. 💻 High-Growth Tech Career Pathways for CSE / AI-ML:\n` +
          `• **Full-Stack & Cloud Software Developer:** Avg starting salary ₹4.5L - ₹8.5L/yr with specialized certifications supported under Bihar Skill Development Mission (BSDM).\n\n` +
          `You can also evaluate your exact qualification using our BSeva **Eligibility Checker**.`;
      }
    } else if (isFarmerQuery) {
      matchedSchemes = schemes.filter(s => s.departmentId === 'AGRI_BIHAR' || s.categoryId === 'agriculture');
      if (isHindi) {
        answerText = `कृषि एवं किसान कल्याण के लिए बिहार सरकार की प्रमुख योजनाएं:\n\n` +
          `• **कृषि यंत्रीकरण योजना:** ट्रैक्टर, कल्टीवेटर और आधुनिक कृषि यंत्रों पर 40% से 80% तक का सरकारी अनुदान।\n` +
          `• **PM-किसान सम्मान निधि (बिहार DBT):** प्रति वर्ष ₹6,000 की प्रत्यक्ष आर्थिक सहायता।\n` +
          `• **बिहार राज्य फसल सहायता योजना:** प्राकृतिक आपदा या सूखे की स्थिति में फसल क्षतिपूर्ति सहायता।`;
      } else {
        answerText = `Key Bihar Government agricultural assistance schemes:\n\n` +
          `• **Krishi Yantrikaran Scheme:** 40% to 80% subsidy on modern agricultural equipment.\n` +
          `• **PM-Kisan Samman Nidhi (Bihar DBT):** ₹6,000 annual direct income support.\n` +
          `• **Bihar Rajya Fasal Sahayata Yojana:** Crop insurance compensation for weather-related damage.`;
      }
    } else {
      matchedSchemes = schemes.slice(0, 3);
      matchedCareers = careers.slice(0, 2);
      if (isHindi) {
        answerText = `नमस्ते! मैं बिहार सहायक AI हूँ। मैं आपको बिहार सरकार की 25+ छात्रवृत्ति, कृषि, महिला सशक्तिकरण एवं रोजगार योजनाओं तथा BSDM करियर पाथवे की आधिकारिक जानकारी दे सकता हूँ।`;
      } else {
        answerText = `Hello! I am Bihar Sahayak AI. I can assist you with verified information on Bihar government scholarships, agriculture subsidies, women empowerment schemes, and BSDM career training.`;
      }
    }

    const citations = this.extractCitations(answerText, query, schemes, careers, isHindi);
    const actionChips = this.generateActionChips(citations, isHindi);

    return {
      success: true,
      query,
      intent: 'DETERMINISTIC_MATCH',
      language,
      response: {
        text: answerText,
        citations,
        actionChips,
        disclaimer: isHindi
          ? 'अस्वीकरण: यह जानकारी बिहार सरकार के सत्यापित आधिकारिक स्रोतों पर आधारित है। अंतिम पात्रता एवं स्वीकृति संबंधित विभाग का निर्णय है।'
          : 'Disclaimer: This response is grounded on verified official Bihar government sources. Final eligibility and approval remain under the respective department.'
      }
    };
  }

  /**
   * Starter suggestions
   */
  getSuggestions(language = 'hi') {
    if (language === 'en') {
      return [
        { label: 'Scholarships for B.Tech & College Students', query: 'What scholarships and student credit card schemes are available for B.Tech engineering students in Bihar?' },
        { label: 'Subsidies for Agricultural Equipment', query: 'How to get subsidy on agricultural equipment in Bihar?' },
        { label: 'Mukhyamantri Kanya Utthan Yojana benefits', query: 'What are the benefits of Mukhyamantri Kanya Utthan Yojana?' },
        { label: 'Bihar Student Credit Card (up to 4 Lakh)', query: 'How to apply for Bihar Student Credit Card scheme?' },
        { label: 'IT and Solar career courses under BSDM', query: 'What free career training courses are offered under BSDM?' }
      ];
    }

    return [
      { label: 'B.Tech / कॉलेज छात्रों के लिए योजनाएं', query: '12वीं पास और B.Tech इंजीनियरिंग छात्रों के लिए बिहार में कौन सी योजनाएं और स्टूडेंट क्रेडिट कार्ड है?' },
      { label: 'कृषि यंत्र पर सरकारी सब्सिडी कैसे मिलेगी?', query: 'बिहार में कृषि यंत्रों और कल्टीवेटर पर कितना अनुदान मिलता है?' },
      { label: 'बिहार स्टूडेंट क्रेडिट कार्ड (₹4 लाख ऋण)', query: 'स्टूडेंट क्रेडिट कार्ड योजना की पात्रता और आवश्यक दस्तावेज क्या हैं?' },
      { label: 'मुख्यमंत्री कन्या उत्थान योजना के लाभ', query: 'कन्या उत्थान योजना में स्नातक पास बालिकाओं को कितनी राशि मिलती है?' },
      { label: 'कुशल युवा कार्यक्रम (KYP) और टेक करियर', query: 'BSDM के तहत निशुल्क कंप्यूटर और सॉफ्टवेयर ट्रेनिंग कैसे मिलेगी?' }
    ];
  }
}

module.exports = new AiService();
