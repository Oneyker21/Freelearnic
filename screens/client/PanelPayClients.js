import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
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

    return (
        <View>
            <Text>Depósitos</Text>
            <FlatList
                data={deposits}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <Text>{`Depósito: ${item.depositAmount}, Fecha: ${item.timestamp.toDate().toLocaleDateString()}`}</Text>
                )}
            />
            <Text>Balance Total: ${totalBalance}</Text>
            <Button
                title="Inicializar Cuenta del Cliente"
                onPress={initializeClientAccount}
            />
        </View>
    );
};

export default PanelPayClients;