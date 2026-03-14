# import socket module
from socket import socket, AF_INET, SOCK_STREAM
import sys  # In order to terminate the program

serverSocket = socket(AF_INET, SOCK_STREAM)

# Prepare a server socket
serverName = '192.168.1.6'  # thinkpad
serverPort = 12000
serverSocket.bind((serverName, serverPort))
serverSocket.listen(1)

while True:
    # Establish the connection
    print('Ready to serve...')

    connectionSocket, addr = serverSocket.accept()

    try:
        message = connectionSocket.recv(1024)

        filename = message.split()[1]
        f = open(filename[1:])
        outputdata = f.readlines()
        f.close()

        # Send one HTTP header line into socket
        connectionSocket.send("HTTP/1.1 200 OK\r\n\r\n".encode())

        # Send the content of the requested file to the client
        for i in range(0, len(outputdata)):
            connectionSocket.send(outputdata[i].encode())

        connectionSocket.send("\r\n".encode())
        connectionSocket.close()

    except IOError:
        connectionSocket.send("HTTP/1.1 404 Not Found\r\n\r\n".encode())
        connectionSocket.close()

    except Exception as e:
        print(e)
        connectionSocket.close()

serverSocket.close()
sys.exit()  # Terminate the program after sending the corresponding data
