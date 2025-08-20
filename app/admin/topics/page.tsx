"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, FileText } from "lucide-react";
import { TopicForm } from "@/components/admin/topic-form";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";

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
  course?: Course;
}

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [deletingTopic, setDeletingTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopics();
    fetchCourses();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await fetch('/api/admin/topics');
      if (response.ok) {
        const data = await response.json();
        setTopics(data);
      }
    } catch (error) {
      console.error('Failed to fetch topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/admin/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const handleCreate = () => {
    setEditingTopic(null);
    setIsFormOpen(true);
  };

  const handleEdit = (topic: Topic) => {
    setEditingTopic(topic);
    setIsFormOpen(true);
  };

  const handleDelete = async (topic: Topic) => {
    try {
      const response = await fetch(`/api/admin/topics/${topic.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTopics(topics.filter(t => t.id !== topic.id));
        setDeletingTopic(null);
      }
    } catch (error) {
      console.error('Failed to delete topic:', error);
    }
  };

  const handleFormSubmit = async (topicData: Omit<Topic, 'id' | 'course'>) => {
    try {
      const url = editingTopic 
        ? `/api/admin/topics/${editingTopic.id}`
        : '/api/admin/topics';
      
      const response = await fetch(url, {
        method: editingTopic ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(topicData),
      });

      if (response.ok) {
        const savedTopic = await response.json();
        if (editingTopic) {
          setTopics(topics.map(t => t.id === editingTopic.id ? savedTopic : t));
        } else {
          setTopics([...topics, savedTopic]);
        }
        setIsFormOpen(false);
        setEditingTopic(null);
      }
    } catch (error) {
      console.error('Failed to save topic:', error);
    }
  };

  const getCourseTitle = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    return course?.title || 'Unknown Course';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Topics</h1>
          <p className="text-gray-600">Manage topics within your courses</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Topic
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <Card key={topic.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                {topic.imageSrc ? (
                  <img 
                    src={topic.imageSrc} 
                    alt={topic.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="text-xs">
                  {getCourseTitle(topic.courseId)}
                </Badge>
                <CardTitle className="text-lg">{topic.title}</CardTitle>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {topic.description || 'No description'}
                </p>
                <div className="text-xs text-gray-500">
                  Order: {topic.order}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEdit(topic)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setDeletingTopic(topic)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {topics.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No topics yet</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first topic.</p>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add Topic
            </Button>
          </CardContent>
        </Card>
      )}

      <TopicForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTopic(null);
        }}
        onSubmit={handleFormSubmit}
        topic={editingTopic}
        courses={courses}
      />

      <DeleteConfirmDialog
        isOpen={!!deletingTopic}
        onClose={() => setDeletingTopic(null)}
        onConfirm={() => deletingTopic && handleDelete(deletingTopic)}
        title="Delete Topic"
        description={`Are you sure you want to delete "${deletingTopic?.title}"? This action cannot be undone and will also delete all associated challenges.`}
      />
    </div>
  );
}
