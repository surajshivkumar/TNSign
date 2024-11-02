import requests

# Define the URL for the API
url = "https://app.staging.v2.tnid.com/autocomplete?query=sa"

# Define headers, including the cookie copied from your browser
headers = {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "en-GB,en;q=0.7",
    "cache-control": "max-age=0",
    "connection": "keep-alive",
    "cookie": "__cfruid=ae758dc08071e3c2291a15bdc604a3d467a36197-1729623788; _tnid_v2_live_view_key=SFMyNTY.g3QAAAAEbQAAAAtfY3NyZl90b2tlbm0AAAAYRnh6Y2lrNHBlX2hZSE5TOEdnWkhNc0xHbQAAAA5saXZlX3NvY2tldF9pZG0AAAJvdXNlcnNfc2Vzc2lvbnM6WlhsS2FHSkhZMmxQYVVwSlZYcFZlRTFwU1hOSmJsSTFZME5KTmtscmNGaFdRMG81TG1WNVNtaGtWMUZwVDJsS01HSnRiR3RZTTFsNVdESlNhR1JIUldsTVEwcHNaVWhCYVU5cVJUTk5la1Y0VDBSWk5VMTZXWE5KYld4b1pFTkpOazFVWTNwTlJGVTBUV3BGZWs1cGQybGhXRTU2U1dwdmFXUkhOWEJhUmpreVRXdzVhMWxZVW1oSmFYZHBZVzVTY0VscWIybE9WMDE2VDFkV2JWbDZSWFJQVjFreldYa3dNRnBVVFhoTVYwVXlXVmRWZEUxcVVYZFpNbFY1V2tSQ2FFMTZTWGxKYVhkcFltMUtiVWxxYjNoT2VrMTNUbFJuZVUxVVRURk1RMHA2WkZkSmFVOXBTbXhaYW1NeVdrUm5kMDFETUhoT2JVMTNURlJSTUZwcVVYUlBSR2Q0V2xNd2VsbFVhM2xaVkd4b1RWZEdhRTFxV1dsTVEwb3daVmhCYVU5cFNtaFpNazVzWXpOTmFVeERTakZqTWxaNVdESnNhMGxxYjJsYVYwa3pUbTFSTkUxRVFYUk5WRnBxVFVNd01FNUhXVEJNVkdjMFRWZFZkRTB5UlRWTmJVVTFXVlJHYUZsVVNUSkpiakF1Vkc5TFlrWjVjMDlCZGxVeGVqWTRaR3hoV25JMVZGOXVUbFpCT0haSFh6QktVSEJxTVVabGVFdFJUa1F5YWxWNGRHSlljVlpNVDNka1FrUldaMlpzWldST1VtaG5PRWh0U1ZCbVQxQldWVmxzZG1SWFFWRT1tAAAACmxvZ2luX3R5cGVtAAAABWVtYWlsbQAAAAp1c2VyX3Rva2VubQAAAcdleUpoYkdjaU9pSklVelV4TWlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaGRXUWlPaUowYm1sa1gzWXlYMlJoZEdFaUxDSmxlSEFpT2pFM016RXhPRFk1TXpZc0ltbGhkQ0k2TVRjek1EVTRNakV6Tml3aWFYTnpJam9pZEc1cFpGOTJNbDlrWVhSaElpd2lhblJwSWpvaU5XTXpPV1ZtWXpFdE9XWTNZeTAwWlRNeExXRTJZV1V0TWpRd1kyVXlaREJoTXpJeUlpd2libUptSWpveE56TXdOVGd5TVRNMUxDSnpkV0lpT2lKbFlqYzJaRGd3TUMweE5tTXdMVFEwWmpRdE9EZ3haUzB6WVRreVlUbGhNV0ZoTWpZaUxDSjBlWEFpT2lKaFkyTmxjM01pTENKMWMyVnlYMmxrSWpvaVpXSTNObVE0TURBdE1UWmpNQzAwTkdZMExUZzRNV1V0TTJFNU1tRTVZVEZoWVRJMkluMC5Ub0tiRnlzT0F2VTF6NjhkbGFacjVUX25OVkE4dkdfMEpQcGoxRmV4S1FORDJqVXh0YlhxVkxPd2RCRFZnZmxlZE5SaGc4SG1JUGZPUFZVWWx2ZFdBUQ.R8zoByb2SZUgxX0rqmiRkxuVnw9TYxsf0Q0CKLcYhy4",
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
}


# Make the GET request with the headers
response = requests.get(url, headers=headers)

# Check if the request was successful
if response.status_code == 200:
    # Print the response JSON (or text if not JSON)
    print(response.json())
else:
    print(f"Error: {response.status_code}")
    print(response.text)
