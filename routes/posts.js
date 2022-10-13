const router = require('express').Router();
const Post = require("../models/Post");

router.post("/posts", async (req, res) => {

    //create a post
    const post = new Post(
        {
            description: req.body.description,
        
        }
    )

    // Save post in the database
    await post.save(post)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating new USER."
            });
        });
});
/*
router.get("/posts",(req, res) => {
    const description = req.query.description;
    var condition = description ? { description: { $regex: new RegExp(description), $options: "i" } } : {};
  
    Post.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials."
        });
      });
  }) */

// Find all Posts
router.get("/posts", async (req, res) => {
    const query = req.query.latest;

    try {
        const posts = query ? await Post.find().sort({ _id: -1 }).limit(1) :
            await Post.find();
        res.status(200).send(posts)
    }
    catch (err) {
        res.status(403).send(err)
    }
}
)

//Find Post By ID
router.get("/posts/:id", async (req, res) => {
    const id = req.params.id;
    await Post.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Post not found with this id" })
            else
                res.json(data)
        })
        .catch(err => {
            res.status(500).send({ message: "error occuring with this id= " + err })
        })
});

// Find Post by ID and Update
router.put("/posts/:id", async (req, res) => {

    if (!req.body) {
        res.status(400).send({ message: "Data to Update can not be empty" })
    };

    const id = req.params.id;

    await Post.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(400).send({ message: "can not update with this id=${id} because post did not find by this id" })
            } else
                res.status(200).send({ message: "Post has updated successfully" })
        })
        .catch(err => {
            res.status(403).send({ message: "Eroor comming in updating Post with id =" + err })
        })
});

// Find Post through Id and remove
router.delete("/posts/:id",(req,res)=>{
    const id= req.params.id;

    Post.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Post with id=${id}. Maybe Post was not found!`
        });
      } else {
        res.send({
          message: "Post has deleted successfully!"
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Post with id=" + id
      })
    })
});

// Delete All Posts 
 router.delete("/posts",(req,res)=>{

    Post.deleteMany({})
    .then(data=>{
        res.status(200).send({meaaage:`${data.deletedCount} posts has been removed successfully`})
    })
    .catch(err=>{
        res.status(500).json({
            message: err.message || "some errors are occuring while removing all posts."
        })
    })
}); 

/* try{
     const newPost= new Post({
         description: req.body.description
     });

     newPost.save(newPost)
     .then(data => {
         res.send(data);
     })
     .catch(err => {
         res.status(500).send({
             message:
                 err.message || "Some error occurred while creating new Post."
         });
     });
 
 const post= await newPost.save();
 res.status(200).json(post);
} 
 catch(err){
     res.status(500).send(err);
 }
}); */

module.exports = router


