import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

// 안드로이드에서도 LayoutAnimation 활성화
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function StoreEvent({
  description,
  operatingHours,
  pickupTime,
  notification,
  notificationPhotos = [],
}) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <TouchableOpacity
        style={[
            styles.storeEvent,
        ]}
        onPress={toggleExpand}
        activeOpacity={0.9}
    >
    {/* 상단 바 */}
    <View style={styles.storeEvent_inner}>
        <View style={styles.storeEvent_left}>
            <Image
                source={require('../../../../../assets/icon-megaphone.png')}
                style={styles.megaphone}
            />
            <Text style={{ fontSize: 14, fontWeight: '500' }}>안내 및 혜택</Text>
        </View>
        <Image
            source={require('../../../../../assets/icon-up-arrow.png')}
            style={[
                styles.eventArrow,
                { transform: [{ rotate: expanded ? '0deg' : '180deg' }] },
            ]}
        />
    </View>

    {/* 펼쳐질 내용 */}
    {expanded && (
        <>
            {/* <Image
                source={require('../../../../../assets/google.png')}
                style={{ width: 80, height: 80, marginTop: 10, marginBottom: 8 }}
            /> */}
            {notification && <Text style={styles.text}>{notification}</Text>}
            {notificationPhotos.length > 0 &&
                notificationPhotos.map((photo, idx) => (
                    <Image
                        key={idx}
                        source={{ uri: photo }}
                        style={styles.photo}
                        resizeMode="cover"
                    />
            ))}
        </>
    )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    storeEvent: {
        width: '95%',
        backgroundColor: '#deffe7', // 전체 배경
        borderRadius: 6,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginVertical: 16,
        overflow: 'hidden',
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 10,
        },
        storeEvent_inner: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        }, 
    storeEvent_left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    megaphone: {
        width: 19,
        height: 19,
        marginRight: 5,
    },
    eventArrow: {
        width: 16,
        height: 16,
    },
    contentBox: {
        width: '95%',
        backgroundColor: '#deffe7',
        padding: 10,
        borderBottomEndRadius: 6,
    },
    text: {
        fontSize: 13,
        marginBottom: 8,
    },
    photo: {
        width: '100%',
        height: 120,
        borderRadius: 6,
        marginBottom: 8,
    },
});
