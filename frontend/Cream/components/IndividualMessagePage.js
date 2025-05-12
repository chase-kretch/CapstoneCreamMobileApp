import React, { useEffect, useState, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Image,
    KeyboardAvoidingView,
    Platform,
    Dimensions
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getApiBaseUrl } from "../Helpers/GetApiBaseUrl";
import { MaterialIcons } from "@expo/vector-icons";
import { getToken } from "../Helpers/GetToken";

const screen = Dimensions.get("screen");
const IndividualMessagePage = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { userName, userId, recipientId, profilePicture } = route.params; // Get profilePicture from route params

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState(null);
    const ws = useRef(null);

    // Establish WebSocket connection
    useEffect(() => {
        const connectToWebSocket = async () => {
            const token = await getToken();
            console.log("Connecting to websocket with token", token);
            if (token) {
                const wsUrl = `${getApiBaseUrl().replace('http', 'ws')}ws?token=${token}`;
                ws.current = new WebSocket(wsUrl);

                ws.current.onopen = () => {
                    console.log('Connected to WebSocket server');
                };

                ws.current.onmessage = (event) => {
                    let message = event.data;
                    console.log("Received message:", message);
                
                    if (message.startsWith("Me")) {
                        console.log("Ignoring duplicate message from self.");
                        return;
                    }
                
                    // Check if the message starts with the sender's first name
                    if (message.startsWith(`${userName}:`)) {
                        // Remove the "sender name:" part from the message
                        message = message.substring(`${userName}:`.length).trim();
                    }
                
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { id: `${prevMessages.length}`, sender: 'User', text: message }
                    ]);
                };

                ws.current.onclose = () => {
                    console.log('Disconnected from WebSocket server');
                };

                ws.current.onerror = (error) => {
                    console.log('WebSocket error:', error);
                };
            }

            return () => {
                if (ws.current) {
                    ws.current.close();
                }
            };
        };

        connectToWebSocket();
    }, [userId]);

    // Fetch chat history on mount
    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const token = await getToken();
                if (userId && recipientId) {
                    const url = `${getApiBaseUrl()}Cream/Messages/History?recipientId=${recipientId}`;
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to fetch chat history. Status: ${response.status}`);
                    }

                    const data = await response.json();
                    if (data?.data) {
                        const formattedMessages = data.data.map((msg, index) => ({
                            id: `${index}`,
                            sender: msg.isFromCurrentUser ? 'Me' : 'Other',
                            text: msg.body,
                        }));
                        setMessages(formattedMessages);
                    } else {
                        throw new Error("Unexpected response format.");
                    }
                }
            } catch (err) {
                console.log("Error fetching chat history:", err);
                setError(err.message);
            }
        };

        fetchChatHistory();
    }, [userId, recipientId]);

    // Send a message
    const sendMessage = () => {
        if (newMessage.trim() && recipientId && ws.current) {
            const fullMessage = `${recipientId}|${newMessage}`;
            ws.current.send(fullMessage);

            setMessages((prevMessages) => [
                ...prevMessages,
                { id: `${prevMessages.length}`, sender: 'Me', text: newMessage }
            ]);

            setNewMessage('');
        }
    };

    const renderItem = ({ item }) => (
        <View style={[styles.messageBubble, item.sender === 'Me' ? styles.myMessage : styles.otherMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
        </View>
    );

    return (
        <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 3 : 0} 
    >
        <SafeAreaView style = {styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity style={styles.navButton} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={30} color="#ec8094" />
                    </TouchableOpacity>
                    <Image source={{ uri: profilePicture }} style={styles.avatar} />
                <View style={styles.textContainer}>
                    <Text style={styles.headerText}>{userName}</Text>
                </View>
                </View>
            </View>
    
                {error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : (
                    <FlatList
                        data={messages}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        style={styles.messageList}
                        ListEmptyComponent={<Text style={styles.noMessagesText}>No messages in the chat</Text>}
                    />
                )}
    
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        value={newMessage}
                        onChangeText={setNewMessage}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 15,
    },
    headerContainer: {
        height: screen.height * 0.07,
        width: screen.width * 0.9,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Platform.OS === 'ios' ? 0: screen.height * 0.03,
        alignSelf: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        marginBottom: 15,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navButton: {
        width: 45,
        height: 45,
        backgroundColor: '#FFF',
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 0, // Adjusted left margin for better spacing
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginLeft: 10,
    },
    textContainer: {
        flex: 1,
        alignItems: 'flex-start',
    },
    headerText: {
        fontSize: 24, // Reduced font size to fit better
        fontWeight: 'bold',
        color: '#ec8094',
        marginLeft: 10, // Space between the avatar and text
    },
    messageList: {
        flex: 1,
        marginTop: 10,
    },
    messageBubble: {
        padding: 10,
        borderRadius: 20,
        marginVertical: 5,
        maxWidth: '70%',
        
    },
    myMessage: {
        backgroundColor: '#FFB6C1',
        alignSelf: 'flex-end',
    },
    otherMessage: {
        backgroundColor: '#D3D3D3',
        alignSelf: 'flex-start',
    },
    messageText: {
        color: '#000',
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 10,
    },
    input: {
        flex: 1,
        height: 40,
        borderRadius: 20,
        paddingHorizontal: 15,
        backgroundColor: '#F0F0F0',
    },
    sendButton: {
        backgroundColor: '#ec8094',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginLeft: 10,
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
    noMessagesText: {
        textAlign: 'center',
        color: '#888',
    },
});

export default IndividualMessagePage;
