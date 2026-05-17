import React, { useState } from "react";
import { motion } from "framer-motion";
import { sendMessage } from "../api/index.js";
import { Send } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendMessage(formData);
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
    setLoading(false);
  };

  return (
    <section id="contact" className="py-20 bg-transparent">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold font-head text-text-primary mb-12 text-center">
          Get In Touch
        </h2>

        <form
          onSubmit={handleSubmit}
          className="relative bg-overlay/40 backdrop-blur-lg border border-white/10 rounded-lg p-8 space-y-6 hover:border-accent/50 transition"
        >
          <div>
            <label className="block text-text-primary font-semibold mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-overlay/40 backdrop-blur-lg border border-white/10 rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-accent/50"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-text-primary font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-overlay/40 backdrop-blur-lg border border-white/10 rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-accent/50"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-text-primary font-semibold mb-2">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              className="w-full bg-overlay/40 backdrop-blur-lg border border-white/10 rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-accent/50"
              placeholder="Your message..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-canvas font-bold py-3 rounded-lg hover:bg-accent-hover transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Message"} <Send size={18} />
          </button>

          {success && (
            <p className="text-accent text-center">
              ✓ Message sent successfully!
            </p>
          )}
        </form>

        {/* Animated HR Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-20 h-1 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full max-w-2xl mx-auto"
        />
      </div>
    </section>
  );
}
