const DB = require('../controller/dbController.js');

const db = new DB()

class Reply{

  getThreadReplies(threadId, res){
    db.getThreadReplies(threadId, res)

  }

  create(boardName, threadId, threadText, password, res){
    db.createReply(boardName, threadId, threadText, password, res)

  }

  update(boardName, threadId, replyId, res){
    db.updateReply(boardName, threadId, replyId, res)

  }

  delete(boardName, threadId, replyId, password, res){
    db.deleteReply(boardName, threadId, replyId, password, res)
  }

}

module.exports = Reply;