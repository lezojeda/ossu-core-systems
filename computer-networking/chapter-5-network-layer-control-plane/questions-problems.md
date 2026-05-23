## SECTION 5.1 Introduction
**R1.** Per-router control means that the routing algorithm is run in each and every router. When we say that they are implemented monolithically we mean that control-plane routing protocols have been implemented together with data-plane forwarding functions within a single router.

**R2.** Logically centralized means that the routing control service is accessed as if it were a single central service point even though the service is likely to be implemented via multiple servers for fault-tolerance, and performance scalability reasons.

In separate devices. The data plane is implemented in "dumb" routers while the control plane in a centralized controller as the name suggests.
## SECTION 5.2 Routing Algorithms
**R3.** Centralized routing algorithms require the component running them to somehow obtain global knowledge about the network, its connectivity and link costs. In contrast, distributed/decentralized routing algorithms run the calculation of the least-cost path in an iterative manner since no node has complete information about the costs of all the network links.

An example of a routing protocol that takes a centralized approach is the OSPF (Open Shortest Path First). Examples of protocols using distributed approaches are Internet’s RIP and BGP, ISO IDRP, Novell IPX, and the original ARPAnet.

---
**R4.** Whereas the LS algorithm is an algorithm using **global** information, the distance-vector (DV) algorithm is iterative, asynchronous, and **distributed**. It is distributed in that each node receives some information from one or more of its directly attached neighbors, performs a calculation, and then distributes the results of its calculation back to its neighbors.

|                      | LS                                                           | DV                                                                           |
| -------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Speed of convergence | $O(N^2)$ requiring $O(\|N\| \|E\|)$ messages                 | Count-to-infinity probl                                                      |
| Robustness           | More robust due to each router keeping its rout calculation Less due to a node being able to advertise incorrect information to others. to  |

---
**R5.** The count to infinity problem arises from the routing loop that happens in distance-vector routing algorithms whenever a router learns a route from a neighbor, and then that route’s cost increases. In the textbook example we see that going from a cost of 4 to 60 leads to 44 iterations until z finds that its direct path to x is less costly than through y. The amount of iterations increases proportionally to the cost increase reaching infinity if a link goes down, for example.

---
**R6.** No, it is not necessary that every Autonomous System (AS) use the same intra-AS routing algorithm. The fundamental purpose of an Autonomous System is to allow a network (or a group of networks) to be administered independently under a single technical and administrative authority. 
## SECTION 5.3-5.4 Intra-AS Routing in the Internet: OSPF
**R7.**

---
**R8.** False. With OSPF, a router broadcasts routing information to **all** other routers in the autonomous system, not just to its neighboring routers.

---
**R9.** An *area* is a group of routers within an AS that run its own OSPF link-state routing algorithm, with each router in an area broadcasting its link state to all other routers in that area. This concept was introduced to support hierarchy within a single AS.

---
**R10.** 

| prefix                                              | subnet                                                                                                                           | BGP route                                                                                                                          |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| a block (range) of IP addresses using CIDR notation | logical subdivision of an IP network. It is a group of interfaces/hosts that can reach each other without going through a router | prefix plus a set of BGP attributes (such as AS-PATH, NEXT-HOP, LOCAL-PREF, etc.). It is what BGP actually advertises and selects. |

---
**R11.** The NEXT-HOP is the IP address of the router interface that begins the AS-PATH. It's used to know where to forward the packets to reach a certain prefix.

The AS-PATH attribute contains the list of ASs through which the advertisement of a certain prefix by a router has passed

---
**R12.**
- By assigning a determined local preference value to a route
- Determining whether to advertise to another AS the possibility of routing traffic from X to Y passing through it
- 

---
**R13.** False, the network administrator in carge of the BGP router can decide whether to send that new path to all neighbors, some or none of them. It's one of the aspects subjected to policies of the AS.

---
## SECTION 5.5
**R14.**
- **Communication layer:** communicating between the SDN controller and controlled network devices. *OpenFlow* is an example of a protocol that implements the communication layer.
- **Network-wide state-management layer:** ultimate control decisions made by the SDN control plane—for example, configuring flow tables in all switches to achieve the desired end-end forwarding, to implement load balancing, or to implement a particular firewalling capability— requiring that the controller have up-to-date information about state of the networks’ hosts, links, switches, and other SDN-controlled devices
- **Network-control application layer:** allow network-control applications to read/write network state and flow tables within the state-management layer.
---
**R15.** In the network-control application layer since in that one the control decisions such as those related to routing happen. The network-control application layer is where the actual intelligence and decision-making logic resides. Routing is a control application, it reads the network state (from the middle layer), runs the routing algorithm, computes the best paths, and then installs the appropriate forwarding rules into the switches via the communication layer.

