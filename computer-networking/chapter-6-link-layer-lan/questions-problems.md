## SECTIONS 6.1-6.2
**R1.** The transportation vehicle like the train wagon or the plane and also the segment-specific ticketing/boarding context (seat assignment, boarding pass, luggage handling rules, etc.) used to carry the tourist between two adjacent points.

---
**R3.**
- Framing
- Link access
- Reliable delivery -> has a corresponding service in TCP, not in IP
- Error detection and correction

---
## SECTION 6.3
**R4.** 

**R5.** The four desirable characteristics:
1. when only one node has data to send, throughput should be R bps
2. when M nodes have data to send, each of these nodes has a throughput of R/M bps
3. the protocol is decentralized; that is, there is no master node that represents a single point of failure for the network.
4. the protocol is simple, so that it is inexpensive to implement

Slotted ALOHA has: 1, 3 and 4

And token passing has:

**R6.** After a fifth collision ($n = 5$), K is chosen with equal probability among $\{0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31\}$ which means the probability of choosing 4 would be 1/32 = 3% approximately.

To get the delay for $K = 4$ we do:
$$
\text{delay} = K \times 512 \times \frac{1}{R}
$$

$$
\text{delay} = 4 \times 512 \times \frac{1}{10^7}
$$

$$
\text{delay} = 4 \times 512 \times 0.1 = 204.8\,\mu s
$$

**R7.** The polling protocol would be analogous to one person (the master node) deciding who gets to talk and for how much time.

The token-passing would be as if holding a certain item would let only the person holding that item talk at any given time until they pass it to another person in the party.

**R8.** In a Token Ring, a station can transmit only when it receives the token, and the token circulates sequentially around the entire ring. That makes performance tightly coupled to the physical size of the LAN.

---
## SECTION 6.4
**R9.**
- MAC address is 6 bytes long, giving $2^{48}$ possible MAC addresses.
- IPv4 addresses are 4 bytes long, giving $2^{32}=4,294,967,296$ possible IPv4 addresses
- IPv6 are 16 bytes long, giving $2^{128}=3.4×10^{38}$ possible addresses.

---
**R10.** No, C will discard these frames since they won't match its own MAC address. It won't pass the IP datagrams to the network layer.

If the frames contain the MAC broadcast address then C will **not** discard the frames and will pass the IP datagrams contained in the frames to the network layer.

---
**R11.** Because at the moment an ARP request is sent, the sender does not know the destination’s link-layer address, so it has no way to target a specific frame.

Because an ARP reply is not a discovery message like in the previous case. It’s a direct response to a known requester. The machine sending the reply already has the requester’s MAC address, so there is no reason to involve the rest of the network.

---
**R12.** It’s not expected under normal conditions, but it is absolutely possible, and the ARP tables would not prevent it.

---
**R13.**

---
**R14.** 2 subnets, the internal interface going to the switch to which all the hosts are then connected (electrical engineering, mail server, etc.) and the external interface going to the external internet.

---
**R15.** The books details:

> The VLAN tag itself consists of a 2-byte Tag Protocol Identifier (TPID) field (with a fixed hexadecimal value of 81-00), a 2-byte Tag Control Information field that contains a **12-bit VLAN identifier field**, and a 3-bit priority field that is similar in intent to the IP datagram TOS field

12-bit VLAN identifier -> 4094 possible VLANs since 0 and 4095 are reserved.
## Problems

**P3.**
1. Convert "Internet" into binary according to ASCII encoding:
- I → 0x49 → 01001001
- n → 0x6E → 01101110
- t → 0x74 → 01110100
- e → 0x65 → 01100101
- r → 0x72 → 01110010
- n → 0x6E → 01101110
- e → 0x65 → 01100101
- t → 0x74 → 01110100
- . → 2E00 → 10111000
Last two for padding
2. Group into 16-bit words:
- 49 6E → 0x496E
- 74 65 → 0x7465
- 72 6E → 0x726E
- 65 74 → 0x6574
- 2E 00 → 0x2E00
1. One's complement sum -> 0xC3B6
2. Calculate bitwise NOT ->  **0x3C49** (result)
---
**P7.**
	a) A single-bit error produces an error pattern with exactly one 1 (i.e., a power of x). For the error to go undetected, this pattern would need to be divisible by G. Since the generator G = 1001 has more than one nonzero term, it cannot divide a single-bit error pattern. Therefore, any single-bit error will always result in a non-zero remainder and be detected
	b) Yes, because odd parity (odd number of bit errors) can’t be divisible by a generator with even parity (1001 has two 1s). CRC guarantees that any error pattern not divisible by G will be detected and an odd number of bit errors will never result into a remainder != 0.
	
---
**P12.** 
**Slotted ALOHA**: each of N nodes transmit with probability $p$, success = exactly one node transmits

$$E_{slotted} = Np(1 - p)^{N-1}$$

![[slotted_aloha.png]]

For any given $N$ we have a $p$ that maximizes the efficiency/throughput. For example, for $N=30$ it's around 0.05.

**Pure ALOHA**: efficiency depends of the node transmitting during $t$ and $t+1$ and _all_ the other nodes _not_ transmitting which results in $2(N-1)$ for the exponent instead of $N-1$:
$$E_{slotted} = Np(1 - p)^{2(N-1)}$$

![[pure_aloha.png]]

