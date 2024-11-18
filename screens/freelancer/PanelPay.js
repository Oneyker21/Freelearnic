import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import { doc, onSnapshot, collection, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../connection/firebaseConfig';

const PanelPay = ({ route }) => {
    const [totalBalance, setTotalBalance] = useState(0);
    const [deposits, setDeposits] = useState([]);
    const { freelancerId } = route.params;

    useEffect(() => {
        if (!freelancerId) {
            console.error("Freelancer ID es undefined");
            return;
        }

        const freelancerAccountRef = doc(db, 'BankAccounts', 'GeneralAccount', 'FreelancerAccounts', freelancerId);

        // Escucha en tiempo real para cambios en el documento del balance
        const unsubscribeBalance = onSnapshot(freelancerAccountRef, (doc) => {
            if (doc.exists()) {
                setTotalBalance(doc.data().totalBalance);
            } else {
                console.log("No se encontró la cuenta del freelancer.");
            }
        }, (error) => {
            console.error("Error al obtener el balance del freelancer:", error);
        });

        // Consulta para obtener los depósitos realizados al freelancer
        const depositsRef = collection(db, 'BankAccounts', 'GeneralAccount', 'FreelancerAccounts', freelancerId, 'Deposits');
        const q = query(depositsRef, where("toFreelancerId", "==", freelancerId));
        const unsubscribeDeposits = onSnapshot(q, (snapshot) => {
            const loadedDeposits = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setDeposits(loadedDeposits);
        }, (error) => {
            console.error('Error al obtener los depósitos:', error);
        });

        // Limpiar las suscripciones cuando el componente se desmonte
        return () => {
            unsubscribeBalance();
            unsubscribeDeposits();
        };
    }, [freelancerId]);

    const addDeposit = async (freelancerId, amount) => {
        try {
            const depositsRef = collection(db, 'BankAccounts', 'GeneralAccount', 'FreelancerAccounts', freelancerId, 'Deposits');
            await addDoc(depositsRef, {
                toFreelancerId: freelancerId,
                amount,
                timestamp: serverTimestamp()
            });
            console.log("Depósito agregado correctamente.");
        } catch (error) {
            console.error("Error al agregar el depósito:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.balanceText}>Balance Total: ${totalBalance}</Text>
            <FlatList
        data={deposits}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
            <Text>
                {`Depósito: $${item.amount}, Fecha: ${
                    item.timestamp 
                        ? item.timestamp.toDate().toLocaleDateString() 
                        : 'Fecha no disponible'
                }`}
            </Text>
        )}
    />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    balanceText: {
        fontSize: 24,
        fontWeight: 'bold'
    }
});

export default PanelPay;
