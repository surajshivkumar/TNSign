from fastapi import FastAPI
from app.routes import auth
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Include the authentication router
app.include_router(auth.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all HTTP headers
)


@app.get("/")
async def root():
    return {"message": "Welcome to the Sign-in Page"}