We can see that the average maximum efficiency is around $1/(2e)$ as suggested by the book in page 468 (8th edition), exactly half that of slotted ALOHA, the price for a fully decentralized ALOHA protocol.

---
**P14.** 
a) No, because hosts E and F are connected via a switch. Source IP and MAC address will be those of Host E. Destination IP and MAC address those of Host F. These last two won't be those of router R1 since the switch understands MAC addresses and can forward the ethernet frame to host F based on its destination MAC address.

b) No, E will not perform an ARP query for B's MAC address, it will do so if needed for its default gateway, router R1, which in turn will ARP for B's address.

And in this case, in the ethernet frame the source IP and MAC addresses are those of host E too but the destination IP and MAC addresses are those of the router.

c)
>What Actions will switch S1 perform once it receives the ARP request message? 

It will learn A's MAC address and add an entry for it, then it will flood the ARP request out of all ports except the one corresponding to A. Every device in subnets 2 and 1 will get the broadcast ARP request and B will send an ARP reply.

>Will router R1 also receive this ARP request message?

Yes, from switch S1.

>Will R1 forward the message to Subnet 3?

No, since routers don't break broadcast domains.

> Once Host B receives this ARP request message, it will send back to Host A an ARP response message. But will it send an ARP query message to ask for A’s MAC address? Why?

No, it'll already know A's MAC address from the ARP query itself.

>What will switch S1 do once it receives an ARP response message from Host B?

It will forward the unicast ARP reply to A so A in turn can update its ARP cache with B's MAC address.

---
**P19.**
>At what time does B schedule its retransmission?

B schedules its retransmission for time $K \cdot 512$, since $K=1$ then it'll be at time $t =245 +{time\,to\,detect\,channel\,is\,idle}+ 512$.

>At what time does A begin transmission?

With $K=0$, A will begin its transmission after the time it takes to sense the channel is idle.

> At what time does A’s signal reach B? Does B refrain from transmitting at its scheduled time?

Assuming the sensing time is negligible for simplifying results, A's signal will reach B at $t=245+245=590$. And based on this assumption, B won't be sensing the channel for idless at the scheduled time of $t=557$ so it will not refrain from transmitting at it leading to another cycle of backoff increasing A and B's K values.

---
**P21.**
### Host A:
MAC: $MAC_A$
IP: $IP_A$
### Router 1
MAC: $MAC_{R1}$
IP: $IP_{R1}$
### Router 2 (subnets 1 and 2)
MAC: $MAC_{R2}$
IP: $IP_{R2}$
### Host F:
MAC: $MAC_F$
IP: $IP_F$

|                                   | Source MAC address | Destination MAC address | Source IP address | Destination IP address |
| --------------------------------- | ------------------ | ----------------------- | ----------------- | ---------------------- |
| From A to left router (router 2)  | $MAC_{A}$          | $MAC_{R2}$              | $IP_A$            | $IP_B$                 |
| Fromt left router to right router | $MAC_{R2}$         | $MAC_{R1}$              | $IP_{R2}$         | $IP_{B}$               |
| From right router to F            | $MAC_{R2}$         | $MAC_{B}$               | $IP_{R1}$         | $IP_{B}$               |
The destination IP address stays the same for the entire trip, it's what lets the involved devices to effectively route the packet to host B.

---
**P24.** The maximum aggregate throughput will be 3 Gbps since a hub only allows one successful transmission at a time within each department
- EE hub: up to 1 Gbps active traffic
- CS hub: up to 1 Gbps active traffic
- CE hub: up to 1 Gbps active traffic

---
**P28.**
EE IP: $IP_{EE}$
CS IP: $IP_{CS}$
Router: $IP_{Router}$

Steps to transfer IP datagram from EE host to CS host:
1. At the link layer:
	- EE host ARPs for router MAC address on the EE VLAN.
	- Switch forwards that ARP only inside the EE VLAN.
	- Router replies with its MAC.
2. EE's host passes the datagram to its adapter with the MAC address of the router and destination IP $IP_{CS}$
3. The adapter creates a frame containing the datagram addressed to $IP_{CS}$.
4. Switch delivers frame to router via port 1.
5. The router sees that the link-layer frame is addressed to it so it passes the frame to the network layer of the router.
6. Router removes Ethernet header and examines destination IP. It determines the packet must go to the CS subnet.
7. Router now needs the MAC of the CS host.
	- It ARPs on the CS VLAN.
	- Switch forwards that ARP only within the CS VLAN.
8. CS host replies with its MAC
9. Router sends a new Ethernet frame:
	- Source MAC: its own MAC address
	- Destination MAC: CS's host MAC address
	- Payload: same IP packet
10. Switch forwards frame only inside the CS VLAN to the CS host.

---
**P33.** 
a) 0.1% of the time, since 99.9% uses three racks.
b) Calculate the combined probability: $P(A∩B)=P(A)×P(B)=0.1 × 0.01 = 0.0001$
c) Each application needs four racks only 1% of the time. Assuming the applications’ demands are independent, the probability that both applications simultaneously require four racks is 0.0001 as calculated in b) which is 0.01% of the time.

Since the system requirement allows server shortages for up to 0.001% of the time, the network can allocate a total of seven racks instead of eight by **dynamically sharing one rack between the two applications**.

In the rare case (0.0001% of the time) where both applications simultaneously require four racks, one application will temporarily receive only three racks, causing brief performance degradation.