const DB = require('../controller/dbController.js');

const db = new DB()

class Thread{

  //getThread
  async getRecentThreads(res){
    await db.getRecentThread(res)
  }

  async create(boardName, threadText, passwordDelete, res){
    await db.createThread(boardName, threadText, passwordDelete, res)

  }

  async update(boardName, threadId, res){
    await db.updateThread(boardName, threadId, res)

  }

  async delete(boardName, threadId, password, res){
    await db.deleteThread(boardName, threadId, password, res)

  }

}

module.exports = Thread;