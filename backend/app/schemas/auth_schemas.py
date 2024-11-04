from pydantic import BaseModel, EmailStr

class OTPRequest(BaseModel):
    email: EmailStr = None
    phone: str = None

class OTPValidation(BaseModel):
    email: EmailStr = None
    otp: str
