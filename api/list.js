const apiList = {
    registerUser: {
      url: () => 'user/signup',
      method: 'post',
    },
    signInUser: {
      url: () => 'user/signin',
      method: 'post',
    },
    resendverificationmail: {
      url: (email) => `user/${email}/resendverificationmail`,
      method: 'get',
    },
    profile: {
      url: () => 'user/me',
      method: 'get',
    },
    updateDiscount: {
      url: () => 'cart/update-discount',
      method: 'post',
    },
    updateProfile: {
      url: () => 'user/update',
      method: 'post',
    },
    logout: {
      url: () => 'user/logout',
      method: 'get',
    },
    forgotPassword: {
      url: (email) => `user/forgot-password/${email}`,
      method: 'get',
    },
    changePassword: {
      url: () => 'user/change-password',
      method: 'post',
    },
    deleteAccount: {
      url: () => 'user/delete-account',
      method: 'delete',
    },
    getNearByRestaurant: {
      url: () => 'restaurant/near_by_restaurants',
      method: 'post',
    },
    checkDeliveryRegion: {
      url: () => 'restaurant/check-delivery-region',
      method: 'post',
    },
    getRestaurantTimePickup: {
      url: (restId, isDelivery) => `restaurant/${restId}/restaurantTime?isDelivery=${isDelivery}`,
      method: 'get',
    },
    addAddress: {
      url: () => 'address/add',
      method: 'post',
    },
    editAddress: {
      url: (id) => `address/${id}`,
      method: 'post',
    },
    deleteAddress: {
      url: (id) => `address/delete/${id}`,
      method: 'get',
    },
    addressList: {
      url: () => 'address/list',
      method: 'get',
    },
    getAllMenu: {
      url: () => 'restaurant/menu/category-item/list',
      method: 'post',
    },
    searchMenu: {
      url: () => 'restaurant/menu/item/search',
      method: 'post',
    },
  
    orderHistory: {
      url: () => 'order/history',
      method: 'post',
    },
    orderDetail: {
      url: (id) => `order/${id}/details`,
      method: 'get',
    },
    orderPriceDetail: {
      url: () => 'order/incentivio-order-detail',
      method: 'post',
    },
    copyOrder: {
      url: (id) => `order/copy-order/${id}`,
      method: 'post',
    },
    reOrder: {
      url: (id) => `order/re-order/${id}`,
      method: 'post',
    },
  
    // payment method
  
    getPaymentList: {
      url: () => 'payment/get-methods',
      method: 'get',
    },
    getCard: {
      url: (id) => `payment/get-methods/${id}`,
      method: 'get',
    },
    addCard: {
      url: () => 'payment/add-card-v2',
      method: 'post',
    },
    editCard: {
      url: (id) => `giftCard/update/${id}`,
      method: 'post',
    },
    deleteCard: {
      url: (id) => `payment/delete-card/${id}`,
      method: 'delete',
    },
  
    makePayment: {
      url: () => 'payment/make-payment',
      method: 'post',
    },
  
    getItemDetails: {
      url: () => 'restaurant/item-details',
      method: 'post',
    },
    addToCart: {
      url: () => 'cart/add-items',
      method: 'post',
    },
    getCart: {
      url: () => 'cart/list',
      method: 'post',
    },
    getcartCount: {
      url: () => 'cart/counts',
      method: 'post',
    },
    removeItem: {
      url: (id) => `cart/remove-item/${id}`,
      method: 'post',
    },
    getUpsell: {
      url: () => 'get_upsell_menu_items/get_menu_items',
      method: 'post',
    },
  
    updateTime: {
      url: () => 'cart/updateTime',
      method: 'post',
    },
    getLoyalty: {
      url: () => 'loyality/get',
      method: 'get',
    },
    getRefreshToken: {
      url: () => 'user/refresh-token',
      method: 'get',
    },
    getRewardHistory: {
      url: () => 'loyality/history',
      method: 'post',
    },
    getPaymentMethods: {
      url: () => 'payment/methods',
      method: 'get',
    },
    makeFavorite: {
      url: () => 'order/favorites',
      method: 'post',
    },
    getAds: {
      url: () => 'ads',
      method: 'post',
    },
    viewAds: {
      url: () => 'ads/view',
      method: 'post',
    },
    belizPay: {
      url: () => 'payment/belize-payment',
      method: 'post',
    },
    rewardPoints: {
      url: () => 'loyalty/points',
      method: 'get',
    },
    rewardConversionRate: {
      url: () => 'loyalty/conversion-rate',
      method: 'get',
    },
    handsOffMode: {
      url: () => 'cart/update/hands-off-mode',
      method: 'post',
    },
    updateCart: {
      url: () => 'cart/update',
      method: 'post',
    },
    getFolderDocuments: {
      url: (id) => `/api/documents?folderId=${id}`,
      method: 'get',
    },
  };
  export default apiList;
  