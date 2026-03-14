## SECTION 1.1
**R1.** What is the difference between a host and an end system? List several different types of end systems. Is a Web server an end system?
	- There is none, they refer to the same. Some examples of end systems are personal computers, smart TVs, mobile devices, gaming consoles. Yes, a web server is an end system.

---
**R2.** Why are standards important for protocols?
	- Standards let two parties agree on what a protocol does so communication can work seamlessy. An example of real life is the standard of saying "hi" before asking someone a question.
## SECTION 1.2
**R4.** List four access technologies. Classify each one as home access, enterprise access, or wide-area wireless access.
- Ethernet: enterprise and home
- Wireless LAN/WiFi: enterprise and home
- DSL: home
- 3G: wide-area wireless access
---
**R5.** Is HFC transmission rate dedicated or shared among users? Are collisions
possible in a downstream HFC channel? Why or why not?
- The transmission rate is shared since the data from many homes travel over a shared coaxial medium to the CMTS
- Collisions are not possible since the CMTS is the only transmitter in this network. Upstream is possible but not downstream.
---
**R9.** HFC, DSL, and FTTH are all used for residential access. For each of
these access technologies, provide a range of transmission rates and
comment on whether the transmission rate is shared or dedicated

| Technology | Downstream transmission rates                                                                              | Upstream transmission rates | Shared/dedicated                                                                                                                |
| ---------- | ---------------------------------------------------------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| HFC        | 40 Mbps and 1.2 Gbps                                                                                       | 30 Mbps and 100 Mbps        | Shared                                                                                                                          |
| DSL        | 24 Mbps and 52 Mbps                                                                                        | 3.5 and 16 Mbps             | Dedicated until the DSLAM. Shared from that point to the ISP's core network. This is why throughput can drop during peak hours. |
| FTTH       | Doesn't specify ."FTTH can potentially provide Internet access rates in<br>the gigabits per second range." |                             | Dedicated until the neighborhood optical splitter                                                                               |
## SECTION 1.3
R11. Suppose there is exactly one packet switch between a sending host and a receiving host. The transmission rates between the sending host and the switch and between the switch and the receiving host are R1 and R2, respectively. Assuming that the switch uses store-and-forward packet switching, what is the total end-to-end delay to send a packet of length L? (Ignore queuing, propagation delay, and processing delay.

$$
d_{end-end}=\frac{L}{R1}+\frac{L}{R2}
$$
---
**R12.** What advantage does a circuit-switched network have over a packet-switched network? What advantages does TDM have over FDM in a circuit-switched network?

The advantage is a guaranted rate of data transfer due to the reserved resources along the path. There is no risk of delays as with packet-switched network in case of congestion of shared links.

---
**R13.** Suppose users share a 2 Mbps link. Also suppose each user transmits continuously at 1 Mbps when transmitting, but each user transmits only 20 percent of the time. (See the discussion of statistical multiplexing in Section 1.3.)
a. When circuit switching is used, how many users can be supported?
b. For the remainder of this problem, suppose packet switching is used. Why will there be essentially no queuing delay before the link if two or fewer
users transmit at the same time? Why will there be a queuing delay if
three users transmit at the same time?
c. Find the probability that a given user is transmitting.
d. Suppose now there are three users. Find the probability that at any given time, all three users are transmitting simultaneously. Find the fraction of
time during which the queue grows

a. Only two since we need to pre-allocate 1 Mbps for each user and the link supports 2 Mbps.
b. If two or fewer users transmit at the same time, the arrival rate = link capacity. Queue only builds up when data arrives faster than it can be sent out. With 3 users we may get 3 Mbps arriving and with a 2 Mbps capacity we get a queue.
c. 0.2
d. It can be obtained with the binomial probability distribution formula, where k = successes = number of simulatenous active users, n = total users, 
$$P(X=k) = \binom{n}{k} \times p^k \times (1-p)^{n-k} = \binom{3}{3} \times 0.2^3 \times 0.8^{0} = 0.008$$
## SECTION 1.4
**R16.** Consider sending a packet from a source host to a destination host over a fixed route. List the delay components in the end-to-end delay. Which of these delays are constant and which are variable?
$$
d_{source-destination}=d_{proc}+d_{queue}+d_{trans}+d_{prop}
$$
Constant -> processing, transmission, propagation for a given packet, physical medum (link) and router
Variable -> queueing, highly depends on the amounts of earlier arriving

---
**R18.** How long does it take a packet of length 1,000 bytes to propagate over a link of distance 2,500 km, propagation speed 2.5 * 10^8 m/s, and transmission rate 2 Mbps? More generally, how long does it take a packet of length L to propagate over a link of distance d, propagation speed s, and transmission rate R bps? Does this delay depend on packet length? Does this delay depend on transmission rate?

L = packet size
$$
time = L/trans + distance/prop = 0.0005 + 0,00001 = 0.00051s = 0,51ms = 510000 ns
$$

To _propagate_ (this is, once it has been transmitted):
$$
t = \frac{d}{s}
$$
It does not depend on the packet length nor on transmission rate. These two only matter for the *transmission* delay.
## SECTION 1.5
**R23.** What are the five layers in the Internet protocol stack? What are the principal responsibilities of each of these layers?
- Application
	- Translation of human-friendly names for Internet end systems
	- Management of applications for end users
- Transport
	- Transport application layer messages
- Network
	- Moving network-layer packets (datagrams)
	- Handle routing protocols
- Link
	- Route datagrams through routers between source and destination
- Physical
	- Move the individual bits

**R24.** What is an application-layer message? A transport-layer segment? A network-layer datagram? A link-layer frame?

An application-layer message is a packet of information of one end system exchanged (or to be exchanged) with an application from another end system.

A transport-layer segment is the packet of information concerning to the transport layer, typically an application-layer message with headers attached to it with information like source/dest ports.

A network-layer datagram is the layer's packet of information, a transport-layer segment with routing protocols that determine the routes that datagrams take between sources and destinations.

A link-layer frame is the fundamental unit at the data link layer encapsulating network-layer packets with headers and trailers for node-to-node transmission

**R25.** Which layers in the Internet protocol stack does a router process? Which layers does a link-layer switch process? Which layers does a host process?

Link-layer switch -> physical/link-layer/network
Router ->network/transport
Host -> transport/application

---
## Problems
**P2.** Equation 1.1 gives a formula for the end-to-end delay of sending one packet of length L over N links of transmission rate R. Generalize this formula for sending P such packets back-to-back over the N links.

We only care about when the first and last ($P-1$) packet arrive so:
$$
d_{end-to-end}=\rm N*\dfrac{L}{R} + (P - 1)*\dfrac{L}{R} = (N+P-1)*\dfrac{L}{R}
$$
---
**P6.** This elementary problem begins to explore propagation delay and transmission delay, two central concepts in data networking. Consider two hosts, A and B, connected by a single link of rate R bps. Suppose that the two hosts are separated by $m$ meters, and suppose the propagation speed along the link is $s$ meters/sec. Host A is to send a packet of size $L$ bits to Host B.
a. Express the propagation delay, $d_{prop}$, in terms of $m$ and $s$.
b. Determine the transmission time of the packet, $d_{trans}$, in terms of $L$ and $R$.
c. Ignoring processing and queuing delays, obtain an expression for the end-
to-end delay.
d. Suppose Host A begins to transmit the packet at time t = 0. At time t =
$d_{trans}$, where is the last bit of the packet?
e. Suppose $d_{prop}$ is greater than $d_{trans}$. At time $t = d_{trans}$, where is the first bit of the packet?
f. Suppose $d_{prop}$ is less than $d_{trans}$. At time $t = d_{trans}$, where is the first bit of the packet?
g. Suppose $s = 2.5 · 10^8$, $L = 1500 bytes$, and $R = 10 Mbps$. Find the distance m so that $d_{prop}$ equals $d{trans}$.

a. $d_{prop}=\frac{m}{s}$
b. $d_{trans}=\frac{L}{R}$
c. $d_{end-to-end}=d_{prop}+d_{trans}$
d. In the link because the transmission delay is the amount of time required to push (that is, transmit) **all** of the packet’s bits into the link.
e. Somewhere in the link and has not yet reached host B.
f. Already in host B while the last bit it's still yet to reach the link. The delay to propagate is less than to transmit the *last* bit to the link so the first bit arrives before all bits have been transmitted.
g.
$$
\begin{align}
d_{prop} &= d_{trans} \\
\frac{m}{s} &= \frac{L}{R} \\
m &= \frac{L}{R} * s \\
m &= \frac{0.012Mb}{10Mbps} * 2.5 · 10^8 \frac{m}{s} \\
m &= 300,000m
\end{align}
$$
---
**P12.** A packet switch receives a packet and determines the outbound link to which the packet should be forwarded. When the packet arrives, one other packet is halfway done being transmitted on this outbound link and four other packets are waiting to be transmitted. Packets are transmitted in order of arrival. Suppose all packets are 1,500 bytes and the link rate is 2.5 Mbps. 

What is the queuing delay for the packet? More generally, what is the queuing delay when all packets have length L, the transmission rate is R, x bits of the currently-being-transmitted packet have been transmitted, and n packets are already in the queue?

The queueing delay for the packet can be calculated by getting the transmission delay of the 4 already in queue plus half of the delay for the one that is halfway done being transmitted:
$$
\begin{align}
d_{queue-5} &= \frac{L}{R}·\frac{1}{2} + \frac{L}{R}*4  \\
d_{queue-5} &= 0.0024 + 0.0192 = 0.0216 s = 21.6ms
\end{align}
$$The general equation, where $x$ bits of the currently-being-transmitted packet have been transmitted, and $n$ pcakets are already in the queue:
$$
d_{queue-n} = \frac{L-x}{R} + \frac{L}{R}*n
$$
---
**P13.** **(a)** Suppose N packets arrive simultaneously to a link at which no packets are currently being transmitted or queued. Each packet is of length $L$ and the link has transmission rate $R$. What is the average queuing delay for the N packets?
**(b)** Now suppose that N such packets arrive to the link every LN/R seconds. What is the average queuing delay of a packet?

**(a)** $avg-delay=(N-1)/2R$
**(b)** First batch arrives at t=0. Second batch arrives at t=LN/R (from question). Clearing first batch takes LN/R (from average time, one packet L/R, second 2L/R, ... packet N takes NL/R). So clearing time = arriving of second time => The average queuing delay is NL/R since the queue is clear every time a new burst arrives.
