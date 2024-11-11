import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../connection/firebaseConfig';

const PanelPay = ({ route }) => {
    const [totalBalance, setTotalBalance] = useState(0);
    const { freelancerId } = route.params;

    useEffect(() => {
        if (!freelancerId) {
            console.error("Freelancer ID es undefined");
            return;
        }

        const freelancerAccountRef = doc(db, 'BankAccounts', 'GeneralAccount', 'FreelancerAccounts', freelancerId);

        // Escucha en tiempo real para cambios en el documento
        const unsubscribe = onSnapshot(freelancerAccountRef, (doc) => {
            if (doc.exists()) {
                setTotalBalance(doc.data().totalBalance);
            } else {
                console.log("No se encontró la cuenta del freelancer.");
            }
        }, (error) => {
            console.error("Error al obtener el balance del freelancer:", error);
        });

        // Limpiar la suscripción cuando el componente se desmonte
        return () => unsubscribe();
    }, [freelancerId]);

    return (
        <View style={styles.container}>
            <Text style={styles.balanceText}>Balance Total: ${totalBalance}</Text>
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
