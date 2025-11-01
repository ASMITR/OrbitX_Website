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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card-admin p-4 sm:p-6 hover:border-purple-400/50 transition-all duration-300 group flex flex-col"
            >
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center text-gray-400 text-sm">
                    <FolderOpen className="h-4 w-4 mr-2 text-purple-400 flex-shrink-0" />
                    <span className="truncate">{project.contributors.length} teams</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
                {project.description}
              </p>

              {/* Technologies */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 3).map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-lg border border-purple-500/30"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-lg border border-gray-500/30">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions and Date */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                <div className="flex items-center space-x-2">
                  <motion.button 
                    onClick={() => window.open(`/projects/${project.id}`, '_blank')}
                    className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Eye className="h-4 w-4" />
                  </motion.button>
                  <motion.button 
                    onClick={() => router.push(`/admin/projects/${project.id}`)}
                    className="p-2 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit className="h-4 w-4" />
                  </motion.button>
                  <motion.button 
                    onClick={() => handleDelete(project.id)}
                    className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(project.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
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