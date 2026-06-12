'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, MapPin, ExternalLink, Award, BookOpen, Calendar, DollarSign, Loader2, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface NationalLab {
  id: string
  name: string
  city: string
  state: string
  type: string
  department: string
  researchGroup: string | null
  url: string
  fields: string
  deadline: string
  fallDeadline: string
  springDeadline: string
  greRequired: string
  grePhysicsRequired: string
  fundingType: string
  annualStipend: number | null
  tuitionWaiver: boolean
  healthInsurance: boolean
  notableProfessors: string
  scholarshipTypes: string
  notesForNepali: string | null
  lastUpdated: string
}

interface NationalLabsTabProps {
  onNavigate: (tab: string) => void
  watchlistedIdsParam: string
}

export default function NationalLabsTab({ onNavigate, watchlistedIdsParam }: NationalLabsTabProps) {
  const [labs, setLabs] = useState<NationalLab[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [stateFilter, setStateFilter] = useState('all')
  const [states, setStates] = useState<string[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchLabs = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('type', 'National Lab')
      if (search) params.set('search', search)
      if (stateFilter !== 'all') params.set('state', stateFilter)
      if (watchlistedIdsParam) params.set('watchlistedIds', watchlistedIdsParam)

      const res = await fetch(`/api/universities?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setLabs(data)
      }
    } catch (err) {
      console.error('Error fetching national labs:', err)
    } finally {
      setLoading(false)
    }
  }, [search, stateFilter, watchlistedIdsParam])

  useEffect(() => {
    async function fetchStates() {
      try {
        const res = await fetch('/api/universities?type=National+Lab')
        if (res.ok) {
          const data: NationalLab[] = await res.json()
          const stateSet = new Set<string>()
          for (const lab of data) {
            stateSet.add(lab.state)
          }
          setStates(Array.from(stateSet).sort())
        }
      } catch (err) {
        console.error('Error fetching states:', err)
      }
    }
    fetchStates()
  }, [])

  useEffect(() => {
    fetchLabs()
  }, [fetchLabs])

  // Group labs by state
  const groupedByState = labs.reduce<Record<string, NationalLab[]>>((acc, lab) => {
    if (!acc[lab.state]) acc[lab.state] = []
    acc[lab.state].push(lab)
    return acc
  }, {})

  return (
    <div className="space-y-4 p-4 md:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 rounded-xl p-4 md:p-6 text-white">
        <h2 className="text-xl md:text-2xl font-bold mb-1">US National Laboratories</h2>
        <p className="text-red-100 text-sm md:text-base">
          US National Labs offer world-class research opportunities with competitive salaries. Many accept international researchers through visiting scholar programs and postdoctoral fellowships.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search national labs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <Select value={stateFilter} onValueChange={setStateFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All States" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {states.map((state) => (
              <SelectItem key={state} value={state}>{state}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 text-red-600 animate-spin" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading national labs...</span>
        </div>
      ) : labs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🔬</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No national labs found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Try adjusting your search</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByState).map(([state, stateLabs]) => (
            <div key={state}>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="size-4 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{state}</h3>
                <Badge variant="secondary" className="text-xs">{stateLabs.length} {stateLabs.length === 1 ? 'lab' : 'labs'}</Badge>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stateLabs.map((lab) => {
                  const fieldsArr = lab.fields.split(',').map((f) => f.trim()).filter(Boolean)
                  const isExpanded = expandedId === lab.id

                  return (
                    <Card key={lab.id} className="hover:shadow-md transition-shadow border-red-100 dark:border-red-900/30">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                            {lab.name}
                          </CardTitle>
                          <Badge className="bg-red-600 hover:bg-red-700 text-white text-xs shrink-0">
                            <Award className="size-3 mr-0.5" />
                            National Lab
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {/* Location */}
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                          <MapPin className="size-3.5 shrink-0" />
                          <span>{lab.city}, {lab.state}</span>
                        </div>

                        {/* Department */}
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                          <BookOpen className="size-3.5 shrink-0" />
                          <span className="truncate">{lab.department}</span>
                        </div>

                        {/* Research Fields */}
                        <div className="flex flex-wrap gap-1">
                          {fieldsArr.map((field) => (
                            <Badge key={field} variant="outline" className="text-xs font-normal">
                              {field}
                            </Badge>
                          ))}
                        </div>

                        {/* Deadline */}
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                          <Calendar className="size-3.5 shrink-0" />
                          <span>Deadline: <span className="font-medium text-gray-800 dark:text-gray-200">{lab.deadline}</span></span>
                        </div>

                        {/* Funding Info */}
                        {lab.fundingType && (
                          <div className="flex items-center gap-1.5 text-xs">
                            <DollarSign className="size-3.5 shrink-0 text-blue-600" />
                            <Badge className={`text-xs ${
                              lab.fundingType === 'Full'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                : lab.fundingType === 'Partial'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                            }`}>
                              {lab.fundingType === 'Full' ? 'Fully Funded' : lab.fundingType}
                            </Badge>
                            {lab.annualStipend && (
                              <span className="text-gray-600 dark:text-gray-400">
                                ~${lab.annualStipend.toLocaleString()}/yr
                              </span>
                            )}
                          </div>
                        )}

                        {/* Expand/Collapse */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedId(isExpanded ? null : lab.id)}
                          className="w-full text-xs text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                        >
                          {isExpanded ? 'Hide Details' : 'View Details'}
                        </Button>

                        {isExpanded && (
                          <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                            {/* URL */}
                            {lab.url && (
                              <div>
                                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Program Website</div>
                                <a
                                  href={lab.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 break-all"
                                >
                                  {lab.url}
                                  <ExternalLink className="size-3 shrink-0" />
                                </a>
                              </div>
                            )}

                            {/* Research Group */}
                            {lab.researchGroup && (
                              <div>
                                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Research Group</div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{lab.researchGroup}</p>
                              </div>
                            )}

                            {/* Fall/Spring Deadlines */}
                            <div>
                              <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Application Deadlines</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                <div>Fall: {lab.fallDeadline || 'N/A'}</div>
                                <div>Spring: {lab.springDeadline || 'N/A'}</div>
                              </div>
                            </div>

                            {/* GRE Requirements */}
                            <div>
                              <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">GRE Requirements</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                <div>General GRE: {lab.greRequired}</div>
                                <div>Physics GRE: {lab.grePhysicsRequired}</div>
                              </div>
                            </div>

                            {/* Stipend Details */}
                            {lab.annualStipend && (
                              <div>
                                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Stipend Details</div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  <div>Annual Stipend: ${lab.annualStipend.toLocaleString()}</div>
                                  {lab.tuitionWaiver && <div>Tuition Waiver: Yes</div>}
                                  {lab.healthInsurance && <div>Health Insurance: Included</div>}
                                </div>
                              </div>
                            )}

                            {/* Notes for Nepali Students */}
                            {lab.notesForNepali && (
                              <div>
                                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Notes for Nepali Students</div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 bg-amber-50 dark:bg-amber-900/10 rounded-md p-2 border border-amber-100 dark:border-amber-900/30">
                                  {lab.notesForNepali}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info about National Lab Fellowships */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Award className="size-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">
                About National Lab Fellowships
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-400">
                US National Labs (like Los Alamos, Oak Ridge, Lawrence Berkeley, etc.) are Department of Energy (DOE) facilities that employ thousands of researchers. PhD students can access these labs through university partnerships, DOE Computational Science Graduate Fellowship (CSGF), or direct postdoctoral appointments. Many labs have partnerships with nearby universities allowing students to conduct their dissertation research at the lab while earning their degree.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('universities')}
                className="mt-2 text-xs border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400"
              >
                View All Universities
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
