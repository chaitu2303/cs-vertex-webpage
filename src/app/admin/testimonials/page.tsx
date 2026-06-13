import { prisma } from '@/lib/prisma';
import { TestimonialActions } from './TestimonialActions';

export const revalidate = 0;

export default async function TestimonialsAdmin() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Testimonials</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Add Testimonial
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600">Client Details</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Feedback</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Rating</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Created</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {testimonials.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No testimonials found.
                  </td>
                </tr>
              ) : (
                testimonials.map((testimonial) => (
                  <tr key={testimonial.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{testimonial.clientName}</div>
                      <div className="text-xs text-gray-500">{testimonial.company || 'No Company'}</div>
                      <div className="text-xs text-gray-400">{testimonial.email || 'No Email'}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-normal min-w-[200px] max-w-xs text-sm">
                      <p className="line-clamp-2" title={testimonial.feedback}>{testimonial.feedback}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${testimonial.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {testimonial.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{new Date(testimonial.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <TestimonialActions id={testimonial.id} published={testimonial.published} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
