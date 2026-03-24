from socket import AF_INET, SOCK_STREAM, socket

msg = "\r\n I love computer networks!"
endmsg = "\r\n.\r\n"

# Run python -m aiosmtpd -n -l localhost:1025
# Public mail servers require TLS and authentication
mailserver = ('localhost', 1025)

# Create socket called clientSocket and establish a TCP connection with mailserver
clientSocket = socket(AF_INET, SOCK_STREAM)
clientSocket.connect(mailserver)

recv = clientSocket.recv(1024).decode()
print(recv)

if recv[:3] != '220':
    print('220 reply not received from server.')

# Send HELO command and print server response.
heloCommand = 'HELO Alice\r\n'
clientSocket.send(heloCommand.encode())

recv1 = clientSocket.recv(1024).decode()
print(recv1)

if recv1[:3] != '250':
    print('250 reply not received from server.')

# Send MAIL FROM command and print server response.
mailFromCommand = 'MAIL FROM: <lezojeda@gmail.com>\r\n'
clientSocket.send(mailFromCommand.encode())

recv2 = clientSocket.recv(1024).decode()
print(recv2)

# Send RCPT TO command and print server response.
sendToCommand = 'RCPT TO: <lezojeda@proton.me>\r\n'
clientSocket.send(sendToCommand.encode())

recv3 = clientSocket.recv(1024).decode()
print(recv3)

# Send DATA command and print server response.
sendToCommand = 'DATA\r\n'
clientSocket.send(sendToCommand.encode())

recv4 = clientSocket.recv(1024).decode()
print(recv4)

# Send message data.
message = "Hello bro\r\nHow are you?"
clientSocket.send(message.encode())

# Message ends with a single period.

end = "\r\n.\r\n"
clientSocket.send(end.encode())

recv5 = clientSocket.recv(1024).decode()
print(recv5)

# Send QUIT command and get server response.
quitCommand = "QUIT\r\n"
clientSocket.send(quitCommand.encode())

recv6 = clientSocket.recv(1024).decode()
print(recv6)
