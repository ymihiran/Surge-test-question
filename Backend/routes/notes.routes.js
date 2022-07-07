const noteRouter = require("express").Router();
let Note = require("../models/note.model.js");
const auth = require('../middleware/auth');


// Add new note
noteRouter.post("/",auth,(req,res)=>{
    const email = req.body.email;
    const title = req.body.title;
    const note = req.body.note;


    const newNote = new Note({
        email,
        title,
        note
    })

    newNote.save().then(()=>{
        res.json("Note Added")
    }).catch((err)=>{
        console.log(err);
    })

})


//get paginated notes
noteRouter.get('/',auth, async (req, res) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
  
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
  
    let previous,next,count;
  
    async function countDoc(){
      count = await Note.countDocuments().exec()
    }
  
    await countDoc();
  
    const totalPages = Math.ceil(count / limit);
  
    
    
  
    if (endIndex < count) {
      next = {
        page: page + 1,
        limit: limit
      }
    }
    
    if (startIndex > 0) {
      previous = {
        page: page - 1,
        limit: limit
      }
    }
  
    Note.find().limit(limit).skip(startIndex).exec((err,notes) =>{
      if(err){
        return res.status(400).json({
          error:err
        });
      }
      return res.status(200).json({
        success:true,
        existingNotes:notes,
        prev:previous,
        next:next,
        pages:totalPages
      });
    });
  
});

//Get note by id
noteRouter.get(`/:id`,auth,async (req, res) => {

    let postId = req.params.id;
  
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
  
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
  
    let previous,next,count;
  
    async function countDoc(){
      count = await Note.find({email:postId}).countDocuments().exec()
    }
  
    await countDoc();
  
    const totalPages = Math.ceil(count / limit);
  
    
    
  
    if (endIndex < count) {
      next = {
        page: page + 1,
        limit: limit
      }
    }
    
    if (startIndex > 0) {
      previous = {
        page: page - 1,
        limit: limit
      }
    }
  
    Note.find({email:postId}).limit(limit).skip(startIndex).exec((err,notes) =>{
      if(err){
        return res.status(400).json({
          error:err
        });
      }
      return res.status(200).json({
        success:true,
        existingNotes:notes,
        prev:previous,
        next:next,
        pages:totalPages
      });
    });
  
});

//delete note by id
noteRouter.delete('/:id',auth,(req, res) => {
    Note.findByIdAndRemove(req.params.id).exec((err,deletenote) =>{
  
        if(err) return res.status(400).json({
          message:"Delete Unsuccessfull",err
        });
  
        return res.json({
          message:"Delete Successfull",deletenote
        });
    });
});

//update note by id
noteRouter.put("/:id",auth,async (req, res)=>{
    let noteId = req.params.id;
    const {email,title,note} = req.body;

    const updateNote = {
        email,
        title,
        note
    }

    const update = await Note.findByIdAndUpdate(noteId,updateNote)
    .then(()=>{
        res.status(200).send({status: "Updated"});
    }).catch((err)=>{
        console.log(err.message);
        res.status(500).send({status: "Error update"})
    })
})    
  





module.exports = noteRouter;