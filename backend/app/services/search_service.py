from fastapi import HTTPException
import requests
from app.config import TNID_API_SEARCH_URL, TNID_API_BEARER_TOKEN


async def search_users_and_companies(name: str) -> dict:
    """
    Search for users and companies based on a name.

    Args:
        name (str): Name to search for in users and companies.

    Returns:
        dict: A dictionary with lists of matching users and companies.
    """
    # Define GraphQL query for users and companies
    query = """
    query Users($name: String!) {
        users(name: $name) {
            aboutMe
            birthdate
            firstName
            id
            lastName
            metadata
            middleName
            username
        }
        companies(name: $name ) {
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
    """
    variables = {"name": name}

    try:
        print(name)
        # Send the GraphQL request to the TNID API
        response = requests.post(
            TNID_API_SEARCH_URL,
            json={"query": query, "variables": variables},
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {TNID_API_BEARER_TOKEN}",
            },
        )

        # Check for HTTP errors
        response.raise_for_status()

        # Parse JSON response
        response_data = response.json()

        # Check if the expected data exists in the response
        if "data" not in response_data:
            raise HTTPException(
                status_code=500, detail="Unexpected API response structure."
            )

        return response_data["data"]  # Return only the 'data' field

    except requests.exceptions.RequestException as e:
        # Raise an HTTPException with a descriptive error message for API call issues
        raise HTTPException(
            status_code=500, detail=f"Error querying search API: {str(e)}"
        )
