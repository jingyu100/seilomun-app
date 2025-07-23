import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  storeMargin: {
    marginTop: 15,
    marginHorizontal: 18,
  },
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: 'auto',
    height: 'auto',
    overflow: 'scroll',
    flex: 1,
  },
  storeImage: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 250,
    zIndex: -1,
  },
  storeUI: {
    position: 'relative',
    width: '100%',
    height: '100%',
    paddingTop: 100,
    zIndex: 100,
  },
  storeHead: {
    backgroundColor: '#fff',
    flex: 1,
  },
  storeHead_Top: {
    display: 'flex',
    flexDirection: 'row',
  },
  storeHead_left: {
    flexDirection: 'column',
    width: '85%',
  },
  storeHead_right: {
    // width: 50,
    marginLeft: 'auto',
  },
  storeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    overflow: 'hidden',
  },

  // StoreMiniInfo 부분
  ratingBtn: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 8,
    alignContent: 'center',
    alignItems: 'center',
  },
  ratingImg: {
    width: 18,
    height: 18,
    marginRight: 2.5,
  },
  ratingTxt: {
    fontSize: 13.5,
    fontWeight: 'bold',
  },
  address: {
    marginBottom: 8,
    overflow: 'hidden',
  },
  deliveryTip: {
    flexDirection: 'row',
    marginTop: 5,
  },

  storeHead_bottom: {
    paddingTop: 16,
  },

  // 가게 즐겨찾기
  tabItem: {
    // left: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  // 가게 메뉴, 정보, 리뷰 탭 부분
  tabUI: {
      flexDirection: 'row',
      position: 'relative',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
  },
  storeTabItem: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
  },
  tabText: {
      fontSize: 16,
      color: '#666',
  },
  activeTabText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000',
  },
  underline: {
      position: 'absolute',
      bottom: 0,
      height: 2,
      backgroundColor: 'black',
  },
  tabContent: {
    paddingTop: 16,
    paddingBottom: 16,
  },

  // 가게 바디 부분
  storeBody: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // StoreMainInfo 부분
  storeMainInfo: {
    // flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    /* justifyContent: 'center', */
    width: '100%',
    paddingTop: 35,
    paddingBottom: 20,
  }
});

export default styles;