document.addEventListener('DOMContentLoaded', () => {
    Telegram.WebApp.ready();
  
    let playerCoins = 100;
    let boughtAvatars = 0;
    let currentUser = {
      avatar: null,
      nickname: null
    };
  
    function selectAvatar(avatar) {
      const nickname = document.getElementById('nickname').value.trim();
      if (!nickname) {
        alert('Please enter a nickname');
        return;
      }
  
      fetch('/api/select-avatar', {
        method: 'POST',
        body: JSON.stringify({ avatar, nickname, coins: playerCoins }),
        headers: { 'Content-Type': 'application/json' }
      }).then(response => response.json()).then(result => {
        if (result.success) {
          document.getElementById('landing-page').style.display = 'none';
          document.getElementById('main-menu').style.display = 'block';
          currentUser.avatar = avatar;
          currentUser.nickname = nickname;
          updateProfile(avatar, nickname, playerCoins, boughtAvatars);
        } else {
          alert('Failed to select avatar and nickname');
        }
      });
    }
  
    function updateProfile(avatar, nickname, coins, avatars) {
      document.getElementById('profile-avatar').src = avatar;
      document.getElementById('profile-nickname').textContent = nickname;
      document.getElementById('coin-count').textContent = coins;
      document.getElementById('bought-avatars').textContent = avatars;
    }
  
    function showMainMenu() {
      document.getElementById('marketplace').style.display = 'none';
      document.getElementById('main-menu').style.display = 'block';
    }
  
    function showMarketplace() {
      document.getElementById('main-menu').style.display = 'none';
      document.getElementById('marketplace').style.display = 'block';
      loadAvatars();
      loadUserAvatars();
    }
  
    function loadAvatars() {
      fetch('/api/avatars').then(response => response.json()).then(avatars => {
        displayAvatars(avatars, 'avatars', buyAvatar);
      });
    }
  
    function loadUserAvatars() {
      fetch('/api/user-avatars').then(response => response.json()).then(avatars => {
        displayAvatars(avatars, 'my-avatars', sellAvatar);
      });
    }
  
    function displayAvatars(avatars, containerId, action) {
      const container = document.getElementById(containerId);
      container.innerHTML = '';
      avatars.forEach(avatar => {
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar';
        avatarDiv.innerHTML = `
          <img src="${avatar.avatar}" alt="Avatar">
          <h3>${avatar.nickname}</h3>
          <p>Value: <img src="coin.png" alt="Coins" class="coin-icon"> ${avatar.value} coins</p>
          <button onclick="${action.name}(${avatar.id}, ${avatar.value})">${action.name === 'buyAvatar' ? 'Buy' : 'Sell'} for ${avatar.value} coins</button>
        `;
        container.appendChild(avatarDiv);
      });
    }
  
    function buyAvatar(userId, price) {
      if (playerCoins < price) {
        alert('Not enough coins to buy this avatar');
        return;
      }
  
      fetch('/api/buy', {
        method: 'POST',
        body: JSON.stringify({ userId, price }),
        headers: { 'Content-Type': 'application/json' }
      }).then(response => response.json()).then(result => {
        if (result.success) {
          playerCoins -= price;
          boughtAvatars++;
          updateProfile(currentUser.avatar, currentUser.nickname, playerCoins, boughtAvatars);
          alert('Purchase successful!');
          loadAvatars();
          loadUserAvatars();
        } else {
          alert('Purchase failed');
        }
      });
    }
  
    function sellAvatar(userId, price) {
      fetch('/api/sell', {
        method: 'POST',
        body: JSON.stringify({ userId, price }),
        headers: { 'Content-Type': 'application/json' }
      }).then(response => response.json()).then(result => {
        if (result.success) {
          playerCoins += price;
          boughtAvatars--;
          updateProfile(currentUser.avatar, currentUser.nickname, playerCoins, boughtAvatars);
          alert('Sale successful!');
          loadAvatars();
          loadUserAvatars();
        } else {
          alert('Sale failed');
        }
      });
    }
  
    window.selectAvatar = selectAvatar;
    window.buyAvatar = buyAvatar;
    window.sellAvatar = sellAvatar;
    window.showMainMenu = showMainMenu;
    window.showMarketplace = showMarketplace;
  });
  