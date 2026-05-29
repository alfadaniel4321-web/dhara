import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Send, Users, UserCheck, Globe, CheckCircle } from "lucide-react";
import { api } from "../services/api";

export default function AdminNotifications() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("all");
  const [type, setType] = useState("general");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    setSending(true);
    setSuccess("");
    setError("");
    try {
      const result = await api.admin.sendNotification({ title, message, target, type });
      setSuccess(`Notification sent to ${result.count || "all"} users`);
      setTitle("");
      setMessage("");
    } catch (err) {
      setError(err.message || "Failed to send");
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-emerald-100">Send Notification</h1>
        <p className="text-xs text-emerald-400/50 mt-1">Broadcast messages to farmers and customers</p>
      </div>

      {success && (
        <div className="px-4 py-3 rounded-xl bg-green-900/20 border border-green-700/30 text-green-400 text-sm font-medium flex items-center gap-2">
          <CheckCircle size={16} /> {success}
        </div>
      )}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-900/20 border border-red-700/30 text-red-400 text-sm font-medium">{error}</div>
      )}

      <form onSubmit={handleSend} className="bg-[#0a1a0e] border border-emerald-900/20 rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-emerald-400/70 mb-1.5">Notification Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Platform Maintenance Tonight"
            className="w-full px-4 py-3 bg-[#042f1a] border border-emerald-900/30 rounded-xl text-sm text-emerald-100 placeholder-emerald-600/40 outline-none focus:border-emerald-600/50"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-emerald-400/70 mb-1.5">Message</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)}
            placeholder="Write your notification message..."
            rows={4}
            className="w-full px-4 py-3 bg-[#042f1a] border border-emerald-900/30 rounded-xl text-sm text-emerald-100 placeholder-emerald-600/40 outline-none focus:border-emerald-600/50 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-emerald-400/70 mb-1.5">Target Audience</label>
            <div className="flex gap-2">
              {[
                { value: "all", icon: Globe, label: "All Users" },
                { value: "farmers", icon: UserCheck, label: "Farmers" },
                { value: "customers", icon: Users, label: "Customers" },
              ].map(({ value, icon: Icon, label }) => (
                <button key={value} type="button" onClick={() => setTarget(value)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-semibold transition-all ${target === value ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30" : "bg-emerald-900/10 text-emerald-400/60 border border-transparent"}`}
                ><Icon size={12} /> {label}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-emerald-400/70 mb-1.5">Notification Type</label>
            <select value={type} onChange={e => setType(e.target.value)}
              className="w-full px-4 py-3 bg-[#042f1a] border border-emerald-900/30 rounded-xl text-sm text-emerald-100 outline-none focus:border-emerald-600/50"
            >
              <option value="general" className="bg-[#042f1a]">General Announcement</option>
              <option value="warning" className="bg-[#042f1a]">Warning</option>
              <option value="offer" className="bg-[#042f1a]">Offer / Promotion</option>
              <option value="seasonal" className="bg-[#042f1a]">Seasonal Alert</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={sending || !title.trim() || !message.trim()}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white text-sm font-bold rounded-xl transition-all"
        >
          <Send size={16} />
          {sending ? "Sending..." : "Send Notification"}
        </button>
      </form>
    </motion.div>
  );
}
