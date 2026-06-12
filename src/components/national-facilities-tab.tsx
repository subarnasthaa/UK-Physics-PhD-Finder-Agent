'use client'

import { useState, useEffect } from 'react'
import { Search, Atom, FlaskConical, Loader2, ChevronDown, ChevronUp, Globe, Banknote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Institution {
  id: string
  name: string
  city: string
  country: string
  type: string
  department: string
  researchGroup: string | null
  url: string
  fields: string
  phdType: string
  deadline: string
  contractType: string
  monthlyGbp: number | null
  languageInstruction: string
  englishLabLife: boolean
  notableProfessors: string
  notesForNepali: string
}

interface NationalFacilitiesTabProps {
  onNavigate: (tab: string) => void
  watchlistedIdsParam: string
}

export default function NationalFacilitiesTab({ onNavigate }: NationalFacilitiesTabProps) {
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/universities')
      .then((r) => r.json())
      .then((data: Institution[]) => {
        const filtered = data.filter(
          (inst) => inst.type === 'National Facility' || inst.type === 'Research Institute'
        )
        setInstitutions(filtered)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const nationalFacilities = institutions.filter((inst) => inst.type === 'National Facility')
  const researchInstitutions = institutions.filter((inst) => inst.type === 'Research Institute')

  const filterBySearch = (list: Institution[]) => {
    if (!search) return list
    const q = search.toLowerCase()
    return list.filter(
      (inst) =>
        inst.name.toLowerCase().includes(q) ||
        inst.city.toLowerCase().includes(q) ||
        inst.fields.toLowerCase().includes(q) ||
        inst.country.toLowerCase().includes(q)
    )
  }

  const filteredFacilities = filterBySearch(nationalFacilities)
  const filteredResearch = filterBySearch(researchInstitutions)

  const typeColors: Record<string, string> = {
    'National Facility': 'from-emerald-600 to-emerald-700',
    'Research Institute': 'from-purple-600 to-purple-700',
  }
  const typeBadgeColors: Record<string, string> = {
    'National Facility': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Research Institute': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  }
  const typeLabels: Record<string, string> = {
    'National Facility': 'National Facility',
    'Research Institute': 'Research Institute',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 text-rose-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <Card className="border-0 bg-gradient-to-r from-rose-600 to-rose-700 text-white overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-1">🔬 National Facilities & Research Institutes</h2>
          <p className="text-rose-100 text-sm max-w-xl">
            UK&apos;s world-renowned national facilities and research institutes offer excellent PhD opportunities
            with STFC/UKRI funding (£1,552–1,667/month stipend)! Students are registered at partner universities while conducting
            cutting-edge research at these premier facilities!
          </p>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search facilities, cities, fields..."
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* National Facilities Section */}
      {filteredFacilities.length > 0 && (
        <div>
          <div className="rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 mb-3">
            <div className="flex items-center gap-3">
              <FlaskConical className="size-6" />
              <div>
                <h3 className="text-lg font-bold">National Facilities</h3>
                <p className="text-sm opacity-80">{filteredFacilities.length} facilities found</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {filteredFacilities.map((inst) => {
              const isExpanded = expandedId === inst.id
              const fieldsList = inst.fields.split('|').map((f) => f.trim()).filter(Boolean)

              return (
                <Card key={inst.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${typeBadgeColors[inst.type] || ''}`}>
                        {typeLabels[inst.type] || inst.type}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{inst.name}</h4>
                        <p className="text-xs text-gray-500">{inst.city}, {inst.country}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {fieldsList.slice(0, 4).map((f) => (
                        <span key={f} className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400">
                          {f}
                        </span>
                      ))}
                      {fieldsList.length > 4 && <span className="text-xs text-gray-400">+{fieldsList.length - 4}</span>}
                    </div>

                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Banknote className="size-3" />
                        {inst.monthlyGbp ? `£${inst.monthlyGbp.toLocaleString()}/mo` : 'Varies'}
                      </span>
                      <span>{inst.languageInstruction}</span>
                      {inst.englishLabLife && (
                        <Badge variant="secondary" className="text-xs bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
                          English OK
                        </Badge>
                      )}
                    </div>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : inst.id)}
                      className="w-full mt-2 flex items-center justify-center gap-1 text-xs text-emerald-600 hover:text-emerald-700"
                    >
                      {isExpanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                      {isExpanded ? 'Less' : 'Details'}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 space-y-1.5 text-xs">
                        {inst.url && (
                          <a href={inst.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-emerald-600 hover:underline">
                            <Globe className="size-3" /> {inst.url}
                          </a>
                        )}
                        {inst.department && <p><span className="text-gray-500">Division:</span> {inst.department}</p>}
                        {inst.contractType && <p><span className="text-gray-500">Funding:</span> {inst.contractType}</p>}
                        {inst.phdType && <p><span className="text-gray-500">PhD Type:</span> {inst.phdType}</p>}
                        {inst.deadline && <p><span className="text-gray-500">Deadline:</span> {inst.deadline}</p>}
                        {inst.notableProfessors && <p><span className="text-gray-500">Notable:</span> {inst.notableProfessors}</p>}
                        {inst.notesForNepali && (
                          <p className="p-1.5 rounded bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300">
                            🇳🇵 {inst.notesForNepali}
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Research Institute Section */}
      {filteredResearch.length > 0 && (
        <div>
          <div className="rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 mb-3">
            <div className="flex items-center gap-3">
              <FlaskConical className="size-6" />
              <div>
                <h3 className="text-lg font-bold">Research Institutes</h3>
                <p className="text-sm opacity-80">{filteredResearch.length} institutes found</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {filteredResearch.map((inst) => {
              const isExpanded = expandedId === inst.id
              const fieldsList = inst.fields.split('|').map((f) => f.trim()).filter(Boolean)

              return (
                <Card key={inst.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${typeBadgeColors[inst.type] || ''}`}>
                        {typeLabels[inst.type] || inst.type}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{inst.name}</h4>
                        <p className="text-xs text-gray-500">{inst.city}, {inst.country}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {fieldsList.slice(0, 4).map((f) => (
                        <span key={f} className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400">
                          {f}
                        </span>
                      ))}
                      {fieldsList.length > 4 && <span className="text-xs text-gray-400">+{fieldsList.length - 4}</span>}
                    </div>

                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Banknote className="size-3" />
                        {inst.monthlyGbp ? `£${inst.monthlyGbp.toLocaleString()}/mo` : 'Varies'}
                      </span>
                      <span>{inst.languageInstruction}</span>
                      {inst.englishLabLife && (
                        <Badge variant="secondary" className="text-xs bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
                          English OK
                        </Badge>
                      )}
                    </div>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : inst.id)}
                      className="w-full mt-2 flex items-center justify-center gap-1 text-xs text-purple-600 hover:text-purple-700"
                    >
                      {isExpanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                      {isExpanded ? 'Less' : 'Details'}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 space-y-1.5 text-xs">
                        {inst.url && (
                          <a href={inst.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-purple-600 hover:underline">
                            <Globe className="size-3" /> {inst.url}
                          </a>
                        )}
                        {inst.department && <p><span className="text-gray-500">Division:</span> {inst.department}</p>}
                        {inst.contractType && <p><span className="text-gray-500">Funding:</span> {inst.contractType}</p>}
                        {inst.phdType && <p><span className="text-gray-500">PhD Type:</span> {inst.phdType}</p>}
                        {inst.deadline && <p><span className="text-gray-500">Deadline:</span> {inst.deadline}</p>}
                        {inst.notableProfessors && <p><span className="text-gray-500">Notable:</span> {inst.notableProfessors}</p>}
                        {inst.notesForNepali && (
                          <p className="p-1.5 rounded bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300">
                            🇳🇵 {inst.notesForNepali}
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {filteredFacilities.length === 0 && filteredResearch.length === 0 && (
        <div className="text-center py-12">
          <Atom className="size-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No research institutes match your search</p>
        </div>
      )}

      {/* National Facilities Info Card */}
      <Card className="border-rose-200 dark:border-rose-800/50">
        <CardContent className="p-4 md:p-6">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Atom className="size-4 text-rose-600" />
            About National Facilities & Research Institutes
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            The UK hosts world-leading national facilities funded by UKRI/STFC. The Rutherford Appleton Laboratory (RAL) in Didcot houses the ISIS Neutron and Muon Source, the Central Laser Facility, and the Diamond Light Source. Daresbury Laboratory in Warrington is home to the Hartree Centre and CLARA accelerator. The National Physical Laboratory (NPL) in Teddington houses the Quantum Metrology Institute and sets the UK&apos;s measurement standards. The UK Astronomy Technology Centre in Edinburgh designs instruments for the world&apos;s leading telescopes. PhD students at these facilities receive STFC/UKRI studentships (tuition + £18,622-20,000/year stipend) and are registered at partner universities such as Oxford, Cambridge, Manchester, Edinburgh, and others.
          </p>
          <button
            onClick={() => onNavigate('universities')}
            className="mt-3 text-xs text-rose-600 hover:text-rose-700 font-medium"
          >
            Browse all institutions →
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
