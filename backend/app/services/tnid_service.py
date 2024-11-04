
from app.config import TNID_API_SEARCH_URL,TNID_API_BEARER_TOKEN
import requests


def is_existing_tnid_user_email(email: str) -> bool:
    """Check if the email exists in the TNID user list"""
    
    query = """
    query Users($email: String!) {
        users(email: $email) {
            id
            firstName
            lastName
        }
    }
    """
    variables = {
        "email": email
    }
    try:
        # Send GraphQL request to the TNID API
        response = requests.post(TNID_API_SEARCH_URL, json={"query": query, "variables": variables},headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {TNID_API_BEARER_TOKEN}'})
        response_data = response.json()

        # Check if any users were returned
        if response_data.get("data") and response_data["data"].get("users"):
            return True  
        else:
            return False  
    except requests.exceptions.RequestException as e:
        print(f"Error querying TNID GraphQL API: {e}")
        return False

def is_existing_tnid_user_phone(phone: str) :
    """Check if the phone exists in the TNID user list"""
    query = """
    query Users($telephoneNumber: String!) {
        users(telephoneNumber: $telephoneNumber) {
            username
        }
    }
    """
    variables = {
        "telephoneNumber": phone
    }
    try:
        # Send GraphQL request to the TNID API
        response = requests.post(TNID_API_SEARCH_URL, json={"query": query, "variables": variables}, headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {TNID_API_BEARER_TOKEN}'})
        print(response.json())
        response_data = response.json()
        
        # Check if any users were returned
        if response_data.get("data") and response_data["data"].get("users"):

            return True,response_data['data']['users'][0] 
        else:
            return False,""
    except requests.exceptions.RequestException as e:
        print(f"Error querying TNID GraphQL API: {e}")
        return False,""
    

