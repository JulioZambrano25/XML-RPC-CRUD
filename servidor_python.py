# servidor_python.py
from xmlrpc.server import SimpleXMLRPCServer

# Función suma
def sumar(a, b):
    print(f"Solicitud recibida: sumar({a}, {b})")
    return a + b

# Configuración del servidor
server = SimpleXMLRPCServer(("localhost", 8000))
print(" Servidor Python escuchando en http://localhost:8000 ...")
server.register_function(sumar, "sumar")
server.serve_forever()
