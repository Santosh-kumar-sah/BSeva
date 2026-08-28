const { prisma } = require('../../database/db');

/**
 * AI Grounded Knowledge Service & RAG Engine
 * Formulates factually grounded responses strictly attributed to verified Bihar schemes & careers.
 */
class AiService {
  /**
   * Classify user query intent
   * @param {string} query 
   * @returns {'SCHEME_INQUIRY' | 'ELIGIBILITY_CHECK' | 'DOCUMENT_REQUIREMENT' | 'CAREER_GUIDANCE' | 'GENERAL_HELP'}
   */
  classifyIntent(query) {
    const q = query.toLowerCase();

    if (q.includes('करियर') || q.includes('नौकरी') || q.includes('जॉब') || q.includes('skill') || q.includes('career') || q.includes('salary') || q.includes('वेतन') || q.includes('kyp') || q.includes('ट्रेनिंग')) {
      return 'CAREER_GUIDANCE';
    }

    if (q.includes('पात्र') || q.includes('योग्यता') || q.includes('eligible') || q.includes('eligibility') || q.includes('उम्र') || q.includes('age') || q.includes('शर्त')) {
      return 'ELIGIBILITY_CHECK';
    }

    if (q.includes('दस्तावेज') || q.includes('कागजात') || q.includes('document') || q.includes('certificate') || q.includes('प्रमाण पत्र')) {
      return 'DOCUMENT_REQUIREMENT';
    }

    if (q.includes('योजना') || q.includes('scheme') || q.includes('छात्रवृत्ति') || q.includes('अनुदान') || q.includes('सब्सिडी') || q.includes('subsidy') || q.includes('पैसा') || q.includes('राशि')) {
      return 'SCHEME_INQUIRY';
    }

    return 'GENERAL_HELP';
  }

  /**
   * Retrieve relevant schemes and careers from PostgreSQL
   * @param {string} query 
   * @param {string} intent 
   */
  async retrieveContext(query, intent) {
    const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    
    // Fetch all active schemes with department, category, rules
    const allSchemes = await prisma.scheme.findMany({
      where: { status: 'ACTIVE' },
      include: {
        department: true,
        category: true,
        rules: true
      }
    });

    const allCareers = await prisma.careerPath.findMany();

    // Score schemes by relevance
    const scoredSchemes = allSchemes.map(scheme => {
      let score = 0;
      const haystack = [
        scheme.title_en,
        scheme.title_hi,
        scheme.description_en,
        scheme.description_hi,
        scheme.benefits_en,
        scheme.benefits_hi,
        scheme.category?.name_en,
        scheme.category?.name_hi,
        scheme.department?.name_en,
        scheme.department?.name_hi
      ].filter(Boolean).join(' ').toLowerCase();

      for (const term of terms) {
        if (haystack.includes(term)) score += 3;
      }

      // Keyword triggers
      if ((query.includes('लड़की') || query.includes('महिला') || query.includes('कन्या') || query.includes('girl') || query.includes('women')) && 
          (scheme.slug.includes('kanya') || scheme.categoryId === 'women-empowerment')) {
        score += 8;
      }
      if ((query.includes('किसान') || query.includes('खेती') || query.includes('कृषि') || query.includes('farmer') || query.includes('krishi')) && 
          (scheme.departmentId === 'AGRI_BIHAR' || scheme.categoryId === 'agriculture')) {
        score += 8;
      }
      if ((query.includes('छात्र') || query.includes('स्टूडेंट') || query.includes('पढ़ाई') || query.includes('क्रेडिट') || query.includes('student')) && 
          (scheme.slug.includes('credit') || scheme.slug.includes('scholarship') || scheme.categoryId === 'education')) {
        score += 8;
      }
      if ((query.includes('उद्यमी') || query.includes('व्यापार') || query.includes('startup') || query.includes('business')) && 
          (scheme.slug.includes('udyami') || scheme.categoryId === 'msme-startup')) {
        score += 8;
      }

      return { scheme, score };
    }).sort((a, b) => b.score - a.score);

    // Score careers
    const scoredCareers = allCareers.map(career => {
      let score = 0;
      const haystack = [
        career.title_en,
        career.title_hi,
        career.industry,
        career.description_en,
        career.description_hi,
        ...(career.required_skills || []),
        ...(career.bsdm_training_path || [])
      ].filter(Boolean).join(' ').toLowerCase();

      for (const term of terms) {
        if (haystack.includes(term)) score += 3;
      }

      return { career, score };
    }).sort((a, b) => b.score - a.score);

    return {
      topSchemes: scoredSchemes.filter(s => s.score > 0).slice(0, 3).map(s => s.scheme),
      fallbackSchemes: allSchemes.slice(0, 3),
      topCareers: scoredCareers.filter(c => c.score > 0).slice(0, 2).map(c => c.career)
    };
  }

