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

Since the receiver is currently expecting packet $k$ every packet it has sent will have an ACK of $k - 1$ or lower, down to $k - 3$ since the window size is 4 (and a propagating packet of $k - 4$ would imply more than 4 packets in transit which can't happen by the protocol definition). So the possible values are $\lbrace k-3, k-2, k-1 \rbrace$

---
**P30.** Consider the network shown in Scenario 2 in Section 3.6.1. Suppose both sending hosts A and B have some fixed timeout values.
a. Argue that increasing the size of the finite buffer of the router might pos-
sibly decrease the throughput ($\lambda_{out}$).

With fixed timeout values but a larger finite buffer the probability of the sender timing out for packets not lost but still in the buffer increases. A larger fraction of the router’s output link capacity is wasted carrying duplicate packets that will eventually be discarded by the receiver.

b. Now suppose both hosts dynamically adjust their timeout values (like what TCP does) based on the buffering delay at the router. Would increasing the buffer size help to increase the throughput? Why?

Yes, because it would avoid premature retransmissions and a higher rate of useful data would come out of the shared output link.

---
**P40.**
![[Captura de pantalla 2026-03-27 181756.png]]
Consider Figure 3.61. Assuming TCP Reno is the protocol experiencing the
behavior shown above, answer the following questions. In all cases, you
should provide a short discussion justifying your answer.

**a.** Identify the intervals of time when TCP slow start is operating. From 0 to the 6th transmission round the first time and from 22.5 to the end the second time.

**b.** Identify the intervals of time when TCP congestion avoidance is operating. 6-16 and 18-22.

**c.** After the 16th transmission round, is segment loss detected by a triple
duplicate ACK or by a timeout? Three ACKs since the `cnwd` wasn't reduced to 1.

**d.** After the 22nd transmission round, is segment loss detected by a triple
duplicate ACK or by a timeout? Timeout.

**e.** What is the initial value of ssthresh at the first transmission round? 0?

**f.** What is the value of ssthresh at the 18th transmission round? Assuming the value of `cnwd` was 42 when the three ACKs were detected then 42/2 = 21

**g.** What is the value of ssthresh at the 24th transmission round? Assuming `cnwd` at congestion was 28 -> 14

**h.** During what transmission round is the 70th segment sent? The 70th segment is sent during transmission round 7. The round where congestion avoidance starts. This comes from calculating the cumnulative packets sent: in round 1 1 packet was sent (cnwd = 1), then in round 2 3 (cnwd = 2), ..., until round 7 when 96 have been sent from the 63 that had been sent in round 6. So the 70th segment falls in the window of packets sent during round 7.

**i.** Assuming a packet loss is detected after the 26th round by the receipt of
a triple duplicate ACK, what will be the values of the congestion window
size and of ssthresh? Since a triple duplicate ACK halves `cnwd` then it'll be 4.

**j.** Suppose TCP Tahoe is used (instead of TCP Reno), and assume that triple
duplicate ACKs are received at the 16th round. What are the `ssthresh`
and the congestion window size at the 19th round? TCP Tahoe cuts the congestion window to 1 even if the after a triple-duplicate-ACK indicated loss event. So the values of `cnwd` and `ssthresh` would've been 1 and 21 respectively after round 16. So 17th round 1, 18th round 2 and finally 19th round `cnwd` would have a value of 4.

k. Again suppose TCP Tahoe is used, and there is a timeout event at
22nd round. How many packets have been sent out from 17th round till
22nd round, inclusive? 

The timeout happens before the packets are sent so we can follow this table:

| Transmission Round | cwnd at start of round | Packets sent in this round |
| ------------------ | ---------------------- | -------------------------- |
| 17                 | 1                      | 1                          |
| 18                 | 2                      | 2                          |
| 19                 | 4                      | 4                          |
| 20                 | 8                      | 8                          |
| 21                 | 16                     | 16                         |
| 22                 | 32                     | 32                         |
Which means a total of 63 packets have been sent from the 17th round till the 22nd.

---
**P52.** Consider a simplified TCP’s AIMD algorithm where the congestion window size is measured in number of segments, not in bytes. In additive increase, the congestion window size increases by one segment in each RTT. In multiplicative decrease, the congestion window size decreases by half (if the result is not an integer, round down to the nearest integer). Suppose that two TCP connections, $C_1$ and $C_2$, share a single congested link of speed 30 segments per second. Assume that both $C_1$ and $C_2$ are in the congestion avoidance phase. Connection $C_1$’s RTT is 50 msec and connection $C_2$’s RTT is 100 msec. Assume that when the data rate in the link exceeds the link’s speed, all TCP connections experience data segment loss.

a. If both $C_1$ and $C_2$ at time $t_0$ have a congestion window of 10 segments,
what are their congestion window sizes after 1000 msec? Their congestion sizes will be both 2, a loss event will be detected and both cnwd will be 2 again. From 0 to 1000ms both connections oscillate between 1 and 2 since the link is heavily congested.
b. In the long run, will these two connections get the same share of the bandwidth of the congested link? Explain. No, C1 will have a bigger share of the bandwidth since its round trip time is shorter which makes it cwnd increase faster than C2's cwnd (which increases every 100ms, not 50ms).