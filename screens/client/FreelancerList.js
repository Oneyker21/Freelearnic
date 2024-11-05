import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../connection/firebaseConfig';

const FreelancerList = ({ navigation, route }) => {
    const [freelancers, setFreelancers] = useState([]);
    const { clientId } = route.params; // ID del cliente que está usando la app

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "Freelancers"), (snapshot) => {
            const loadedFreelancers = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setFreelancers(loadedFreelancers);
        });

        return () => unsubscribe();
    }, []);

    const handleStartChat = (freelancerId) => {
        navigation.navigate('ChatScreen', { userId: clientId, otherUserId: freelancerId});
    };

    return (
        <FlatList
            data={freelancers}
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

export default FreelancerList; 