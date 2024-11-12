import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { Button, Modal, TextInput, View, Text, StyleSheet } from 'react-native';
import { db } from '../../connection/firebaseConfig';
import { collection, addDoc, query, where, getDocs, orderBy, onSnapshot, serverTimestamp, doc, setDoc, getDoc, runTransaction, limit } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const ChatScreen = ({ route }) => {
    const { userId, otherUserId } = route.params;
    const [messages, setMessages] = useState([]);
    const [userType, setUserType] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [depositAmount, setDepositAmount] = useState('');

    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        const determineUserType = async () => {
            // Verificar si el usuario es un cliente
            const clientQuery = query(collection(db, "Clients"), where("id", "==", userId));
            const clientSnapshot = await getDocs(clientQuery);
            if (!clientSnapshot.empty) {
                setUserType('client');
                return;
            }

            // Verificar si el usuario es un freelancer
            const freelancerQuery = query(collection(db, "Freelancers"), where("id", "==", userId));
            const freelancerSnapshot = await getDocs(freelancerQuery);
            if (!freelancerSnapshot.empty) {
                setUserType('freelancer');
                return;
            }

            console.log('User type not determined');
        };

        if (user) {
            determineUserType();
        }
    }, [user]);

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

    const renderCustomActions = (props) => {
        // Renderizar botón de pago para clientes
        if (userType === 'client') {
            return (
                <Button
                    title="Pagar"
                    onPress={() => setModalVisible(true)}  // Abrir el modal para ingresar el monto
                />
            );
        }
        // Renderizar botón de entrega para freelancers
        else if (userType === 'freelancer') {
            return (
                <Button
                    title="Entregado"
                    onPress={() => handleDelivery(userId)}
                />
            );
        }
        return null;
    };

    const handlePayment = async (amount) => {
        if (!userId || userType !== 'client' || isNaN(amount)) {
            console.log("Acceso denegado o monto inválido.");
            return;
        }

        const accountRef = doc(db, 'BankAccounts', "22802373"); // ID de la cuenta bancaria general
        const depositRef = collection(accountRef, 'Deposits');

        try {
            await runTransaction(db, async (transaction) => {
                const accountSnap = await transaction.get(accountRef);
                if (!accountSnap.exists()) {
                    throw new Error("La cuenta bancaria no existe.");
                }

                const newTotalBalance = (accountSnap.data().totalBalance || 0) + amount;
                transaction.update(accountRef, { totalBalance: newTotalBalance });

                // Registrar el depósito en la subcolección 'Deposits'
                const depositDocRef = doc(depositRef);
                transaction.set(depositDocRef, {
                    depositAmount: amount,
                    userId: userId,
                    timestamp: serverTimestamp(),
                });
            });
            alert("Pago realizado correctamente por $" + amount);
        } catch (error) {
            console.error("Error al procesar el pago:", error);
            alert("Error al realizar el pago.");
        }
    };

    // Función para inicializar la estructura de la colección BankAccounts
    const initializeBankAccountsCollection = async () => {
        const accountId = "22802373";  // ID de la cuenta bancaria
        const accountRef = doc(db, 'BankAccounts', accountId);

        // Crear o actualizar el documento de la cuenta bancaria
        await setDoc(accountRef, {
            accountNumber: "22802373",
            totalBalance: 0  // Balance inicial para propósitos de prueba
        }, { merge: true });

        // Crear un depósito de prueba en la subcolección 'Deposits'
        const depositRef = collection(accountRef, 'Deposits');
        await setDoc(doc(depositRef), {
            depositAmount: 100,
            userId: "userIdExample",
            timestamp: serverTimestamp(),
            firstName: "John",
            lastName: "Doe",
            userType: "client"
        });

        console.log("Estructura de BankAccounts inicializada correctamente.");
    };

    const renderPaymentModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TextInput
                            style={styles.modalText}
                            placeholder="Ingrese el monto a depositar"
                            keyboardType="numeric"
                            onChangeText={text => setDepositAmount(text)}
                            value={depositAmount}
                        />
                        <Button
                            title="Confirmar Pago"
                            onPress={() => {
                                if (parseFloat(depositAmount) > 0) {
                                    handlePayment(parseFloat(depositAmount));
                                    setModalVisible(false);
                                } else {
                                    alert("Por favor, ingrese un monto válido.");
                                }
                            }}
                        />
                    </View>
                </View>
            </Modal>
        );
    };

    const styles = StyleSheet.create({
        centeredView: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 22
        },
        modalView: {
            margin: 20,
            backgroundColor: "white",
            borderRadius: 20,
            padding: 35,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
        },
        modalText: {
            marginBottom: 15,
            textAlign: "center"
        }
    });

    const getLastDepositAmount = async () => {
        const accountRef = doc(db, 'BankAccounts', "22802373"); // Asumiendo que "22802373" es el ID de la cuenta bancaria general
        const depositsRef = collection(accountRef, 'Deposits');
        const q = query(depositsRef, orderBy("timestamp", "desc"), limit(1));

        try {
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const lastDeposit = querySnapshot.docs[0].data();
                return lastDeposit.depositAmount; // Retorna el monto del último depósito
            } else {
                console.log("No se encontraron depósitos.");
                return 0; // Retorna 0 si no hay depósitos
            }
        } catch (error) {
            console.error("Error al recuperar el último depósito:", error);
            return 0; // Retorna 0 en caso de error
        }
    };

    const handleDelivery = async (freelancerId) => {
        const amount = await getLastDepositAmount();  // Obtener el monto del último depósito
        if (amount > 0) {
            // Referencia a la cuenta general
            const generalAccountRef = doc(db, 'BankAccounts', '22802373');  // Referencia correcta a la cuenta general
            // Referencia a la cuenta del freelancer
            const freelancerAccountRef = doc(db, 'BankAccounts', 'GeneralAccount', 'FreelancerAccounts', freelancerId);  // Referencia correcta a la cuenta del freelancer

            try {
                await runTransaction(db, async (transaction) => {
                    const generalAccountSnap = await transaction.get(generalAccountRef);
                    const freelancerAccountSnap = await transaction.get(freelancerAccountRef);

                    if (!generalAccountSnap.exists() || !freelancerAccountSnap.exists()) {
                        throw new Error("Las cuentas no existen.");
                    }

                    // Calcular los nuevos balances
                    const newGeneralBalance = generalAccountSnap.data().totalBalance - amount;
                    const newFreelancerBalance = freelancerAccountSnap.data().totalBalance + amount;

                    if (newGeneralBalance < 0) {
                        throw new Error("Fondos insuficientes en la cuenta general.");
                    }

                    // Actualizar los balances en la base de datos
                    transaction.update(generalAccountRef, { totalBalance: newGeneralBalance });
                    transaction.update(freelancerAccountRef, { totalBalance: newFreelancerBalance });
                });
                alert("Trabajo entregado y pago transferido correctamente.");
            } catch (error) {
                console.error("Error al procesar la entrega:", error);
                alert("Error al realizar la transferencia.");
            }
        } else {
            console.log("No hay fondos para transferir.");
        }
    };

    const renderFreelancerActions = () => {
        if (userType === 'freelancer') {
            return (
                <Button
                    title="Entregado"
                    onPress={() => handleDelivery(userId)}
                />
            );
        }
        return null;
    };

    const initializeFreelancerAccount = async (freelancerId) => {
        // Asumiendo que 'general' es un documento dentro de 'BankAccounts' que actúa como padre para todos los freelancers
        const freelancerAccountRef = doc(db, 'BankAccounts', 'GeneralAccount', 'FreelancerAccounts', freelancerId);

        try {
            await setDoc(freelancerAccountRef, {
                accountNumber: "57867406",  // Número de cuenta específico para cada freelancer
                totalBalance: 0,  // Balance inicial
                userId: freelancerId,
                createdAt: serverTimestamp()
            }, { merge: true });

            console.log("Cuenta de freelancer inicializada correctamente.");
        } catch (error) {
            console.error("Error al inicializar la cuenta de freelancer:", error);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            {renderPaymentModal()}
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: userId,
                }}
                renderActions={renderCustomActions}
            />
        </View>
    );
};

export default ChatScreen;

