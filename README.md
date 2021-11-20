# [Anonymous Message Board Project](https://boilerplate-project-messageboard.supersyd.repl.co/)

Test Cases
- Only allow your site to be loaded in an iFrame on your own pages.
- Do not allow DNS prefetching.
- Only allow your site to send the referrer for your own pages.
- You can send a POST request to /api/threads/{board} with form data including text and delete_password. The saved database record will have at least the fields _id, text, created_on(date & time), bumped_on(date & time, starts same as created_on), reported (boolean), delete_password, & replies (array).
- You can send a POST request to /api/replies/{board} with form data including text, delete_password, & thread_id. This will update the bumped_on date to the comment's date. In the thread's replies array, an object will be saved with at least the properties _id, text, created_on, delete_password, & reported.
- You can send a GET request to /api/threads/{board}. Returned will be an array of the most recent 10 bumped threads on the board with only the most recent 3 replies for each. The reported and delete_password fields will not be sent to the client.
- You can send a GET request to /api/replies/{board}?thread_id={thread_id}. Returned will be the entire thread with all its replies, also excluding the same fields from the client as the previous test.
- You can send a DELETE request to /api/threads/{board} and pass along the thread_id & delete_password to delete the thread. Returned will be the string incorrect password or success.
- You can send a DELETE request to /api/replies/{board} and pass along the thread_id, reply_id, & delete_password. Returned will be the string incorrect password or success. On success, the text of the reply_id will be changed to [deleted].
- You can send a PUT request to /api/threads/{board} and pass along the thread_id. Returned will be the string success. The reported value of the thread_id will be changed to true.
- You can send a PUT request to /api/replies/{board} and pass along the thread_id & reply_id. Returned will be the string success. The reported value of the reply_id will be changed to true.
