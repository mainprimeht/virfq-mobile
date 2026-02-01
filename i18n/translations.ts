export const vi = {
  // Common
  common: {
    loading: 'Đang tải...',
    error: 'Có lỗi xảy ra',
    retry: 'Thử lại',
    cancel: 'Hủy',
    save: 'Lưu',
    delete: 'Xóa',
    edit: 'Sửa',
    back: 'Quay lại',
    next: 'Tiếp theo',
    done: 'Xong',
    search: 'Tìm kiếm',
    filter: 'Lọc',
    clear: 'Xóa',
    all: 'Tất cả',
  },
  
  // Auth
  auth: {
    login: 'Đăng nhập',
    logout: 'Đăng xuất',
    register: 'Đăng ký',
    email: 'Email',
    password: 'Mật khẩu',
    confirmPassword: 'Xác nhận mật khẩu',
    name: 'Họ tên',
    company: 'Công ty',
    phone: 'Số điện thoại',
    forgotPassword: 'Quên mật khẩu?',
    noAccount: 'Chưa có tài khoản?',
    hasAccount: 'Đã có tài khoản?',
    registerNow: 'Đăng ký ngay',
    loginNow: 'Đăng nhập ngay',
    verifyEmail: 'Xác thực email',
    enterOTP: 'Nhập mã xác thực',
    otpSent: 'Mã xác thực đã được gửi đến email của bạn',
    resendOTP: 'Gửi lại mã',
    invalidCredentials: 'Email hoặc mật khẩu không đúng',
  },
  
  // RFQ
  rfq: {
    title: 'Yêu cầu báo giá',
    list: 'Danh sách RFQ',
    detail: 'Chi tiết RFQ',
    quantity: 'Số lượng',
    targetPrice: 'Giá mục tiêu',
    incoterms: 'Điều kiện giao hàng',
    buyerCountry: 'Quốc gia người mua',
    shippingPort: 'Cảng giao hàng',
    createdAt: 'Ngày tạo',
    category: 'Danh mục',
    unlock: 'Mở khóa thông tin',
    unlocked: 'Đã mở khóa',
    contact: 'Thông tin liên hệ',
    buyerEmail: 'Email người mua',
    buyerPhone: 'SĐT người mua',
    buyerWhatsapp: 'WhatsApp',
    buyerCompany: 'Công ty người mua',
    trialRemaining: 'Còn lại {{count}} lượt dùng thử',
    noResults: 'Không tìm thấy RFQ nào',
    loadMore: 'Tải thêm',
  },
  
  // Profile
  profile: {
    title: 'Hồ sơ',
    subscription: 'Gói đăng ký',
    freePlan: 'Gói miễn phí',
    upgradePlan: 'Nâng cấp gói',
    changePassword: 'Đổi mật khẩu',
    currentPassword: 'Mật khẩu hiện tại',
    newPassword: 'Mật khẩu mới',
  },
  
  // Settings
  settings: {
    title: 'Cài đặt',
    language: 'Ngôn ngữ',
    notifications: 'Thông báo',
    about: 'Về ViRFQ',
    version: 'Phiên bản',
  },
  
  // Tabs
  tabs: {
    home: 'Trang chủ',
    profile: 'Hồ sơ',
    settings: 'Cài đặt',
  },
};

export const en = {
  // Common
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Retry',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    next: 'Next',
    done: 'Done',
    search: 'Search',
    filter: 'Filter',
    clear: 'Clear',
    all: 'All',
  },
  
  // Auth
  auth: {
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    name: 'Full Name',
    company: 'Company',
    phone: 'Phone Number',
    forgotPassword: 'Forgot Password?',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    registerNow: 'Register Now',
    loginNow: 'Login Now',
    verifyEmail: 'Verify Email',
    enterOTP: 'Enter verification code',
    otpSent: 'Verification code has been sent to your email',
    resendOTP: 'Resend Code',
    invalidCredentials: 'Invalid email or password',
  },
  
  // RFQ
  rfq: {
    title: 'Request for Quotation',
    list: 'RFQ List',
    detail: 'RFQ Detail',
    quantity: 'Quantity',
    targetPrice: 'Target Price',
    incoterms: 'Incoterms',
    buyerCountry: 'Buyer Country',
    shippingPort: 'Shipping Port',
    createdAt: 'Created At',
    category: 'Category',
    unlock: 'Unlock Contact',
    unlocked: 'Unlocked',
    contact: 'Contact Information',
    buyerEmail: 'Buyer Email',
    buyerPhone: 'Buyer Phone',
    buyerWhatsapp: 'WhatsApp',
    buyerCompany: 'Buyer Company',
    trialRemaining: '{{count}} trial unlocks remaining',
    noResults: 'No RFQs found',
    loadMore: 'Load More',
  },
  
  // Profile
  profile: {
    title: 'Profile',
    subscription: 'Subscription',
    freePlan: 'Free Plan',
    upgradePlan: 'Upgrade Plan',
    changePassword: 'Change Password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
  },
  
  // Settings
  settings: {
    title: 'Settings',
    language: 'Language',
    notifications: 'Notifications',
    about: 'About ViRFQ',
    version: 'Version',
  },
  
  // Tabs
  tabs: {
    home: 'Home',
    profile: 'Profile',
    settings: 'Settings',
  },
};

export type Translations = typeof vi;
