// EdTok: Full-screen vertical scroll app with Wikipedia topics and images

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const RANDOM_TOPICS = [
  "Artificial intelligence",
  "Photosynthesis",
  "Black hole",
  "Mitochondria",
  "Quantum computing",
  "Great Wall of China",
  "Taj Mahal",
  "Evolution",
  "Human brain",
  "Theory of relativity",
  "Blockchain",
  "Internet",
  "Climate change",
  "Machine learning",
  "DNA",
  "Neural network",
  "Solar system",
  "Volcano",
  "Gravity",
  "Programming language",
  "Cybersecurity",
  "Augmented reality",
  "Higgs boson",
  "Antibiotic resistance",
  "Nanotechnology",
  "Renewable energy",
  "Genetic engineering",
  "CRISPR",
  "Space exploration",
  "Saturn",
  "Photoshop",
  "Mars",
  "Biodiversity",
  "Astronomy",
  "Ocean",
  "Telescope",
  "Bacteria",
  "Plasma (physics)",
  "Big Bang",
  "Internet of things",
  "Artificial general intelligence"
];

export default function EdTok() {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchRandomTopic = async () => {
    const topic = RANDOM_TOPICS[Math.floor(Math.random() * RANDOM_TOPICS.length)];
    try {
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`
      );
      if (!res.ok) throw new Error("Failed to fetch article");
      const data = await res.json();
      return data;
    } catch (err) {
      return { title: "Error", extract: err.message, content_urls: { desktop: { page: "#" } }, thumbnail: null };
    }
  };

  const loadInitialCards = async () => {
    const newCards = await Promise.all(
      Array.from({ length: 5 }).map(() => fetchRandomTopic())
    );
    setCards(newCards);
  };

  const handleScroll = (e) => {
    if (e.deltaY > 0 && currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (e.deltaY < 0 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    loadInitialCards();
    window.addEventListener("wheel", handleScroll, { passive: true });
    return () => window.removeEventListener("wheel", handleScroll);
  }, [currentIndex, cards.length]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-black text-white">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          className="absolute top-0 left-0 h-screen w-screen flex flex-col items-center justify-center p-8 text-center"
          style={{ zIndex: index === currentIndex ? 1 : 0, opacity: index === currentIndex ? 1 : 0 }}
          animate={{ opacity: index === currentIndex ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        >
          {card.thumbnail?.source && (
            <img
              src={card.thumbnail.source}
              alt={card.title}
              className="w-80 h-80 object-cover rounded-2xl shadow-lg mb-6"
            />
          )}
          <h2 className="text-4xl font-bold mb-4">{card.title}</h2>
          <p className="text-lg max-w-xl mb-4">{card.extract}</p>
          <a
            href={card.content_urls.desktop.page}
            target="_blank"
            className="text-blue-400 hover:underline"
          >
            Read more on Wikipedia ↗
          </a>
        </motion.div>
      ))}
    </div>
  );
}
