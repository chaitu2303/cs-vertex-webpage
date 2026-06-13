"use client"

import { useTransition } from 'react';
import { togglePublishStatus, deleteTestimonial } from './actions';

export function TestimonialActions({ id, published }: { id: string, published: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(() => {
      togglePublishStatus(id, published);
    });
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      startTransition(() => {
        deleteTestimonial(id);
      });
    }
  }

  return (
    <div className="flex gap-3 justify-end items-center">
      <button 
        onClick={handleToggle}
        disabled={isPending}
        className={`font-medium text-sm px-3 py-1 rounded-md transition-colors ${
          published ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : 'bg-green-100 text-green-700 hover:bg-green-200'
        }`}
      >
        {isPending ? 'Updating...' : published ? 'Revoke' : 'Approve'}
      </button>
      <button 
        onClick={handleDelete}
        disabled={isPending}
        className="text-red-600 hover:text-red-800 font-medium text-sm"
      >
        Delete
      </button>
    </div>
  )
}
