"use client";


import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Check, Search, Save } from 'lucide-react';
import toast from 'react-hot-toast';

type Service = {
  id: string;
  title: string;
  description: string;
  businessValue: string | null;
  icon: string | null;
  deliverables: string | null;
  industries: string | null;
  published: boolean;
  order: number;
  createdAt: string;
};

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    description: '',
    businessValue: '',
    icon: '',
    deliverables: '',
    industries: '',
    published: true,
    order: 0,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/services');
      if (!res.ok) throw new Error('Failed to fetch services');
      const data = await res.json();
      setServices(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setIsEditing(true);
      setFormData({
        id: service.id,
        title: service.title,
        description: service.description,
        businessValue: service.businessValue || '',
        icon: service.icon || '',
        deliverables: service.deliverables || '',
        industries: service.industries || '',
        published: service.published,
        order: service.order,
      });
    } else {
      setIsEditing(false);
      setFormData({
        title: '',
        description: '',
        businessValue: '',
        icon: '',
        deliverables: '',
        industries: '',
        published: true,
        order: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEditing ? `/api/admin/services/${formData.id}` : '/api/admin/services';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      toast.success(isEditing ? 'Service updated successfully' : 'Service created successfully');
      fetchServices();
      handleCloseModal();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete service');

      toast.success('Service deleted successfully');
      fetchServices();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const togglePublish = async (service: Service) => {
    try {
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...service, published: !service.published }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      toast.success(`Service ${!service.published ? 'published' : 'unpublished'}`);
      fetchServices();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Services</h1>
            <p className="text-zinc-400 mt-1">Manage the services offered by your company.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-[#FF5A2A] hover:bg-[#e04e22] text-white px-5 py-2.5 rounded-md font-medium transition-colors"
          >
            <Plus size={18} />
            Add Service
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2 mb-6 w-full max-w-md focus-within:border-[#FF5A2A] transition-colors">
          <Search size={18} className="text-zinc-400 mr-2" />
          <input 
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-zinc-500"
          />
        </div>

        {/* Data Table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Title & Icon</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium text-center">Order</th>
                  <th className="px-6 py-4 font-medium text-center">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                      <div className="animate-pulse flex flex-col items-center">
                        <div className="h-6 w-6 border-2 border-[#FF5A2A] border-t-transparent rounded-full animate-spin mb-4"></div>
                        Loading services...
                      </div>
                    </td>
                  </tr>
                ) : filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                      No services found. Try adjusting your search or add a new service.
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service) => (
                    <tr key={service.id} className="hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {service.icon ? (
                            <div className="w-10 h-10 flex items-center justify-center bg-zinc-800 rounded text-xl" dangerouslySetInnerHTML={{ __html: service.icon }} />
                          ) : (
                            <div className="w-10 h-10 flex items-center justify-center bg-zinc-800 rounded text-zinc-500 text-xs">No icon</div>
                          )}
                          <span className="font-medium">{service.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-400 max-w-xs truncate">
                        {service.description}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center bg-zinc-800 text-zinc-300 w-8 h-8 rounded-full text-xs font-medium">
                          {service.order}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => togglePublish(service)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                            service.published 
                              ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20' 
                              : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'
                          } transition-colors`}
                        >
                          {service.published ? (
                            <><Check size={12} /> Published</>
                          ) : (
                            <><X size={12} /> Draft</>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(service)}
                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(service.id)}
                            className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-3xl my-8 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950">
              <h2 className="text-xl font-semibold">{isEditing ? 'Edit Service' : 'Add New Service'}</h2>
              <button 
                onClick={handleCloseModal}
                className="text-zinc-400 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Column */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Title *</label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title || ''}
                      onChange={handleChange}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5A2A] transition-colors"
                      placeholder="e.g. Cloud Migration"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Description *</label>
                    <textarea
                      name="description"
                      required
                      rows={4}
                      value={formData.description || ''}
                      onChange={handleChange}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5A2A] transition-colors resize-none"
                      placeholder="Briefly describe the service..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Icon (SVG or class name)</label>
                    <input
                      type="text"
                      name="icon"
                      value={formData.icon || ''}
                      onChange={handleChange}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5A2A] transition-colors font-mono"
                      placeholder='<svg>...</svg> or "fa-solid fa-cloud"'
                    />
                    <p className="text-xs text-zinc-500 mt-1.5">Paste raw SVG code or use an icon class name.</p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Business Value</label>
                    <textarea
                      name="businessValue"
                      rows={3}
                      value={formData.businessValue || ''}
                      onChange={handleChange}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5A2A] transition-colors resize-none"
                      placeholder="Why do clients need this? What value does it add?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Deliverables</label>
                    <input
                      type="text"
                      name="deliverables"
                      value={formData.deliverables || ''}
                      onChange={handleChange}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5A2A] transition-colors"
                      placeholder="e.g. Assessment Report, Architecture Design..."
                    />
                    <p className="text-xs text-zinc-500 mt-1.5">Comma separated list of deliverables.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Industries</label>
                    <input
                      type="text"
                      name="industries"
                      value={formData.industries || ''}
                      onChange={handleChange}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5A2A] transition-colors"
                      placeholder="e.g. Healthcare, Finance, Retail..."
                    />
                    <p className="text-xs text-zinc-500 mt-1.5">Comma separated list of target industries.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1.5">Order</label>
                      <input
                        type="number"
                        name="order"
                        value={formData.order || 0}
                        onChange={handleChange}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5A2A] transition-colors"
                      />
                    </div>
                    <div className="flex flex-col justify-end pb-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="published"
                          checked={formData.published}
                          onChange={handleChange}
                          className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-[#FF5A2A] focus:ring-[#FF5A2A] focus:ring-offset-zinc-950"
                        />
                        <span className="text-sm font-medium text-zinc-300">Published</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 text-sm font-medium text-zinc-300 bg-transparent border border-zinc-700 hover:bg-zinc-800 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#FF5A2A] hover:bg-[#e04e22] rounded-md transition-colors"
                >
                  <Save size={16} />
                  {isEditing ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}



