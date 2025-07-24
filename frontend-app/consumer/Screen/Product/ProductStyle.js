import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  productMargin: {
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
    zIndex: 100,
  },
  productImages: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 250,
    zIndex: -1,
  },
  productUI: {
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

  // ProductHead 부분
  prodHead: {
    position: 'relative',
    flexDirection: 'row',
  },

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
  deliveryTip: {
    flexDirection: 'row',
    marginTop: 5,
  },

  storeHead_bottom: {
    paddingTop: 16,
  },

  // ProductHeadDetail 부분
  prodHeadDtl: {
    backgroundColor: "#fff",
  },
  prodHdDtl_Head: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  prodHdDtlHd_Bottom: {
    flexDirection: 'column',
  },
  storeImage: {
    position: 'relative',
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  address: {
    overflow: 'hidden',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: "#444",
  },
  stock: {
    fontSize: 17,
    marginBottom: 8,
    color: "#000",
  },
  priceBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  discountedPrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginRight: 5,
  },
  originalPrice: {
    textDecorationLine: "line-through",
    fontSize: 16,
    color: "#999",
    marginRight: 5,
  },
  discountBox: {
    top: -2,
  },
  discountRate: {
    fontSize: 18,
    color: "red",
    fontWeight: "bold",
  },
  expiry: {
    color: "gray",
    marginBottom: 6,
  },
  totalBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginVertical: 16,
  },
  qtyBtn: {
    borderRadius: 4,
    padding: 10,
  },
  qtyText: {
    fontSize: 20,
  },
  qtyValue: {
    fontSize: 15,
    fontWeight: "600",
  },
  disabledBtn: {
    opacity: 0.4,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },


  // 가게 즐겨찾기
  tabItem: {
    // left: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  // 제품 페이지 구매, 장바구니 영역
    prodBottom: {
        width: '100%',
        borderTopWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#fff",
        paddingTop: 13,
        paddingHorizontal: 18,
        zIndex: 1000,
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 'auto',
    },
    btnRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },
    buyBtn: {
        flex: 1,
        backgroundColor: "#000",
        padding: 13,
        borderRadius: 8,
    },
    cartBtn: {
        flex: 1,
        backgroundColor: '#00c266',
        borderColor: '#00c266',
        padding: 13,
        borderRadius: 8,
    },
});

export default styles;