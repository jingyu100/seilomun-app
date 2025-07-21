import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  storeMargin: {
    margin: 10,
  },
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    overflow: 'scroll',
  },
  storeImage: {
    // position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 320,
  },
  storeHead: {
    position: 'relative',
    backgroundColor: '#fff',
    flex: 1,
    width: '100%',
    // height: 400,
    zIndex: 100,
  },
  storeHead_Top: {
    display: 'flex',

  },
  storeHead_left: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,

  },
  storeHead_right: {

  },
  storeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  storeHead_bottom: {
    paddingTop: 16,
  },
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
      padding: 16,
  },
});

export default styles;