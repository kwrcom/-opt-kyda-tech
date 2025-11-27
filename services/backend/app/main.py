from fastapi import FastAPI, Depends, WebSocket, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.auth import create_access_token, create_refresh_token, verify_token, oauth2_scheme
from app.websocket import manager

app = FastAPI(title="Kyda Backend API")

@app.post("/auth/login")
async def login(form: OAuth2PasswordRequestForm = Depends()):
    # ЗАГЛУШКА: любая пара логин/пароль проходит
    user_id = form.username
    return {
        "access_token": create_access_token(user_id),
        "refresh_token": create_refresh_token(user_id)
    }

@app.post("/auth/refresh")
async def refresh(token: str):
    data = verify_token(token)
    if data.get("type") != "refresh":
        raise HTTPException(400, "Invalid refresh token")
    return {"access_token": create_access_token(data["sub"])}

@app.get("/transactions/")
async def transactions(token: str = Depends(oauth2_scheme)):
    verify_token(token)
    return [{"id": 1, "amount": 100, "status": "ok"}]

@app.websocket("/ws")
async def ws_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(f"Echo: {data}")
    finally:
        manager.disconnect(websocket)

