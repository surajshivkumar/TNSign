import random
import smtplib
from app.config import EMAIL_ADDRESS, EMAIL_PASSWORD

# In-memory OTP store for now, use a database for production
otp_store = {}

# Helper function to send OTP to email
def send_otp_to_email(email: str):
    otp = str(random.randint(1000, 9999))
    otp_store[email] = otp
    send_email(email, otp)


# Function to validate OTP
def validate_otp(identifier: str, otp: str) -> bool:
    return otp_store.get(identifier) == otp

# Helper function to send OTP to email
def send_email(to_email: str, otp: str):
    with smtplib.SMTP("smtp.gmail.com", 587) as smtp:
        smtp.starttls()
        smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        subject = "Login credentials for TNSign"
        body = """
        Welcome to TNSign,

        Here is your OTP code: {}

        Please use this code to complete your sign-in process.

        Thank you,
        TNSign Team
        """.format(otp)
        msg = f"Subject: {subject}\n\n{body}"
        smtp.sendmail(EMAIL_ADDRESS, to_email, msg)
    