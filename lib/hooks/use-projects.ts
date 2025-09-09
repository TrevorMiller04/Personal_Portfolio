'use client'

import { useQuery } from '@tanstack/react-query'
import { ProjectsApiResponseSchema, type ProjectQuery } from '@/lib/validation'

async function fetchProjects(params?: Partial<ProjectQuery>) {
  const searchParams = new URLSearchParams()
  
  if (params?.limit) searchParams.set('limit', params.limit.toString())
  if (params?.offset) searchParams.set('offset', params.offset.toString())
  if (params?.search) searchParams.set('search', params.search)
  if (params?.tech) searchParams.set('tech', params.tech)

  const url = `/api/projects${searchParams.toString() ? `?${searchParams}` : ''}`
  
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.statusText}`)
  }
  
  const data = await response.json()
  return ProjectsApiResponseSchema.parse(data)
}

export function useProjects(params?: Partial<ProjectQuery>) {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => fetchProjects(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useProjectsSearch(search: string, tech?: string) {
  return useProjects({
    search: search || undefined,
    tech: tech || undefined,
    limit: 20,
  })
}