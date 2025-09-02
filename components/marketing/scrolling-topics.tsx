'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './scrolling-topics.module.css';

// Helper function to get emoji for each topic
const getTopicEmoji = (topic: string) => {
  const emojiMap: Record<string, string> = {
    'Electronics': '🔌',
    'Mechanics': '⚙️',
    'Programming': '💻',
    'Arduino': '🧰',
    '3D Printing': '🖨️',
    'IoT': '🌐',
    'Home Automation': '🏠',
    'Robotics': '🤖'
  };
  return emojiMap[topic] || '✨';
};

export function ScrollingTopics() {
  const topics = ['Electronics', 'Mechanics', 'Programming', 'Arduino', '3D Printing', 'IoT', 'Home Automation', 'Robotics'];
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.scrollWrapper}>
        <div 
          ref={containerRef}
          className={`${styles.scrollContainer} ${isVisible ? styles.visible : ''}`}
        >
          <div 
            className={styles.scrollContent}
            style={{
              animation: `${styles.scroll} 30s linear infinite`,
              animationPlayState: isVisible ? 'running' : 'paused'
            }}
          >
            {[...topics, ...topics, ...topics].map((topic, index) => (
              <div key={`topic-${index}`} className={styles.topicItem}>
                <span className={styles.emoji}>{getTopicEmoji(topic)}</span>
                <span className={styles.text}>{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
