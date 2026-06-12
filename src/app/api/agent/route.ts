import { NextResponse } from 'next/server'
import { institutions } from '@/lib/static-data'

const SYSTEM_PROMPT = `You are the UK Physics PhD Finder Agent, specialized in helping Nepali MSc Physics students from Tribhuvan University find and apply to Physics PhD programs in the United Kingdom. You have extensive knowledge of:

1. Top UK universities offering Physics PhD programs: Oxford, Cambridge, Imperial College London, UCL, Edinburgh, Manchester, Durham, Bristol, Warwick, Birmingham, Glasgow, Leeds, Sheffield, Nottingham, Southampton, King's College London, Liverpool, York, Cardiff, Newcastle
2. Other notable universities: St Andrews, Sussex, Lancaster, Queen Mary London, Royal Holloway, Exeter, Strathclyde
3. National Facilities: Rutherford Appleton Laboratory (RAL), Daresbury Laboratory, National Physical Laboratory (NPL), UK Astronomy Technology Centre
4. Russell Group universities (24 leading research-intensive universities)
5. EPSRC Studentship: Full tuition + £18,622/year stipend + training support grant
6. Commonwealth Scholarship (CSC): Full tuition + living allowance + travel from Nepal (MOST IMPORTANT for Nepali students!)
7. STFC Studentship: For astronomy/particle/nuclear physics, tuition + £18,622/year
8. UKRI research councils: EPSRC, STFC, MRC, BBSRC, NERC, AHRC, ESRC
9. University-specific scholarships: Oxford Clarendon, Cambridge Gates Trust, Imperial President's, etc.
10. International tuition fees: £22,000-34,000/year (but often covered by studentships)
11. PhD typically 3.5-4 years in the UK
12. October entry (main intake), some January entry available
13. Application deadlines: typically December-January for October entry
14. IELTS requirements: 6.5-7.0 (Oxford/Cambridge require 7.0-7.5)
15. British Embassy Kathmandu for visa processing (3-6 weeks)
16. ATAS certificate may be required for certain physics fields
17. TB test required for visa from Nepal
18. English is the working language for all UK PhD programs
19. Research fields: Quantum Computing, Particle Physics, Astrophysics, Condensed Matter, Nuclear Physics, Biophysics, Gravitational Physics, Photonics, Quantum Information, Materials Science, Theoretical Physics, Plasma Physics, Superconductivity, Nanotechnology, Medical Physics, Quantum Metrology, Accelerator Science

Key points for Nepali students:
- Commonwealth Scholarship covers: full tuition (international rate), living allowance, return airfare from Nepal
- Apply through British Embassy Kathmandu / Ministry of Education Nepal for CSC
- EPSRC Studentship: tuition + £18,622/year stipend — international students now eligible!
- Many Russell Group universities offer fee waivers for international students
- STFC studentships at national labs (RAL, Daresbury, NPL, UK ATC) offer enhanced stipends
- IELTS 6.5-7.0 required (varies by university)
- UK PhD is typically 3.5-4 years (shorter than many countries!)
- October is the main entry point (apply Dec-Jan)
- British Embassy Kathmandu handles student visa applications
- Students can bring spouse on dependant visa (spouse can work full-time!)
- Health surcharge required for visa (~£470/year, gives NHS access)
- Living costs: £1,000-1,500/month depending on location (London most expensive)
- ATAS certificate may be needed for certain physics fields (free, takes ~20 working days)
- TB test certificate required from approved clinic in Nepal

Help students by:
- Recommending universities/institutes based on their research interests
- Explaining EPSRC/CSC/STFC application processes
- Guiding through UK university applications
- Clarifying IELTS requirements by university
- Providing funding and stipend information in GBP (£)
- Suggesting required documents and application strategies
- Offering tips specific to Nepali applicants
- Explaining UK student visa process
- Comparing institutions and research programs
- Advising on contacting potential supervisors
- Explaining national facility studentship arrangements
- Helping with research proposal writing
- Guiding on ATAS and TB test requirements

Always be encouraging, detailed, and specific. When possible, mention actual professors and research groups. Be realistic about admission chances and funding. Emphasize that the UK has excellent funding for physics PhDs and Commonwealth Scholarship is specifically designed for Nepali students!`

// Build institution data context for the AI
function buildInstitutionContext(): string {
  const summary = institutions.slice(0, 35).map((u) =>
    `${u.name} (${u.city}, ${u.country}) | Type: ${u.type} | Fields: ${u.fields} | Deadline: ${u.deadline} | Funding: ${u.contractType} | £${u.monthlyGbp?.toLocaleString() || 'N/A'}/mo | IELTS: ${u.ieltsMinimum} | EPSRC: ${u.funding.epsrcFunded ? 'Yes' : 'No'} | CSC: ${u.funding.cscEligible ? 'Yes' : 'No'} | Russell Group: ${u.funding.russellGroup ? 'Yes' : 'No'} | UKRI: ${u.funding.ukriFunded ? 'Yes' : 'No'}`
  ).join('\n')
  return summary
}

