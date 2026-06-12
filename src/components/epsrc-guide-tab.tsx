'use client'

import { useState, useMemo } from 'react'
import { BookOpen, CheckCircle2, Globe, Phone, MapPin, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Progress } from '@/components/ui/progress'
import { scholarships as allScholarships, searchScholarships } from '@/lib/static-data'

export default function EPSRCGuideTab() {
  const [searchQuery, setSearchQuery] = useState('')
  const [checkedDocs, setCheckedDocs] = useState<string[]>([])

  const scholarships = useMemo(() => {
    return searchQuery ? searchScholarships(searchQuery) : allScholarships
  }, [searchQuery])

  const requiredDocuments = [
    { id: 'passport', label: 'Valid Passport' },
    { id: 'degree', label: 'MSc Degree Certificate & Transcripts (notarized)' },
    { id: 'cv', label: 'CV/Resume (UK format)' },
    { id: 'research-proposal', label: 'Research Proposal (detailed, 3-5 pages)' },
    { id: 'references', label: '2-3 Reference Letters (academic)' },
    { id: 'language', label: 'IELTS Score (6.5-7.0)' },
    { id: 'cover-letter', label: 'Cover Letter / Personal Statement' },
    { id: 'funding-letter', label: 'Funding/Scholarship Letter (if applicable)' },
    { id: 'photos', label: 'Passport Photos' },
    { id: 'health', label: 'TB Test Certificate (required for Nepal)' },
    { id: 'police', label: 'Police Clearance Certificate' },
    { id: 'at-test', label: 'ATAS Certificate (if required for your field)' },
  ]

  const toggleDoc = (id: string) => {
    setCheckedDocs((prev) => prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id])
  }

  const scholarshipCategories = scholarships.reduce<Record<string, typeof scholarships>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <Card className="border-0 bg-gradient-to-r from-rose-600 via-emerald-600 to-rose-700 text-white overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-1">🎓 EPSRC & CSC Scholarship Guide</h2>
          <p className="text-rose-100 text-sm max-w-xl">
            Complete guide to UK scholarships for Nepali Physics students.
            The EPSRC Studentship is the primary funding route — tuition fees + £18,622/year stipend + training support grant.
            The Commonwealth Scholarship (CSC) covers EVERYTHING for Nepali students — tuition, living, and travel from Nepal!
          </p>
        </CardContent>
      </Card>

      {/* EPSRC Studentship Section */}
      <Card className="border-rose-200 dark:border-rose-800/50">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center shrink-0">
              <BookOpen className="size-6 text-rose-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">EPSRC Studentship 🌟</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                The MOST COMMON funding route for Physics PhDs in the UK. The Engineering and Physical Sciences Research Council (EPSRC)
                funds doctoral studentships at universities across the UK. Covers full tuition fees + generous stipend.
              </p>
              <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                <p>• <strong>Stipend:</strong> £18,622/year (£1,552/month, tax-free)</p>
                <p>• <strong>Tuition:</strong> Full tuition fees covered (home rate; international students may need fee top-up)</p>
                <p>• <strong>Duration:</strong> 3.5-4 years</p>
                <p>• <strong>Training Support Grant:</strong> Additional research expenses covered</p>
                <p>• <strong>IELTS:</strong> Typically 6.5-7.0 required</p>
                <p>• <strong>Apply through:</strong> University departments (not a central portal)</p>
                <p>• <strong>Deadline:</strong> Varies by university, typically December-January for October entry</p>
              </div>
              <a href="https://epsrc.ukri.org/" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm text-rose-600 hover:underline">
                EPSRC Official Website →
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Commonwealth Scholarship (CSC) Section */}
      <Card className="border-emerald-200 dark:border-emerald-800/50">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
              <BookOpen className="size-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Commonwealth Scholarship (CSC) 🌟</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                The BEST scholarship for Nepali students! The Commonwealth Scholarship Commission provides full funding
                for students from Commonwealth countries including Nepal. Covers absolutely everything.
              </p>
              <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                <p>• <strong>Tuition:</strong> Full tuition fees covered (international rate)</p>
                <p>• <strong>Living Allowance:</strong> £1,236/month (London) or £1,116/month (elsewhere)</p>
                <p>• <strong>Travel:</strong> Return airfare from Nepal to UK</p>
                <p>• <strong>Arrival Allowance:</strong> One-time payment for settling in</p>
                <p>• <strong>Study Travel Grant:</strong> For conferences and fieldwork</p>
                <p>• <strong>Warm Clothing Allowance:</strong> One-time payment</p>
                <p>• <strong>Apply through:</strong> British Embassy Kathmandu / Ministry of Education Nepal</p>
                <p>• <strong>Deadline:</strong> Typically November-December each year</p>
              </div>
              <a href="https://cscuk.fcdo.gov.uk/" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm text-emerald-600 hover:underline">
                Commonwealth Scholarship Commission →
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* STFC Studentship Section */}
      <Card className="border-purple-200 dark:border-purple-800/50">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
              <BookOpen className="size-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">STFC Studentship</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                The Science and Technology Facilities Council (STFC) specifically funds PhD students in astronomy, particle physics,
                nuclear physics, and accelerator science. Students may be based at universities or at STFC national labs.
              </p>
              <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                <p>• <strong>Stipend:</strong> £18,622/year (minimum), enhanced at national labs</p>
                <p>• <strong>Tuition:</strong> Full tuition fees covered</p>
                <p>• <strong>Duration:</strong> 3.5-4 years</p>
                <p>• <strong>Fields:</strong> Astronomy, Particle Physics, Nuclear Physics, Accelerator Science</p>
                <p>• <strong>Apply through:</strong> University physics departments or STFC facilities</p>
                <p>• <strong>National Labs:</strong> RAL, Daresbury, UK ATC</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* British Embassy / British Council Nepal */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardContent className="p-4 md:p-6">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">🇬🇧 British Embassy & British Council Nepal</h3>
          <div className="grid sm:grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-start gap-2">
              <MapPin className="size-4 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">British Embassy Kathmandu</p>
                <p>Lainchaur, Kathmandu, Nepal</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="size-4 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Phone</p>
                <p>+977-1-4410583 (British Embassy)</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Globe className="size-4 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">British Council Nepal</p>
                <a href="https://www.britishcouncil.org.np/" target="_blank" rel="noopener noreferrer" className="text-rose-600 hover:underline">
                  britishcouncil.org.np
                </a>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="size-4 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Visa Processing</p>
                <p>UK Visas & Immigration (3-6 weeks)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Timeline */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
            📅 Application Timeline for October Entry
          </h3>
          <div className="space-y-3">
            {[
              { step: 1, month: 'Mar-May 2025', desc: 'Research programs, identify supervisors, start IELTS preparation', color: 'bg-rose-500' },
              { step: 2, month: 'Jun-Aug 2025', desc: 'Contact potential supervisors, prepare research proposal', color: 'bg-rose-600' },
              { step: 3, month: 'Sep-Nov 2025', desc: 'Apply for Commonwealth Scholarship via British Embassy/Ministry of Education', color: 'bg-emerald-600' },
              { step: 4, month: 'Nov-Jan 2026', desc: 'Apply for EPSRC/STFC studentships through university departments', color: 'bg-rose-700' },
              { step: 5, month: 'Feb-Apr 2026', desc: 'Interviews, receive offers, confirm funding', color: 'bg-emerald-700' },
              { step: 6, month: 'May-Jul 2026', desc: 'Apply for UK student visa, ATAS certificate if needed, arrange accommodation', color: 'bg-rose-800' },
              { step: 7, month: 'Sep-Oct 2026', desc: 'Arrive in UK, enroll, start your PhD! Welcome! 🇬🇧', color: 'bg-emerald-600' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div className={`size-8 rounded-full ${item.color} text-white flex items-center justify-center text-xs font-bold shrink-0`}>
                  {item.step}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-900 dark:text-white">{item.month}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* IELTS Requirement */}
      <Card className="border-amber-200 dark:border-amber-800/50">
        <CardContent className="p-4 md:p-6">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            📝 IELTS Requirement
          </h3>
          <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
            <p>UK universities require proof of English proficiency. Here are the typical requirements:</p>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="p-2 rounded bg-rose-50 dark:bg-rose-950/20">
                <p className="font-medium text-rose-700 dark:text-rose-300">IELTS 6.5-7.0</p>
                <p>Standard requirement (Oxford/Cambridge require 7.0-7.5)</p>
              </div>
              <div className="p-2 rounded bg-amber-50 dark:bg-amber-950/20">
                <p className="font-medium text-amber-700 dark:text-amber-300">TOEFL iBT 90+</p>
                <p>Some accept TOEFL iBT 90+ or Pearson PTE Academic</p>
              </div>
            </div>
            <p className="mt-2"><strong>Tip:</strong> Take IELTS early! IDP Nepal and British Council Nepal offer tests in Kathmandu regularly. Score is valid for 2 years. Most Russell Group universities require 6.5 minimum, but Oxford and Cambridge often require 7.0-7.5. Some universities also accept TOEFL iBT 90+ or Pearson PTE.</p>
          </div>
        </CardContent>
      </Card>

      {/* Document Checklist */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
            📋 Required Documents Checklist
          </h3>
          <div className="mb-3">
            <Progress value={(checkedDocs.length / requiredDocuments.length) * 100} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">{checkedDocs.length}/{requiredDocuments.length} completed</p>
          </div>
          <div className="space-y-2">
            {requiredDocuments.map((doc) => (
              <button
                key={doc.id}
                onClick={() => toggleDoc(doc.id)}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
              >
                <CheckCircle2
                  className={`size-5 shrink-0 ${
                    checkedDocs.includes(doc.id) ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
                <span className={`text-sm ${
                  checkedDocs.includes(doc.id)
                    ? 'text-gray-400 line-through'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {doc.label}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scholarship Cards */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">💰 Scholarships & Funding</h3>
          <div className="mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scholarships..."
              className="w-full h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          {Object.entries(scholarshipCategories).map(([category, items]) => (
            <div key={category} className="mb-4">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{items.length}</Badge>
                {category}
              </h4>
              <div className="grid gap-2 sm:grid-cols-2">
                {items.slice(0, 4).map((s) => (
                  <div key={s.id} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-rose-300 dark:hover:border-rose-700 transition-colors">
                    <p className="text-xs font-medium text-gray-900 dark:text-white">{s.title}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{s.content.slice(0, 100)}...</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Doctoral Stipend Explanation */}
      <Card className="border-emerald-200 dark:border-emerald-800/50">
        <CardContent className="p-4 md:p-6">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">💷 Doctoral Stipend Explained</h3>
          <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
            <p>Most UK PhD positions in physics are funded through EPSRC/STFC studentships or university scholarships. You receive a <strong>stipend</strong> for living costs, and tuition fees are covered. International students may need to pay the fee difference between home and international rates, but many universities now offer fee waivers.</p>
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="p-2 rounded bg-rose-50 dark:bg-rose-950/20">
                <p className="font-medium text-rose-700 dark:text-rose-300">EPSRC Studentship</p>
                <p>£18,622/year</p>
              </div>
              <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-950/20">
                <p className="font-medium text-emerald-700 dark:text-emerald-300">STFC/National Lab</p>
                <p>£18,622-20,000/year</p>
              </div>
              <div className="p-2 rounded bg-amber-50 dark:bg-amber-950/20">
                <p className="font-medium text-amber-700 dark:text-amber-300">Commonwealth (CSC)</p>
                <p>£13,392-14,832/year + tuition</p>
              </div>
            </div>
            <p className="mt-2">Benefits include: tax-free stipend, tuition fees covered, training support grant, conference travel allowance (especially at national labs), access to world-class facilities, and potential for enhanced stipend at London universities. UK living costs: £1,000-1,500/month depending on location (London most expensive).</p>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">❓ FAQ</h3>
          <Accordion type="single" collapsible>
            {[
              { q: 'How do I apply for EPSRC studentship from Nepal?', a: 'You apply through individual university departments, not through a central EPSRC portal. Find a PhD project and supervisor on the university website, then apply directly. The university will nominate you for EPSRC funding. You need IELTS 6.5+, a strong academic record, a compelling research proposal, and references. Contact potential supervisors before applying.' },
              { q: 'How do I apply for Commonwealth Scholarship?', a: 'Apply through the British Embassy in Kathmandu or through the Ministry of Education Nepal. The application typically opens in September-November each year. You need to secure a university offer first. The CSC website (cscuk.fcdo.gov.uk) has detailed guidance. Nepali students are eligible as Nepal is a Commonwealth country.' },
              { q: 'What IELTS score do I need for UK PhD?', a: 'Most UK universities require IELTS 6.5 overall with no band below 6.0. Oxford and Cambridge require 7.0-7.5. Take IELTS through IDP Nepal or British Council Nepal in Kathmandu. Score is valid for 2 years. Some universities also accept TOEFL iBT 90+ or Pearson PTE Academic.' },
              { q: 'Can international students get full funding in the UK?', a: 'Yes! EPSRC now allows international students to receive full studentships (tuition + stipend). Many Russell Group universities offer fee waivers that cover the difference between home and international fees. Commonwealth Scholarships cover full international fees. STFC studentships at national labs also cover international fees. Check individual university websites for their fee waiver policies.' },
              { q: 'How long does UK student visa processing take from Nepal?', a: 'Typically 3-6 weeks after submitting your application at the visa application centre in Kathmandu. You need a CAS (Confirmation of Acceptance for Studies) from your university and proof of funding. You also need a TB test certificate from an approved clinic in Nepal. Apply early as processing times can vary.' },
              { q: 'What is the Russell Group?', a: 'The Russell Group is a collection of 24 leading UK universities known for research excellence. Think of them as the UK equivalent of the US Ivy League. For physics, notable Russell Group universities include Oxford, Cambridge, Imperial, UCL, Edinburgh, Manchester, Durham, and Bristol. They tend to have more EPSRC/STFC funding available and better research facilities.' },
              { q: 'What is ATAS and do I need it?', a: 'ATAS (Academic Technology Approval Scheme) is a security clearance required for some postgraduate courses in science and engineering. Most physics PhD programmes require ATAS clearance if they involve certain restricted technologies. Apply online through the UK government website after receiving your offer. It takes about 20 working days and is free. Your university will tell you if you need it.' },
              { q: 'Can I bring my spouse to the UK?', a: 'Yes! On a dependant visa, your spouse can join you in the UK. If you have a UKRI/EPSRC studentship, your spouse is allowed to work full-time in the UK. You need to show additional maintenance funds (£680/month for London, £545/month elsewhere). The UK is generally family-friendly for international researchers.' },
              { q: 'What are National Facilities like RAL?', a: 'The Rutherford Appleton Laboratory (RAL) is the UK\'s largest national lab, home to ISIS Neutron Source, Central Laser Facility, and Diamond Light Source. PhD students at RAL receive STFC studentships (tuition + £18,622-20,000/year) and register at partner universities like Oxford or Reading. Daresbury Laboratory and the National Physical Laboratory offer similar arrangements. These positions provide access to world-class equipment and facilities.' },
            ].map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-sm text-left">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-xs text-gray-600 dark:text-gray-400">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