---
**R16.**
Across northbound API (the network-control applications send the messages):

Across southbound API (the recipients are the SDN-Controlled switches):
- Configuration
- Modify-State
- Read-State
- Send-Packet

---
## SECTIONS 5.6 - 5.7
**R19.** `echo reply` (type 0) and `echo request` (type 8) used in the `ping` program. `destination network unreachable` (type 3), typical when an HTTP request is made and the host specified wasn't found. `destination port unreachable` (type 3) used in `traceroute`.

---
**R20.** `TTL expired` sent by each router along the path and `destination port unreachable`, sent by the final destination host.

---
**R21.**

---
**R22.** To request or set the value of one or more MIB objects at the agent's managed device.

---
## Problems
**P1.**
1. y -> w -> x -> u
2. y -> x -> u
3. y -> w -> v -> u
4. y -> w -> u
5. y -> z -> w -> v -> u
6. y -> w -> x -> v -> u
7. y -> x -> v -> u
8. y -> x -> w -> u

---
**P5.**
At time = 0, the table would look like follows, since z only knows the costs to each of its neighbors:

|     |     | cost | to  |     |     |     |
| --- | --- | ---- | --- | --- | --- | --- |
| f   |     | u    | v   | z   | x   | y   |
| r   | u   | ∞    | ∞   | ∞   | ∞   | ∞   |
| o   | v   | ∞    | ∞   | ∞   | ∞   | ∞   |
| m   | z   | ∞    | 6   | ∞   | 2   | ∞   |
|     | x   | ∞    | ∞   | ∞   | ∞   | ∞   |
|     | y   | ∞    | ∞   | ∞   | ∞   | ∞   |
Then, at time = 1, from knowing the neighbors reported costs we would have:

|     |     | cost | to  |     |     |     |
| --- | --- | ---- | --- | --- | --- | --- |
| f   |     | u    | v   | z   | x   | y   |
| r   | u   | ∞    | ∞   | ∞   | ∞   | ∞   |
| o   | v   | 1    | 0   | ∞   | 3   | ∞   |
| m   | z   | 7    | 5   | 0   | 2   | 5   |
|     | x   | ∞    | 3   | ∞   | 0   | 3   |
|     | y   | ∞    | ∞   | ∞   | ∞   | ∞   |

---
**P12.** The BGP (Border Gateway Protocl) is an inter-AS (Autonomous System) routing protocol responsible for acting as the glue between all the ISPs in the internet together, among other things.

The way it detects loops is with the AS-PATH attribute. If a router sees that its own AS is in the path list, it'll reject the advertisement coming from another router.

---
**P16.** Through the MULTI_EXIT_DISC attribute. Per the RFC 4271:

> This is an optional non-transitive attribute that is a four-octet unsigned integer.  The value of this attribute MAY be used by a BGP speaker's Decision Process to discriminate among multiple entry points to a neighboring autonomous system.

Which in other words means that ISP C could set a lower MED for the East Cost peering point so that ISP B prefers it over the West Coast one.

---
**P18.** P2P applications like BitTorrent or qBittorrent. If client A is in network X and client B is in network Y, then when B sends a chunk to A, the data packet may first arrive at network X (via one of X’s provider links) and then be forwarded internally to A. The reverse path (from A to B) can similarly create flows that cross providers in ways BGP policy would normally try to avoid.

---
**P20.** Yes, BGP does allow Z to implement this policy. Although X and Z are not directly connected, Z can selectively control which routes it advertises to Y. Specifically, Z applies an export filter toward Y so that it advertises routes to its own prefixes (and any other destinations it wishes to provide), but does not advertise routes whose AS path contains X. As a result, Y learns a path through Z only for Z’s own traffic (and other allowed destinations), but does not learn a path to X’s prefixes via Z. Therefore, Y will forward its own traffic through Z when appropriate, but will not send X’s traffic to Z, effectively allowing Z to transit Y’s traffic while refusing to transit X’s traffic.

This route advertisement based on AS-path filtering is a standard BGP policy mechanism.

---
**P22.** As per RFC 1157:

>  Consistent with the goal of minimizing complexity of the management agent, the exchange of SNMP messages requires only an unreliable datagram service, and every message is entirely and independently represented by a single transport datagram.  While this document specifies the exchange of messages via the UDP protocol [[11](https://datatracker.ietf.org/doc/html/rfc1157#ref-11)], the mechanisms of the SNMP are generally suitable for use with a wide variety of transport services.

Keeping it as simple as possible, as the S in the name suggests.