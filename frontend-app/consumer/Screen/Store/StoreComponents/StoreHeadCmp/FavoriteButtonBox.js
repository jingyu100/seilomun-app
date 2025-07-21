import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from '../../StoreStyle.js';


const TabItem = ({ icon, label, focused }) => (
    <TouchableOpacity style={styles.tabItem}>
      <Ionicons 
        name={icon} 
        size={23}
        color={focused ? "black" : "black"} 
        style= {{
            
        }}
    />
    </TouchableOpacity>
);

export default function FavoriteButtonBox() {
    
    return (
        <View>
            <TabItem icon="heart-outline" />
        </View>
    )
}