// Call Google Gemini API
async function callGemini(apiKey: string, messages: Array<{ role: string; content: string }>) {
  const contents = messages.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }))

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
      }),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini API error: ${res.status} - ${err}`)
  }

  const data = await res.json()
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.'
}

// Call OpenAI-compatible API
async function callOpenAI(
  apiKey: string,
  messages: Array<{ role: string; content: string }>,
  baseUrl: string = 'https://api.openai.com/v1',
  model: string = 'gpt-4o-mini'
) {
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      temperature: 0.7,
      max_tokens: 2048,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenAI API error: ${res.status} - ${err}`)
  }

  const data = await res.json()
  return data?.choices?.[0]?.message?.content || 'No response from AI.'
}

// Call z-ai-web-dev-sdk (sandbox only)
async function callZAI(messages: Array<{ role: string; content: string }>) {
  const ZAI = (await import('z-ai-web-dev-sdk')).default
  const zai = await ZAI.create()
  const typedMessages = messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))
  const completion = await zai.chat.completions.create({
    messages: typedMessages,
    thinking: { type: 'disabled' },
  })
  return completion?.choices?.[0]?.message?.content || 'I could not generate a response.'
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message, history, watchlistedIds, apiKey, provider, model, baseUrl } = body

    if (!message) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 })
    }

    const messages: Array<{ role: string; content: string }> = [
      { role: 'assistant', content: SYSTEM_PROMPT },
    ]

    // Add institution data context
    const instContext = buildInstitutionContext()
    messages.push({
      role: 'assistant',
      content: `Here is a database of UK Physics PhD institutions for reference:\n${instContext}\n\nUse this data to provide accurate, specific answers. If asked about an institution not in this list, use your general knowledge.`,
    })

    // Add watchlist context
    if (watchlistedIds && Array.isArray(watchlistedIds) && watchlistedIds.length > 0) {
      const watchlisted = institutions.filter((inst) => watchlistedIds.includes(inst.id)).slice(0, 10)
      if (watchlisted.length > 0) {
        const watchlistContext = watchlisted
          .map((u) => `${u.name} (${u.city}, ${u.country}) - EPSRC: ${u.funding.epsrcFunded ? 'Yes' : 'No'} - Russell Group: ${u.funding.russellGroup ? 'Yes' : 'No'} - CSC: ${u.funding.cscEligible ? 'Yes' : 'No'} - Fields: ${u.fields} - Deadline: ${u.deadline} - Funding: ${u.contractType} - £${u.monthlyGbp?.toLocaleString() || 'N/A'}/mo`)
          .join('\n')
        messages.push({
          role: 'assistant',
          content: `The student has these institutions in their watchlist:\n${watchlistContext}`,
        })
      }
    }

    // Add conversation history
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({ role: msg.role, content: msg.content })
        }
      }
    }

    messages.push({ role: 'user', content: message })

    let assistantMessage: string

    if (apiKey && provider === 'gemini') {
      assistantMessage = await callGemini(apiKey, messages)
    } else if (apiKey && provider === 'openai') {
      assistantMessage = await callOpenAI(apiKey, messages, baseUrl || 'https://api.openai.com/v1', model || 'gpt-4o-mini')
    } else if (apiKey && provider === 'groq') {
      assistantMessage = await callOpenAI(apiKey, messages, 'https://api.groq.com/openai/v1', model || 'llama-3.3-70b-versatile')
    } else if (apiKey && provider === 'together') {
      assistantMessage = await callOpenAI(apiKey, messages, 'https://api.together.xyz/v1', model || 'meta-llama/Llama-3-70b-chat-hf')
    } else if (apiKey && provider === 'custom') {
      assistantMessage = await callOpenAI(apiKey, messages, baseUrl || 'https://api.openai.com/v1', model || 'gpt-4o-mini')
    } else {
      try {
        assistantMessage = await callZAI(messages)
      } catch {
        return NextResponse.json(
          {
            error: 'AI_API_KEY_REQUIRED',
            message: 'Please configure an AI API key to use the chat. Go to Settings in the AI Agent tab and add your API key.',
          },
          { status: 400 }
        )
      }
    }

    return NextResponse.json({ response: assistantMessage })
  } catch (error) {
    console.error('Error in agent chat:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to process agent request'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
