import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import { chatbotService } from '../../services/chatbotService';

// Helper function to format markdown-like text
const formatMessage = (text) => {
    // Convert **text** to bold with Tailwind classes
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');

    // Convert bullet points to proper list items
    formatted = formatted.replace(/^• (.+)$/gm, '<li class="ml-4 list-disc">$1</li>');

    // Wrap consecutive list items in ul tags with proper spacing
    formatted = formatted.replace(/(<li class="ml-4 list-disc">.*<\/li>\s*)+/gs, '<ul class="my-2 space-y-1">$&</ul>');

    // Convert line breaks to <br> tags
    formatted = formatted.replace(/\n/g, '<br>');

    return formatted;
};

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            message: chatbotService.getConversationStarters()[0],
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize speech recognition
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (SpeechRecognition) {
                setSpeechSupported(true);
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = false;
                recognitionRef.current.interimResults = false;
                recognitionRef.current.lang = 'en-US';

                recognitionRef.current.onstart = () => {
                    setIsListening(true);
                };

                recognitionRef.current.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    setInputMessage(transcript);
                    setIsListening(false);
                };

                recognitionRef.current.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                    setIsListening(false);

                    // Show user-friendly error message
                    if (event.error === 'not-allowed') {
                        alert('Microphone access denied. Please allow microphone access to use voice input.');
                    } else if (event.error === 'no-speech') {
                        alert('No speech detected. Please try again.');
                    }
                };

                recognitionRef.current.onend = () => {
                    setIsListening(false);
                };
            }
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, []);

    const quickReplies = chatbotService.getQuickReplies();

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            message: inputMessage,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        // Simulate typing delay
        setTimeout(() => {
            const botResponse = {
                id: Date.now() + 1,
                type: 'bot',
                message: chatbotService.findResponse(inputMessage),
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1000 + Math.random() * 1000); // 1-2 second delay
    };

    const handleQuickReply = (reply) => {
        setInputMessage(reply);
        setTimeout(() => handleSendMessage(), 100);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleVoiceInput = () => {
        if (!speechSupported) {
            alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
            return;
        }

        if (isListening) {
            // Stop listening
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            // Start listening
            try {
                recognitionRef.current?.start();
            } catch (error) {
                console.error('Failed to start speech recognition:', error);
                alert('Failed to start voice input. Please try again.');
            }
        }
    };

    return (
        <>
            {/* Chatbot Toggle Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${isOpen
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-primary hover:bg-primary/90'
                        }`}
                    aria-label={isOpen ? 'Close chat' : 'Open chat support'}
                >
                    {isOpen ? (
                        <Icon name="X" size={24} color="white" />
                    ) : (
                        <Icon name="MessageCircle" size={24} color="white" />
                    )}
                </button>
            </div>

            {/* Chatbot Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl border border-border z-40 flex flex-col">
                    {/* Header */}
                    <div className="bg-primary text-white p-4 rounded-t-lg flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <Icon name="Bot" size={16} color="white" />
                        </div>
                        <div>
                            <h3 className="font-semibold">CiviBot</h3>
                            <p className="text-xs text-white/80">Civic Assistant • Online</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.type === 'user'
                                        ? 'bg-primary text-white rounded-br-none'
                                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                        }`}
                                >
                                    {msg.type === 'bot' ? (
                                        <div
                                            dangerouslySetInnerHTML={{ __html: formatMessage(msg.message) }}
                                            className="bot-message leading-relaxed"
                                            style={{
                                                lineHeight: '1.5'
                                            }}
                                        />
                                    ) : (
                                        <div className="whitespace-pre-line">{msg.message}</div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Quick Replies */}
                        {messages.length === 1 && !isTyping && (
                            <div className="space-y-2">
                                <p className="text-xs text-gray-500 text-center">Quick questions:</p>
                                <div className="flex flex-wrap gap-2">
                                    {quickReplies.map((reply, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleQuickReply(reply)}
                                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                                        >
                                            {reply}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-border">
                        <div className="flex space-x-2">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={isListening ? "Listening..." : "Ask me anything about civic reporting..."}
                                    className="w-full px-3 py-2 pr-10 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    disabled={isTyping || isListening}
                                />
                                {/* Microphone Button */}
                                {speechSupported && (
                                    <button
                                        onClick={handleVoiceInput}
                                        disabled={isTyping}
                                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-all duration-200 ${isListening
                                                ? 'bg-red-100 text-red-600 animate-pulse'
                                                : 'text-gray-400 hover:text-primary hover:bg-gray-100'
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        title={isListening ? "Stop listening" : "Click to speak"}
                                    >
                                        <Icon
                                            name={isListening ? "MicOff" : "Mic"}
                                            size={16}
                                        />
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputMessage.trim() || isTyping}
                                className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Icon name="Send" size={16} />
                            </button>
                        </div>

                        {/* Voice Input Status */}
                        {isListening && (
                            <div className="mt-2 flex items-center justify-center space-x-2 text-sm text-red-600">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                <span>Listening... Speak now</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;