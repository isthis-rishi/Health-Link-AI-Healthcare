import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { createSymptomChat, updateSymptomChat } from "../../services/database";
import { sendSymptomQuery } from "../../services/healthService";
import { FiSend, FiAlertTriangle, FiCheckCircle, FiClock, FiHeart, FiRefreshCw, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const SymptomChecker = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [triageResult, setTriageResult] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const greeting = "Hello! I'm your Health Link assistant. I'll help assess your symptoms and guide you to the right care.\n\nPlease describe what you're experiencing — any pain, discomfort, or unusual symptoms.";
    setMessages([{ role: "assistant", content: greeting }]);
    createSymptomChat(currentUser.uid)
      .then((id) => setChatId(id))
      .catch(console.error);
  }, [currentUser]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);
    inputRef.current?.focus();

    try {
      const conversationMsgs = updated.slice(1);
      const result = await sendSymptomQuery(conversationMsgs);

      if (result.message) {
        const allMessages = [...updated, { role: "assistant", content: result.message }];
        setMessages(allMessages);

        if (result.triageResult) {
          setTriageResult(result.triageResult);
          if (chatId) await updateSymptomChat(chatId, allMessages, result.triageResult);
        } else if (chatId) {
          await updateSymptomChat(chatId, allMessages);
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I'm having trouble right now. Please try again in a moment.\n\nError: " + err.message
        }
      ]);
    }

    setLoading(false);
  };

  const startNewChat = () => {
    setMessages([]);
    setTriageResult(null);
    setChatId(null);
    const greeting = "Hello! Describe your symptoms and I'll help assess them.";
    setMessages([{ role: "assistant", content: greeting }]);
    createSymptomChat(currentUser.uid).then((id) => setChatId(id));
  };

  const triageConfig = {
    EMERGENCY: { color: "from-red-500 to-red-600", bg: "bg-red-50 border-red-200", text: "text-red-700", icon: <FiAlertTriangle className="w-5 h-5" /> },
    URGENT: { color: "from-orange-500 to-orange-600", bg: "bg-orange-50 border-orange-200", text: "text-orange-700", icon: <FiClock className="w-5 h-5" /> },
    ROUTINE: { color: "from-blue-500 to-blue-600", bg: "bg-blue-50 border-blue-200", text: "text-blue-700", icon: <FiCheckCircle className="w-5 h-5" /> },
    "SELF-CARE": { color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", icon: <FiHeart className="w-5 h-5" /> }
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-3 sm:py-4 h-[calc(100vh-4rem)] flex flex-col">
      
      <div className="flex items-center justify-between mb-3 sm:mb-4 flex-shrink-0">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Symptom Checker</h1>
          <p className="text-xs sm:text-sm text-gray-500">Smart health assessment</p>
        </div>
        <button
          onClick={startNewChat}
          className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition"
        >
          <FiRefreshCw className="w-3.5 h-3.5" /> New
        </button>
      </div>
      {triageResult &&
        (() => {
          const cfg = triageConfig[triageResult.level] || triageConfig.ROUTINE;
          return (
            <div className={`mb-3 p-3 sm:p-4 rounded-2xl border ${cfg.bg} animate-scale-in flex-shrink-0`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${cfg.color} rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
                  {cfg.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`font-bold text-sm ${cfg.text}`}>Triage: {triageResult.level}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{triageResult.summary}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {triageResult.level === "EMERGENCY" && (
                      <Link
                        to="/patient/sos"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700"
                      >
                        <FiAlertTriangle className="w-3 h-3" /> Trigger SOS
                      </Link>
                    )}
                    {(triageResult.level === "ROUTINE" || triageResult.level === "URGENT") && (
                      <Link
                        to="/patient/appointments"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"
                      >
                        Book Appointment <FiArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1 min-h-0">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
            <div
              className={`max-w-[85%] sm:max-w-[80%] px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-primary-600 to-primary-700 text-white chat-user shadow-sm shadow-primary-200/40"
                  : "bg-white border border-gray-100 text-gray-800 chat-ai shadow-sm"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-5 h-5 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                    <FiHeart className="w-2.5 h-2.5 text-primary-600" />
                  </div>
                  <span className="text-[11px] font-semibold text-primary-600">Health Link</span>
                </div>
              )}
              <p className="whitespace-pre-wrap text-[13px] sm:text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white border border-gray-100 rounded-2xl chat-ai px-4 py-3 shadow-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex-shrink-0 safe-bottom">
        <div className="bg-white border border-gray-200 rounded-2xl p-1.5 sm:p-2 flex items-end gap-2 shadow-lg shadow-gray-200/50">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Describe your symptoms..."
            rows={1}
            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 resize-none outline-none text-sm max-h-28 overflow-y-auto"
            style={{ minHeight: "42px" }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="p-2.5 sm:p-3 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-xl hover:shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <FiSend className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        <p className="text-[11px] text-gray-400 text-center mt-1.5">
          This does not replace professional medical advice.
        </p>
      </div>
    </div>
  );
};

export default SymptomChecker;
