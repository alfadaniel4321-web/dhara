import React, { useState } from "react";
import {
  MessageCircle, Send, ChevronLeft, ChevronRight, Phone, MoreVertical, Check, CheckCheck, User
} from "lucide-react";

const FARMERS_LIST = [
  { id: 1, name: "Madhavan Nair", lastMsg: "Your duck eggs are ready for pickup!", time: "10:32 AM", unread: 2, online: true },
  { id: 2, name: "Devika Rajan", lastMsg: "Tomatoes harvested fresh today 🍅", time: "09:15 AM", unread: 0, online: true },
  { id: 3, name: "Anil Kumar", lastMsg: "Banana bunch ready, shall I deliver?", time: "Yesterday", unread: 0, online: false },
  { id: 4, name: "Saraswati Menon", lastMsg: "Sure, I'll deliver by 7 AM tomorrow", time: "Yesterday", unread: 1, online: false },
  { id: 5, name: "Rajesh Pillai", lastMsg: "Paddy harvest expected next week", time: "May 25", unread: 0, online: false },
];

const MESSAGES = {
  1: [
    { id: 1, text: "Hi Madhavan, are the duck eggs available today?", sender: "me", time: "10:15 AM" },
    { id: 2, text: "Yes, fresh batch just came in! 12 eggs at ₹72", sender: "them", time: "10:18 AM" },
    { id: 3, text: "Perfect, please pack one for me", sender: "me", time: "10:20 AM" },
    { id: 4, text: "Your duck eggs are ready for pickup!", sender: "them", time: "10:32 AM" },
  ],
  2: [
    { id: 1, text: "Are the organic tomatoes available?", sender: "me", time: "09:00 AM" },
    { id: 2, text: "Tomatoes harvested fresh today 🍅", sender: "them", time: "09:15 AM" },
  ],
};

const INITIAL_MSG = [
  { id: 1, text: "Start a conversation with a farmer!", sender: "system", time: "" },
];

