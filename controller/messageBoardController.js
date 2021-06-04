const mongoose = require('mongoose')

const myDB = process.env['DB']

mongoose.connect(myDB, {
  useNewURLParser: true, 
  useUnifiedTopology: true
});

if(!mongoose.connection.readyState){
  console.log("database error")
}

const threadSchema = new mongoose.Schema({
    boardName: {
      type: String
    },
    text: {
      type: String,
      required: true
      },
    created_on: {
      type: Date,
      required: true
      },
    bumped_on: {
      type: Date,
      required: true
      },
    reported: {
      type: Boolean,
      required: true
      },
    delete_password: {
      type: String,
      required: true
    },
    replies: {
      type: Array
    }
    
  })

  let Thread = mongoose.model("thread", threadSchema);

  class MessageBoardController{

    //getThread
  async getThreadReplies(boardName, threadId, res){
    await Thread.findById({_id: threadId, boardName: boardName}, (err,data)=>{
      if(err || data == null || data == ""){
        console.log(err," getThreadReplies")
      } else {
       // console.log(data,"HERERE")
      /*  console.log({
            board: data.boardName,
            _id: data._id,
            text: data.text,
            created_on: data.created_on,
            bumped_on: data.bumped_on,
            replies: data.replies
          },"GET THREAD REPLIES") */
          return res.json({
             board: data.boardName,
            _id: data._id,
            text: data.text,
            created_on: data.created_on,
            bumped_on: data.bumped_on,
            replies: data.replies
          })
        
      }
    })

  }

  async getRecentThread(boardName, res){
    await Thread.find({boardName: boardName},(err,data)=>{
      if(err || data == null || data == ""){
        console.log(data,"getRecentThread")
      } else if(data){
        var myArray = data.map(item =>{

          var myRepliesArray = []

          if(item.replies.length > 0){
            myRepliesArray = item.replies.sort((a,b) =>{
            return new Date(b.created_on) - new Date(a.created_on)
          })

          myRepliesArray = myRepliesArray.slice(0,3)

          //console.log(myRepliesArray,"TESTHERE")

          }

          return {
            _id: item._id,
            text: item.text,
            created_on: item.created_on,
            bumped_on: new Date(item.bumped_on),
            replies: myRepliesArray
          }
        })

       // console.log(myArray, "GET RECENT THREAD")

        return res.send(myArray)


      }
    }).sort({bumped_on: -1}).limit(10)

  }

  async createThread(boardName, threadText, passwordDelete, res){
            var myDate = new Date().toISOString()

    const myThread = new Thread({
      boardName: boardName,
      text: threadText,
      created_on: myDate,
      bumped_on: myDate,
      reported: false,
      delete_password: passwordDelete
    })

    await myThread.save((err, threadData)=>{
      if(err || threadData == null || threadData == ""){
       // console.log(err,"createThread")
      } else if(threadData) {
        console.log(threadData, "NEW THREAD CREATED")
        //console.log(process)
            return res.redirect('/b/'+boardName);

       // return res.send("success")

      }
    })

  }

  async updateThread(boardName, threadId, res){
    await Thread.findById({_id: threadId, boardName: boardName},(err, data)=>{
      if(err){
        console.log(err)
      } else if(data){
        data.reported = true

        data.save((err,data)=>{
          if(err || data == null || data == ""){
            console.log(err,"updateThread")
          } else if(data){
            console.log("THREAD REPORTED")
            return res.send("success")
          }
        })

      }
    })
  }

  async deleteThread(boardName, threadId, password, res){
    await Thread.findById({_id: threadId, boardName: boardName, delete_password: password},(err, data) =>{
      if(err || data == null || data == ""){
        console.log(err)
        
        
      } else if(data){

        if(data.delete_password != password){
          console.log("DELETE THREAD INCORRECT PASSWORD")
          return res.send("incorrect password")
        } else {
          data.remove((err,data)=>{
          if(err){
            console.log(err)
          } else if(data){
            console.log("DELETE THREAD SUCCESS")
            return res.send("success")

          }
        })

        }
        

      }
    })


  }

  async createReply(boardName, threadId, threadText, password, res){
    //console.log(boardName,"HERE")
    await Thread.findById({_id: threadId,boardName: boardName},(err,data)=>{
      //console.log(data)
      if(err || data == null || data == ""){
        console.log(err, "createReply1")
      } else if(data) {
        var myDate = new Date().toISOString()
        data.bumped_on = myDate
        data.replies.push({
          _id: mongoose.Types.ObjectId(),
          text: threadText,
          created_on: myDate,
          delete_password: password,
          reported: false
        })

        data.save((err,data)=>{
        if(err || data == null || data == ""){
          console.log(err,"createReply2")
        } else if(data){
          console.log(data, "NEW REPLY CREATED")
          //return res.send("success")
          return res.redirect('/b/' + boardName + '/' + threadId)
        }
        })

      }
      
    })

  }

  async updateReply(boardName, threadId, replyId, res){
    await Thread.findById({_id: threadId,boardName: boardName,
      'replies._id': replyId
    },(err,data)=>{
      if(err || data == null || data == ""){
        console.log(err)
      } else if(data){

        for(let i in data.replies){
          if(data.replies[i][id] == replyId){
            data.replies[i][reported] = true
          }

        }

        data.save((err,data)=>{
          if(err || data == null || data == ""){
          console.log(err,"updateReply")
        } else if(data){
         // console.log("REPLY REPORTED")
          return res.send("success")
        }
        })

        
        
      }
    })

  }

  async deleteReply(boardName, threadId, replyId, password, res){
    await Thread.findById({id: threadId,boardName: boardName},(err,data)=>{
      if(err || data == null || data == ""){
        console.log(err)
        
        } else if(data){
          var myArray = []
          var myValidArray = []

          for(let i in data.replies){
            if(data.replies[i]._id != replyId && data.delete_password != password){
              myArray.push(data.replies[i])
            } else {
              myValidArray.push(data.replies[i])
            }
          }

          if(myValidArray.length == 0){
            console.log("DELETE REPLY INCORRECT PASSWORD")
            return res.send("incorrect password")
          } else {
            data.replies = myArray

          data.save((err,data)=>{
            if(err || data == null || data == ""){
              console.log(err)
            } else if(data) {
              console.log("DELETE REPLY SUCCESS")
              return res.send("success")

            }
          })

          }

          
          

        }
    })

  }

  }

  


module.exports = MessageBoardController;