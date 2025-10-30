'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Package, Trash2, Eye, Edit } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Order } from '@/lib/types'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders', {
        next: { revalidate: 30 }
      })
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
        setFilteredOrders(data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = orders.filter(order => 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status === selectedStatus)
    }

    setFilteredOrders(filtered)
  }, [orders, searchTerm, selectedStatus])

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, status: newStatus as any } : order
        ))
        toast.success('Order status updated')
      } else {
        toast.error('Failed to update order')
      }
    } catch (error) {
      console.error('Error updating order:', error)
      toast.error('Failed to update order')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return

    setDeleteLoading(id)
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setOrders(prev => prev.filter(order => order.id !== id))
        toast.success('Order deleted successfully')
      } else {
        toast.error('Failed to delete order')
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      toast.error('Failed to delete order')
    } finally {
      setDeleteLoading(null)
    }
  }

  const statuses = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

  if (loading) {
    return (
      <AdminLayout title="Order Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Order Management">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Order Management</h1>
            <p className="text-sm text-gray-400">Manage customer orders and track deliveries</p>
          </div>
        </div>

        <div className="glass-card-admin p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white focus:outline-none focus:border-blue-400"
            >
              {statuses.map(status => (
                <option key={status} value={status} className="bg-black">
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="glass-card-admin p-6 text-center">
            <Package className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-400 mb-2">No orders found</h3>
            <p className="text-sm text-gray-500">
              {searchTerm || selectedStatus !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'No orders have been placed yet'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card-admin p-4"
              >
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-white font-bold">{order.orderNumber}</h3>
                        <p className="text-gray-400 text-sm">{order.customerInfo.name}</p>
                        <p className="text-gray-400 text-xs">{order.customerInfo.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-400 font-bold text-lg">₹{order.total}</p>
                        <p className="text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        order.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
                        order.status === 'shipped' ? 'bg-purple-500/20 text-purple-400' :
                        order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {order.items?.length || 0} item{(order.items?.length || 0) > 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {order.items?.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white/5 rounded px-2 py-1">
                          <img src={item.image} alt={item.name} className="w-6 h-6 object-contain rounded" />
                          <span className="text-xs text-gray-300">{item.name}</span>
                        </div>
                      ))}
                      {(order.items?.length || 0) > 3 && (
                        <span className="text-xs text-gray-400 px-2 py-1">+{(order.items?.length || 0) - 3} more</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[200px]">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white focus:outline-none focus:border-blue-400"
                    >
                      <option value="pending" className="bg-black">Pending</option>
                      <option value="confirmed" className="bg-black">Confirmed</option>
                      <option value="shipped" className="bg-black">Shipped</option>
                      <option value="delivered" className="bg-black">Delivered</option>
                      <option value="cancelled" className="bg-black">Cancelled</option>
                    </select>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/order-confirmation/${order.id}`)}
                        className="flex-1 py-2 px-3 bg-white/10 hover:bg-white/20 text-white rounded text-xs transition-colors flex items-center justify-center"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        disabled={deleteLoading === order.id}
                        className="py-2 px-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded text-xs transition-colors disabled:opacity-50"
                      >
                        {deleteLoading === order.id ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-300"></div>
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}