# We will need the following module to generate randomized lost packets
import random
from socket import socket, AF_INET, SOCK_DGRAM

# Create a UDP socket
# Notice the use of SOCK_DGRAM for UDP packets
serverSocket = socket(AF_INET, SOCK_DGRAM)

# Assign IP address and port number to socket
serverSocket.bind(('192.168.1.4', 12000))

# Set a timeout so recvfrom does not block forever
serverSocket.settimeout(1)

print("Listening...")
while True:
    try:
        # Generate random number in the range of 0 to 10
        rand = random.randint(0, 10)

        # Receive the client packet along with the address it is coming from
        message, address = serverSocket.recvfrom(1024)

        # Capitalize the message from the client
        message = message.upper()

        # If rand is less is than 4, we consider the packet lost and do not respond
        if rand < 4:
            print("Lost packet :()")
            continue

        # Otherwise, the server responds
        serverSocket.sendto(message, address)

    except KeyboardInterrupt:
        print("Stopping server")
        break
    except TimeoutError:
        pass
