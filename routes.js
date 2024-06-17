const express = require('express');
const router = express.Router();

let avatars = [
  { id: 1, nickname: 'user1', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', value: 100 },
  { id: 2, nickname: 'user2', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', value: 150 },
  { id: 3, nickname: 'user3', avatar: 'https://randomuser.me/api/portraits/men/4.jpg', value: 200 },
  { id: 4, nickname: 'user4', avatar: 'https://randomuser.me/api/portraits/women/4.jpg', value: 250 },
];

let userAvatars = [];

let currentUser = {
  avatar: null,
  nickname: null,
  coins: 100
};

router.post('/select-avatar', (req, res) => {
  const { avatar, nickname, coins } = req.body;
  if (!avatar || !nickname) {
    return res.json({ success: false, message: 'Avatar and nickname are required' });
  }
  currentUser.avatar = avatar;
  currentUser.nickname = nickname;
  currentUser.coins = coins;
  res.json({ success: true });
});

router.post('/buy', (req, res) => {
  const { userId, price } = req.body;
  const avatar = avatars.find(av => av.id === userId);
  if (avatar) {
    userAvatars.push(avatar);
    avatars = avatars.filter(av => av.id !== userId);
    currentUser.coins -= price;
    res.json({ success: true, message: 'Purchase successful' });
  } else {
    res.json({ success: false, message: 'Avatar not found' });
  }
});

router.post('/sell', (req, res) => {
  const { userId, price } = req.body;
  const avatar = userAvatars.find(av => av.id === userId);
  if (avatar) {
    avatars.push(avatar);
    userAvatars = userAvatars.filter(av => av.id !== userId);
    currentUser.coins += price;
    res.json({ success: true, message: 'Sale successful' });
  } else {
    res.json({ success: false, message: 'Avatar not found' });
  }
});

router.get('/avatars', (req, res) => {
  res.json(avatars);
});

router.get('/user-avatars', (req, res) => {
  res.json(userAvatars);
});

module.exports = router;
