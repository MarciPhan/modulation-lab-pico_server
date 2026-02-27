import network
import socket
import os
import machine

# --- KONFIGURACE WI-FI ---
SSID_AP = "ModulationLab-AP"
PASS_AP = "heslo-do-labu"
# Lze libovolně změnit na otevřenou síť (odstraněním PASS_AP a příslušného nastavení, pokud bys to chtěl bez hesla)

def setup_wifi():
    # Start Access Point (vždy aktivní)
    ap = network.WLAN(network.AP_IF)
    ap.config(essid=SSID_AP, password=PASS_AP)
    ap.active(True)
    
    # Ujistíme se, že je Station Mode vypnutý (nechceme, aby se Pico někam připojovalo)
    sta = network.WLAN(network.STA_IF)
    sta.active(False)
    
    print("AP Aktivní na: http://192.168.4.1")
    return "192.168.4.1"

def get_content_type(filename):
    if filename.endswith(".gz"):
        filename = filename[:-3]
    if filename.endswith(".html"): return "text/html"
    if filename.endswith(".css"): return "text/css"
    if filename.endswith(".js"): return "application/javascript"
    if filename.endswith(".ico"): return "image/x-icon"
    return "text/plain"

def serve():
    setup_wifi()
    addr = socket.getaddrinfo('0.0.0.0', 80)[0][-1]
    s = socket.socket()
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    s.bind(addr)
    s.listen(1) # Small backlog for reliability on Pico
    
    print("Webserver běží na http://192.168.4.1")
    
    while True:
        cl = None
        try:
            cl, addr = s.accept()
            # Set timeout to prevent hanging sockets
            cl.settimeout(10.0) # Increase timeout for large files like Plotly
            request = cl.recv(1024).decode('utf-8')
            if not request:
                cl.close()
                continue
                
            path_full = request.split(' ')[1]
            path = path_full.split('?')[0]
            if path == '/': path = '/index.html'
            
            filename = 'www' + path
            gz_filename = filename + '.gz'
            
            use_gz = False
            try:
                # Get file size for Content-Length
                fsize = os.stat(gz_filename)[6]
                filename = gz_filename
                use_gz = True
            except:
                try:
                    fsize = os.stat(filename)[6]
                except:
                    fsize = 0

            try:
                with open(filename, 'rb') as f:
                    cl.send('HTTP/1.1 200 OK\r\n')
                    cl.send('Content-Type: ' + get_content_type(path).replace("application/javascript", "text/javascript") + '\r\n')
                    cl.send('Content-Length: ' + str(fsize) + '\r\n')
                    cl.send('X-Hardware: Raspberry Pi Pico W (MicroPython)\r\n')
                    if use_gz:
                        cl.send('Content-Encoding: gzip\r\n')
                    cl.send('Cache-Control: no-cache, no-store, must-revalidate\r\n')
                    cl.send('Connection: close\r\n\r\n')
                    
                    # Send in chunks to prevent buffer issues
                    while True:
                        data = f.read(1024) # Slightly larger chunks
                        if not data: break
                        cl.sendall(data)
            except Exception as e:
                print("Not found:", filename)
                cl.send('HTTP/1.1 404 Not Found\r\n\r\n')
            
            cl.close()
        except Exception as e:
            print("Server error:", e)
            if cl: cl.close()

if __name__ == "__main__":
    serve()
