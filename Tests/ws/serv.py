
import threading
def run():
    import asyncio
    import websockets

    async def hello(websocket, path):
        name = await websocket.recv()
        print(f"< {name}")

        greeting = f"Hello {name}!"

        await websocket.send(greeting)
        print(f"> {greeting}")

    start_server = websockets.serve(hello, "localhost", 8765)

    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()

ws_thread = threading.Thread(target = run)
ws_thread.start()
import time
while(True):
    time.sleep(1000)
    print("running")