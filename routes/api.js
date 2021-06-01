'use strict';

const Reply = require('../controller/replyController.js');
const Thread = require('../controller/threadController.js');

module.exports = function (app) {

  const thread = new Thread()
  const reply = new Reply()

  //get thread
  app.route('/api/threads/:board')
  .get((req,res) => {
    thread.getRecentThreads(res)
  })
  
  app.route('/api/threads/:board')
  .post((req,res) =>{
    //create new thread

    let boardName = req.body.board
    let threadText = req.body.text
    let passwordDelete = req.body.delete_password

    if(threadText && passwordDelete){
      thread.create(boardName, threadText, passwordDelete, res)

    } else {
      res.send("Please enter field(s)")
    }

  });
  
  
  //report thread
  app.route('/api/threads/:board')
  .put((req,res) =>{

    let boardName = req.body.board
    let threadId = req.body.thread_id

    if(threadId){
      thread.update(boardName, threadId, res)

    } else {
      res.send("Please enter field(s)")
    }

  });
  //delete thread
  app.route('/api/threads/:board')
  .delete((req,res) =>{

    let boardName = req.body.board
    let threadId = req.body.thread_id
    let password = req.body.delete_password

    if(threadId && password){
      thread.delete(boardName, threadId, password, res)

    } else {
      res.send("Please enter field(s)")
    }

  });
    
  app.route('/api/replies/:board')
  .post((req,res) =>{
    //create new reply

    let boardName = req.body.board
    let threadId = req.body.thread_id
    let threadText = req.body.text
    let password = req.body.delete_password

    if( threadId && threadText && password){
      reply.create(boardName, threadId, threadText, password, res)

    } else {
      res.send("Please enter field(s)")
    }

  });
  //report reply
  app.route('/api/replies/:board')
  .put((req,res) =>{

    let boardName = req.body.board
    let threadId = req.body.thread_id
    let replyId = req.body.reply_id

    if( threadId && threadText && password){
      reply.update(boardName, threadId, replyId, res)

    } else {
      res.send("Please enter field(s)")
    }

  });
  //delete reply
  app.route('/api/replies/:board')
  .delete((req,res) =>{

    let boardName = req.body.board
    let threadId = req.body.thread_id
    let replyId = req.body.reply_id
    let password = req.body.delete_password


    if( threadId && threadText && password){
      reply.delete(boardName, threadId, replyId, password, res)

    } else {
      res.send("Please enter field(s)")
    }

  });

  //get thread id
  app.route('/api/replies/{board}')
  .get((req,res) => {
    let threadId = req.query.thread_id

    if(threadId){
      reply.getThreadReplies(threadId, res)

    } else {
      res.send("Please enter threadId value")
    }

    
  })

};
