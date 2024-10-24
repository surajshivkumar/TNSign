from fastapi import APIRouter, HTTPException
from app.schemas.auth_schemas import OTPRequest, OTPValidation
from app.services.otp_service import send_otp_to_email,validate_otp
from app.services.tnid_service import is_existing_tnid_user_email,is_existing_tnid_user_phone
from fastapi.responses import HTMLResponse
#from fastapi.responses import RedirectResponse

router = APIRouter()

# Endpoint to send OTP to email or phone

def get_tnid_response() -> str:
    """Return an HTMLResponse with a clickable sign-up link to TNID."""
    return "The email or phone number is not found in our records. To sign up, please go to -> https://tnid.com/signup"
 
    

@router.post("/sendotp")
async def send_otp(data: OTPRequest):
    
    if not data.email and not data.phone:
        raise HTTPException(status_code=400, detail="Either email or phone number must be provided.")
    
    if data.email:
        
        if not is_existing_tnid_user_email(data.email):

            return get_tnid_response()
        # Simulate sending OTP to 
        send_otp_to_email(data.email)
        return {"message": f"OTP sent to {data.email}"}
        
    if data.phone:
        # Send OTP to phone
        val,email=is_existing_tnid_user_phone(data.phone)
        
        if not val:
            return get_tnid_response()
        # Simulate sending OTP to email
        send_otp_to_email(email['username'])
        return {"message": f"OTP sent to {email['username']}"}

# Endpoint to validate the OTP
@router.post("/auth")
async def validate_otp_route(data: OTPValidation):
    if not data.email and not data.phone:
        raise HTTPException(status_code=400, detail="Either email or phone number must be provided.")
    
    if data.email:
        if validate_otp(data.email, data.otp):
            return {"message": "Email OTP validated successfully."}
        else:
            raise HTTPException(status_code=400, detail="Invalid OTP for email.")
    
    if data.phone:
        if validate_otp(data.email, data.otp):
            return {"message": "Phone OTP validated successfully."}
        else:
            raise HTTPException(status_code=400, detail="Invalid OTP for phone.")
