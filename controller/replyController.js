const DB = require('../controller/dbController.js');

const db = new DB()

class Reply{

  async getThreadReplies(threadId, res){
    await db.getThreadReplies(threadId, res)

  }

  async create(boardName, threadId, threadText, password, res){
    await db.createReply(boardName, threadId, threadText, password, res)

  }

  async update(boardName, threadId, replyId, res){
    await db.updateReply(boardName, threadId, replyId, res)

  }

  async delete(boardName, threadId, replyId, password, res){
    await db.deleteReply(boardName, threadId, replyId, password, res)
  }

}

module.exports = Reply;