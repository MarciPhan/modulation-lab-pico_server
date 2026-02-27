import network
import socket
import os
import machine

# --- KONFIGURACE WI-FI ---
SSID_AP = "ModulationLab-AP"
PASS_AP = "heslo-do-labu"

# Chceš-li Pico připojit k vlastní Wi-Fi, vyplň údaje zde:
SSID_STA = "Tvůj_Název_WiFi" 
PASS_STA = "Tvoje_Heslo"

def setup_wifi():
    # 1. Start Access Point (vždy aktivní)
    ap = network.WLAN(network.AP_IF)
    ap.config(essid=SSID_AP, password=PASS_AP)
    ap.active(True)
    
    # 2. Start Station Mode (pokus o připojení k tvojí síti)
    sta = network.WLAN(network.STA_IF)
    if SSID_STA and SSID_STA != "Tvůj_Název_WiFi":
        sta.active(True)
        sta.connect(SSID_STA, PASS_STA)
        print("Připojuji se k Wi-Fi:", SSID_STA)
        
    print("AP Aktivní na: http://192.168.4.1")
    if sta.isconnected():
        print("Pico je také v tvé síti na: http://" + sta.ifconfig()[0])
    
    return "192.168.4.1"

def get_content_type(filename):
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
            cl.settimeout(2.0)
            request = cl.recv(1024).decode('utf-8')
            if not request:
                cl.close()
                continue
                
            path = request.split(' ')[1]
            if path == '/': path = '/index.html'
            
            filename = 'www' + path
            gz_filename = filename + '.gz'
            
            use_gz = False
            try:
                os.stat(gz_filename)
                filename = gz_filename
                use_gz = True
            except:
                pass

            try:
                with open(filename, 'rb') as f:
                    cl.send('HTTP/1.1 200 OK\r\n')
                    cl.send('Content-Type: ' + get_content_type(path) + '\r\n')
                    if use_gz:
                        cl.send('Content-Encoding: gzip\r\n')
                    cl.send('Cache-Control: no-cache, no-store, must-revalidate\r\n')
                    cl.send('Connection: close\r\n\r\n')
                    
                    # Send in chunks to prevent buffer issues
                    while True:
                        data = f.read(512)
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
