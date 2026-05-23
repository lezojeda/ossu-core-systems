## SECTION 4.1
**R2.** The primary data-plane role of each router is to forward datagrams from
its input links to its output links; the primary role of the network control plane is to coordinate these local, per-router forwarding actions so that datagrams are ultimately transferred end-to-end, along paths of routers between source and destination hosts.

**R3.** Forwarding is the **router-local** task of moving a packet from the input link to the *appropriate* output link of the router. It takes nanoseconds and it's **implemented in hardware**.

Routing is a network wide process responsible for the path that the packets will take from sender to receiver. Takes miliseconds to seconds and is **implemented in software**.

Forwarding is controled by the data plane while routing by the control plane.

**R4.** To store a mapping between header values and outgoing link interfaces.

**R5.** The service model is a "best-effort service". There are no guarantees at all. No received in order guarantee, no eventual delivery, no end-to-end delay nor minimal bandwidth 👍.
## SECTION 4.2
**R6.** Only the routing processor is implemented in software, the ports and the switching fabric are implemented in hardware. This is because input/output ports need to handle datagrams in the nanoseconds time scale.

**R7.** A shadow copy at each input port helps make forwarding decisions at a local level without invoking the centralized routing processor on a per-packet basis and thus avoiding a centralized processing bottleneck.

**R8.**

**R9.** When there are multiple matches, the router uses the longest prefix matching rule; that is, it finds the longest matching entry in the table and forwards the packet to the output port associated with the longest prefix match.

**R10.**
- **Switching via memory:** incoming packet from input port is copied to the processor's memory, the routing process extracts its destination address and then looks up the appropriate output port in the fwd table, copying the packet to the output port's buffers
- **Switching via a bus:**  an input port transfers a packet directly to the output port over a shared bus, without intervention by the routing processor. All output ports receive the packet, but only the port that matches the label will keep the packet. In roundabout analogy, is as if only one car at a time can use the roundabout.
- **Switching via an interconnection Network:** 2N buses to connect N input ports to N output ports; unlike the previous two switching approaches, crossbar switches are capable of forwarding multiple packets in parallel.

The only one that can send multiple packets in parallel is the interconnection network one.

**R11.** Packet loss can occur when memory to store arriving packets is insufficient due to large queues. One cause of this could be if the switch fabric is not fast enough (relative to the input line speeds) to transfer all arriving packets through the fabric without delay

**R12.** Packet loss can occur at output ports when more packets arrive at a unit time than what the outport port can transmit in that same unit time. For example 4 packets come from 4 different input ports but have the same output port which can only transmit only a single packet in a unit of time, they will inevitably form a queue.

**R13.** Head of line blocking happens at input ports. It's when an input-queued packet, even though its output port is free, must wait for the transfer through the switch fabric of another packet that goes to a different output port.

**R14.** FIFO, 

**R15.** Packethat carry network management information such as indicated by the source or destination TCP/UDP port number might be given priority since they carry fundamental information to establish communication between end systems.

**R16.** A round robin scheduler alternates service among the classes in an equal manner, but in the WFQ each class may receive a differential amount of service in a given interval of time
## SECTION 4.3
**R17.** It checks the *Protocol* header which indicates the specific transport-layer protocol to which the data portion of the IP datagram should be passed.

**R18.** The *time-to-live* field, when it reaches 0 the router must drop the datagram.

**R21.** No, technically IP addresses are each associated with each interface a router might have.

**R22.** 11011111 00000001 00000011 00011011

**R23.**
- IP address:  192.168.1.9
- Network mask: 255.255.255.0
- Default router: 192.168.1.1
- DNS server IP address: 192.168.1.10

**R24.** Source host -> outgoing interface of source host -> incoming interface of Router 1 -> Router 1 -> outgoing interface of Router 1 -> interface of Router 2 -> Router 2 -> outgoing interface of Router 2 -> incoming interface of Router 3 -> Router 3 -> outgoing interface of Router 3 -> interface of destination host -> Destination host

Forwarding tables: 3, one for each router

**R25.** 

**R30.** 
The only common fields between IPv4 and IPv6 are:
- Those for a source IP address and destination IP address although IPv6 has 128 bits available for them vs the 32-bit of the IPv4 format.
- Version
- Traffic class <-> Type of service
- Next header <-> Protocol (AKA Upper-layer protocol)
## SECTION 4.4
**R32.**  In destination-based forwarding, by match and action we mean the looking up of a destination IP address and sending the packet into the switching fabric to the specified output port. In a more generalized manner "action" may include forwarding the packet to one or more output ports (as in destination-based forwarding), load balancing packets across multiple outgoing interfaces that lead to a service (as in load balancing), rewriting
header values (as in NAT), purposefully blocking/dropping a packet (as in a firewall), sending a packet to a special server for further processing and action (as in DPI), and more.

