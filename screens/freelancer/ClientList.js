import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, Animated, Dimensions } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';
import { db } from '../../connection/firebaseConfig';

const { width } = Dimensions.get('window');

const ClientList = ({ navigation, route }) => {
    const [clients, setClients] = useState([]);
    const { freelancerId } = route.params;
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchInputWidth] = useState(new Animated.Value(0));

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

    const handleStartChat = (clientId,firstName, lastName, profilePic) => { // 'clientId' es el ID del cliente seleccionado
        navigation.navigate('ChatScreen', { 
        userId: freelancerId,
        otherUserId: clientId,
        otherUserName: `${firstName} ${lastName}`,
        otherUserPic: profilePic
    });
    };

    const filteredClients = clients.filter(client => {
        const fullName = `${client.firstName || ''} ${client.lastName || ''}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
    });

    const toggleSearch = () => {
        setIsSearchVisible(!isSearchVisible);

        Animated.spring(searchInputWidth, {
            toValue: isSearchVisible ? 0 : width * 0.8, // 80% del ancho de la pantalla
            useNativeDriver: false,
        }).start();
    };

    const clearSearch = () => {
        setSearchQuery('');
        setIsSearchVisible(false);
        Animated.spring(searchInputWidth, {
            toValue: 0,
            useNativeDriver: false,
        }).start();
    };

    return (
        <SafeAreaView style={styles.backgroundContainer}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Mensajes</Text>
            <FontAwesome 
                name="search" 
                size={24} 
                color="#fff" 
                style={styles.searchIcon} 
                onPress={toggleSearch} 
            />
        </View>

        {isSearchVisible && (
                <Animated.View style={[styles.searchContainer, { width: searchInputWidth }]}>
                    <FontAwesome 
                        name="arrow-left" 
                        size={20} 
                        color="#666" 
                        style={styles.backIcon} 
                        onPress={clearSearch} 
                    />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar chats..."
                        placeholderTextColor="#666"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </Animated.View>
            )}   
            <View style={styles.chatContainer}>
            <FlatList
                data={filteredClients}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                    style={styles.card} 
                    onPress={() => handleStartChat(item.id, item.firstName, item.lastName, item.profilePic)}
                >
                    <View style={styles.iconContainer}>
                        {item.profilePic ? (
                            <Image
                                source={{ uri: item.profilePic }}
                                style={{ width: 40, height: 40, borderRadius: 20 }}
                            />
                        ) : (
                            <FontAwesome name="user-circle" size={40} color="#666" />
                        )}
                    </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.name}>
                                {item.firstName || ''} {item.lastName || ''}
                            </Text>
                            {item.hasNewMessages && (
                                <View style={styles.newMessageIndicator}>
                                    <Text style={styles.newMessageText}>Nuevo</Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    </SafeAreaView>
);
};
const styles = StyleSheet.create({
    backgroundContainer: {
        flex: 1,
        backgroundColor: '#107ACC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#107ACC',
        paddingVertical: width * 0.04, // 4% del ancho de la pantalla
        paddingHorizontal: width * 0.05, // 5% del ancho de la pantalla
    },
    headerTitle: {
        color: '#ffffff',
        fontSize: width * 0.05, // 5% del ancho de la pantalla
        fontWeight: 'bold',
    },
    searchIcon: {
        padding: width * 0.01,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        marginHorizontal: width * 0.05, // 5% del ancho de la pantalla
        marginTop: width * 0.02, // 2% del ancho de la pantalla
        borderRadius: 20,
        backgroundColor: '#fff',
    },
    backIcon: {
        paddingLeft: width * 0.02, // 2% del ancho de la pantalla
        paddingRight: width * 0.01, // 1% del ancho de la pantalla
    },
    searchInput: {
        flex: 1,
        padding: width * 0.03, // 3% del ancho de la pantalla
        fontSize: width * 0.04, // 4% del ancho de la pantalla
        color: '#333',
    },
    chatContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: width * 0.06,
        borderTopRightRadius: width * 0.06,
        padding: width * 0.03, // 3% del ancho de la pantalla
        marginTop: width * 0.045, 
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: width * 0.02, // 2% del ancho de la pantalla
        padding: width * 0.03, // 3% del ancho de la pantalla
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: '#ffffff',
        borderRadius: width * 0.001,
        marginVertical: width * 0.01, // 1% del ancho de la pantalla
    },
    iconContainer: {
        marginRight: width * 0.03, // 3% del ancho de la pantalla
    },
    infoContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    name: {
        fontSize: width * 0.04, // 4% del ancho de la pantalla
        fontWeight: 'bold',
        color: '#333',
    },
    newMessageIndicator: {
        backgroundColor: '#007AFF',
        borderRadius: 5,
        paddingHorizontal: width * 0.02, // 2% del ancho de la pantalla
        paddingVertical: width * 0.01, // 1% del ancho de la pantalla
        marginLeft: width * 0.02, // 2% del ancho de la pantalla
    },
    newMessageText: {
        color: '#ffffff',
        fontSize: width * 0.03, // 3% del ancho de la pantalla
        fontWeight: 'bold',
    },
});



export default ClientList; 