from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

print(pwd_context.hash("manal").encode("utf-8"))
# pwd_context.hash("Admin@123".encode("utf-8"))