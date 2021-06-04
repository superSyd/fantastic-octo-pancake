const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  var threadId
  //Creating a new thread: POST request to /api/threads/{board}
  test("Creating a new thread: POST request to /api/threads/{board}", function (done) {
       chai
        .request(server)
        .post("/api/threads/specific")
        .send({
          board: "specific",
          text: "Hello",
          delete_password: "delete_me"
        })
        .end(async function (err, res) {
          await assert.equal(res.status, 200);

          done();
        });
    });

  //Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}
  test("Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}", function (done) {
      chai
        .request(server)
        .get("/api/threads/specific")
        .end(async function (err, res) {
          await assert.equal(res.status, 200);
          //console.log(res)
          await assert.isBelow(res.body.length, 11)
          await assert.isBelow(res.body[0].replies.length,4)

          threadId = res.body[0]._id

          done();
        });
    });

//Creating a new reply: POST request to /api/replies/{board}
  var replyId
  test("Creating a new reply: POST request to /api/replies/{board}", function (done) {
       chai
        .request(server)
        .post("/api/replies/specific")
        .send({
          board: "specific",
          thread_id: threadId,
          text: "Hello Reply",
          delete_password: "delete_reply"
        })
        .end(async function (err, res) {
          await assert.equal(res.status, 200);

          done();
        });
    });
  
  //Viewing a single thread with all replies: GET request to /api/replies/{board}
  test("Viewing a single thread with all replies: GET request to /api/replies/{board}", function (done) {
       chai
        .request(server)
        .get("/api/replies/specific?thread_id="+threadId)
        .end(async function (err, res) {
          await assert.equal(res.status, 200);
          await assert.equal(res.body.replies.length,1)
          
          replyId = res.body.replies[0]._id


          done();
        });
    });
  
  //Deleting a reply with the incorrect password: DELETE request to /api/replies/{board} with an invalid delete_password
  test("Deleting a reply with the incorrect password: DELETE request to /api/replies/{board} with an invalid delete_password", function (done) {
      chai
        .request(server)
        .delete("/api/threads/specific")
        .send({
          board: "specific",
          thread_id: threadId,
          reply_id: replyId,
          delete_password: "delete"
        })
        .end(async function (err, res) {
          await assert.equal(res.status, 200);
          await assert.equal(res.text, "incorrect password")

          done();
        });
    });

    //Reporting a reply: PUT request to /api/replies/{board}
  test("Reporting a reply: PUT request to /api/replies/{board}", function (done) {
      chai
        .request(server)
        .put("/api/threads/specific")
        .send({
          board: "specific",
          thread_id: threadId,
          reply_id: replyId
        })
        .end(async function (err, res) {
          await assert.equal(res.status, 200);
          await assert.equal(res.text, "success")

          done();
        });
    });
  
  //Deleting a reply with the correct password: DELETE request to /api/replies/{board} with a valid delete_password
  test("Deleting a reply with the correct password: DELETE request to /api/replies/{board} with a valid delete_password", function (done) {
      chai
        .request(server)
        .delete("/api/threads/specific")
        .send({
          board: "specific",
          thread_id: threadId,
          reply_id: replyId,
          delete_password: "delete_reply"
        })
        .end(async function (err, res) {
          await assert.equal(res.status, 200);
          await assert.equal(res.text, "incorrect password")

          done();
        });
    });
  
  //Deleting a thread with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password
  test("Deleting a thread with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password", function (done) {
      chai
        .request(server)
        .delete("/api/threads/specific")
        .send({
          board: "specific",
          thread_id: threadId,
          delete_password: "delete"
        })
        .end(async function (err, res) {
          await assert.equal(res.status, 200);
          //console.log(res)
          await assert.equal(res.text, "incorrect password")

          done();
        });
    });

    //Reporting a thread: PUT request to /api/threads/{board}
  test("Reporting a thread: PUT request to /api/threads/{board}", function (done) {
      chai
        .request(server)
        .put("/api/threads/specific")
        .send({
          board: "specific",
          thread_id: threadId
        })
        .end(async function (err, res) {
          await assert.equal(res.status, 200);
          await assert.equal(res.text, "success")

          done();
        });
    });
  
  //Deleting a thread with the correct password: DELETE request to /api/threads/{board} with a valid delete_password
  test("Deleting a thread with the correct password: DELETE request to /api/threads/{board} with a valid delete_password", function (done) {
      chai
        .request(server)
        .delete("/api/threads/specific")
        .send({
          board: "specific",
          thread_id: threadId,
          delete_password: "delete_me"
        })
        .end(async function (err, res) {
          await assert.equal(res.status, 200);
          await assert.equal(res.text, "success")

          done();
        });
    });
  
  
});
