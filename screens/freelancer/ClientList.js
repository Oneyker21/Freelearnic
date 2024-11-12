import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../connection/firebaseConfig';

const ClientList = ({ navigation, route }) => {
    const [clients, setClients] = useState([]);
    const { freelancerId } = route.params; // ID del freelancer actual que está usando la app

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "Clients"), (snapshot) => { // Asegúrate de que la colección sea 'clients'
            const loadedClients = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setClients(loadedClients);
        });

        return () => unsubscribe();
    }, []);

    const handleStartChat = (clientId) => { // 'clientId' es el ID del cliente seleccionado
        navigation.navigate('ChatScreen', { userId: freelancerId, otherUserId: clientId });
    };

    return (
        <FlatList
            data={clients}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                    <Text>{item.firstName} {item.lastName}</Text>
                    <Button title="Chatear" onPress={() => handleStartChat(item.id)} />
                </View>
            )}
        />
    );
};

export default ClientList; 