**R33.** Forwarding table just checks a destination IP address and sends the packet to this or that interface, it has a fixed behavior.

OpenFlow's flow table is more general and programmable, it can match on many fields and take more actions.

**R34.** Partially answered in R32.

Three fields that can be matched: MAC address, VLAN tags and TCP/UDP ports

Three actions that can be taken: forward to port, drop or modify headers

**R35.** Three IP datagram header fields that *cannot* be matched: TTL, datagram length

---
## Problems
**P1.**
a.

| Header | Outgoing interface |
| ------ | ------------------ |
| H3     | 3                  |
b. No, it is not possible with a standard destination-based forwarding table because the forwarding decision depends only on the destination address, and we cannot distinguish whether the packet came from H1 or H2

---
**P4.**

| t   | X1 (top input)       | X2 (middle input)    | Y1 (middle input)    | Y2 (bottom input) | Z (bottom input)      |
| --- | -------------------- | -------------------- | -------------------- | ----------------- | --------------------- |
| 1   | moves to output port | queued in input port | moves to output port | waiting           | waiting (HOL blocked) |
| 2   | leaves output port   | moves to output port | leaves outport       | moves to outport  | waiting               |
| 3   | gone                 | leavs output port    | gone                 | leaves outport    | moves to output port  |
| 4   | gone                 | gone                 | gone                 | gone              | leaves                |
So it would take a minimal number of 3 time slots to transfer the packets from input ports to output ports, by the 4th time slot they will be all gone. If output ports could have queues and the switch fabric could send more than one datagram in a time slot we could get it to 2 time units.

The largest number of slots need assuming worst-case scheduling is also 3. If Y of the middle is transferred first then the X that follows it come last but the same happens if Y of the bottom input is transferred first and Z comes last.

---
**P8.** 
**a.**

| Prefix            | Link Interface |
| ----------------- | -------------- |
| 11100000 00       | 0              |
| 11100000 01000000 | 1              |
| 1110000           | 2              |
| 11100001 1        | 3              |
| otherwise         | 3              |
**b.**
11001000 10010001 01010001 01010101 -> doesn't match any -> link interface 3
11100001 01000000 11000011 00111100 -> matches link interface 2
11100001 10000000 00010001 01110111 -> matches link interface 3 exception we added so it doesn't fall into 2

---
**P12.**

| Prefix         | Link Interface |
| -------------- | -------------- |
| 200.23.16.0/21 | 0              |
| 200.23.24.0/24 | 1              |
| 200.23.24.0/21 | 2              |
| otherwise      | 3              |
**P17.** 
Assumptions:
- Datagrams limited to 1500 bytes
- 20-byte header
- MP3 consisting of 5 million bytes

Reserve 20 from each datagram for the header. That gives us 1480 bytes per datagram for MP3 information. 5M / 1480 = 3378.38. Since we have a remainder that means we need an extra datagram for those bytes -> **3379** (3378 * 1480 = 4999440 -> 560 bytes remain).

---
**P21.**

| Match                                                     | Action     |
| --------------------------------------------------------- | ---------- |
| Ingress port = 1; IP Src = 10.3.0.\*; IP dest = 10.1.0.\* | Forward(2) |
| Ingress port = 2; IP Src = 10.1.0.\*; IP dest = 10.3.0.\* | Forward(1) |
| Ingress port = 1; IP Dest = 10.2.0.3;                     | Forward(3) |
| Ingress port = 2; IP Dest = 10.2.0.3;                     | Forward(3) |
| Ingress port = 1; IP Dest = 10.2.0.4;                     | Forward(4) |
| Ingress port = 2; IP Dest = 10.2.0.4;                     | Forward(4) |
| Ingress port = 4; IP Dest = 10.2.0.3; IP src = 10.2.0.4   | Forward(3) |
| Ingress port = 3; IP Dest = 10.2.0.4; IP src = 10.2.0.3   | Forward(4) |

---
**P25.**
ICMP is not concerned with port numbers nor it carries any kind of application data. It's a supporting protocol for IP packet delivery. Considering this it's fair to think of it as part of the **network** layer.

The [RFC 792](https://www.rfc-editor.org/rfc/rfc792) even says:
> ICMP, uses the basic support of IP as if it were a higher level protocol, however, ICMP is actually **an integral part of IP**, and must be implemented by every IP module.


