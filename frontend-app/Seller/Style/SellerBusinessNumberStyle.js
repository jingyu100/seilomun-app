import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* Header */
  header: {
    height: 156,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    position: 'absolute',
    left: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#111',
    lineHeight: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  headerDivider: {
    height: 1,
    backgroundColor: '#E6E6E6',
  },

  /* Body */
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  inner: {
    width: '100%',
  },

  /* Labels */
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    color: '#222',
    fontWeight: '600',
  },
  labelAsterisk: {
    marginLeft: 4,
    color: '#FF8A00',
    fontSize: 15,
    fontWeight: '700',
  },

  /* Inputs */
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D7DCE1',
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },

  /* Outline Button */
  outlineButton: {
    marginTop: 24,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
});
