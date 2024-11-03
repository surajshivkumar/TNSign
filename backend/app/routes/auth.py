from fastapi import APIRouter, HTTPException,Query
from app.schemas.auth_schemas import OTPRequest, OTPValidation
from app.services.otp_service import send_otp_to_email, validate_otp
from app.services.tnid_service import (
    is_existing_tnid_user_email,
    is_existing_tnid_user_phone,
)
from app.services.search_service import search_users_and_companies
from app.services.send_b2b_connections import (
    get_companies_with_status,
    send_connection,
    revoke_connection,
    ConnectionType,
)
from fastapi.responses import HTMLResponse
from fastapi import APIRouter, HTTPException
from app.services.connections_service import (
    fetch_b2b_connections,
    fetch_b2c_connections,
)
from fastapi import APIRouter, HTTPException
from typing import List
import httpx

# from fastapi.responses import RedirectResponse

router = APIRouter()

# Endpoint to send OTP to email or phone


def get_tnid_response() -> str:
    """Return an HTMLResponse with a clickable sign-up link to TNID."""
    return "The email or phone number is not found in our records. To sign up, please go to -> https://tnid.com/signup"


@router.post("/sendotp")
async def send_otp(data: OTPRequest):
    print(data.email)

    if not data.email and not data.phone:
        raise HTTPException(
            status_code=400, detail="Either email or phone number must be provided."
        )

    if data.email:

        if not is_existing_tnid_user_email(data.email):
            return get_tnid_response()
        # Simulate sending OTP to
        send_otp_to_email(data.email)
        return {"message": f"OTP sent to {data.email}"}

    if data.phone:
        # Send OTP to phone
        val, email = is_existing_tnid_user_phone(data.phone)

        if not val:
            return get_tnid_response()
        # Simulate sending OTP to email
        send_otp_to_email(email["username"])
        return {"message": f"OTP sent to {email['username']}"}


# Endpoint to validate the OTP
@router.post("/auth")
async def validate_otp_route(data: OTPValidation):
    if not data.email and not data.phone:
        raise HTTPException(
            status_code=400, detail="Either email or phone number must be provided."
        )

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


@router.post("/b2bConnections")
def get_b2b_connections_route():
    try:
        return fetch_b2b_connections()
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code, detail="Failed to fetch B2B connections"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/b2CConnections")
def get_b2c_connections_route():
    try:
        return fetch_b2c_connections()
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code, detail="Failed to fetch B2C connections"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/search")
def search_entities(name: str):
    try:
        result = search_users_and_companies(name)
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred")


@router.get("/search-with-status")
async def search_with_status_route(name: str):
    """
    Route to search for users and companies by name and include connection status for each company.

    Args:
        name (str): The name to search for.

    Returns:
        dict: A dictionary with lists of matching users and companies, including connection status.
    """
    try:
        print(name)
        result = get_companies_with_status(name)
        print("RESULT",result)
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred")



@router.post("/revoke-connection/{request_id}")
async def revoke_connection_route(request_id: str,entity_type: str = Query(..., description="Specify 'company' for B2B or 'user' for B2C")):
    """
    Endpoint to revoke a B2B connection.

    Args:
        request_id (str): The ID of the connection request
        entity_type (str): Specify whether the connection is for a 'company' (B2B) or 'user' (B2C).

    Returns:
        dict: Message about the revocation status.
    """
    try:
        result = revoke_connection(request_id,entity_type)
        return {"message": result}
    except HTTPException as e:
        raise e

@router.post("/send-connection/{entity_id}")
async def send_connection_route(
    entity_id: str,
    connection_type: ConnectionType,
    entity_type: str = Query(..., description="Specify 'company' for B2B or 'user' for B2C")
):
    """
    Endpoint to send a connection request to a company or user.

    Args:
        entity_id (str): The ID of the company or user to connect with.
        connection_type (ConnectionType): The type of connection to create.
        entity_type (str): Specify whether the connection is for a 'company' (B2B) or 'user' (B2C).

    Returns:
        dict: Message about the connection request status.
    """
    try:
        result = send_connection(entity_id, connection_type, entity_type)
        return {"message": "Connection request sent successfully.", "connection_id": result}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred while sending the connection request")