import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { db } from '../../connection/firebaseConfig';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, setDoc, getDoc } from 'firebase/firestore';

const ChatScreen = ({ route }) => {
    const { userId, otherUserId } = route.params; // Recibir los IDs desde los parámetros de navegación

    console.log("UserID:", userId); // Depurar el valor de userId
    console.log("OtherUserID:", otherUserId); // Depurar el valor de otherUserId

    const [messages, setMessages] = useState([]);

    // Función para obtener o crear un chatId
    const getOrCreateChatId = async () => {
        if (!userId || !otherUserId) {
            console.error("Uno de los IDs es undefined:", userId, otherUserId);
            return null; // Retornar null si alguno de los IDs es undefined
        }
        const ids = [userId, otherUserId].sort();
        const potentialChatId = `${ids[0]}_${ids[1]}`;
        const chatRef = doc(db, 'chats', potentialChatId);
        const chatSnap = await getDoc(chatRef);

        if (!chatSnap.exists()) {
            // Si el chat no existe, lo creamos
            await setDoc(chatRef, { participantes: ids });
        }
        return potentialChatId;
    };

    useEffect(() => {
        getOrCreateChatId().then(chatId => {
            if (!chatId) return; // No hacer nada si chatId es null
            const q = query(collection(db, 'chats', chatId, 'mensajes'), orderBy('createdAt', 'desc'));

            const unsubscribe = onSnapshot(q, (snapshot) => {
                setMessages(snapshot.docs.map(doc => ({
                    _id: doc.id,
                    text: doc.data().text,
                    createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date(), // Usar fecha actual como fallback
                    user: {
                        _id: doc.data().senderID,
                        name: "Nombre del Usuario", // Idealmente, deberías buscar el nombre real del usuario
                    },
                })));
            });
            return () => unsubscribe();
        });
    }, []);

    const onSend = useCallback((messages = []) => {
        getOrCreateChatId().then(chatId => {
            if (!chatId) return; // No hacer nada si chatId es null
            messages.forEach(async (message) => {
                await addDoc(collection(db, 'chats', chatId, 'mensajes'), {
                    text: message.text,
                    createdAt: serverTimestamp(),
                    senderID: userId, // Usar el ID del usuario actual
                });
            });
        });
    }, []);

    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: userId, // ID del usuario actual
            }}
        />
    );
};

export default ChatScreen;

