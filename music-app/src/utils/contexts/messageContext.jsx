import { createContext, useCallback, useState } from 'react';
import { useFetch } from '../hooks/calls';
import PropTypes from 'prop-types';

// Créer le contexte des messages
const MessagesContext = createContext();

// Provider pour le contexte
const MessagesProvider = ({ children }) => {
    const { fetchData, isLoading, error } = useFetch();

    // État pour stocker les messages
    const [inboxMessages, setInboxMessages] = useState([]);
    const [sentMessages, setSentMessages] = useState([]);
    const [drafts, setDrafts] = useState([]);
    const [trashMessages, setTrashMessages] = useState([]);

    // Méthodes pour les opérations de message

    const fetchMessages = useCallback(async (userId, view) => {
        const res = await fetchData(`http://localhost:5006/api/messages/get_messages/${userId}`, 'POST', view);
        // console.log('message data: ', data)
        if (res) setInboxMessages(res.messages);
        return res;
    }, [fetchData]);

    // Récupérer les messages de la boîte de réception
    const fetchInboxMessages = useCallback(async (userId) => {
        const res = await fetchData(`http://localhost:5006/api/messages/inbox/${userId}`, 'GET');
        // console.log('message data: ', data)
        if (res) setInboxMessages(res.messages);
        return res;
    }, [fetchData]);

    const fetchDrafts = useCallback(async (userId) => {
        const res = await fetchData(`http://localhost:5006/api/messages/getDrafts/${userId}`, 'GET');
        // console.log('message data for draft: ', res)
        if (res) setSentMessages(res.messages);
        return res;
    }, [fetchData]);

    const fetchTrash = useCallback(async (userId) => {
        const res = await fetchData(`http://localhost:5006/api/messages/getTrash/${userId}`, 'GET');
        // console.log('message data for trash: ', res)

        if (res) setSentMessages(res.messages);
        return res;
    }, [fetchData]);

    // Récupérer les messages envoyés
    const fetchSentMessages = useCallback(async (userId) => {
        const res = await fetchData(`http://localhost:5006/api/messages/sent/${userId}`, 'GET');
        if (res) setSentMessages(res.messages);
        return res;
    }, [fetchData]);

    // Enregistrer un brouillon
    const saveDraft = useCallback(async (messageData) => {
        const res = await fetchData('http://localhost:5006/api/messages/draft', 'POST', messageData);
        if (res) setDrafts((prevDrafts) => [...prevDrafts, res]);
        return res;
    }, [fetchData]);

    // Envoyer un message
    const sendMessage = useCallback(async (data) => {
        // console.log('Send message data: ', data);
        const res = await fetchData('http://localhost:5006/api/messages/send', 'POST', data);
        if (res) setSentMessages((prevSent) => [...prevSent, res]);
        return res;
    }, [fetchData]);

    // Déplacer un message vers la corbeille
    const moveToTrash = useCallback(async (messageId, userId) => {

        await fetchData(`http://localhost:5006/api/messages/trash/${messageId}/&/${userId}`, 'PUT');
        setInboxMessages((prev) => prev.filter((msg) => msg._id !== messageId));
        setSentMessages((prev) => prev.filter((msg) => msg._id !== messageId));
        // Si tu veux gérer une liste de messages dans la corbeille
        setTrashMessages((prev) => [...prev, ...inboxMessages.filter((msg) => msg._id === messageId)]);
    },[fetchData, inboxMessages]);

    // Restaurer un message de la corbeille
    const restoreMessage = useCallback(async (messageId, userId) => {
        const res = await fetchData(`http://localhost:5006/api/messages/restore/${messageId}/&/${userId}`, 'PUT');
        setTrashMessages((prev) => prev.filter((msg) => msg._id !== messageId));
        return res;
    }, [fetchData]);

    // Supprimer définitivement un message
    const deleteMessage = useCallback(async (messageId, userId) => {
        await fetchData(`http://localhost:5006/api/messages/delete/${messageId}/&/${userId}`, 'DELETE');
        setTrashMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    }, [fetchData])
    return (
        <MessagesContext.Provider
            value={{
                inboxMessages,
                sentMessages,
                drafts,
                trashMessages,
                fetchMessages,
                fetchInboxMessages,
                fetchSentMessages,
                fetchDrafts,
                fetchTrash,
                saveDraft,
                sendMessage,
                moveToTrash,
                restoreMessage,
                deleteMessage,
                isLoading,
                error
            }}
        >
            {children}
        </MessagesContext.Provider>
    );
};

MessagesProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export {MessagesContext, MessagesProvider};
