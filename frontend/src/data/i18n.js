const translations = {
  en: {
    app: { name: "Dhara Organic" },
    nav: { home: "Home", about: "About", features: "Features", contact: "Contact", signIn: "Sign In" },
    hero: { subtitle: "Kerala's Premium Organic Marketplace", title: "DHARA", tagline: "Farm • Table • Trust", desc: "From Kerala's oldest organic families to your table — harvest to home in under 24 hours.", shop: "Shop now", farmerSignIn: "Sign in farmer" },
    dashboard: { title: "Farmer Dashboard", earnings: "Total Earnings", orders: "Orders Received", harvest: "Harvest Entries", subscriptions: "Subscribed Routines", warnings: "Warnings", addProduct: "Add Product", ordersLink: "Orders", profile: "Profile", logout: "Logout", home: "Home", notifications: "Notifications", contact: "Contact" },
    product: { name: "Product Name", price: "Price", quantity: "Quantity", harvestTime: "Harvest Time", availability: "Availability", delivery: "Delivery Option", add: "Add Product", save: "Save", edit: "Edit Profile", available: "Available", notAvailable: "Not Available" },
    profile: { title: "Farmer Profile", name: "Farmer Name", address: "Farm Address", phone: "Phone Number", village: "Village", district: "District", description: "Farm Description", edit: "Edit Profile", save: "Save Profile" },
    warning: { title: "Warnings", count: "Warning Count", blocked: "Account Blocked", active: "Active" },
    language: "Language",
    voice: "Listen",
    stop: "Stop",
    farmerSidebar: {
      dashboard: "Dashboard", products: "Products", orders: "Orders",
      revenue: "Revenue", reviews: "Reviews", inventory: "Inventory",
      notifications: "Notifications", profile: "Profile",
      customerView: "Customer View", logout: "Logout"
    },
    farmerLayout: {
      farmer: "Farmer", copyright: "© 2026 Dhara Marketplace",
      version: "Farmer Admin Panel v2.0"
    },
    farmerDashboard: {
      title: "Dashboard Overview", welcomeBack: "Welcome back",
      addProduct: "Add Product", totalProducts: "Total Products",
      activeOrders: "Active Orders", totalEarnings: "Total Earnings",
      monthlyRevenue: "Monthly Revenue", productViews: "Product Views",
      rating: "Rating", lowStockItems: "Low Stock Items",
      pendingDeliveries: "Pending Deliveries",
      revenueOverview: "Revenue Overview", monthlyEarnings: "Monthly earnings",
      viewAll: "View All", recentOrders: "Recent Orders",
      latestOrders: "Latest {count} orders", noOrdersYet: "No orders yet",
      orderHash: "Order #", items: "items",
      accountBlocked: "Account Blocked",
      negativeReviews: "{count}/3 Negative Reviews",
      blockedDesc: "You cannot post products. Contact admin.",
      negativeReviewDesc: "{count} severe comment{plural} received. 3 will block your account.",
      topSellingProducts: "Top Selling Products",
      noSalesData: "No sales data yet", sold: "sold",
      lowStockAlerts: "Low Stock Alerts",
      productsRunningLow: "Products running low", manage: "Manage",
      allWellStocked: "All products well stocked",
      outOfStock: "Out of Stock", left: "left"
    },
    farmerProducts: {
      title: "Products", totalProducts: "{count} total products",
      addProduct: "Add Product", productUpdated: "Product updated!",
      productDeleted: "Product deleted.",
      searchProducts: "Search products...",
      noProductsFound: "No products found",
      addYourFirst: "Add your first product",
      outOfStock: "Out of Stock",
      stock: "Stock", price: "Price", category: "Category",
      product: "Product", actions: "Actions",
      save: "Save", cancel: "Cancel",
      deleteProduct: "Delete Product?",
      cannotUndo: "This action cannot be undone.",
      delete: "Delete", left: "left"
    },
    farmerOrders: {
      title: "Orders", totalOrders: "{count} total orders",
      search: "Search by order ID or product...",
      noOrdersFound: "No orders found",
      orderHash: "Order #", items: "items",
      customer: "Customer", delivery: "Delivery", date: "Date",
      products: "products",
      moreItems: "+{count} more items",
      acceptOrder: "Accept Order", markShipped: "Mark Shipped",
      markDelivered: "Mark Delivered", reject: "Reject",
      details: "Details",
      status: { all: "All", pending: "Pending", processing: "Processing", inTransit: "In Transit", delivered: "Delivered", cancelled: "Cancelled" },
      payment: { paid: "Paid", pending: "Pending" }
    },
    farmerRevenue: {
      title: "Revenue & Earnings",
      subtitle: "Financial overview of your farm business",
      totalEarnings: "Total Earnings", weeklyRevenue: "Weekly Revenue",
      monthlyRevenue: "Monthly Revenue", pendingPayouts: "Pending Payouts",
      monthlyRevenueChart: "Monthly Revenue",
      noRevenueData: "No revenue data yet",
      topSellingProducts: "Top Selling Products",
      noSalesData: "No sales data yet",
      productSalesBreakdown: "Product Sales Breakdown",
      num: "#", product: "Product", unitsSold: "Units Sold",
      noProductsSold: "No products sold yet",
      unableToLoad: "Unable to load revenue data"
    },
    farmerReviews: {
      title: "Customer Reviews",
      subtitle: "Manage your reputation and respond to feedback",
      averageRating: "Average Rating", negativeReviews: "Negative Reviews",
      accountBlocked: "Account Blocked", totalReviews: "Total Reviews",
      negativeWarning: "You have {count} negative review{s}. {remaining} more will block your account.",
      noReviewsYet: "No reviews yet",
      reviewsAppearHere: "Reviews from customers will appear here",
      negative: "Negative", on: "on", yourReply: "Your Reply",
      writeReply: "Write your reply...", cancel: "Cancel", reply: "Reply",
      customer: "Customer"
    },
    farmerInventory: {
      title: "Inventory Management",
      subtitle: "Track stock levels and manage product availability",
      stockUpdated: "Stock updated!",
      outOfStock: "Out of Stock", lowStock: "Low Stock (≤5)",
      inStock: "In Stock",
      outOfStockAlert: "{count} product{s} {is} out of stock. Update inventory or add new products.",
      searchProducts: "Search products...",
      noProductsFound: "No products found",
      product: "Product", category: "Category", price: "Price",
      currentStock: "Current Stock", status: "Status", update: "Update",
      addNewProduct: "Add New Product"
    },
    farmerSettings: {
      title: "Farm Settings",
      subtitle: "Manage your farm profile and contact information",
      farmName: "Farm Name", phoneNumber: "Phone Number",
      address: "Address", village: "Village", district: "District",
      farmDescription: "Farm Description",
      saveChanges: "Save Changes", saving: "Saving...",
      profileUpdated: "Profile updated successfully!",
      updateFailed: "Failed to update profile",
      accountInformation: "Account Information",
      email: "Email", accountType: "Account Type", rating: "Rating",
      placeholders: {
        farmName: "Your farm name", phone: "+91 9XXXXXXXXX",
        address: "Full address", village: "Village name",
        district: "District", description: "Describe your farm..."
      }
    }
  },
  ml: {
    app: { name: "ധാര ഓർഗാനിക്" },
    nav: { home: "ഹോം", about: "കുറിച്ച്", features: "സവിശേഷതകൾ", contact: "ബന്ധപ്പെടുക", signIn: "സൈൻ ഇൻ" },
    hero: { subtitle: "കേരളത്തിന്റെ പ്രീമിയം ഓർഗാനിക് മാർക്കറ്റ്‌പ്ലേസ്", title: "ധാര", tagline: "ഫാം • ടേബിൾ • ട്രസ്റ്റ്", desc: "കേരളത്തിലെ ഏറ്റവും പഴക്കമുള്ള ഓർഗാനിക് കുടുംബങ്ങളിൽ നിന്ന് നിങ്ങളുടെ മേശയിലേക്ക് - 24 മണിക്കൂറിനുള്ളിൽ വിളവെടുപ്പ് മുതൽ വീട്ടിലേക്ക്.", shop: "ഷോപ്പ് ചെയ്യുക", farmerSignIn: "കർഷക സൈൻ ഇൻ" },
    dashboard: { title: "കർഷക ഡാഷ്‌ബോർഡ്", earnings: "ആകെ വരുമാനം", orders: "ലഭിച്ച ഓർഡറുകൾ", harvest: "വിളവെടുപ്പ് എൻട്രികൾ", subscriptions: "സബ്‌സ്ക്രൈബ് ചെയ്ത റൂട്ടിനുകൾ", warnings: "മുന്നറിയിപ്പുകൾ", addProduct: "ഉൽപ്പന്നം ചേർക്കുക", ordersLink: "ഓർഡറുകൾ", profile: "പ്രൊഫൈൽ", logout: "ലോഗൗട്ട്", home: "ഹോം", notifications: "അറിയിപ്പുകൾ", contact: "ബന്ധപ്പെടുക" },
    product: { name: "ഉൽപ്പന്നത്തിന്റെ പേര്", price: "വില", quantity: "അളവ്", harvestTime: "വിളവെടുപ്പ് സമയം", availability: "ലഭ്യത", delivery: "ഡെലിവറി ഓപ്ഷൻ", add: "ഉൽപ്പന്നം ചേർക്കുക", save: "സംരക്ഷിക്കുക", edit: "പ്രൊഫൈൽ എഡിറ്റ് ചെയ്യുക", available: "ലഭ്യമാണ്", notAvailable: "ലഭ്യമല്ല" },
    profile: { title: "കർഷക പ്രൊഫൈൽ", name: "കർഷകന്റെ പേര്", address: "ഫാം വിലാസം", phone: "ഫോൺ നമ്പർ", village: "ഗ്രാമം", district: "ജില്ല", description: "ഫാം വിവരണം", edit: "പ്രൊഫൈൽ എഡിറ്റ് ചെയ്യുക", save: "പ്രൊഫൈൽ സംരക്ഷിക്കുക" },
    warning: { title: "മുന്നറിയിപ്പുകൾ", count: "മുന്നറിയിപ്പ് എണ്ണം", blocked: "അക്കൗണ്ട് ബ്ലോക്ക് ചെയ്‌തു", active: "സജീവമാണ്" },
    language: "ഭാഷ",
    voice: "കേൾക്കുക",
    stop: "നിർത്തുക",
    farmerSidebar: {
      dashboard: "ഡാഷ്ബോർഡ്", products: "ഉൽപ്പന്നങ്ങൾ", orders: "ഓർഡറുകൾ",
      revenue: "വരുമാനം", reviews: "അവലോകനങ്ങൾ", inventory: "ഇൻവെന്ററി",
      notifications: "അറിയിപ്പുകൾ", profile: "പ്രൊഫൈൽ",
      customerView: "ഉപഭോക്തൃ കാഴ്ച", logout: "ലോഗൗട്ട്"
    },
    farmerLayout: {
      farmer: "കർഷകൻ", copyright: "© 2026 ധാര മാർക്കറ്റ്‌പ്ലേസ്",
      version: "കർഷക അഡ്മിൻ പാനൽ v2.0"
    },
    farmerDashboard: {
      title: "ഡാഷ്ബോർഡ് അവലോകനം", welcomeBack: "സ്വാഗതം",
      addProduct: "ഉൽപ്പന്നം ചേർക്കുക", totalProducts: "ആകെ ഉൽപ്പന്നങ്ങൾ",
      activeOrders: "സജീവ ഓർഡറുകൾ", totalEarnings: "ആകെ വരുമാനം",
      monthlyRevenue: "പ്രതിമാസ വരുമാനം", productViews: "ഉൽപ്പന്ന കാഴ്ചകൾ",
      rating: "റേറ്റിംഗ്", lowStockItems: "കുറഞ്ഞ സ്റ്റോക്ക് ഇനങ്ങൾ",
      pendingDeliveries: "തീർപ്പാക്കാത്ത ഡെലിവറികൾ",
      revenueOverview: "വരുമാന അവലോകനം", monthlyEarnings: "പ്രതിമാസ വരുമാനം",
      viewAll: "എല്ലാം കാണുക", recentOrders: "സമീപകാല ഓർഡറുകൾ",
      latestOrders: "ഏറ്റവും പുതിയ {count} ഓർഡറുകൾ", noOrdersYet: "ഓർഡറുകൾ ഇതുവരെ ഇല്ല",
      orderHash: "ഓർഡർ #", items: "ഇനങ്ങൾ",
      accountBlocked: "അക്കൗണ്ട് ബ്ലോക്ക് ചെയ്‌തു",
      negativeReviews: "{count}/3 നെഗറ്റീവ് അവലോകനങ്ങൾ",
      blockedDesc: "നിങ്ങൾക്ക് ഉൽപ്പന്നങ്ങൾ പോസ്റ്റ് ചെയ്യാൻ കഴിയില്ല. അഡ്മിനെ ബന്ധപ്പെടുക.",
      negativeReviewDesc: "{count} ഗുരുതരമായ അഭിപ്രായം{plural} ലഭിച്ചു. 3 എണ്ണമായാൽ അക്കൗണ്ട് ബ്ലോക്ക് ചെയ്യും.",
      topSellingProducts: "മികച്ച വിൽപ്പന ഉൽപ്പന്നങ്ങൾ",
      noSalesData: "ഇതുവരെ വിൽപ്പന ഡാറ്റ ഇല്ല", sold: "വിറ്റു",
      lowStockAlerts: "കുറഞ്ഞ സ്റ്റോക്ക് അലേർട്ടുകൾ",
      productsRunningLow: "സ്റ്റോക്ക് കുറഞ്ഞ ഉൽപ്പന്നങ്ങൾ", manage: "മാനേജ്",
      allWellStocked: "എല്ലാ ഉൽപ്പന്നങ്ങളും മതിയായ സ്റ്റോക്കിൽ",
      outOfStock: "സ്റ്റോക്ക് ഇല്ല", left: "ശേഷിക്കുന്നു"
    },
    farmerProducts: {
      title: "ഉൽപ്പന്നങ്ങൾ", totalProducts: "{count} ആകെ ഉൽപ്പന്നങ്ങൾ",
      addProduct: "ഉൽപ്പന്നം ചേർക്കുക", productUpdated: "ഉൽപ്പന്നം അപ്‌ഡേറ്റ് ചെയ്‌തു!",
      productDeleted: "ഉൽപ്പന്നം ഇല്ലാതാക്കി.",
      searchProducts: "ഉൽപ്പന്നങ്ങൾ തിരയുക...",
      noProductsFound: "ഉൽപ്പന്നങ്ങളൊന്നും കണ്ടെത്തിയില്ല",
      addYourFirst: "നിങ്ങളുടെ ആദ്യ ഉൽപ്പന്നം ചേർക്കുക",
      outOfStock: "സ്റ്റോക്ക് ഇല്ല",
      stock: "സ്റ്റോക്ക്", price: "വില", category: "വിഭാഗം",
      product: "ഉൽപ്പന്നം", actions: "പ്രവർത്തനങ്ങൾ",
      save: "സംരക്ഷിക്കുക", cancel: "റദ്ദാക്കുക",
      deleteProduct: "ഉൽപ്പന്നം ഇല്ലാതാക്കണോ?",
      cannotUndo: "ഈ പ്രവർത്തനം പഴയപടിയാക്കാനാവില്ല.",
      delete: "ഇല്ലാതാക്കുക", left: "ശേഷിക്കുന്നു"
    },
    farmerOrders: {
      title: "ഓർഡറുകൾ", totalOrders: "{count} ആകെ ഓർഡറുകൾ",
      search: "ഓർഡർ ഐഡി അല്ലെങ്കിൽ ഉൽപ്പന്നം ഉപയോഗിച്ച് തിരയുക...",
      noOrdersFound: "ഓർഡറുകളൊന്നും കണ്ടെത്തിയില്ല",
      orderHash: "ഓർഡർ #", items: "ഇനങ്ങൾ",
      customer: "ഉപഭോക്താവ്", delivery: "ഡെലിവറി", date: "തീയതി",
      products: "ഉൽപ്പന്നങ്ങൾ",
      moreItems: "+{count} കൂടുതൽ ഇനങ്ങൾ",
      acceptOrder: "ഓർഡർ സ്വീകരിക്കുക", markShipped: "ഷിപ്പ് ചെയ്‌തതായി അടയാളപ്പെടുത്തുക",
      markDelivered: "ഡെലിവർ ചെയ്‌തതായി അടയാളപ്പെടുത്തുക", reject: "നിരസിക്കുക",
      details: "വിശദാംശങ്ങൾ",
      status: { all: "എല്ലാം", pending: "തീർപ്പാക്കാത്തത്", processing: "പ്രോസസ്സിംഗ്", inTransit: "ഗതാഗതത്തിൽ", delivered: "ഡെലിവർ ചെയ്‌തു", cancelled: "റദ്ദാക്കി" },
      payment: { paid: "പണമടച്ചു", pending: "തീർപ്പാക്കാത്തത്" }
    },
    farmerRevenue: {
      title: "വരുമാനവും വരുമാനവും",
      subtitle: "നിങ്ങളുടെ ഫാം ബിസിനസ്സിന്റെ സാമ്പത്തിക അവലോകനം",
      totalEarnings: "ആകെ വരുമാനം", weeklyRevenue: "പ്രതിവാര വരുമാനം",
      monthlyRevenue: "പ്രതിമാസ വരുമാനം", pendingPayouts: "തീർപ്പാക്കാത്ത പേഔട്ടുകൾ",
      monthlyRevenueChart: "പ്രതിമാസ വരുമാനം",
      noRevenueData: "ഇതുവരെ വരുമാന ഡാറ്റ ഇല്ല",
      topSellingProducts: "മികച്ച വിൽപ്പന ഉൽപ്പന്നങ്ങൾ",
      noSalesData: "ഇതുവരെ വിൽപ്പന ഡാറ്റ ഇല്ല",
      productSalesBreakdown: "ഉൽപ്പന്ന വിൽപ്പന വിഭജനം",
      num: "#", product: "ഉൽപ്പന്നം", unitsSold: "വിറ്റ യൂണിറ്റുകൾ",
      noProductsSold: "ഇതുവരെ ഉൽപ്പന്നങ്ങളൊന്നും വിറ്റിട്ടില്ല",
      unableToLoad: "വരുമാന ഡാറ്റ ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല"
    },
    farmerReviews: {
      title: "ഉപഭോക്തൃ അവലോകനങ്ങൾ",
      subtitle: "നിങ്ങളുടെ പ്രശസ്തി നിയന്ത്രിക്കുക, ഫീഡ്‌ബാക്കിനോട് പ്രതികരിക്കുക",
      averageRating: "ശരാശരി റേറ്റിംഗ്", negativeReviews: "നെഗറ്റീവ് അവലോകനങ്ങൾ",
      accountBlocked: "അക്കൗണ്ട് ബ്ലോക്ക് ചെയ്‌തു", totalReviews: "ആകെ അവലോകനങ്ങൾ",
      negativeWarning: "നിങ്ങൾക്ക് {count} നെഗറ്റീവ് അവലോകനം{s} ഉണ്ട്. {remaining} കൂടിയാൽ അക്കൗണ്ട് ബ്ലോക്ക് ചെയ്യും.",
      noReviewsYet: "ഇതുവരെ അവലോകനങ്ങളൊന്നുമില്ല",
      reviewsAppearHere: "ഉപഭോക്താക്കളിൽ നിന്നുള്ള അവലോകനങ്ങൾ ഇവിടെ ദൃശ്യമാകും",
      negative: "നെഗറ്റീവ്", on: "ഓൺ", yourReply: "നിങ്ങളുടെ മറുപടി",
      writeReply: "നിങ്ങളുടെ മറുപടി എഴുതുക...", cancel: "റദ്ദാക്കുക", reply: "മറുപടി",
      customer: "ഉപഭോക്താവ്"
    },
    farmerInventory: {
      title: "ഇൻവെന്ററി മാനേജ്മെന്റ്",
      subtitle: "സ്റ്റോക്ക് ലെവലുകൾ ട്രാക്ക് ചെയ്യുക, ഉൽപ്പന്ന ലഭ്യത നിയന്ത്രിക്കുക",
      stockUpdated: "സ്റ്റോക്ക് അപ്‌ഡേറ്റ് ചെയ്‌തു!",
      outOfStock: "സ്റ്റോക്ക് ഇല്ല", lowStock: "കുറഞ്ഞ സ്റ്റോക്ക് (≤5)",
      inStock: "സ്റ്റോക്കിൽ ഉണ്ട്",
      outOfStockAlert: "{count} ഉൽപ്പന്നം{s} സ്റ്റോക്കിൽ ഇല്ല. ഇൻവെന്ററി അപ്‌ഡേറ്റ് ചെയ്യുക അല്ലെങ്കിൽ പുതിയ ഉൽപ്പന്നങ്ങൾ ചേർക്കുക.",
      searchProducts: "ഉൽപ്പന്നങ്ങൾ തിരയുക...",
      noProductsFound: "ഉൽപ്പന്നങ്ങളൊന്നും കണ്ടെത്തിയില്ല",
      product: "ഉൽപ്പന്നം", category: "വിഭാഗം", price: "വില",
      currentStock: "നിലവിലെ സ്റ്റോക്ക്", status: "സ്റ്റാറ്റസ്", update: "അപ്‌ഡേറ്റ്",
      addNewProduct: "പുതിയ ഉൽപ്പന്നം ചേർക്കുക"
    },
    farmerSettings: {
      title: "ഫാം ക്രമീകരണങ്ങൾ",
      subtitle: "നിങ്ങളുടെ ഫാം പ്രൊഫൈലും കോൺടാക്റ്റ് വിവരങ്ങളും നിയന്ത്രിക്കുക",
      farmName: "ഫാമിന്റെ പേര്", phoneNumber: "ഫോൺ നമ്പർ",
      address: "വിലാസം", village: "ഗ്രാമം", district: "ജില്ല",
      farmDescription: "ഫാം വിവരണം",
      saveChanges: "മാറ്റങ്ങൾ സംരക്ഷിക്കുക", saving: "സംരക്ഷിക്കുന്നു...",
      profileUpdated: "പ്രൊഫൈൽ വിജയകരമായി അപ്‌ഡേറ്റ് ചെയ്‌തു!",
      updateFailed: "പ്രൊഫൈൽ അപ്‌ഡേറ്റ് ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു",
      accountInformation: "അക്കൗണ്ട് വിവരങ്ങൾ",
      email: "ഇമെയിൽ", accountType: "അക്കൗണ്ട് തരം", rating: "റേറ്റിംഗ്",
      placeholders: {
        farmName: "നിങ്ങളുടെ ഫാമിന്റെ പേര്", phone: "+91 9XXXXXXXXX",
        address: "പൂർണ്ണ വിലാസം", village: "ഗ്രാമത്തിന്റെ പേര്",
        district: "ജില്ല", description: "നിങ്ങളുടെ ഫാം വിവരിക്കുക..."
      }
    }
  },
  hi: {
    app: { name: "धारा ऑर्गेनिक" },
    nav: { home: "होम", about: "बारे में", features: "विशेषताएं", contact: "संपर्क", signIn: "साइन इन" },
    hero: { subtitle: "केरल का प्रीमियम ऑर्गेनिक मार्केटप्लेस", title: "धारा", tagline: "फार्म • टेबल • ट्रस्ट", desc: "केरल के सबसे पुराने ऑर्गेनिक परिवारों से आपकी टेबल तक - 24 घंटे के भीतर फार्म से घर तक।", shop: "अभी खरीदें", farmerSignIn: "किसान साइन इन" },
    dashboard: { title: "किसान डैशबोर्ड", earnings: "कुल कमाई", orders: "प्राप्त ऑर्डर", harvest: "फसल प्रविष्टियां", subscriptions: "सब्सक्राइब्ड रूटीन", warnings: "चेतावनियां", addProduct: "उत्पाद जोड़ें", ordersLink: "ऑर्डर", profile: "प्रोफाइल", logout: "लॉगआउट", home: "होम", notifications: "सूचनाएं", contact: "संपर्क" },
    product: { name: "उत्पाद का नाम", price: "मूल्य", quantity: "मात्रा", harvestTime: "कटाई का समय", availability: "उपलब्धता", delivery: "डिलीवरी विकल्प", add: "उत्पाद जोड़ें", save: "सहेजें", edit: "प्रोफाइल संपादित करें", available: "उपलब्ध", notAvailable: "उपलब्ध नहीं" },
    profile: { title: "किसान प्रोफाइल", name: "किसान का नाम", address: "फार्म का पता", phone: "फोन नंबर", village: "गांव", district: "जिला", description: "फार्म विवरण", edit: "प्रोफाइल संपादित करें", save: "प्रोफाइल सहेजें" },
    warning: { title: "चेतावनियां", count: "चेतावनी गणना", blocked: "खाता ब्लॉक कर दिया गया", active: "सक्रिय" },
    language: "भाषा",
    voice: "सुनें",
    stop: "रोकें",
    farmerSidebar: {
      dashboard: "डैशबोर्ड", products: "उत्पाद", orders: "ऑर्डर",
      revenue: "राजस्व", reviews: "समीक्षाएं", inventory: "इन्वेंटरी",
      notifications: "सूचनाएं", profile: "प्रोफाइल",
      customerView: "ग्राहक दृश्य", logout: "लॉगआउट"
    },
    farmerLayout: {
      farmer: "किसान", copyright: "© 2026 धारा मार्केटप्लेस",
      version: "किसान एडमिन पैनल v2.0"
    },
    farmerDashboard: {
      title: "डैशबोर्ड अवलोकन", welcomeBack: "आपका स्वागत है",
      addProduct: "उत्पाद जोड़ें", totalProducts: "कुल उत्पाद",
      activeOrders: "सक्रिय ऑर्डर", totalEarnings: "कुल कमाई",
      monthlyRevenue: "मासिक राजस्व", productViews: "उत्पाद दृश्य",
      rating: "रेटिंग", lowStockItems: "कम स्टॉक आइटम",
      pendingDeliveries: "लंबित डिलीवरी",
      revenueOverview: "राजस्व अवलोकन", monthlyEarnings: "मासिक कमाई",
      viewAll: "सभी देखें", recentOrders: "हाल के ऑर्डर",
      latestOrders: "नवीनतम {count} ऑर्डर", noOrdersYet: "अभी तक कोई ऑर्डर नहीं",
      orderHash: "ऑर्डर #", items: "आइटम",
      accountBlocked: "खाता ब्लॉक कर दिया गया",
      negativeReviews: "{count}/3 नकारात्मक समीक्षाएं",
      blockedDesc: "आप उत्पाद पोस्ट नहीं कर सकते। एडमिन से संपर्क करें।",
      negativeReviewDesc: "{count} गंभीर टिप्पणी{plural} प्राप्त हुई। 3 होने पर खाता ब्लॉक हो जाएगा।",
      topSellingProducts: "सर्वाधिक बिकने वाले उत्पाद",
      noSalesData: "अभी तक कोई बिक्री डेटा नहीं", sold: "बिके",
      lowStockAlerts: "कम स्टॉक अलर्ट",
      productsRunningLow: "स्टॉक खत्म हो रहे उत्पाद", manage: "प्रबंधित करें",
      allWellStocked: "सभी उत्पाद पर्याप्त स्टॉक में हैं",
      outOfStock: "स्टॉक खत्म", left: "बचे"
    },
    farmerProducts: {
      title: "उत्पाद", totalProducts: "{count} कुल उत्पाद",
      addProduct: "उत्पाद जोड़ें", productUpdated: "उत्पाद अपडेट किया गया!",
      productDeleted: "उत्पाद हटा दिया गया।",
      searchProducts: "उत्पाद खोजें...",
      noProductsFound: "कोई उत्पाद नहीं मिला",
      addYourFirst: "अपना पहला उत्पाद जोड़ें",
      outOfStock: "स्टॉक खत्म",
      stock: "स्टॉक", price: "मूल्य", category: "श्रेणी",
      product: "उत्पाद", actions: "कार्रवाइयां",
      save: "सहेजें", cancel: "रद्द करें",
      deleteProduct: "उत्पाद हटाएं?",
      cannotUndo: "यह क्रिया पूर्ववत नहीं की जा सकती।",
      delete: "हटाएं", left: "बचे"
    },
    farmerOrders: {
      title: "ऑर्डर", totalOrders: "{count} कुल ऑर्डर",
      search: "ऑर्डर आईडी या उत्पाद से खोजें...",
      noOrdersFound: "कोई ऑर्डर नहीं मिला",
      orderHash: "ऑर्डर #", items: "आइटम",
      customer: "ग्राहक", delivery: "डिलीवरी", date: "तारीख",
      products: "उत्पाद",
      moreItems: "+{count} और आइटम",
      acceptOrder: "ऑर्डर स्वीकार करें", markShipped: "भेजा गया चिह्नित करें",
      markDelivered: "डिलीवर किया गया चिह्नित करें", reject: "अस्वीकार करें",
      details: "विवरण",
      status: { all: "सभी", pending: "लंबित", processing: "प्रोसेसिंग", inTransit: "पारगमन में", delivered: "डिलीवर किया गया", cancelled: "रद्द किया गया" },
      payment: { paid: "भुगतान किया गया", pending: "लंबित" }
    },
    farmerRevenue: {
      title: "राजस्व और कमाई",
      subtitle: "आपके फार्म व्यवसाय का वित्तीय अवलोकन",
      totalEarnings: "कुल कमाई", weeklyRevenue: "साप्ताहिक राजस्व",
      monthlyRevenue: "मासिक राजस्व", pendingPayouts: "लंबित भुगतान",
      monthlyRevenueChart: "मासिक राजस्व",
      noRevenueData: "अभी तक कोई राजस्व डेटा नहीं",
      topSellingProducts: "सर्वाधिक बिकने वाले उत्पाद",
      noSalesData: "अभी तक कोई बिक्री डेटा नहीं",
      productSalesBreakdown: "उत्पाद बिक्री विवरण",
      num: "#", product: "उत्पाद", unitsSold: "बेची गई इकाइयां",
      noProductsSold: "अभी तक कोई उत्पाद नहीं बिका",
      unableToLoad: "राजस्व डेटा लोड करने में असमर्थ"
    },
    farmerReviews: {
      title: "ग्राहक समीक्षाएं",
      subtitle: "अपनी प्रतिष्ठा प्रबंधित करें और फीडबैक का जवाब दें",
      averageRating: "औसत रेटिंग", negativeReviews: "नकारात्मक समीक्षाएं",
      accountBlocked: "खाता ब्लॉक कर दिया गया", totalReviews: "कुल समीक्षाएं",
      negativeWarning: "आपकी {count} नकारात्मक समीक्षा{s} है। {remaining} और होने पर खाता ब्लॉक हो जाएगा।",
      noReviewsYet: "अभी तक कोई समीक्षा नहीं",
      reviewsAppearHere: "ग्राहकों से समीक्षाएं यहां दिखाई देंगी",
      negative: "नकारात्मक", on: "पर", yourReply: "आपका जवाब",
      writeReply: "अपना जवाब लिखें...", cancel: "रद्द करें", reply: "जवाब दें",
      customer: "ग्राहक"
    },
    farmerInventory: {
      title: "इन्वेंटरी प्रबंधन",
      subtitle: "स्टॉक स्तर ट्रैक करें और उत्पाद उपलब्धता प्रबंधित करें",
      stockUpdated: "स्टॉक अपडेट किया गया!",
      outOfStock: "स्टॉक खत्म", lowStock: "कम स्टॉक (≤5)",
      inStock: "स्टॉक में",
      outOfStockAlert: "{count} उत्पाद{s} स्टॉक से बाहर है। इन्वेंटरी अपडेट करें या नए उत्पाद जोड़ें।",
      searchProducts: "उत्पाद खोजें...",
      noProductsFound: "कोई उत्पाद नहीं मिला",
      product: "उत्पाद", category: "श्रेणी", price: "मूल्य",
      currentStock: "वर्तमान स्टॉक", status: "स्थिति", update: "अपडेट",
      addNewProduct: "नया उत्पाद जोड़ें"
    },
    farmerSettings: {
      title: "फार्म सेटिंग्स",
      subtitle: "अपनी फार्म प्रोफाइल और संपर्क जानकारी प्रबंधित करें",
      farmName: "फार्म का नाम", phoneNumber: "फोन नंबर",
      address: "पता", village: "गांव", district: "जिला",
      farmDescription: "फार्म विवरण",
      saveChanges: "बदलाव सहेजें", saving: "सहेजा जा रहा है...",
      profileUpdated: "प्रोफाइल सफलतापूर्वक अपडेट हुआ!",
      updateFailed: "प्रोफाइल अपडेट करने में विफल",
      accountInformation: "खाता जानकारी",
      email: "ईमेल", accountType: "खाता प्रकार", rating: "रेटिंग",
      placeholders: {
        farmName: "आपके फार्म का नाम", phone: "+91 9XXXXXXXXX",
        address: "पूरा पता", village: "गांव का नाम",
        district: "जिला", description: "अपने फार्म का वर्णन करें..."
      }
    }
  }
};

let currentLang = "ml";
let listeners = [];

export function setLanguage(lang) {
  if (translations[lang]) {
    currentLang = lang;
    listeners.forEach(fn => fn(lang));
    return true;
  }
  return false;
}

export function getLanguage() {
  return currentLang;
}

export function onLanguageChange(fn) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter(l => l !== fn);
  };
}

export function t(path, lang) {
  const l = lang || currentLang;
  const keys = path.split(".");
  let result = translations[l];
  for (const key of keys) {
    if (result && result[key] !== undefined) {
      result = result[key];
    } else {
      const fallbackKeys = path.split(".");
      let fallback = translations.en;
      for (const k of fallbackKeys) {
        if (fallback && fallback[k] !== undefined) {
          fallback = fallback[k];
        } else {
          return path;
        }
      }
      return fallback;
    }
  }
  return result;
}

export default translations;
