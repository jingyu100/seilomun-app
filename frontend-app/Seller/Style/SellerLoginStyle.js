import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 240,
    height: 240,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#ddd',
    marginBottom: 20,
  },
  snsLoginText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 12,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#888',
    marginHorizontal: 3,
  },
  footerDot: {
    fontSize: 13,
    color: '#ccc',
    marginHorizontal: 2,
  },
});
