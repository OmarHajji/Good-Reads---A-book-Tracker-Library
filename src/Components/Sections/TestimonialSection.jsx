import React, { useEffect, useState } from "react";
import Container from "../UI/Container.jsx";
const quotes = [
  {
    id: 1,
    text: "Goodreads makes tracking my reading progress and writing reviews incredibly simple and enjoyable.",
    name: "Jane Doe",
    avatar: "/avatar1.png",
  },
  {
    id: 2,
    text: "I discovered so many new authors here. The community recommendations are pure gold.",
    name: "Samuel Thompson",
    avatar: "/avatar2.png",
  },
  {
    id: 3,
    text: "The best place to organize your library and find the next book to love.",
    name: "Emily Hartman",
    avatar: "/community-3.png",
  },
];

export default function TestimonialSection() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % quotes.length), 6000);
    return () => clearInterval(t);
  }, []);

  const q = quotes[i];

  return (
    <Container>
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="mx-auto w-20 h-20 rounded-full overflow-hidden bg-gray-200">
            <img
              src={q.avatar}
              alt={q.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          <div className="relative mt-6">
            <div className="text-brown text-lg md:text-3xl leading-relaxed font-playfair">
              “{q.text}”
            </div>
            <div className="mt-4 font-semibold text-brown">{q.name}</div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-6"></div>
        </div>
      </section>
    </Container>
  );
}
