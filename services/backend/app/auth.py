from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

with open(settings.PRIVATE_KEY_PATH, "r") as f:
    PRIVATE_KEY = f.read()

with open(settings.PUBLIC_KEY_PATH, "r") as f:
    PUBLIC_KEY = f.read()

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(sub: str):
    expires = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": sub, "exp": expires}
    return jwt.encode(payload, PRIVATE_KEY, algorithm=settings.ALGORITHM)

def create_refresh_token(sub: str):
    expires = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    payload = {"sub": sub, "exp": expires, "type": "refresh"}
    return jwt.encode(payload, PRIVATE_KEY, algorithm=settings.ALGORITHM)

def verify_token(token: str):
    return jwt.decode(token, PUBLIC_KEY, algorithms=[settings.ALGORITHM])

