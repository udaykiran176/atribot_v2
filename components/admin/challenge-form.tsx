"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
}

interface ChallengeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (challenge: Omit<Challenge, 'id'>) => void;
  challenge?: Challenge | null;
  topics: Topic[];
}

const challengeTypes = [
  { value: "video_lesson", label: "Video Lesson" },
  { value: "swipe_cards", label: "Swipe Cards" },
  { value: "interactive_game", label: "Interactive Game" },
  { value: "build_it_thought", label: "Build It Thought" },
  { value: "quiz", label: "Quiz" },
];

export function ChallengeForm({ isOpen, onClose, onSubmit, challenge, topics }: ChallengeFormProps) {
  const [topicId, setTopicId] = useState<number | null>(null);
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [order, setOrder] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (challenge) {
      setTopicId(challenge.topicId);
      setType(challenge.type);
      setTitle(challenge.title);
      setDescription(challenge.description || "");
      setContent(challenge.content || "");
      setOrder(challenge.order);
    } else {
      setTopicId(null);
      setType("");
      setTitle("");
      setDescription("");
      setContent("");
      setOrder(0);
    }
  }, [challenge]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicId || !type) return;
    
    setLoading(true);
    
    try {
      await onSubmit({
        topicId,
        type,
        title,
        description,
        content,
        order,
      });
    } finally {
      setLoading(false);
    }
  };

  const getTopicLabel = (topic: Topic) => {
    return `${topic.course?.title || 'Unknown Course'} > ${topic.title}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {challenge ? "Edit Challenge" : "Create New Challenge"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topicId">Topic</Label>
            <Select value={topicId?.toString()} onValueChange={(value) => setTopicId(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic.id} value={topic.id.toString()}>
                    {getTopicLabel(topic)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Challenge Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select challenge type" />
              </SelectTrigger>
              <SelectContent>
                {challengeTypes.map((challengeType) => (
                  <SelectItem key={challengeType.value} value={challengeType.value}>
                    {challengeType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Challenge Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter challenge title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter challenge description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content (JSON)</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter challenge content as JSON"
              rows={4}
            />
            <p className="text-xs text-gray-500">
              Enter challenge-specific data in JSON format (e.g., video URLs, quiz questions, etc.)
            </p>
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

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !topicId || !type}>
              {loading ? "Saving..." : challenge ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
