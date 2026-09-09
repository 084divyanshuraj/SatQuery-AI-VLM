import urllib.request
import json
import sys
import asyncio

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

try:
    import websockets
    HAS_WEBSOCKETS = True
except ImportError:
    HAS_WEBSOCKETS = False

def test_rest_api():
    print("Testing Local REST API connection...")
    try:
        response = urllib.request.urlopen("http://localhost:7001/", timeout=4)
        data = json.loads(response.read().decode())
        print(f"[PASS] Backend is online: {data}")
        return True
    except Exception as e:
        print(f"[FAIL] Error: Could not connect to local backend on http://localhost:7001. Make sure your FastAPI server is running. Error: {e}")
        return False

async def test_websocket():
    if not HAS_WEBSOCKETS:
        print("[INFO] Skipping WebSocket library check (websockets package not installed in this test environment).")
        return True
    print("Testing Local WebSocket handshake on ws://localhost:7001/ws/orchestrate...")
    try:
        async with websockets.connect("ws://localhost:7001/ws/orchestrate") as ws:
            # Send a test payload
            payload = {
                "query": "Test local connection handshake",
                "mode": "single",
                "metadata": {"file": "handshake_test.tif"}
            }
            await ws.send(json.dumps(payload))
            print("[PASS] Sent test payload to WebSocket.")
            
            # Receive first streaming message
            resp = await ws.recv()
            print(f"[PASS] Received stream update from WebSocket: {resp}")
            return True
    except Exception as e:
        print(f"[FAIL] WebSocket Error: Could not establish a socket connection. Error: {e}")
        return False

if __name__ == "__main__":
    print("=== SATQUERY AI LOCAL CONNECTION AUDIT ===")
    rest_ok = test_rest_api()
    if rest_ok and HAS_WEBSOCKETS:
        asyncio.run(test_websocket())
    print("==========================================")
