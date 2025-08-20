"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, Target } from "lucide-react";
import { ChallengeForm } from "@/components/admin/challenge-form";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";

interface Topic {
  id: number;
  title: string;
  courseId: number;
  course?: {
    id: number;
    title: string;
  };
}

interface Challenge {
  id: number;
  topicId: number;
  type: string;
  title: string;
  description: string;
  content: string;
  order: number;
  topicTitle?: string;
  courseTitle?: string;
  topic?: Topic;
}

const challengeTypeLabels: Record<string, string> = {
  video_lesson: "Video Lesson",
  swipe_cards: "Swipe Cards",
  interactive_game: "Interactive Game",
  build_it_thought: "Build It Thought",
  quiz: "Quiz",
};

const challengeTypeColors: Record<string, string> = {
  video_lesson: "bg-blue-100 text-blue-800",
  swipe_cards: "bg-green-100 text-green-800",
  interactive_game: "bg-purple-100 text-purple-800",
  build_it_thought: "bg-orange-100 text-orange-800",
  quiz: "bg-red-100 text-red-800",
};

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [deletingChallenge, setDeletingChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges();
    fetchTopics();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await fetch('/api/admin/challenges');
      if (response.ok) {
        const data = await response.json();
        setChallenges(data);
      }
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async () => {
    try {
      const response = await fetch('/api/admin/topics');
      if (response.ok) {
        const data = await response.json();
        setTopics(data);
      }
    } catch (error) {
      console.error('Failed to fetch topics:', error);
    }
  };

  const handleCreate = () => {
    setEditingChallenge(null);
    setIsFormOpen(true);
  };

  const handleEdit = (challenge: Challenge) => {
    setEditingChallenge(challenge);
    setIsFormOpen(true);
  };

  const handleDelete = async (challenge: Challenge) => {
    try {
      const response = await fetch(`/api/admin/challenges/${challenge.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setChallenges(challenges.filter(c => c.id !== challenge.id));
        setDeletingChallenge(null);
      }
    } catch (error) {
      console.error('Failed to delete challenge:', error);
    }
  };

  const handleFormSubmit = async (challengeData: Omit<Challenge, 'id' | 'topic'>) => {
    try {
      const url = editingChallenge 
        ? `/api/admin/challenges/${editingChallenge.id}`
        : '/api/admin/challenges';
      
      const response = await fetch(url, {
        method: editingChallenge ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(challengeData),
      });

      if (response.ok) {
        const savedChallenge = await response.json();
        if (editingChallenge) {
          setChallenges(challenges.map(c => c.id === editingChallenge.id ? savedChallenge : c));
        } else {
          setChallenges([...challenges, savedChallenge]);
        }
        setIsFormOpen(false);
        setEditingChallenge(null);
      }
    } catch (error) {
      console.error('Failed to save challenge:', error);
    }
  };

  const getTopicInfo = (challenge: Challenge) => {
    return {
      topicTitle: challenge.topicTitle || 'Unknown Topic',
      courseTitle: challenge.courseTitle || 'Unknown Course'
    };
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Challenges</h1>
          <p className="text-gray-600">Manage challenges within your topics</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Challenge
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => {
          const { topicTitle, courseTitle } = getTopicInfo(challenge);
          return (
            <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      {courseTitle}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {topicTitle}
                    </Badge>
                  </div>
                  <Badge 
                    className={`text-xs ${challengeTypeColors[challenge.type] || 'bg-gray-100 text-gray-800'}`}
                  >
                    {challengeTypeLabels[challenge.type] || challenge.type}
                  </Badge>
                  <CardTitle className="text-lg">{challenge.title}</CardTitle>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {challenge.description || 'No description'}
                  </p>
                  <div className="text-xs text-gray-500">
                    Order: {challenge.order}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(challenge)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setDeletingChallenge(challenge)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {challenges.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No challenges yet</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first challenge.</p>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add Challenge
            </Button>
          </CardContent>
        </Card>
      )}

      <ChallengeForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingChallenge(null);
        }}
        onSubmit={handleFormSubmit}
        challenge={editingChallenge}
        topics={topics}
      />

      <DeleteConfirmDialog
        isOpen={!!deletingChallenge}
        onClose={() => setDeletingChallenge(null)}
        onConfirm={() => deletingChallenge && handleDelete(deletingChallenge)}
        title="Delete Challenge"
        description={`Are you sure you want to delete "${deletingChallenge?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
