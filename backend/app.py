from fastapi import FastAPI, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
import json, os, secrets

app = FastAPI()

# ---- CORS (for Vite dev) ----
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

USERS_FILE = os.path.join(os.path.dirname(__file__), "users.json")

# In-memory session store (مؤقتًا)
SESSIONS = {}  # session_id -> user_id

COOKIE_NAME = "sid"
COOKIE_MAX_AGE = 60 * 60 * 8  # 8 hours

class LoginIn(BaseModel):
    email: EmailStr
    password: str

def load_users():
    with open(USERS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def find_user_by_email(email: str):
    users = load_users()
    for u in users:
        if u.get("email", "").lower() == email.lower():
            return u
    return None

def find_user_by_id(user_id: str):
    users = load_users()
    for u in users:
        if u.get("id") == user_id:
            return u
    return None

def get_user_from_session(sid: str | None):
    if not sid:
        return None
    user_id = SESSIONS.get(sid)
    if not user_id:
        return None
    return find_user_by_id(user_id)

@app.post("/auth/login")
def login(payload: LoginIn, response: Response):
    user = find_user_by_email(payload.email)
    if not user:
        raise HTTPException(status_code=401, detail="البريد أو كلمة المرور غير صحيحة")

    if not pwd_ctx.verify(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="البريد أو كلمة المرور غير صحيحة")

    sid = secrets.token_urlsafe(32)
    SESSIONS[sid] = user["id"]

    # HttpOnly cookie (جلسة)
    response.set_cookie(
        key=COOKIE_NAME,
        value=sid,
        httponly=True,
        secure=False,      # True only on HTTPS production
        samesite="lax",
        max_age=COOKIE_MAX_AGE,
        path="/",
    )

    return {"user": {"id": user["id"], "name": user.get("name") or user["email"], "email": user["email"]}}

@app.post("/auth/logout")
def logout(response: Response, sid: str | None = None):
    # sid will be read from cookie by browser; we just clear cookie client-side via response
    response.delete_cookie(key=COOKIE_NAME, path="/")
    return {"ok": True}

@app.get("/auth/me")
def me(sid: str | None = None):
    # FastAPI doesn’t auto-inject cookies unless you use Cookie() dependency,
    # but we keep it simple by reading from headers in frontend using fetch credentials.
    # We'll implement cookie reading properly:
    from fastapi import Cookie
    # this is a little trick; we re-declare properly:
    raise HTTPException(status_code=500, detail="Use /auth/me2 instead")

from fastapi import Cookie

@app.get("/auth/me2")
def me2(sid: str | None = Cookie(default=None, alias=COOKIE_NAME)):
    user = get_user_from_session(sid)
    if not user:
        raise HTTPException(status_code=401, detail="Not logged in")
    return {"user": {"id": user["id"], "name": user.get("name") or user["email"], "email": user["email"]}}