'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, FolderOpen, Eye } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import { getProjects, deleteProject } from '@/lib/db'
import { Project } from '@/lib/types'
import toast from 'react-hot-toast'

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const projectsData = await getProjects()
      setProjects(projectsData)
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error('Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id)
        setProjects(projects.filter(project => project.id !== id))
        toast.success('Project deleted successfully')
      } catch (error) {
        toast.error('Failed to delete project')
      }
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Projects Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Projects Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Projects</h2>
            <p className="text-gray-400">Manage your space technology projects</p>
          </div>
          <Link href="/admin/projects/new" className="btn-primary flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add Project
          </Link>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-white truncate">{project.title}</h3>
                <div className="flex space-x-1 relative z-10">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(`/projects/${project.id}`, '_blank')
                    }}
                    className="p-1 text-gray-400 hover:text-blue-400 transition-colors cursor-pointer"
                    type="button"
                  >
                    <Eye className="h-4 w-4 pointer-events-none" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/admin/projects/${project.id}`)
                    }}
                    className="p-1 text-gray-400 hover:text-yellow-400 transition-colors cursor-pointer"
                    type="button"
                  >
                    <Edit className="h-4 w-4 pointer-events-none" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(project.id)
                    }}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                    type="button"
                  >
                    <Trash2 className="h-4 w-4 pointer-events-none" />
                  </button>
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                {project.description}
              </p>

              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs rounded">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>{project.contributors.length} teams</span>
                <span>{new Date(project.date).toLocaleDateString()}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No projects found</h3>
            <p className="text-gray-400">Create your first project to get started.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}