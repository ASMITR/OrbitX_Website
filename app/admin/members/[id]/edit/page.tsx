'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Save, Upload, X, User } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { getMember, updateMember } from '@/lib/db'
import { Member } from '@/lib/types'
import toast from 'react-hot-toast'

interface MemberForm {
  name: string
  branch: string
  year: string
  division: string
  rollNo: string
  zprnNo: string
  team: string
  position: string
  phone: string
  email: string
  dateOfBirth?: string
  linkedin?: string
  github?: string
  instagram?: string
}

export default function EditMember() {
  const [member, setMember] = useState<Member | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>('')
  const router = useRouter()
  const params = useParams()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<MemberForm>()

  const teams = [
    'Core Team',
    'Design & Innovation Team',
    'Technical Team',
    'Management & Operations Team',
    'Public Outreach Team',
    'Documentation Team',
    'Social Media & Editing Team'
  ]

  const positions = [
    'Faculty Coordinator',
    'President',
    'Vice President',
    'Secretary',
    'Treasurer',
    'Co-Treasurer',
    'Team Lead',
    'Core Member',
    'Member'
  ]

  const branches = [
    'CS',
    'IT',
    'AIDS',
    'AIML',
    'ENTC',
    'ECE',
    'CIVIL',
    'MECHANICAL',
    'ELECTRICAL',
  ]

  const years = ['FE', 'SE', 'TE', 'BE']
  const divisions = ['A', 'B', 'C', 'D']

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const memberData = await getMember(params.id as string)
        if (memberData) {
          setMember(memberData)
          setPhotoPreview(memberData.photo)
          reset({
            name: memberData.name,
            branch: memberData.branch,
            year: memberData.year,
            division: memberData.division,
            rollNo: memberData.rollNo,
            zprnNo: memberData.zprnNo,
            team: memberData.team,
            position: memberData.position,
            phone: memberData.phone,
            email: memberData.email,
            dateOfBirth: memberData.dateOfBirth || '',
            linkedin: memberData.socialLinks?.linkedin || '',
            github: memberData.socialLinks?.github || '',
            instagram: memberData.socialLinks?.instagram || ''
          })
        }
      } catch (error) {
        console.error('Error fetching member:', error)
        toast.error('Failed to fetch member details')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchMember()
    }
  }, [params.id, reset])

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Photo size should be less than 2MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    setPhoto(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removePhoto = () => {
    setPhoto(null)
    setPhotoPreview(member?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(member?.name || '')}&size=200&background=1e293b&color=ffffff`)
  }

  const onSubmit = async (data: MemberForm) => {
    setIsSubmitting(true)
    try {
      const socialLinks: any = {}
      if (data.linkedin) socialLinks.linkedin = data.linkedin
      if (data.github) socialLinks.github = data.github
      if (data.instagram) socialLinks.instagram = data.instagram
      
      const photoUrl = photo ? photoPreview : (photoPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&size=200&background=1e293b&color=ffffff`)
      
      const updateData: any = {
        name: data.name,
        branch: data.branch,
        year: data.year,
        division: data.division,
        rollNo: data.rollNo,
        zprnNo: data.zprnNo,
        team: data.team,
        position: data.position,
        phone: data.phone,
        email: data.email,
        photo: photoUrl,
        ...(data.dateOfBirth && { dateOfBirth: data.dateOfBirth }),
        ...(Object.keys(socialLinks).length > 0 && { socialLinks })
      }
      
      await updateMember(params.id as string, updateData)
      
      toast.success('Member updated successfully!')
      router.push('/admin/members')
    } catch (error) {
      console.error('Error updating member:', error)
      toast.error('Failed to update member')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Edit Member">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!member) {
    return (
      <AdminLayout title="Edit Member">
        <div className="text-center py-12">
          <p className="text-gray-400">Member not found</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Edit Member">
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white">Edit Member</h2>
            <p className="text-gray-400">Update member information</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Photo Upload */}
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Profile Photo
              </label>
              
              <div className="flex flex-col items-center">
                {photoPreview ? (
                  <div className="relative">
                    <img
                      src={photoPreview}
                      alt="Profile preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white/20"
                    />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-white/10 border-2 border-dashed border-white/20 flex items-center justify-center">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="mt-4 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg cursor-pointer hover:bg-blue-500/30 transition-colors flex items-center"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Change Photo
                </label>
                <p className="text-gray-400 text-sm mt-2">JPG, PNG up to 2MB</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  {...register('dateOfBirth')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Team *
                </label>
                <select
                  {...register('team', { required: 'Team is required' })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors"
                >
                  <option value="">Select team</option>
                  {teams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
                {errors.team && (
                  <p className="mt-1 text-sm text-red-400">{errors.team.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Position *
                </label>
                <select
                  {...register('position', { required: 'Position is required' })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors"
                >
                  <option value="">Select position</option>
                  {positions.map(position => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
                {errors.position && (
                  <p className="mt-1 text-sm text-red-400">{errors.position.message}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Branch *
                </label>
                <select
                  {...register('branch', { required: 'Branch is required' })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors"
                >
                  <option value="">Select branch</option>
                  {branches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
                {errors.branch && (
                  <p className="mt-1 text-sm text-red-400">{errors.branch.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Year *
                </label>
                <select
                  {...register('year', { required: 'Year is required' })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors"
                >
                  <option value="">Select year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                {errors.year && (
                  <p className="mt-1 text-sm text-red-400">{errors.year.message}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Division *
                </label>
                <select
                  {...register('division', { required: 'Division is required' })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors"
                >
                  <option value="">Select division</option>
                  {divisions.map(division => (
                    <option key={division} value={division}>{division}</option>
                  ))}
                </select>
                {errors.division && (
                  <p className="mt-1 text-sm text-red-400">{errors.division.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Roll No *
                </label>
                <input
                  {...register('rollNo', { required: 'Roll No is required' })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="e.g., 01"
                />
                {errors.rollNo && (
                  <p className="mt-1 text-sm text-red-400">{errors.rollNo.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ZPRN No *
                </label>
                <input
                  {...register('zprnNo', { required: 'ZPRN No is required' })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="e.g., 2021BTECS00001"
                />
                {errors.zprnNo && (
                  <p className="mt-1 text-sm text-red-400">{errors.zprnNo.message}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="member@orbitx.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  {...register('phone', { required: 'Mobile number is required' })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="+91 98765 43210"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Social Links (Optional)
              </label>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">LinkedIn</label>
                  <input
                    {...register('linkedin')}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="LinkedIn profile URL"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">GitHub</label>
                  <input
                    {...register('github')}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="GitHub profile URL"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Instagram</label>
                  <input
                    {...register('instagram')}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="Instagram profile URL"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-white/20 text-gray-300 rounded-lg hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Update Member
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AdminLayout>
  )
}