import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    Image,
    StyleSheet,
    useWindowDimensions,
  } from 'react-native';

export default function StoreEvent() {

    return(
        <TouchableOpacity
            style= {styles.storeEvent}
        >
            <View 
                style= {styles.storeEvent_inner}
            >
                <View 
                    style= {styles.storeEvent_left}
                >
                    <Image
                        source= {require('../../../../../assets/icon-megaphone.png')}
                        style= {styles.megaphone}
                    />
                    <Text style= {{
                        fontSize: 14,
                        fontWeight: 500,
                        top: 1,
                    }}>안내 및 혜택</Text>
                </View>
                <Image
                    source= {require('../../../../../assets/icon-up-arrow.png')}
                    style= {styles.eventArrow}
                />
            </View>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    storeEvent: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: "flex-start",
        // justifyContent: 'center',
    },
    storeEvent_inner: {
        display: 'flex',
        flexDirection: 'row',
        width: '95%',
        height: 'auto',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: "#deffe7",
        borderRadius: 6,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    storeEvent_left: {
        flexDirection: 'row',
    }, 
    megaphone: {
        width: 19,
        height: 19,
        marginRight: 5,
    },
    eventArrow: {
        width: 16,
        height: 16,
        transform: [{ scaleY: -1 }], // 상하반전
    },
});
