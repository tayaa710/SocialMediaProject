const postsRouter = require('express').Router()
const User = require('../models/user')
const Post = require('../models/post')
const { tokenExtractor, userExtractor } = require('../utils/middleware');

postsRouter.get('/', async (request, response) => {
  const posts = await Post.find({}).populate("userId", { firstName: 1, lastName: 1 })
  response.json(posts)
})

//Create a post
postsRouter.post('/', tokenExtractor, userExtractor, async (req, res) => {
  const { description, image } = req.body
  const newPost = new Post({
    userId: req.user.id,
    description,
    image
  })
  const post = await newPost.save()
  const postId = post._id
  const user = await User.findById(req.user.id)
  user.posts = user.posts.concat(postId)
  await User.findByIdAndUpdate(user._id, user)

  res.status(201).json(post)
})


//update a post

postsRouter.put('/:id', tokenExtractor, userExtractor, async (req, res) => {
  const postToEdit = await Post.findById(req.params.id);
  if (postToEdit.userId.toString() === req.user.id.toString()) {
    const post = await Post.findByIdAndUpdate(req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
    res.status(200).json(post)
  }else{
    res.status(401).json({"error":"You do not have permission to edit this post"})
  }
})

//delete a post

//like a post

//get a post

//get all posts of the users followings (timeline)


module.exports = postsRouter