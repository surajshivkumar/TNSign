from datetime import datetime
from app.config import TNID_API_SEARCH_URL, TNID_API_BEARER_TOKEN
import requests


def fetch_b2b_connections():
    """Fetch B2B connections using a GraphQL query."""

    query = """
    query {
        b2bConnections {
            id
            createdAt
            startedAt
            type
            updatedAt
            company {
                aboutUs
                brandName
                id
                legalName
                metadata
                profileName
                taxId
                yearFounded
            }
            connectedCompany {
                aboutUs
                brandName
                id
                legalName
                metadata
                profileName
                taxId
                yearFounded
            }
        }
    }
    """
    try:
        # Send GraphQL request to the TNID API
        response = requests.post(
            TNID_API_SEARCH_URL,
            json={"query": query},
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {TNID_API_BEARER_TOKEN}",
            },
        )
        response_data = response.json()
        print(response_data)
        return [connection for connection in response_data["data"]["b2bConnections"]]

    except requests.exceptions.RequestException as e:
        print(f"Error querying B2B connections TNID GraphQL API: {e}")
        return False


def fetch_b2c_connections():
    """Fetch B2C connections using a GraphQL query."""

    query = """
    query {
         b2cConnections {
        id
        insertedAt
        startedAt
        type
        updatedAt
        company {
            aboutUs
            brandName
            id
            legalName
            metadata
            profileName
            taxId
            yearFounded
        }
        connectedUser {
            aboutMe
            birthdate
            firstName
            id
            lastName
            metadata
            middleName
            username
        }
    }
}
    """
    try:
        # Send GraphQL request to the TNID API
        response = requests.post(
            TNID_API_SEARCH_URL,
            json={"query": query},
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {TNID_API_BEARER_TOKEN}",
            },
        )
        response_data = response.json()
        print(response_data)
        return [connection for connection in response_data["data"]["b2cConnections"]]

    except requests.exceptions.RequestException as e:
        print(f"Error querying b2c Connections TNID GraphQL API: {e}")
        return False
