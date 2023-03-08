const expressAsyncHandler = require("express-async-handler");
require("colors");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const postChat = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("user haven't send userId".red);
    return res.status(400);
  }
  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("lastestMessage");
  console.log(`${isChat}`.america);

  isChat = await User.populate(isChat, {
    path: "lastestMessage.sender",
    select: "name pic email",
  });
  console.log(`${isChat}`.america);
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createChat = await Chat.create(chatData);

      const fullChat = await Chat.findOne({ _id: createChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).send(fullChat);
    } catch (e) {
      res.status(400);
      throw new Error(e.message);
    }
  }
});

const getChat = expressAsyncHandler(async (req, res) => {
  try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("lastestMessage")
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: "lastestMessage.sender",
      select: "name pic email",
    });

    res.json(chats);
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
});

const createGroup = expressAsyncHandler(async (req, res) => {
  try {
    if (!req.body.users || !req.body.name) {
      return res.status(400).json({ msg: "Please fill the all fields" });
    }

    let users = JSON.parse(req.body.users);

    if (users.length < 2) {
      return res
        .status(400)
        .json({ msg: "more that 2 users are required to create group" });
    }

    users.push(req.user);

    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGropuChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGropuChat);
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
});

const renameGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

const addInGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  console.log(chatId, userId);
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("chat not found");
  } else {
    res.json(added);
  }
});

const removeFromGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("chat not found");
  } else {
    res.json(removed);
  }
});

module.exports = {
  postChat,
  getChat,
  createGroup,
  renameGroup,
  addInGroup,
  removeFromGroup,
};
