import React from 'react';
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from '../../StoreStyle.js';

export default function Inquiry({ onOpenChat }) {
    return (
        <TouchableOpacity style={styles.tabItem} onPress={onOpenChat}>
            <Ionicons
                name="chatbubble-outline"
                size={21}
                color={"black"}
            />
        </TouchableOpacity>
    );
}
