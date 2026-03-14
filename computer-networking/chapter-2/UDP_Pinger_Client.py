# (1) send the ping message using UDP (Note: Unlike TCP, you do not need to establish a connectionfirst, since UDP is a connectionless protocol.)
# The ping messages in this lab are formatted in a simple way. The client message is one line,
# consisting of ASCII characters in the following format:
# Ping sequence_number time
# where sequence_number starts at 1 and progresses to 10 for each successive ping message sent by the client, and time is the time when the client sends the message

from socket import socket, AF_INET, SOCK_DGRAM, timeout
from datetime import datetime

serverName = '192.168.1.4'
serverPort = 12000

sequence_number = 1

clientSocket = socket(AF_INET, SOCK_DGRAM)
clientSocket.settimeout(1) 	# 1 second timeout

while sequence_number <= 10:
    send_time = datetime.now()
    send_time_formatted = send_time.strftime("%Y-%m-%d %H:%M:%S")
    msg = f'Ping {sequence_number} {send_time_formatted}'

    print(msg)
    try:
        clientSocket.sendto(msg.encode(), (serverName, serverPort))

        # (2) print the response message from server, if any
        message, serverAddress = clientSocket.recvfrom(2048)

        # (3) calculate and print the round trip time (RTT), in seconds, of each packet, if server responses
        receive_time = datetime.now()
        time_elapsed = receive_time - send_time
        print(message.decode())
        rtt_us = time_elapsed.total_seconds() * 1_000_000
        print(f'RTT: {int(rtt_us)} microseconds')
    except timeout:
        # (4) otherwise, print “Request timed out” after 1 second elapsed
        print("Request timed out")
    finally:
        sequence_number += 1
        print()

clientSocket.close()
