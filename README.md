# TNSign

![alt text](./assets/TNSign_EXT.png)<br>
**TNSign** is a document signing platform built on **TNID**, offering a **secure** and **seamless** digital signature experience. 🗂️ It leverages **TNID's identity management** capabilities to ensure reliable document verification and signing. ✅

🔒 **Features**:

- Secure document signing
- Seamless integration with TNID
- Reliable and efficient workflow

Start your **digital signature** journey with **TNSign** today! 🚀

### Running the app locally
#### Frontend
```bash
cd frontend_
npx next dev -p 3001
```
This will spin up a next js server on port 3001
#### Backend
```bash
cd backend
uvicorn main:app --reload    
```
This will spin up a fastapi server on port 8000(default)

# Routes
Check the /docs page on fastapi to get a list of apis and test them out.
Some of the apis include
- /auth
- /b2bConnections
- /b2cConnections
- search with connection status
- search
- revoke connection
- send-connection
