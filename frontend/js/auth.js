// auth.js - Quản lý xác thực người dùng

function saveAuth(data) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify({
    _id: data._id,
    name: data.name,
    email: data.email,
    role: data.role,
    address: data.address || ''
  }));
}

function getToken() {
  return localStorage.getItem('token');
}

function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

function isLoggedIn() {
  return !!getToken();
}

function isAdmin() {
  const user = getUser();
  return !!(user && user.role === 'admin');
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/index.html';
}

// Bảo vệ trang yêu cầu đăng nhập (dùng cho customer pages)
function protectPage() {
  if (!isLoggedIn()) {
    alert('Vui lòng đăng nhập để tiếp tục');
    window.location.href = '/login.html';
  }
}

// Bảo vệ trang admin - gọi API /auth/profile để xác thực role
async function protectAdminPage() {
  if (!isLoggedIn()) {
    alert('Vui lòng đăng nhập với quyền admin');
    window.location.href = '/login.html';
    return;
  }

  try {
    const profile = await apiGet('/auth/profile');
    if (profile.role !== 'admin') {
      alert('Bạn không có quyền truy cập trang này');
      window.location.href = '/index.html';
    }
  } catch (error) {
    alert('Vui lòng đăng nhập lại');
    logout();
  }
}

// Cập nhật navbar dựa trên trạng thái đăng nhập
function updateNavbar() {
  const loggedIn = isLoggedIn();
  const user = getUser();

  const navLogin = document.getElementById('nav-login');
  const navRegister = document.getElementById('nav-register');
  const navLogout = document.getElementById('nav-logout');
  const navProfile = document.getElementById('nav-profile');
  const navAdmin = document.getElementById('nav-admin');
  const navUserName = document.getElementById('nav-user-name');

  if (loggedIn) {
    if (navLogin) navLogin.classList.add('d-none');
    if (navRegister) navRegister.classList.add('d-none');
    if (navLogout) navLogout.classList.remove('d-none');
    if (navProfile) navProfile.classList.remove('d-none');
    if (navUserName) navUserName.textContent = user ? user.name : '';
    if (navAdmin) {
      if (user && user.role === 'admin') {
        navAdmin.classList.remove('d-none');
      } else {
        navAdmin.classList.add('d-none');
      }
    }
  } else {
    if (navLogin) navLogin.classList.remove('d-none');
    if (navRegister) navRegister.classList.remove('d-none');
    if (navLogout) navLogout.classList.add('d-none');
    if (navProfile) navProfile.classList.add('d-none');
    if (navAdmin) navAdmin.classList.add('d-none');
  }

  const logoutBtn = document.getElementById('nav-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
}

document.addEventListener('DOMContentLoaded', updateNavbar);
