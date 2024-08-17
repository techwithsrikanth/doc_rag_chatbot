Doc-RAG Chatbot
Welcome to the Doc-RAG Chatbot! We can input our pdfs, have multiple chat with the same. hope you like it :) 

**Client**


 go to the path and npm start


**Server**

path and nodemon index.js


run the chromadb as well in powershell

 chroma run --host localhost --port 8000



Features: 

-> Chat Interface: Interact with PDF documents through a user-friendly chat interface.

-> Thread Management: Each PDF gets a new asset ID. Chats are organized by thread ID.

-> Chat History: Retrieve chat history using the thread ID.

-> Side Navbar: Displays thread IDs associated with each PDF.






Image of chat..we will be getting new asset id for each pdf and if we click on new chat and threadID is associated with it

 ![image](https://github.com/user-attachments/assets/3868c098-6242-4c46-b7b9-e3f198dafae3)



we can retrieve the chat history using the threadid as well
![image](https://github.com/user-attachments/assets/57c14501-6138-40b0-a6fc-93ce05af2608)

Side Navbar show the threadid associated for each pdf


Further Improvements:

--> We can integrate with Bert Embeddings and nlp/ml (bag of words, positonal encoding, transformers) methods to give actual textual output related to any pdf

