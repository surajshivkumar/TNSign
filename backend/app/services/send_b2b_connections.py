from app.config import TNID_API_SEARCH_URL, TNID_API_BEARER_TOKEN
import requests
from fastapi import HTTPException
from app.services.search_service import search_users_and_companies
from enum import Enum
class ConnectionType(str, Enum):
    PARTNER = "PARTNER"
    CUSTOMER = "CUSTOMER"
    SUPPLIER = "SUPPLIER"
    OTHER = "OTHER"

def get_companies_with_status(name: str) -> dict:
    """
    Get the connection status for each company matching the search name.
    
    Args:
        name (str): Name to search for in companies.
        
    Returns:
        dict: Dictionary with users and companies (including their connection status).
    """
    # Call the search API to get companies and users
    search_result = search_users_and_companies(name)
    companies = search_result["data"]["companies"]
    print(companies)
    #users = search_result.get("users", [])

    # For each company, check the connection status
    companies_with_status = []
    for company in companies:
        company_id = company["id"]
        connection_status = get_company_connection_status(company_id)
        companies_with_status.append({
            **company,
            "connectionStatus": connection_status
        })

    return {
        "companies": companies_with_status
    }


def get_company_connection_status(company_id: str) -> list:
    """
    Check the connection status for a company based on its ID.
    
    Args:
        company_id (str): The ID of the company to check.
        
    Returns:
        str: The connection status ('pending', 'connected', 'not_connected').
    """
    query = """
    query PendingB2bConnectionRequests($companyId: ID!) {
        pendingB2bConnectionRequests(invitedCompanyId: $companyId) {
            status
            id
        }
        b2bConnections {
           company{
           id
           }
            connectedCompany {
                id
            }
        }
    }
    """
    variables = {"companyId": company_id}
    
    
    try:
        response = requests.post(
            TNID_API_SEARCH_URL,
            json={"query": query, "variables": variables},
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {TNID_API_BEARER_TOKEN}'
            }
        )
        response.raise_for_status()
        response_data = response.json()
        print(response_data)

        # Check for pending connection requests
        pending_requests = response_data.get("data", {}).get("pendingB2bConnectionRequests", [])
        print(pending_requests)
        if pending_requests:
            return "pending"
        
        # Check if a connection already exists
        active_connections = response_data.get("data", {}).get("b2bConnections", [])
        for connection in active_connections:
            if connection.get("connectedCompany", {}).get("id") == company_id:
                return "connected"
        
        # If no pending or active connections are found, return 'not_connected'
        return "not connected"
    
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error checking company connection status: {e}")
    

def send_connection(company_id: str, connection_type: ConnectionType) -> str:
    """
    Send a connection request to a company with a specified connection type 
    if not already connected or pending.
    
    Args:
        company_id (str): The ID of the company to connect with.
        connection_type (ConnectionType): The type of connection to create.
        
    Returns:
        str: The ID of the connection request if created, otherwise an error message.
    """
    # Check current connection status
    status = get_company_connection_status(company_id)
    
    if status == "connected":
        return "Already connected. Use revoke connection to disconnect."
    elif status == "pending":
        return "Connection request is already pending. Cannot send a new request."
    
    # Send connection request with the specified connection_type
    mutation = """
    mutation CreateB2bConnectionRequest($invitedCompanyId: ID!) {
        createB2bConnectionRequest(connectionType: %s, invitedCompanyId: $invitedCompanyId) {
            id
        }
    }
    """ % connection_type.value  # Pass the enum as an unquoted value

    variables = {"invitedCompanyId": company_id}
    
    try:
        response = requests.post(
            TNID_API_SEARCH_URL,
            json={"query": mutation, "variables": variables},
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {TNID_API_BEARER_TOKEN}'
            }
        )
        response.raise_for_status()
        response_data = response.json()

        # Extract the connection ID
        connection_id = response_data.get("data", {}).get("createB2bConnectionRequest", {}).get("id")
        if not connection_id:
            raise HTTPException(status_code=400, detail="Error creating connection request")

        return connection_id  # Return the request ID for revocation purposes
    
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error sending connection request: {e}")


def revoke_connection(request_id: str) -> str:
    """
    Revoke a connection request using the unique request ID.
    
    Args:
        request_id (str): The unique ID of the connection request to revoke.
        
    Returns:
        str: Success message or error message.
    """
    mutation = """
    mutation RevokeB2bConnectionRequest($requestId: ID!) {
        revokeB2bConnectionRequest(requestId: $requestId) {
            id
        }
    }
    """
    variables = {"requestId": request_id}
    
    try:
        response = requests.post(
            TNID_API_SEARCH_URL,
            json={"query": mutation, "variables": variables},
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {TNID_API_BEARER_TOKEN}'
            }
        )
        response.raise_for_status()
        response_data = response.json()

        # Check for errors in the mutation response
        if "errors" in response_data:
            raise HTTPException(status_code=400, detail="Error revoking connection request")
        
        return "Connection revoked successfully."
    
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error revoking connection: {e}")

  