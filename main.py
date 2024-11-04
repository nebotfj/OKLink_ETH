from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
import httpx
import pandas as pd
from datetime import datetime
import json
from typing import List, Dict
import csv
from io import StringIO

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

API_KEY = "c0adfa1e-da7a-4628-bf5f-0b7a2f43e898"
BASE_URL = "https://www.oklink.com/api/v5"

NETWORKS = [
    {"id": "eth", "name": "Ethereum", "symbol": "ETH"},
    {"id": "bsc", "name": "BNB Smart Chain", "symbol": "BNB"},
    {"id": "polygon", "name": "Polygon", "symbol": "MATIC"},
    {"id": "arbitrum", "name": "Arbitrum", "symbol": "ARB"},
    {"id": "optimism", "name": "Optimism", "symbol": "OP"}
]

async def get_balance(address: str, network: str) -> Dict:
    async with httpx.AsyncClient() as client:
        headers = {"Ok-Access-Key": API_KEY}
        response = await client.get(
            f"{BASE_URL}/balance/{network}/{address}",
            headers=headers
        )
        return response.json()

async def get_transactions(address: str, network: str) -> List[Dict]:
    async with httpx.AsyncClient() as client:
        headers = {"Ok-Access-Key": API_KEY}
        response = await client.get(
            f"{BASE_URL}/transaction-history/{network}/{address}",
            headers=headers
        )
        return response.json()

@app.get("/", response_class=HTMLResponse)
async def root():
    with open("static/index.html") as f:
        return f.read()

@app.get("/api/networks")
async def get_networks():
    return NETWORKS

@app.get("/api/balance/{network}/{address}")
async def balance(network: str, address: str):
    try:
        result = await get_balance(address, network)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/transactions/{network}/{address}")
async def transactions(network: str, address: str):
    try:
        result = await get_transactions(address, network)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/export/{network}/{address}")
async def export_csv(network: str, address: str):
    try:
        transactions = await get_transactions(address, network)
        
        output = StringIO()
        writer = csv.writer(output)
        writer.writerow([
            "Hash", "Method", "From", "To", "In. Quantity", "In. Asset",
            "Out. Quantity", "Out. Asset", "Time"
        ])
        
        for tx in transactions["data"]:
            timestamp = datetime.fromtimestamp(tx["timestamp"])
            writer.writerow([
                tx["hash"],
                tx["method"],
                tx["from"],
                tx["to"],
                tx["inQuantity"],
                tx["inAsset"],
                tx["outQuantity"],
                tx["outAsset"],
                timestamp.strftime("%d-%m-%Y %H:%M:%S")
            ])
        
        return FileResponse(
            output.getvalue(),
            media_type="text/csv",
            filename=f"transactions_{network}_{address}.csv"
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)