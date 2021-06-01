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
    text: {
      type: String,
      required: true
      },
    created_on: {
      type: String,
      required: true
      },
    bumped_on: {
      type: String,
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


class DB{

  //getThread
  getThreadReplies(threadId, res){
    Thread.findById(threadId,(err,data)=>{
      if(err || data == null || data == ""){
        console.log(err," getThreadReplies")
      } else {
        console.log({
            _id: item._id,
            text: item.text,
            created_on: item.created_on,
            bumped_on: item.bumped_on,
            replies: item.replies
          },"GET THREAD REPLIES")
          return res.json({
            _id: item._id,
            text: item.text,
            created_on: item.created_on,
            bumped_on: item.bumped_on,
            replies: item.replies
          })
        
      }
    })

  }

  getRecentThread(res){
    Thread.find({sort: {bumped_on: -1}, limit: 10},(err,data)=>{
      if(err || data == null || data == ""){
        console.log(err,"getRecentThread")
      } else if(data){
        var myArray = data.map(item =>{

          var myRepliesArray = item.replies.sort((a,b) =>{
            return new Date(a) - new Date(b)
          })

          myRepliesArray = myRepliesArray.slice(0,4)

          return {
            _id: item._id,
            text: item.text,
            created_on: item.created_on,
            bumped_on: new Date(item.bumped_on),
            replies: myRepliesArray
          }
        })

        console.log(myArray, "GET RECENT THREAD")

        return res.send(myArray)


      }
    })

  }

  createThread(boardName, threadText, passwordDelete, res){
            var myDate = new Date().toISOString()

    const myThread = new Thread({
      text: threadText,
      created_on: myDate,
      bumped_on: myDate,
      reported: false,
      delete_password: passwordDelete
    })

    myThread.save((err, threadData)=>{
      if(err || threadData == null || threadData == ""){
        console.log(err,"createThread")
      } else if(threadData) {
        console.log(threadData, "NEW THREAD CREATED")

      }
    })

  }

  updateThread(boardName, threadId, res){
    Thread.findById(threadId, (err, data)=>{
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

  deleteThread(boardName, threadId, password, res){
    Thread.findByIdAndDelete(threadId,{delete_password: password},(err, data) =>{
      if(err || data == null || data == ""){
        console.log("DELETE THREAD INCORRECT PASSWORD")

        return res.send("incorrect password")
        
      } else if(data){
        console.log("DELETE THREAD SUCCESS")
        return res.send("success")


      }
    })


  }

  createReply(boardName, threadId, threadText, password, res){
    Thread.findById(threadId,(err,data)=>{
      if(err || data == null || data == ""){
        console.log(err)
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
          console.log(err,"createReply")
        } else if(data){
          console.log(data, "NEW REPLY CREATED")
        }
        })

      }
      
    })

  }

  updateReply(boardName, threadId, replyId, res){
    Thread.findById(threadId,(err,data)=>{
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
          console.log("REPLY REPORTED")
          return res.send("success")
        }
        })

        
        
      }
    })

  }

  deleteReply(boardName, threadId, replyId, password, res){
    Thread.findByIdAndDelete(threadId,
    {
      'replies._id': replyId,
      'replies.delete_password': password
    },(err,data)=>{
      if(err || data == null || data == ""){
        console.log("DELETE REPLY INCORRECT PASSWORD")
          return res.send("incorrect password")
        } else if(data){
          console.log("DELETE REPLY SUCCESS")
          return res.send("success")

        }
    })

  }


}

module.exports = DB;