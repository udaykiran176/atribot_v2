"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Course {
  id: number;
  title: string;
  imageSrc: string;
  order: number;
}

interface CourseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (course: Omit<Course, 'id'>) => void;
  course?: Course | null;
}

export function CourseForm({ isOpen, onClose, onSubmit, course }: CourseFormProps) {
  const [title, setTitle] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [order, setOrder] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setImageSrc(course.imageSrc);
      setOrder(course.order);
    } else {
      setTitle("");
      setImageSrc("");
      setOrder(0);
    }
  }, [course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit({
        title,
        imageSrc,
        order,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {course ? "Edit Course" : "Create New Course"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter course title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageSrc">Image URL</Label>
            <Input
              id="imageSrc"
              value={imageSrc}
              onChange={(e) => setImageSrc(e.target.value)}
              placeholder="Enter image URL"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Order</Label>
            <Input
              id="order"
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
              placeholder="Enter display order"
              min="0"
            />
          </div>

          {imageSrc && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={imageSrc} 
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : course ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
