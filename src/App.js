import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { faker } from '@faker-js/faker';

const App = () => {
  const [messages, setMessages] = useState(JSON.parse(localStorage.getItem('messages')) || []);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('');
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [senderName, setSenderName] = useState('');

  useEffect(() => {
    setSenderName(generateRandomName());
  }, []);

  const generateRandomName = () => {
    return faker.person.fullName();
  };

  const handleMessageSend = (event) => {
    if (event.key === 'Enter' || event.type === 'click') {
      if (inputValue.trim() === '') return;
      if (blockedUsers.includes(inputValue.trim())) {
        alert('You have been blocked for sending blocked messages!');
        return;
      }
      const newMessage = {
        id: uuidv4(),
        text: inputValue.trim(),
        sender: senderName,
        timestamp: new Date()
      };
      const newMessages = [...messages, newMessage];
      setMessages(newMessages);
      setInputValue('');
      localStorage.setItem('messages', JSON.stringify(newMessages));
    }
  };

  const handleFilterAdd = (event) => {
    if (event.key === 'Enter' || event.type === 'click') {
      if (filter.trim() === '') return;
      setBlockedUsers([...blockedUsers, filter.trim()]);
      setFilter('');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow flex flex-col">
        <div className="overflow-y-auto flex-grow">
          {messages.map(message => (
            <div key={message.id} className="border-b border-gray-300 p-2">
              <div className="font-semibold">{message.sender}</div>
              <div>{message.text}</div>
              {message.timestamp && (
                <div className="text-xs text-gray-500">
                  {format(message.timestamp, 'dd/MM/yyyy HH:mm')}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between p-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-grow border border-gray-300 rounded p-2 mr-2"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleMessageSend}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleMessageSend}
          >
            Send
          </button>
        </div>
      </div>
      <div className="p-2">
        <input
          type="text"
          placeholder="Add blocked message filter..."
          className="border border-gray-300 rounded p-2 mr-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          onKeyDown={handleFilterAdd}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleFilterAdd}
        >
          Add Filter
        </button>
      </div>
    </div>
  );
};

export default App;
