## SECTION 3.4
**R9.** Because when we wanted to solve the problem of the sender receiving a garbled ACK or NAK packet the approach was to simply resend the current data packet but this introduced the problem of data duplication and the receiver can't know whether an arriving packet is new data or a retransmission. A sequence number solves this issue since the receiver just checks it to know if it's a retransmission or not.

---
**R10.** To handle packet loss. The sender chooses a time value such that the packet loss is likely, although not guaranteed, to have happened.

---
**R11.** Yes, because the timer purpose is not related to the roundtrip delay, it's to handle packet loss, which it still can happen.

---
**R12.** 
	**a.** First packet is lost and then the other 4 are received out of order, no packets are acknowledged and no ack is sent. Timeour occurs for packet 0 and so according to the Go-Back-N all the 5 packets are sent retransmitted (this is exactly why it's called "Go-Back-N")
	**b.** All packets and acks are received, even though the first ack is never received.
	**c.** It's not possible to send 6 packets until the first one is acknowledged that was received.

**R13.**
	**a.** Packets are received out of order but still acknowledged. After the timeout occurs for the packet lost, it's sent, received, ack sent and finally ack received. So all 5 packets end up being sent and acknowledged in contrast to Go-Back-N.
	**b.** Same as in a., after the timeout occurs for the packet lost, the packet is sent, received and acknowledged.
	**c.** Same as with Go-Back-N
	
---
## SECTION 3.5
**R14.**
	**a.** False, acknowledgments don't depend on host B having data to send to A or not
	**b.** False, $rwnd = RcvBuffer - [LastByteRcvd - LastByteRead]$ which implies that spare room changes as bytes and read and received
	**c.** True
	**f.** True, unnecessary retransmissions would be otherwise sent. The timeout interval can be below 1 sec if future SampleRTT are below 1, but the _current_ timeout interval must be higher than the last SampleRTT
	**g.** False, the acknowledgment number in the segment A sends to B is independent from the sequence number, it represents what A expects to receive from B.
## Problems
**P1.** Suppose Client A initiates a Telnet session with Server S. At about the same time, Client B also initiates a Telnet session with Server S. Provide possible source and destination port numbers for:

a. The segments sent from A to S. **Source: any available port in the range 1024–65535 (for example 51234), destination: 23 or 2323**
b. The segments sent from B to S. **Same as a.**
c. The segments sent from S to A. **Source: 23 or 2323, destination: 51234 (following a. example)**
d. The segments sent from S to B. **Same as b.**
e. If A and B are different hosts, is it possible that the source port number in the segments from A to S is the same as that from B to S? **Yes, it's totally possible since ports don't identify hosts, IP do.**
f. How about if they are the same host? **No, if they are in the same host each client/application uses its own port number.**

---
**P2.** Consider Figure 3.5. What are the source and destination port values in the segments flowing from the server back to the clients’ processes? What are the IP addresses in the network-layer datagrams carrying the transport-layer segments?

![[Pasted image 20260324133259.png]]
From B to C (left packet):
- Source port: 80
- Destination port: 7532
- Source IP: B
- Destination IP: C
From B to C (right packet):
- Source port: 80
- Destination port: 26145
- Source IP: B
- Destination IP: C
From B to A:
- Source port: 80
- Destination port: 26145
- Source IP: B
- Destination IP: A
---
**P7.** In protocol rdt3.0, the ACK packets flowing from the receiver to the
sender do not have sequence numbers (although they do have an ACK field
that contains the sequence number of the packet they are acknowledging).
Why is it that our ACK packets do not require sequence numbers?

Because rdt3.0 it's a stop-and-wait protocol where only one packet is in flight at a certain time so the sender is waiting for only one specific ACK at any moment.

---
**P22.** Consider the GBN protocol with a sender window size of 4 and a sequence number range of 1,024. Suppose that at time $t$, the next in-order packet that the receiver is expecting has a sequence number of $k$. Assume that the medium does not reorder messages. Answer the following questions:
a. What are the possible sets of sequence numbers inside the sender’s
window at time t? Justify your answer.

The possible sets are:

* base = k-3 (3 packets unacknowledged before k) → window = $\lbrace k-3, k-2, k-1, k \rbrace$
* base = k-2 (2 packets unacknowledged before k) → window = $\lbrace k-2, k-1, k, k+1 \rbrace$
* base = k-1 (1 packet unacknowledged before k) → window = $\lbrace k-1, k, k+1, k+2 \rbrace$
* base = k (no packets unacknowledged before k) → window = $\lbrace k, k+1, k+2, k+3 \rbrace$

b. What are all possible values of the ACK field in all possible messages
currently propagating back to the sender at time t? Justify your answer.

