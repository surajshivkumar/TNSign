from fastapi import HTTPException
import requests
from app.config import TNID_API_SEARCH_URL, TNID_API_BEARER_TOKEN

async def search_users_and_companies(name: str) -> dict:
    """
    Search for users and companies based on a name.
    
    Args:
        name (str): Name to search for in users and companies.
        
    Returns:
        A dictionary with lists of matching users and companies.
    """
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
        # Send GraphQL request to the TNID API
        #print(query)
        response = requests.post(
            TNID_API_SEARCH_URL,
            json={"query": query, "variables": variables},
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {TNID_API_BEARER_TOKEN}'
            }
        )
        response.raise_for_status()
        #print(response.json())
        response_data = response.json()

        return response_data
        
        
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error querying search API: {e}")
       