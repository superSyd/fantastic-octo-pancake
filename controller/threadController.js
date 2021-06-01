const DB = require('../controller/dbController.js');

const db = new DB()

class Thread{

  //getThread
  getRecentThreads(res){
    db.getRecentThread(res)
  }

  create(boardName, threadText, passwordDelete, res){
    db.createThread(boardName, threadText, passwordDelete, res)

  }

  update(boardName, threadId, res){
    db.updateThread(boardName, threadId, res)

  }

  delete(boardName, threadId, password, res){
    db.deleteThread(boardName, threadId, password, res)

  }

}

module.exports = Thread;