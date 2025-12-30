import { Header } from '../components/Header';
import { MessageCircle } from 'lucide-react';
import { useState, useRef, useEffect, FormEvent, ChangeEvent } from 'react';
import type { UserRole, CurrentPage } from '../../App';

interface Message {
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

interface ChatBotPageProps {
  isLoggedIn: boolean;
  userRole: UserRole;
  userName?: string;
  onLogin: (role: UserRole, username?: string) => void;
  onLogout: () => void;
  onNavigate: (page: CurrentPage) => void;
}

export default function ChatBotPage({
  isLoggedIn,
  userRole,
  userName,
  onLogin,
  onLogout,
  onNavigate,
}: ChatBotPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      text: "Aslema 👋 Je suis Zaraa, l'assistante d'ElBazar. Comment puis-je vous aider aujourd'hui ?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const faqAnswers: { [key: string]: string } = {
    livraison: 'Nos livraisons prennent entre 2 et 5 jours ouvrables. 📦',
    paiement: 'Nous acceptons la carte bancaire, D17, et e-dinar. 💳',
    retour: 'Tu peux retourner un article sous 14 jours. ↩️',
    support: 'Tu peux nous contacter via notre email ou WhatsApp. 📞',
    horaires: 'Notre service client est disponible de 9h à 18h du lundi au vendredi. ⏰',
    produits: "Nous avons une large gamme de produits allant de l'électronique aux vêtements. 🛍️",
    promotions: "Nous offrons des promotions spéciales chaque semaine, reste à l'affût ! 🎉",
  };

  const findAnswer = (question: string): string | null => {
    const questionLower = question.toLowerCase();
    for (const [key, answer] of Object.entries(faqAnswers)) {
      if (questionLower.includes(key)) {
        return answer;
      }
    }
    return null;
  };

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      type: 'user',
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const answer = findAnswer(inputValue);

    setTimeout(() => {
      const botMessage: Message = {
        type: 'bot',
        text: answer || 'Je ne suis pas sûre de votre question. Pouvez-vous reformuler ? 🤔',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/chatbot.png')" }} 
    >
      
      <div className="absolute inset-0 bg-black/40" />

      {/* Contenu */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          userName={userName}
          onLogin={onLogin}
          onLogout={onLogout}
          onNavigate={onNavigate}
          onRefreshSellers={() => {}}
        />

        {/* Chat Container */}
        <div className="max-w-2xl mx-auto mt-10 px-4 pb-12 flex-1">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px] border border-gray-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-4 flex items-center gap-3">
              <MessageCircle size={28} />
              <div>
                <h1 className="text-xl font-bold">Zaraa</h1>
                <p className="text-sm text-gray-300">Assistante ElBazar</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white/80">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-3 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-slate-800 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {msg.timestamp.toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-900 px-4 py-3 rounded-lg rounded-bl-none">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSendMessage}
              className="border-t border-gray-200 p-4 bg-white/90 flex gap-2 backdrop-blur-sm"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                placeholder="Posez votre question..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="bg-slate-800 hover:bg-slate-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition font-medium"
              >
                Envoyer
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
