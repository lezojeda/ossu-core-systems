## Questions
## SECTION 2.1
**R1.** List five nonproprietary Internet applications and the application-layer protocols that they use
1. qBittorrent -> BitTorrent
2. Filezilla -> FTP
3. OpenSSH -> SSH
4. `curl` -> HTTP
5. Internet browser -> DNS and HTTP

**R2.** The application architecture is decided by the application developer which dictates how it will be structured to various end system while the network architecture is fixed and the one with 5 layers.

**R3.** The client process is the one that initiates the communication, i.e. makes the first contact.

**R4.** Yes, because communication can go from peer to peer without passing through a dedicated server. Everyone acts like a client and a server simultaneously.

**R5.** IP to identify the receiving host and a port number identifying the receiving process in that host.

**R6.** UDP since we don't have the extra delay that comes from the initial three-way handshake.

**R7.** Payment processing and monitoring applications.

**R8.** 
- Reliable data transfer service -> TCP
- Throughput ("guaranteed available throughput at some specified rate") -> none
- Timing -> none
- Security -> TCP if enhanced with TLS

**R9.** It lives in the application layer. The developer must include TLS code such as the one from existing libraries for it to work along TCP.

**R10.** The handshaking protocol is the set of rules governing the information exchange between client and server before the application-level messages begin to flow.

**R11.** Because they both need reliable, ordered, and complete delivery of data. Lost packets could mean a corrupted webpage, missing parts on an email, all things that would make the applications not fulfill their main purpose.

**R16.** Alice first composes the message in her **user agent** (Hotmail or Gmail). After this, the user agent **sends** the message to her **mail server** and its placed in the outgoing message queue. The client side of SMTP running on Alice's mail server sees this message and opens a TCP connection with Bob's SMTP server, after the handshake the message is put into the TCP connection, leaves her mail server and arrives to Bob's mail server at SMTP server side. After Bob authenticates with his mail server he can finally read the mail through his user agent. **SMTP** is the protocol used between the **mail servers** to make all this happen.

**R18.** Head of Line blocking issue comes from using a single TCP connection and transferring objects of various sizes. For example a HTML base page with very large high quality image and small objects below it. These small objects will be delayed by the transfer of the image which takes considerable more time to pass through the link to arrive to the client.

HTTP/2 attempts to solve this by breaking each message into several smaller frames and interleaving the request and response messages on the same TCP connection. This way smaller objects are interleaved between the frames of larger objects and are not delayed until these are completely transferred.

**R19.** Yes, the RR would be of type **MX**.
## Problems
Session 2 — Problems (theory + calculation)** P1, P3, P4, P5, P7, P8, P9, P13, P14, P15, P16, P22, P25. These are the ones with actual analytical depth. P7/P8/P9 are the most exam-relevant timing calculations. P22 is good practice if P2P distribution comes up. Skip P2, P6, P17–P21, P26–P27, P32 (research/lookup tasks with low return).

**P1.**
a. False. Sends an HTTP request, receives a webpage with references to the images that are parsed by the browser and **three more** HTTP requests are fired to get those images.
b. True. HTTP/1.1 persistent connections (keep-alive) allow multiple requests/responses over a single TCP connection.
c. False. With nonpersistent connection we need to create a new TCP connection for every request.
d. False, the `Last-Modified` header indicates that. `Date` indicates the date and time at which the message was originated.
e. False. Many HTTP response message have an empty message body such as responses with status code of 204 or 304.

**P3.** DNS over UDP to resolve the domain name in the URL to the correct IP. HTTP over TCP to request and receive the webpage.

**P4.** 
a. gaia.cs.umass.edu/cs453/index.html
b. 1.1
c. Persistent (`keep-alive`)
d. The IP address cannot be determined from the HTTP GET message itself. It would appear in the header of the packet carrying the TCP segment
e. Netscape. For the formatting of the response message and content compatibility.

**P5.**
a. If we assume good design and 200 OK means the document was found then yes. The reply was provided on 07 Mar 2008, 12:39:45
b. Sat, 10 Dec 2005
c. 3874
d. The first 5 bytes show the title of a comp sci course and yes the server agreed to a persistent connection evidenced by the header `Connection: Keep-Alive`

**P7.** Suppose within your Web browser you click on a link to obtain a Web page.
The IP address for the associated URL is not cached in your local host, so
a DNS lookup is necessary to obtain the IP address. Suppose that n DNS
servers are visited before your host receives the IP address from DNS; the
successive visits incur an RTT of RTT1, . . . , RTTn. Further suppose that the
Web page associated with the link contains exactly one object, consisting of
a small amount of HTML text. Let RTT0 denote the RTT between the local
host and the server containing the object. Assuming zero transmission time
of the object, how much time elapses from when the client clicks on the link
until the client receives the object?

Total elapsed time = (time spent on DNS resolution) + (time spent on TCP setup) + (time spent requesting/receiving the object) = (RTT₁ + RTT₂ + ... + RTTₙ) + RTT_0 + RTT_0

**P8.**
a. $RTT_0$ for each new TCP connection since it's not persistent plus $RTT_0$ to transmit every object = $(RTT_0 × 2)  8$
b. $RTT_0 × 2$. In one $RTT_0$ we make use of all 6 parallel connections and then we are left with 2 remaining objects that make use of two parallel connections and take $RTT_0$ each
c. Since the connection stays open we need 8 $RTT_0$, one for each object

The takeaway is that the amount of $RTT$ goes: parallel HTTP < non-persistent HTTP with parallel connections < non-persistent HTTP without parallel connections

**P13.**
a. 2000 per each video frame + 3 per each image (5) = 2015
b. 18. Each round is 6 frame times (1 video + 5 images), each image has 3 frames so 3 x 6 = 18

**P15.** `MAIL FROM` in SMTP is a command required in the handshake between the mail client and the mail server. The `From:` is a header required by the RFC 5322.

**P17.** MTA stands for Mail Transfer Agents. The malicious host was most likely 58.88.21.177 which sent the message through inbnd55.exchangeddd.com since it appears in the `Received:` header which and we assume it was added by the trustworthy mail server. The "Mail from:" can be easily forged.

**P18.**
a. A whois database contains information about domain names and IP address block among other range of internet entities. They can be queried using the whois protocol to get information about a certain internet resource's registered user or assignee.

b. example.com -> ELLIOTT.NS.CLOUDFLARE.COM, HERA.NS.CLOUDFLARE.COM

uba.ar -> ns3.uba.ar (157.92.6.1/32), ns1.uba.ar and many more