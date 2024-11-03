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
    Get the connection status for each company and user matching the search name.

    Args:
        name (str): Name to search for in companies and users.

    Returns:
        dict: Dictionary with users and companies (including their connection status).
    """
    search_result = search_users_and_companies(name)
    companies = search_result["companies"]
    users = search_result["users"]

    companies_with_status = [
        {
            **company,
            "connectionStatus": get_company_user_connection_status(
                company["id"], flag=0
            ),
        }
        for company in companies
    ]
    users_with_status = [
        {
            **user,
            "connectionStatus": get_company_user_connection_status(user["id"], flag=1),
        }
        for user in users
    ]

    return {"companies": companies_with_status, "users": users_with_status}


def get_company_user_connection_status(entity_id: str, flag: int) -> str:
    """
    Check the connection status for a company or user based on its ID.

    Args:
        entity_id (str): The ID of the company or user to check.
        flag (int): 0 for companies (B2B), 1 for users (B2C).

    Returns:
        str: The connection status ('pending', 'connected', 'not_connected').
    """
    if flag == 0:  # B2B connection
        query = """
        query CheckB2BConnection($companyId: ID!) {
            pendingB2bConnectionRequests(invitedCompanyId: $companyId) {
                status
                id
            }
            b2bConnections {
                connectedCompany {
                    id
                }
            }
        }
        """
        variables = {"companyId": entity_id}
    else:  # B2C connection
        query = """
        query CheckB2CConnection($userId: ID!) {
            pendingB2cConnectionRequests(invitedUserId: $userId) {
                status
                id
            }
            b2cConnections {
                connectedUser {
                    id
                }
            }
        }
        """
        variables = {"userId": entity_id}

    try:
        response = requests.post(
            TNID_API_SEARCH_URL,
            json={"query": query, "variables": variables},
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {TNID_API_BEARER_TOKEN}",
            },
        )
        response.raise_for_status()
        response_data = response.json()

        pending_requests = response_data.get("data", {}).get(
            (
                "pendingB2bConnectionRequests"
                if flag == 0
                else "pendingB2cConnectionRequests"
            ),
            [],
        )
        active_connections = response_data.get("data", {}).get(
            "b2bConnections" if flag == 0 else "b2cConnections", []
        )

        if pending_requests:
            return "pending"
        for connection in active_connections:
            connected_id = connection.get(
                "connectedCompany" if flag == 0 else "connectedUser", {}
            ).get("id")
            if connected_id == entity_id:
                return "connected"
        return "not connected"

    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=500, detail=f"Error checking connection status: {e}"
        )


def send_connection(
    entity_id: str, connection_type: ConnectionType, entity_type: str
) -> str:
    """
    Send a connection request to a company (B2B) or user (B2C) with a specified connection type.

    Args:
        entity_id (str): The ID of the company or user to connect with.
        connection_type (ConnectionType): The type of connection to create.
        entity_type (str): Type of entity, either 'company' for B2B or 'user' for B2C.

    Returns:
        str: The ID of the connection request if created, otherwise an error message.
    """
    flag = 0 if entity_type == "company" else 1
    status = get_company_user_connection_status(entity_id, flag)

    if status == "connected":
        return "Already connected. Use revoke connection to disconnect."
    elif status == "pending":
        return "Connection request is already pending. Cannot send a new request."

    if entity_type == "company":
        mutation = f"""
        mutation CreateB2bConnectionRequest($invitedCompanyId: ID!) {{
            createB2bConnectionRequest(connectionType: {connection_type.value}, invitedCompanyId: $invitedCompanyId) {{
                id
            }}
        }}
        """
        variables = {"invitedCompanyId": entity_id}
    else:
        mutation = f"""
        mutation CreateB2cConnectionRequest($invitedUserId: ID!) {{
            createB2cConnectionRequest(connectionType: {connection_type.value}, invitedUserId: $invitedUserId) {{
                id
            }}
        }}
        """
        variables = {"invitedUserId": entity_id}

    try:
        response = requests.post(
            TNID_API_SEARCH_URL,
            json={"query": mutation, "variables": variables},
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {TNID_API_BEARER_TOKEN}",
            },
        )
        response.raise_for_status()
        response_data = response.json()

        connection_id = (
            response_data.get("data", {})
            .get(
                (
                    "createB2bConnectionRequest"
                    if entity_type == "company"
                    else "createB2cConnectionRequest"
                ),
                {},
            )
            .get("id")
        )
        if not connection_id:
            raise HTTPException(
                status_code=400, detail="Error creating connection request"
            )

        return connection_id

    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=500, detail=f"Error sending connection request: {e}"
        )


def revoke_connection(request_id: str, entity_type: str) -> str:
    """
    Revoke a connection request using the unique request ID.

    Args:
        request_id (str): The unique ID of the connection request to revoke.
        entity_type (str): Type of entity, either 'company' for B2B or 'user' for B2C.

    Returns:
        str: Success message or error message.
    """
    mutation = (
        """
    mutation RevokeConnectionRequest($requestId: ID!) {
        revokeConnectionRequest(requestId: $requestId) {
            id
        }
    }
    """
        if entity_type == "company"
        else """
    mutation RevokeB2cConnectionRequest($requestId: ID!) {
        revokeB2cConnectionRequest(requestId: $requestId) {
            id
        }
    }
    """
    )
    variables = {"requestId": request_id}

    try:
        response = requests.post(
            TNID_API_SEARCH_URL,
            json={"query": mutation, "variables": variables},
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {TNID_API_BEARER_TOKEN}",
            },
        )
        response.raise_for_status()
        response_data = response.json()

        if "errors" in response_data:
            raise HTTPException(
                status_code=400, detail="Error revoking connection request"
            )

        return "Connection revoked successfully."

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error revoking connection: {e}")