export default function Chat() {
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [input, setInput] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);

  const activeFarmer = selectedFarmer ? FARMERS_LIST.find(f => f.id === selectedFarmer) : null;
  const chatMsgs = selectedFarmer ? (MESSAGES[selectedFarmer] || INITIAL_MSG) : INITIAL_MSG;

  const handleSend = () => {
    if (!input.trim() || !selectedFarmer) return;
    setInput("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", height: "calc(100vh - 120px)" }}>
      <div style={{
        background: "linear-gradient(135deg,#013220,#14532d)",
        borderRadius: "20px", padding: "1.5rem 2rem", color: "white",
        display: "flex", alignItems: "center", gap: "12px", flexShrink: 0,
      }}>
        <MessageCircle size={26} color="#7BE495" />
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, margin: 0 }}>Chat with Farmer</h1>
          <p style={{ opacity: 0.8, fontSize: "0.85rem", margin: "2px 0 0" }}>Connect directly with growers</p>
        </div>
      </div>

      <div style={{
        display: "flex", flex: 1, background: "white", borderRadius: "16px",
        overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", minHeight: 0,
      }}>
        {/* Sidebar */}
        <div style={{
          width: showSidebar ? "280px" : "0px", overflow: "hidden", transition: "width 0.3s ease",
          borderRight: "1px solid #F4F6F3", flexShrink: 0, display: "flex", flexDirection: "column",
        }}>
          <div style={{
            display: "flex",
            padding: "1rem", borderBottom: "1px solid #F4F6F3", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontWeight: 700, color: "#013220", fontSize: "0.9rem" }}>Farmers</span>
            <span style={{ fontSize: "0.7rem", color: "#6A994E", fontWeight: 600 }}>
              {FARMERS_LIST.filter(f => f.online).length} online
            </span>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {FARMERS_LIST.map(f => (
              <div key={f.id} onClick={() => { setSelectedFarmer(f.id); setShowSidebar(false); }} style={{
                display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.85rem 1rem",
                cursor: "pointer", transition: "all 0.15s",
                background: selectedFarmer === f.id ? "#EBF5EB" : "transparent",
                borderBottom: "1px solid #F8FAF8",
              }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "12px",
                    background: "#EBF5EB", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.8rem", fontWeight: 700, color: "#013220",
                  }}>{f.name.split(" ").map(n => n[0]).join("")}</div>
                  {f.online && <div style={{
                    position: "absolute", bottom: "0", right: "0", width: "10px", height: "10px",
                    borderRadius: "50%", background: "#2D6A4F", border: "2px solid white",
                  }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 700, color: "#013220", fontSize: "0.82rem" }}>{f.name}</span>
                    <span style={{ fontSize: "0.62rem", color: "#999" }}>{f.time}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2px" }}>
                    <span style={{
                      fontSize: "0.7rem", color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "150px",
                    }}>{f.lastMsg}</span>
                    {f.unread > 0 && <span style={{
                      background: "#013220", color: "white", borderRadius: "50%", width: "18px", height: "18px",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 700, flexShrink: 0,
                    }}>{f.unread}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {activeFarmer ? (
            <>
              {/* Header */}
              <div style={{
                display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.85rem 1rem",
                borderBottom: "1px solid #F4F6F3", flexShrink: 0,
              }}>
                <button onClick={() => setShowSidebar(true)} style={{
                  display: "none", background: "none", border: "none", cursor: "pointer", padding: 0,
                }} className="mobile-back-btn">
                  <ChevronLeft size={20} color="#013220" />
                </button>
                <style>{`@media(max-width:768px){.mobile-back-btn{display:flex!important;}}`}</style>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: "#EBF5EB", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.75rem", fontWeight: 700, color: "#013220", flexShrink: 0,
                }}>{activeFarmer.name.split(" ").map(n => n[0]).join("")}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: "#013220", fontSize: "0.85rem" }}>{activeFarmer.name}</div>
                  <div style={{ fontSize: "0.65rem", color: activeFarmer.online ? "#2D6A4F" : "#999" }}>
                    {activeFarmer.online ? "Online" : "Offline"}
                  </div>
                </div>
                <button style={{ background: "none", border: "none", cursor: "pointer" }}>
                  <Phone size={18} color="#013220" />
                </button>
              </div>

              {/* Messages */}
              <div style={{
                flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem",
              }}>
                {chatMsgs.map(msg => (
                  <div key={msg.id} style={{
                    display: "flex", justifyContent: msg.sender === "me" ? "flex-end" : "flex-start",
                  }}>
                    <div style={{
                      maxWidth: "75%", padding: "0.7rem 1rem", borderRadius: msg.sender === "me" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      background: msg.sender === "me" ? "#013220" : "#F4F6F3",
                      color: msg.sender === "me" ? "white" : "#333",
                      fontSize: "0.85rem", lineHeight: 1.4,
                    }}>
                      {msg.text}
                      <div style={{
                        display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "4px",
                        marginTop: "4px", fontSize: "0.6rem", opacity: 0.7,
                      }}>
                        {msg.time}
                        {msg.sender === "me" && <CheckCheck size={12} />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div style={{
                display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.85rem 1rem",
                borderTop: "1px solid #F4F6F3", flexShrink: 0,
              }}>
                <input type="text" placeholder="Type a message..." value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                  style={{
                    flex: 1, background: "#F4F6F3", border: "1px solid #E0EAE0", borderRadius: "12px",
                    padding: "0.75rem 1rem", outline: "none", fontSize: "0.85rem",
                  }} />
                <button onClick={handleSend} style={{
                  width: "42px", height: "42px", borderRadius: "12px", background: "#013220", color: "white",
                  border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s", flexShrink: 0,
                }}>
                  <Send size={18} />
                </button>
              </div>
            </>
          ) : (
            <div style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: "1rem", color: "#999", padding: "2rem",
            }}>
              <MessageCircle size={64} color="#ddd" />
              <div style={{ fontWeight: 700, color: "#013220", fontSize: "1.1rem" }}>Select a Farmer</div>
              <div style={{ fontSize: "0.85rem", textAlign: "center", maxWidth: "300px" }}>
                Choose a farmer from the sidebar to start chatting about your orders and fresh produce.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
