## ICMP and Ping
1. Host: 192.168.1.11, Destination: 157.92.32.86
2. Because ports are for demultiplexing data to specific applications used by transport layer protocols like TCP or UDP. ICMP is a network layer protocol that supports the IP.
3. ICMP type -> 8 (Echo (ping) request); Other fields: Checksum, Identifier , Sequence Number. They are all 2 bytes in size.

```
No.					Time											Source																Destination											Protocol	Length	Info
62	26.381427535	192.168.1.11	157.92.32.86	ICMP	98	Echo (ping) request id=0x0007, seq=12/3072, ttl=64 (reply in 63)

Frame 62: 98 bytes on wire (784 bits), 98 bytes captured (784 bits) on interface wlp2s0, id 0
Ethernet II, Src: FNLINKTECHNO_f6:6b:24 (e8:5c:5f:f6:6b:24), Dst: SagemcomBroa_e9:fc:47 (38:a6:59:e9:fc:47)

Internet Protocol Version 4, Src: 192.168.1.11, Dst: 157.92.32.86
    0100 .... = Version: 4
    .... 0101 = Header Length: 20 bytes (5)
    Differentiated Services Field: 0x00 (DSCP: CS0, ECN: Not-ECT)
    Total Length: 84
    Identification: 0x010a (266)
    10. .... = Flags: 0x2, Don't fragment
    ...0 0000 0000 0000 = Fragment Offset: 0
    Time to Live: 64
    Protocol: ICMP (1)
    Header Checksum: 0xba39 [validation disabled]
    [Header checksum status: Unverified]
    Source Address: 192.168.1.11
    Destination Address: 157.92.32.86
    [Stream index: 8]

Internet Control Message Protocol
    Type: 8 (Echo (ping) request)
    Code: 0
    Checksum: 0x253c [correct]
    [Checksum Status: Good]
    Identifier (BE): 7 (0x0007)
    Identifier (LE): 1792 (0x0700)
    Sequence Number (BE): 12 (0x000c)
    Sequence Number (LE): 3072 (0x0c00)
    [Response frame: 63]
    Timestamp from icmp data: Apr 21, 2026 10:25:41.325970000 -03
    [Timestamp from icmp data (relative): 0.000036987 seconds]
    Data (40 bytes)

0000    10 11 12 13 14 15 16 17 18 19 1a 1b 1c 1d 1e 1f    ................
0010    20 21 22 23 24 25 26 27 28 29 2a 2b 2c 2d 2e 2f     !"#$%&'()*+,-./
0020    30 31 32 33 34 35 36 37                            01234567
```

4. ICMP type -> 0 (Echo (ping) reply); Fields and size same as the request.

```
No.					Time											Source																Destination											Protocol	Length	Info
63	26.424245835	157.92.32.86	192.168.1.11	ICMP	98	Echo (ping) reply id=0x0007, seq=12/3072, ttl=54 (request in 62)

Frame 63: 98 bytes on wire (784 bits), 98 bytes captured (784 bits) on interface wlp2s0, id 0
Ethernet II, Src: SagemcomBroa_e9:fc:47 (38:a6:59:e9:fc:47), Dst: FNLINKTECHNO_f6:6b:24 (e8:5c:5f:f6:6b:24)

Internet Protocol Version 4, Src: 157.92.32.86, Dst: 192.168.1.11
    0100 .... = Version: 4
    .... 0101 = Header Length: 20 bytes (5)
    Differentiated Services Field: 0x00 (DSCP: CS0, ECN: Not-ECT)
    Total Length: 84
    Identification: 0x65fe (26110)
    0. .... = Flags: 0x0
    ...0 0000 0000 0000 = Fragment Offset: 0
    Time to Live: 54
    Protocol: ICMP (1)
    Header Checksum: 0x9f45 [validation disabled]
    [Header checksum status: Unverified]
    Source Address: 157.92.32.86
    Destination Address: 192.168.1.11
    [Stream index: 8]

Internet Control Message Protocol
    Type: 0 (Echo (ping) reply)
    Code: 0
    Checksum: 0x2d3c [correct]
    [Checksum Status: Good]
    Identifier (BE): 7 (0x0007)
    Identifier (LE): 1792 (0x0700)
    Sequence Number (BE): 12 (0x000c)
    Sequence Number (LE): 3072 (0x0c00)
    [Request frame: 62]
    [Response time: 42.818 ms]
    Timestamp from icmp data: Apr 21, 2026 10:25:41.325970000 -03
    [Timestamp from icmp data (relative): 0.042855287 seconds]
    Data (40 bytes)

0000    10 11 12 13 14 15 16 17 18 19 1a 1b 1c 1d 1e 1f    ................
0010    20 21 22 23 24 25 26 27 28 29 2a 2b 2c 2d 2e 2f     !"#$%&'()*+,-./
0020    30 31 32 33 34 35 36 37                            01234567
```

## ICMP and Traceroute
5. Source host: 192.168.1.9, target destination host: 128.119.245.12 (gaia.cs.umass.edu).
6. No, it would be 17, the corresponding protocol number of UDP.
7. The only difference relies on the TTL field which in the traceroute case is incremented to discover the path to the destination host.
8. 