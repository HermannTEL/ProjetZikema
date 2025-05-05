import { useState, useEffect, useRef, useCallback } from 'react'; 
import './messagingSystem.css';
import { useMessages, useUser, useTheme } from '../../../utils/hooks';
import { displayMessages } from '../../../utils/functions';
import styles from './filtering';
import { DarkMode, LightMode } from '@mui/icons-material';
import { Button } from '@/components/ui';
import FilteredUsersDropdown from './FilteredUsersDropdown';

const MessagingSystem = () => {
    const { fetchMessages, sendMessage, saveDraft, moveToTrash, restoreMessage, deleteMessage } = useMessages();
    const { fetchUsers } = useUser();
    const { theme, toggleTheme } = useTheme();

    const [messages, setMessages] = useState({
        inbox: [],
        sent: [],
        drafts: [],
        trash: []
    });
    const [currentView, setCurrentView] = useState('inbox');
    const [newMessage, setNewMessage] = useState({
        recipient: '',
        subject: '',
        body: ''
    });
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([])
    const [toInput, setToInput] = useState(''); 
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isContextOpen, setIsContextOpen] = useState(false);

    const inputRef = useRef(null);
    const contextRef = useRef(null);
    const user = JSON.parse(sessionStorage.getItem('user'));
    // console.log('User loaded', user);
    // console.log('Users loaded', users);

    
    // Styles basés sur le thème
    const themeStyles = {
        messagingSystem: {
            backgroundColor: theme === 'dark' ? '#1a1a1a' : '#463a2f',
        },
        sidebar: {
            backgroundColor: theme === 'dark' ? '#121212' : '#2c3e50',
            color: theme === 'dark' ? '#e0e0e0' : 'white',
        },
        messageView: {
            backgroundColor: theme === 'dark' ? '#2d2d2d' : '#bed1df',
        },
        messageList: {
            backgroundColor: theme === 'dark' ? '#1e1e1e' : 'white',
            boxShadow: theme === 'dark' ? '0 10px 25px rgba(0, 0, 0, 0.4)' : '0 10px 25px rgba(0, 0, 0, 0.1)',
        },
        messageItem: {
            backgroundColor: theme === 'dark' ? '#333' : 'white',
            color: theme === 'dark' ? '#e0e0e0' : 'inherit',
        },
        messageItemHover: {
            backgroundColor: theme === 'dark' ? '#444' : '#f1f2f6',
        },
        composeMessage: {
            backgroundColor: theme === 'dark' ? 'rgba(30, 30, 30, 0.8)' : 'rgba(11, 11, 11, 0.05)',
            color: theme === 'dark' ? '#e0e0e0' : 'inherit',
        },
        input: {
            backgroundColor: theme === 'dark' ? '#333' : 'white',
            color: theme === 'dark' ? '#e0e0e0' : 'inherit',
            borderColor: theme === 'dark' ? '#555' : '#bdc3c7',
        },
        headings: {
            color: theme === 'dark' ? '#e0e0e0' : '#34495e',
            marginBottom: '15px'
        },
        suggestions: {
            ...styles.suggestions,
            backgroundColor: theme === 'dark' ? '#333' : '#ffffff',
            borderColor: theme === 'dark' ? '#555' : '#ddd',
        },
        suggestionItem: {
            ...styles.suggestionItem,
            borderBottomColor: theme === 'dark' ? '#444' : '#eee',
        },
        suggestionItemHover: {
            backgroundColor: theme === 'dark' ? '#444' : '#f0f8ff',
        },
    };

    const userId = user._id;

    const loadMessages = useCallback(async (userId) => {
        try {
            let inboxMessages = await fetchMessages(userId, {view: 'inbox'});
            inboxMessages = inboxMessages.messages;
            setMessages((prev) => ({ ...prev, inbox: inboxMessages }));
    
            let sentMessages = await fetchMessages(userId, {view: 'sent'});
            sentMessages = sentMessages.messages;
            setMessages((prev) => ({ ...prev, sent: sentMessages }));
    
            let draftMessages = await fetchMessages(userId, {view: 'drafts'});
            draftMessages = draftMessages.messages;
            setMessages((prev) => ({ ...prev, drafts: draftMessages }));
    
            let trashMessages = await fetchMessages(userId, {view: 'trash'});
            trashMessages = trashMessages.messages;
            setMessages((prev) => ({ ...prev, trash: trashMessages }));
    
            let usersArray = await fetchUsers();
            // console.log('usersArray: ', usersArray)
            setUsers(usersArray);

        } catch (error) {
            console.error('Failed to load messages:', error);
        }
    }, [fetchMessages, fetchUsers, setMessages]);
    
    useEffect(() => {
        loadMessages(userId);
    }, [currentView, newMessage]);

    const handleInputChange = (e) => {
        const inputValue = e.target.value.toLowerCase();
        setToInput(inputValue);

        if (inputValue.length > 0) {
            const filtered = users.filter(user =>
                user.firstname.toLowerCase().includes(inputValue) ||
                user.lastname.toLowerCase().includes(inputValue) ||
                user.email.toLowerCase().includes(inputValue)
            );
            setFilteredUsers(filtered);
            setIsContextOpen(true);
        } else {
            setIsContextOpen(false);
        }
    };

    const handleSelectUser = (user) => {
        setNewMessage({recipient: user._id})
        setToInput(`${user.firstname} ${user.lastname}`);
        setFilteredUsers([]);
        setIsContextOpen(false);
    };

    const handleClickOutside = (event) => {
        if (
            contextRef.current &&
            !contextRef.current.contains(event.target) && 
            inputRef.current && 
            !inputRef.current.contains(event.target)
        ) {
            setIsContextOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSendMessage = async (id, draft = false) => {
        if (!newMessage.recipient || !newMessage.subject || !newMessage.body) {
            alert('Please fill out all fields before sending the message.');
            return;
        }

        const newSentMessage = {
            ...newMessage,
            sender: userId,
            date: new Date(),
        };

        try {
            const savedMessage = await sendMessage(newSentMessage);

            if (draft)  {
                await deleteMessage(id);
                const updatedDrafts = messages.drafts.filter((draftMessage) => draftMessage._id !== id);
                setMessages(updatedDrafts);
            }

            setMessages((prevMessages) => ({
                ...prevMessages,
                sent: [...prevMessages.sent, savedMessage],
                inbox: [...prevMessages.inbox, { ...savedMessage, sender: userId, recipient: newMessage.recipient }],
            }));

            setNewMessage({ recipient: '', subject: '', body: '' });
            changeView('sent');
        } catch (error) {
            console.error('Error sending message:', error);
            alert('An error occurred while sending the message. Please try again.');
        }
    };

    const handleSaveDraft = async () => {
        const newDraft = {
            ...newMessage,
            sender: userId,
            date: new Date(),
        };

        const savedDraft = await saveDraft(newDraft);
        setMessages({
            ...messages,
            drafts: [...messages.drafts, savedDraft],
        });
        setNewMessage({ recipient: '', subject: '', body: '' });
        changeView('drafts');
    };

    const handleEditDraft = (draft) => {
        setNewMessage({
            recipient: draft.recipient,
            subject: draft.subject,
            body: draft.body,
        });
        setToInput(draft.recipient.lastname);
        changeView('compose');
    };

    const handleSendDraft = async (id) => {
        await handleSendMessage(id, true);
    };
    
    const handleDeleteMessage = async (view, id) => {
        await moveToTrash(id, userId);

        setMessages({
            ...messages,
            [view]: messages[view].filter(msg => msg._id !== id),
            trash: [...messages.trash, messages[view].find(msg => msg._id === id)],
        });
        setSelectedMessage(null);
    };

    const handleRestoreMessage = async (id) => {
        try {
            const restoredMessage = await restoreMessage(id, userId);
    
            if (!restoredMessage) {
                console.error('Le message restauré est indéfini.');
                return;
            }
    
            if (restoredMessage.message?.sender === userId) {
                if (!restoredMessage.trashStatus?.sender || restoredMessage.draftStatus?.sender) {
                    setMessages({
                        ...messages,
                        drafts: [...messages.drafts, restoredMessage],
                        trash: messages.trash.filter(msg => msg._id !== id),
                    });
                } 
                if (!restoredMessage.trashStatus?.sender || !restoredMessage.draftStatus?.sender) {
                    setMessages({
                        ...messages,
                        sent: [...messages.sent, restoredMessage],
                        trash: messages.trash.filter(msg => msg._id !== id),
                    });
                }
            } 
            if (restoredMessage.message?.recipient === userId) {   
                setMessages({
                    ...messages,
                    inbox: [...messages.inbox, restoredMessage],
                    trash: messages.trash.filter(msg => msg._id !== id),
                });
            }
        } catch (error) {
            console.error('Erreur lors de la restauration du message:', error);
        }
    };

    const handlePermanentDeleteMessage = async (id) => {
        await deleteMessage(id, userId);

        setMessages({
            ...messages,
            trash: messages.trash.filter(msg => msg._id !== id),
        });
    };

    const changeView = (view) => {
        setCurrentView(view);
        setSelectedMessage(null);
        setSearchQuery('');
    };

    return (
        <div className="messaging-system" style={themeStyles.messagingSystem}>
            <div className="sidebar_message" style={themeStyles.sidebar}>
                <h2 className="flow-gradient flow-shadow flow-animation">Flow</h2>
                <button onClick={() => changeView('inbox')}>
                    <i className="bi bi-inbox"></i>
                    Inbox ({messages.inbox.length})
                </button>
                <button onClick={() => changeView('sent')}>
                    <i className="bi bi-send"></i>
                    Sent ({messages.sent.length})
                </button>
                <button onClick={() => changeView('drafts')}>
                    <i className="bi bi-journal-text"></i>
                    Drafts ({messages.drafts.length})
                </button>
                <button onClick={() => changeView('trash')}>
                    <i className="bi bi-trash3-fill"></i>
                    Trash ({messages.trash.length})
                </button>
                <button onClick={() => changeView('compose')}>
                    <i className="bi bi-envelope"></i>
                    New Message
                </button>
            </div>

            <div className="message-view" style={themeStyles.messageView}>
                <div className="flex items-center justify-between">
                    {currentView !== "compose" && (
                        <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search by subject or recipient"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={themeStyles.input}
                        />
                        </div>
                    )}

                    <Button
                        className={
                        `rounded-3xl transition duration-300 ease-in-out shadow-md mr-6 mb-2
                        ${theme === "dark"
                            ? "bg-slate-700 text-amber-500 hover:shadow-amber-300 hover:bg-amber-100"
                            : "bg-sky-200 text-slate-600 hover:shadow-slate-900 hover:bg-slate-800 "
                        }`}
                        style={{
                            marginLeft: currentView === "compose" ? '90%' : undefined,
                            marginBottom: currentView === "compose" ? '20%' : undefined,
                        }}
                        onClick={toggleTheme}
                    >
                        {theme === "light" ? <DarkMode /> : <LightMode />}
                    </Button>
                </div>

                {currentView === 'compose' ? (
                    <div className="compose-message" style={themeStyles.composeMessage}>
                        <h3 style={themeStyles.headings}>Compose New Message</h3>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="To"
                            value={toInput}
                            onChange={handleInputChange}
                            style={{...styles.input, ...themeStyles.input}}
                        />

                        <FilteredUsersDropdown isContextOpen={isContextOpen} filteredUsers={filteredUsers} handleSelectUser={handleSelectUser} theme={theme} contextRef={contextRef} />
                        
                        {/* <div style={styles.filteredContainer}>
                            {isContextOpen && filteredUsers.length > 0 && (
                                <ul ref={contextRef} style={themeStyles.suggestions}>
                                    {filteredUsers.map(user => (
                                        <li
                                            key={user._id}
                                            onClick={() => handleSelectUser(user)}
                                            style={themeStyles.suggestionItem}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = themeStyles.suggestionItemHover.backgroundColor}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = ''}
                                        >
                                            <span style={{...styles.name, color: theme === 'dark' ? '#e0e0e0' : '#333'}}>{user.firstname} {user.lastname}</span>
                                            <span style={{...styles.email, color: theme === 'dark' ? '#aaa' : '#777'}}>{user.email}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div> */}

                        <input
                            type="text"
                            placeholder="Subject"
                            value={newMessage.subject}
                            onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                            style={themeStyles.input}
                        />
                        <textarea
                            placeholder="Message body"
                            value={newMessage.body}
                            onChange={(e) => setNewMessage({ ...newMessage, body: e.target.value })}
                            style={themeStyles.input}
                        />
                        <button onClick={handleSendMessage} disabled={!newMessage.recipient || !newMessage.subject || !newMessage.body}>Send</button>
                        <button onClick={handleSaveDraft}>Save as Draft</button>
                    </div>
                ) : (
                    <div className="message-list" style={themeStyles.messageList}>
                        <h3 style={themeStyles.headings}>{currentView.charAt(0).toUpperCase() + currentView.slice(1)} Messages</h3>
                        <ul>
                            {displayMessages(
                                currentView, 
                                messages, 
                                selectedMessage, 
                                setSelectedMessage, 
                                searchQuery, 
                                handleDeleteMessage, 
                                handleRestoreMessage, 
                                handlePermanentDeleteMessage, 
                                handleEditDraft, 
                                handleSendDraft,
                                theme,
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagingSystem;