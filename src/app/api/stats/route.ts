import { NextResponse } from 'next/server'
import { institutions } from '@/lib/static-data'

export async function GET() {
  const totalInstitutions = institutions.filter((i) => i.type === 'University').length
  const totalNationalFacilities = institutions.filter((i) => i.type === 'National Facility').length
  const totalResearchInstitutes = institutions.filter((i) => i.type === 'Research Institute').length
  const doctoralScholarships = institutions.filter((i) => i.funding?.doctoralScholarshipAvailable).length
  const epsrcFunded = institutions.filter((i) => i.funding?.epsrcFunded).length
  const ukriPositions = institutions.filter((i) => i.funding?.ukriFunded).length

  const stipends = institutions.filter((i) => i.monthlyGbp).map((i) => i.monthlyGbp as number)
  const avgStipendGbp = stipends.length > 0 ? Math.round(stipends.reduce((a, b) => a + b, 0) / stipends.length) : 0

  // Top fields
  const fieldCount: Record<string, number> = {}
  institutions.forEach((inst) => {
    inst.fields.split('|').forEach((f) => {
      const field = f.trim()
      if (field) fieldCount[field] = (fieldCount[field] || 0) + 1
    })
  })
  const topFields = Object.entries(fieldCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([field, count]) => ({ field, count }))

  // Top UK regions
  const regionCount: Record<string, number> = {}
  institutions.forEach((inst) => {
    regionCount[inst.country] = (regionCount[inst.country] || 0) + 1
  })
  const topStates = Object.entries(regionCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([state, count]) => ({ state, count }))

  return NextResponse.json({
    totalInstitutions,
    totalNationalFacilities,
    totalResearchInstitutes,
    doctoralScholarships,
    epsrcFunded,
    ukriPositions,
    avgStipendGbp,
    topFields,
    topStates,
  })
}
