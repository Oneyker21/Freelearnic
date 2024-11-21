import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../connection/firebaseConfig';

const PanelPayClients = ({ route }) => {
    const [deposits, setDeposits] = useState([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const { clientId } = route.params;

    useEffect(() => {
        const clientAccountRef = doc(db, 'BankAccounts', 'GeneralAccount', 'ClientAccounts', clientId);
        const unsubscribeAccount = onSnapshot(clientAccountRef, (doc) => {
            if (doc.exists()) {
                setTotalBalance(doc.data().totalBalance);
            } else {
                console.log("No se encontró la cuenta del cliente.");
            }
        }, (error) => {
            console.error("Error al obtener el balance del cliente:", error);
        });

        const accountRef = doc(db, 'BankAccounts', '22802373');
        const depositsRef = collection(accountRef, 'Deposits');
        const q = query(depositsRef, where("userId", "==", clientId));
        const unsubscribeDeposits = onSnapshot(q, (snapshot) => {
            const depositsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setDeposits(depositsData);
        }, (error) => {
            console.error('Error al obtener los depósitos:', error);
        });

        return () => {
            unsubscribeAccount();
            unsubscribeDeposits();
        };
    }, [clientId]);

    const initializeClientAccount = async () => {
        const accountRef = doc(db, 'BankAccounts', 'GeneralAccount', 'ClientAccounts', clientId);

        try {
            await setDoc(accountRef, {
                accountNumber: "78983742",
                createdAt: serverTimestamp(),
                totalBalance: 19000,
                userId: clientId
            }, { merge: true });

            setTotalBalance(19000);
            console.log("Cuenta de cliente inicializada o actualizada correctamente.");
        } catch (error) {
            console.error("Error al inicializar la cuenta del cliente:", error);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: '#f4f4f8',
        },
        header: {
            fontSize: 22,
            fontWeight: 'bold',
            color: '#333',
            marginBottom: 20,
        },
        listItem: {
            backgroundColor: '#fff',
            padding: 15,
            borderRadius: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 3,
        },
        listItemText: {
            fontSize: 16,
            color: '#555',
        },
        totalBalance: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#1a73e8',
            marginTop: 20,
            textAlign: 'center',
        },
        button: {
            marginTop: 20,
            backgroundColor: '#007bff',
            padding: 10,
            borderRadius: 5,
        },
        buttonText: {
            color: '#fff',
            textAlign: 'center',
            fontSize: 18,
        }
    });

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Depósitos</Text>
            <FlatList
                data={deposits}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <Text style={styles.listItemText}>
                            {`Depósito: ${item.depositAmount}`}
                        </Text>
                        <Text style={styles.listItemText}>
                            {`Fecha: ${item.timestamp.toDate().toLocaleDateString()}`}
                        </Text>
                    </View>
                )}
            />
            <Text style={styles.totalBalance}>Balance Total: ${totalBalance}</Text>
            <TouchableOpacity style={styles.button} onPress={initializeClientAccount}>
                <Text style={styles.buttonText}>Inicializar Cuenta del Cliente</Text>
            </TouchableOpacity>
        </View>
    );
};

export default PanelPayClients;