"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Course {
  id: number;
  title: string;
}

interface Topic {
  id: number;
  title: string;
  description: string;
  courseId: number;
  imageSrc: string;
  order: number;
}

interface TopicFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (topic: Omit<Topic, 'id'>) => void;
  topic?: Topic | null;
  courses: Course[];
}

export function TopicForm({ isOpen, onClose, onSubmit, topic, courses }: TopicFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState<number | null>(null);
  const [imageSrc, setImageSrc] = useState("");
  const [order, setOrder] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (topic) {
      setTitle(topic.title);
      setDescription(topic.description || "");
      setCourseId(topic.courseId);
      setImageSrc(topic.imageSrc);
      setOrder(topic.order);
    } else {
      setTitle("");
      setDescription("");
      setCourseId(null);
      setImageSrc("");
      setOrder(0);
    }
  }, [topic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) return;
    
    setLoading(true);
    
    try {
      await onSubmit({
        title,
        description,
        courseId,
        imageSrc,
        order,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {topic ? "Edit Topic" : "Create New Topic"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="courseId">Course</Label>
            <Select value={courseId?.toString()} onValueChange={(value) => setCourseId(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Topic Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter topic title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter topic description"
              rows={3}
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
            <Button type="submit" disabled={loading || !courseId}>
              {loading ? "Saving..." : topic ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