  /**
   * Formulate Grounded Answer with Strict Attributions
   */
  async processQuery({ query, language = 'hi', userProfile = null }) {
    const intent = this.classifyIntent(query);
    const { topSchemes, fallbackSchemes, topCareers } = await this.retrieveContext(query, intent);

    const relevantSchemes = topSchemes.length > 0 ? topSchemes : fallbackSchemes;
    const isHindi = language === 'hi';

    let answerText = '';
    const citations = [];
    const actionChips = [];

    if (intent === 'CAREER_GUIDANCE' && topCareers.length > 0) {
      const topC = topCareers[0];
      const title = isHindi ? topC.title_hi : topC.title_en;
      const desc = isHindi ? topC.description_hi : topC.description_en;
      const salaryLakhs = (topC.avg_starting_salary_inr / 100000).toFixed(1);

      if (isHindi) {
        answerText = `**${title}** के संबंध में जानकारी:\n\n` +
          `• **उद्योग क्षेत्र:** ${topC.industry}\n` +
          `• **न्यूनतम शिक्षा:** ${topC.min_education}\n` +
          `• **अनुमानित प्रारंभिक वेतन:** ₹${salaryLakhs} लाख / वर्ष (${topC.growth_prospects} ग्रोथ)\n` +
          `• **विवरण:** ${desc}\n\n` +
          `• **सरकारी ट्रेनिंग प्रोग्राम (BSDM):** ${(topC.bsdm_training_path || []).join(', ')}`;
      } else {
        answerText = `Information for **${title}**:\n\n` +
          `• **Industry:** ${topC.industry}\n` +
          `• **Min Education:** ${topC.min_education}\n` +
          `• **Avg Starting Salary:** ₹${salaryLakhs} Lakhs/year (${topC.growth_prospects} Growth)\n` +
          `• **Overview:** ${desc}\n\n` +
          `• **Govt Training (BSDM):** ${(topC.bsdm_training_path || []).join(', ')}`;
      }

      citations.push({
        title: title,
        type: 'CAREER',
        sourceDepartment: 'Bihar Skill Development Mission (BSDM)',
        officialUrl: 'https://skillmissionbihar.org',
        slug: `/careers/${topC.slug}`
      });

      actionChips.push({
        label: isHindi ? 'करियर पाथवे देखें' : 'View Career Path',
        link: `/careers/${topC.slug}`
      });
      actionChips.push({
        label: isHindi ? 'सभी करियर खोजें' : 'Explore All Careers',
        link: '/careers'
      });

    } else if (relevantSchemes.length > 0) {
      const primary = relevantSchemes[0];
      const title = isHindi ? primary.title_hi : primary.title_en;
      const benefits = isHindi ? primary.benefits_hi : primary.benefits_en;
      const desc = isHindi ? primary.description_hi : primary.description_en;
      const deptName = isHindi ? (primary.department?.name_hi || primary.department?.name_en) : primary.department?.name_en;
      const docs = primary.required_documents || [];

      if (intent === 'DOCUMENT_REQUIREMENT') {
        if (isHindi) {
          answerText = `**${title}** के लिए आवश्यक दस्तावेजों की सूची:\n\n` +
            docs.map((d, i) => `${i + 1}. **${d}**`).join('\n') +
            `\n\nआवेदन करने से पहले कृपया सुनिश्चित करें कि आपके पास वैध मोबाइल नंबर और बैंक खाता है।`;
        } else {
          answerText = `Required documents checklist for **${title}**:\n\n` +
            docs.map((d, i) => `${i + 1}. **${d}**`).join('\n') +
            `\n\nPlease ensure your bank account and mobile number are linked before applying.`;
        }
      } else if (intent === 'ELIGIBILITY_CHECK') {
        const rulesList = (primary.rules || []).map(r => `• ${isHindi ? (r.message_hi || r.field) : (r.message_en || r.field)}`).join('\n');
        if (isHindi) {
          answerText = `**${title}** के मुख्य पात्रता मानदंड:\n\n` +
            (rulesList || '• बिहार का स्थायी निवासी होना अनिवार्य है।') +
            `\n\n• **लाभ:** ${benefits}\n\n` +
            `आप हमारी पात्रता जांच प्रणाली से अपनी 100% सटीक योग्यता का तुरंत विश्लेषण कर सकते हैं।`;
        } else {
          answerText = `Key eligibility criteria for **${title}**:\n\n` +
            (rulesList || '• Must be a permanent resident of Bihar.') +
            `\n\n• **Key Benefit:** ${benefits}\n\n` +
            `You can run an exact check using our Eligibility Calculator.`;
        }
        actionChips.push({
          label: isHindi ? 'मेरी पात्रता जांचें' : 'Check My Eligibility',
          link: '/eligibility'
        });
      } else {
        // General scheme inquiry
        if (isHindi) {
          answerText = `आपके प्रश्न के अनुसार सबसे उपयुक्त योजना **${title}** है:\n\n` +
            `• **विभाग:** ${deptName}\n` +
            `• **मुख्य लाभ:** ${benefits}\n` +
            `• **विवरण:** ${desc}\n` +
            `• **आवेदन का प्रकार:** ${primary.application_mode}`;
        } else {
          answerText = `Based on your inquiry, the most relevant scheme is **${title}**:\n\n` +
            `• **Department:** ${deptName}\n` +
            `• **Key Benefits:** ${benefits}\n` +
            `• **Description:** ${desc}\n` +
            `• **Application Mode:** ${primary.application_mode}`;
        }
      }

      // Populate citations for all relevant matched schemes
      relevantSchemes.forEach(s => {
        citations.push({
          title: isHindi ? s.title_hi : s.title_en,
          type: 'SCHEME',
          sourceDepartment: isHindi ? (s.department?.name_hi || s.department?.name_en) : s.department?.name_en,
          officialUrl: s.official_portal_url,
          lastVerifiedDate: s.last_verified_date,
          slug: `/schemes/${s.slug}`
        });
      });

      actionChips.push({
        label: isHindi ? 'योजना का पूर्ण विवरण' : 'Scheme Details',
        link: `/schemes/${primary.slug}`
      });
      actionChips.push({
        label: isHindi ? 'आवश्यक दस्तावेज चेकलिस्ट' : 'Document Checklist',
        link: `/schemes/${primary.slug}`
      });
    } else {
      if (isHindi) {
        answerText = `नमस्ते! मैं बिहार सहायक AI हूँ। मैं आपको बिहार सरकार की 25+ छात्रवृत्ति, कृषि, महिला सशक्तिकरण एवं रोजगार योजनाओं तथा BSDM करियर पाथवे की आधिकारिक जानकारी दे सकता हूँ। कृपया अपना प्रश्न पूछें।`;
      } else {
        answerText = `Hello! I am Bihar Sahayak AI. I can assist you with verified information on Bihar government scholarships, agriculture subsidies, women empowerment schemes, and BSDM career training. How may I assist you?`;
      }
      actionChips.push({ label: isHindi ? 'सभी योजनाएं देखें' : 'View All Schemes', link: '/schemes' });
      actionChips.push({ label: isHindi ? 'पात्रता जांचें' : 'Check Eligibility', link: '/eligibility' });
    }

    return {
      success: true,
      query,
      intent,
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
   * Get Contextual Starter Suggestions
   */
  getSuggestions(language = 'hi') {
    if (language === 'en') {
      return [
        { label: 'Scholarships for 10th & 12th pass students', query: 'What scholarships are available for 10th and 12th pass students in Bihar?' },
        { label: 'Subsidies for Agricultural Equipment', query: 'How to get subsidy on agricultural equipment in Bihar?' },
        { label: 'Mukhyamantri Kanya Utthan Yojana benefits', query: 'What are the benefits of Mukhyamantri Kanya Utthan Yojana?' },
        { label: 'Bihar Student Credit Card (up to 4 Lakh)', query: 'How to apply for Bihar Student Credit Card scheme?' },
        { label: 'IT and Solar career courses under BSDM', query: 'What free career training courses are offered under BSDM?' }
      ];
    }

    return [
      { label: 'मैट्रिक व इंटर पास छात्राओं के लिए योजनाएं', query: 'बिहार में 10वीं और 12वीं पास छात्राओं के लिए कौन-कौन सी योजनाएं हैं?' },
      { label: 'कृषि यंत्र पर सरकारी सब्सिडी कैसे मिलेगी?', query: 'बिहार में कृषि यंत्रों और कल्टीवेटर पर कितना अनुदान मिलता है?' },
      { label: 'बिहार स्टूडेंट क्रेडिट कार्ड (₹4 लाख ऋण)', query: 'स्टूडेंट क्रेडिट कार्ड योजना की पात्रता और आवश्यक दस्तावेज क्या हैं?' },
      { label: 'मुख्यमंत्री कन्या उत्थान योजना के लाभ', query: 'कन्या उत्थान योजना में स्नातक पास बालिकाओं को कितनी राशि मिलती है?' },
      { label: 'कुशल युवा कार्यक्रम (KYP) और सोलर करियर', query: 'BSDM के तहत निशुल्क कंप्यूटर और सोलर ट्रेनिंग कैसे मिलेगी?' }
    ];
  }
}

module.exports = new AiService();
