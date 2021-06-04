'use strict';

const MessageBoardController = require('../controller/messageBoardController.js');

module.exports = function (app) {

  const messageBoard = new MessageBoardController()

  

  //get thread
  app.route('/api/threads/:board')
  .get(async (req,res) => {
    
    let boardName = req.params.board

    await messageBoard.getRecentThread(boardName, res)
  })
  
  app.route('/api/threads/:board')
  .post(async (req,res) =>{
    //create new thread

    let boardName = req.params.board
    let threadText = req.body.text
    let passwordDelete = req.body.delete_password

    if(threadText && passwordDelete){

      await messageBoard.createThread(boardName, threadText, passwordDelete, res)
      
    } else {
      return res.send("Please enter field(s)")
    }

  });
  
  
  //report thread
  app.route('/api/threads/:board')
  .put(async (req,res) =>{

    let boardName = req.params.board
    let threadId = req.body.thread_id

    if(threadId){
      await messageBoard.updateThread(boardName, threadId, res)

    } else {
      return res.send("Please enter field(s)")
    }

  });
  //delete thread
  app.route('/api/threads/:board')
  .delete(async (req,res) =>{

    let boardName = req.params.board
    let threadId = req.body.thread_id
    let password = req.body.delete_password

    if(threadId && password){
      await messageBoard.deleteThread(boardName, threadId, password, res)

    } else {
      return res.send("Please enter field(s)")
    }

  });
    
  app.route('/api/replies/:board')
  .post(async (req,res) =>{
    //create new reply

    //console.log(req.params.board, "HERE")

    let boardName = req.params.board
    let threadId = req.body.thread_id
    let threadText = req.body.text
    let password = req.body.delete_password

    if( threadId && threadText && password){
      await messageBoard.createReply(boardName, threadId, threadText, password, res)

    } else {
      return res.send("Please enter field(s)")
    }

  });
  //report reply
  app.route('/api/replies/:board')
  .put(async (req,res) =>{

    let boardName = req.params.board
    let threadId = req.body.thread_id
    let replyId = req.body.reply_id

    if( threadId && replyId && password){
      await messageBoard.updateReply(boardName, threadId, replyId, res)

    } else {
      return res.send("Please enter field(s)")
    }

  });
  //delete reply
  app.route('/api/replies/:board')
  .delete(async (req,res) =>{

    let boardName = req.params.board
    let threadId = req.body.thread_id
    let replyId = req.body.reply_id
    let password = req.body.delete_password


    if( threadId && replyId && password){
      await messageBoard.deleteReply(boardName, threadId, replyId, password, res)

    } else {
      return res.send("Please enter field(s)")
    }

  });

  //get thread id
  app.route('/api/replies/:board')
  .get(async (req,res) => {
    //console.log(req.url, "here")
    let threadId = req.query.thread_id
    let boardName = req.params.board

    if(threadId){
      await messageBoard.getThreadReplies(boardName,threadId, res)

    } else {
      return res.send("Please enter threadId value")
    }

    
  })

};
